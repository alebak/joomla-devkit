import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import archiver from 'archiver';
import crypto from 'crypto';
import { createWriteStream } from 'fs';
import { getI18n } from '../utils/i18n.js';
import { pathExists, readJsonFile, formatBytes } from '../utils/files.js';
import { findExtensionPath } from '../utils/extensions.js';
import type { JkitConfig, ExtensionConfig } from '../types/config.js';

interface PackageOptions {
  extension?: string;
  output?: string;
}

interface PackageResult {
  name: string;
  type: string;
  version: string;
  zipPath: string;
  size: number;
  checksums: {
    md5: string;
    sha256: string;
  };
}

/**
 * Loads jkit configuration from current project
 *
 * @returns Jkit configuration or null
 */
async function loadJkitConfig(): Promise<JkitConfig | null> {
  const configPath = path.join(process.cwd(), 'jkit.config.json');

  if (!(await pathExists(configPath))) {
    return null;
  }

  try {
    return await readJsonFile<JkitConfig>(configPath);
  } catch {
    return null;
  }
}


/**
 * Reads manifest XML to extract version
 *
 * @param extensionPath - Extension directory path
 * @param extensionConfig - Extension configuration
 * @returns Version string or default
 */
async function getExtensionVersion(
  extensionPath: string,
  extensionConfig: ExtensionConfig
): Promise<string> {
  // Try to find manifest XML file
  const possibleManifests = [
    `${extensionConfig.name}.xml`,
    'manifest.xml',
    `${extensionConfig.type}_${extensionConfig.name}.xml`,
  ];

  for (const manifestFile of possibleManifests) {
    const manifestPath = path.join(extensionPath, manifestFile);
    if (await pathExists(manifestPath)) {
      try {
        const content = await fs.readFile(manifestPath, 'utf-8');
        const versionMatch = content.match(/<version>(.*?)<\/version>/);
        if (versionMatch && versionMatch[1]) {
          return versionMatch[1];
        }
      } catch {
        // Continue to next manifest
      }
    }
  }

  // Default to config version or 1.0.0
  return extensionConfig.version || '1.0.0';
}

/**
 * Creates ZIP archive from directory
 *
 * @param sourceDir - Source directory to package
 * @param outputPath - Output ZIP file path
 * @returns Promise that resolves when ZIP is created
 */
async function createZipArchive(sourceDir: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    output.on('close', () => resolve());
    output.on('error', reject);
    archive.on('error', reject);

    archive.pipe(output);

    // Add all files from source directory
    archive.directory(sourceDir, false);

    archive.finalize();
  });
}

/**
 * Calculates file checksums
 *
 * @param filePath - File path
 * @returns Object with MD5 and SHA256 checksums
 */
async function calculateChecksums(
  filePath: string
): Promise<{ md5: string; sha256: string }> {
  const content = await fs.readFile(filePath);

  const md5 = crypto.createHash('md5').update(content).digest('hex');
  const sha256 = crypto.createHash('sha256').update(content).digest('hex');

  return { md5, sha256 };
}

/**
 * Copies extension files to staging directory
 *
 * @param extensionPath - Source extension path
 * @param stagingPath - Staging directory path
 */
async function copyExtensionFiles(
  extensionPath: string,
  stagingPath: string
): Promise<void> {
  // Files and directories to exclude
  const excludePatterns = [
    'node_modules',
    '.git',
    '.vscode',
    '.idea',
    'dist',
    '.DS_Store',
    'Thumbs.db',
    '*.log',
    '*.tmp',
    '.env',
    '.env.local',
    'tsconfig.json',
    'vite.config.ts',
    'package.json',
    'package-lock.json',
  ];

  // Source file extensions to exclude (we want built files, not source)
  const excludeExtensions = ['.ts', '.scss', '.sass', '.less'];

  const shouldExclude = (filePath: string): boolean => {
    const relativePath = path.relative(extensionPath, filePath);

    // Check exclude patterns
    for (const pattern of excludePatterns) {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace('*', '.*'));
        if (regex.test(relativePath)) return true;
      } else if (relativePath.includes(pattern)) {
        return true;
      }
    }

    // Check file extensions
    const ext = path.extname(filePath);
    if (excludeExtensions.includes(ext)) {
      return true;
    }

    return false;
  };

  // Recursive copy function
  const copyRecursive = async (src: string, dest: string): Promise<void> => {
    const stats = await fs.stat(src);

    if (stats.isDirectory()) {
      await fs.ensureDir(dest);
      const entries = await fs.readdir(src);

      for (const entry of entries) {
        const srcPath = path.join(src, entry);
        const destPath = path.join(dest, entry);

        if (!shouldExclude(srcPath)) {
          await copyRecursive(srcPath, destPath);
        }
      }
    } else if (stats.isFile()) {
      await fs.copy(src, dest);
    }
  };

  await copyRecursive(extensionPath, stagingPath);
}

/**
 * Packages a single extension
 *
 * @param extensionName - Extension name
 * @param extensionPath - Extension path
 * @param extensionConfig - Extension configuration
 * @param outputDir - Output directory for packages
 * @returns Package result or null on failure
 */
async function packageExtension(
  extensionName: string,
  extensionPath: string,
  extensionConfig: ExtensionConfig,
  outputDir: string
): Promise<PackageResult | null> {
  const i18n = await getI18n();

  try {
    // Get version from manifest
    const version = await getExtensionVersion(extensionPath, extensionConfig);

    // Create staging directory
    const stagingDir = path.join(process.cwd(), '.jkit-staging', extensionName);
    await fs.ensureDir(stagingDir);

    // Copy extension files to staging
    await copyExtensionFiles(extensionPath, stagingDir);

    // For package type, copy all other extension ZIPs to packages/ folder
    if (extensionConfig.type === 'package') {
      const packagesDir = path.join(stagingDir, 'packages');
      await fs.ensureDir(packagesDir);

      // Copy all ZIPs from outputDir except the package itself
      const zipFiles = await fs.readdir(outputDir).catch(() => []);
      for (const file of zipFiles) {
        if (file.endsWith('.zip') && file !== `${extensionConfig.name}.zip`) {
          const srcPath = path.join(outputDir, file);
          const destPath = path.join(packagesDir, file);
          await fs.copy(srcPath, destPath);
        }
      }
    }

    // Ensure output directory exists
    await fs.ensureDir(outputDir);

    // Generate package filename
    // Use extension name directly (e.g., com_blog.zip, mod_latest.zip)
    const zipFilename = `${extensionConfig.name}.zip`;
    const zipPath = path.join(outputDir, zipFilename);

    // Remove existing package if exists
    if (await pathExists(zipPath)) {
      await fs.remove(zipPath);
    }

    // Create ZIP archive
    await createZipArchive(stagingDir, zipPath);

    // Calculate checksums
    const checksums = await calculateChecksums(zipPath);

    // Get file size
    const stats = await fs.stat(zipPath);
    const size = stats.size;

    // Clean up staging directory
    await fs.remove(stagingDir);

    console.log(
      chalk.gray(
        `  ${i18n.t('commands:package.info.size')}: ${chalk.white(formatBytes(size))}`
      )
    );
    console.log(chalk.gray(`  ${i18n.t('commands:package.info.md5')}: ${checksums.md5}`));
    console.log(
      chalk.gray(`  ${i18n.t('commands:package.info.sha256')}: ${checksums.sha256}`)
    );

    return {
      name: extensionName,
      type: extensionConfig.type,
      version,
      zipPath,
      size,
      checksums,
    };
  } catch (error) {
    console.error(
      chalk.red(
        `  ${i18n.t('commands:package.errors.packageFailed', { name: extensionName })}`
      )
    );
    console.error(chalk.red(`  ${error instanceof Error ? error.message : String(error)}`));

    // Clean up staging directory on error
    const stagingDir = path.join(process.cwd(), '.jkit-staging', extensionName);
    if (await pathExists(stagingDir)) {
      await fs.remove(stagingDir);
    }

    return null;
  }
}

/**
 * Saves checksums to file
 *
 * @param packages - Array of package results
 * @param outputDir - Output directory
 */
async function saveChecksums(
  packages: PackageResult[],
  outputDir: string
): Promise<void> {
  const checksumFile = path.join(outputDir, 'checksums.txt');
  const lines: string[] = [];

  lines.push('# Package Checksums');
  lines.push(`# Generated: ${new Date().toISOString()}`);
  lines.push('');

  for (const pkg of packages) {
    const filename = path.basename(pkg.zipPath);
    lines.push(`## ${filename}`);
    lines.push(`MD5:    ${pkg.checksums.md5}`);
    lines.push(`SHA256: ${pkg.checksums.sha256}`);
    lines.push('');
  }

  await fs.writeFile(checksumFile, lines.join('\n'), 'utf-8');
}

/**
 * Creates distribution packages for extensions
 *
 * @param options - Package command options
 */
export async function packageCommand(options: PackageOptions): Promise<void> {
  const i18n = await getI18n();

  console.log(chalk.cyan.bold(`\n${i18n.t('commands:package.title')}\n`));

  // Load jkit configuration
  const config = await loadJkitConfig();

  if (!config) {
    console.error(chalk.red(`\n${i18n.t('commands:package.errors.noConfig')}\n`));
    console.log(chalk.yellow(i18n.t('commands:package.info.runInit')));
    process.exit(1);
  }

  // Determine which extensions to package
  const extensionsToPackage: string[] = [];

  if (options.extension) {
    // Package specific extension
    if (config.extensions[options.extension]) {
      extensionsToPackage.push(options.extension);
    } else {
      console.error(
        chalk.red(
          `\n${i18n.t('commands:package.errors.extensionNotFound', { name: options.extension })}\n`
        )
      );
      process.exit(1);
    }
  } else {
    // Package all extensions
    const allExtensions = Object.keys(config.extensions);

    if (allExtensions.length === 0) {
      console.error(chalk.red(`\n${i18n.t('commands:package.errors.noExtensions')}\n`));
      console.log(chalk.yellow(i18n.t('commands:package.info.createExtension')));
      process.exit(1);
    }

    extensionsToPackage.push(...allExtensions);
  }

  // Output directory
  const outputDir = options.output || path.join(process.cwd(), 'dist');

  console.log(
    chalk.blue(
      i18n.t('commands:package.info.packaging', { count: extensionsToPackage.length })
    )
  );
  console.log(chalk.gray(`${i18n.t('commands:package.info.outputDir')}: ${outputDir}`));
  console.log();

  // Package each extension
  const packages: PackageResult[] = [];
  let successCount = 0;
  let failCount = 0;

  for (const extensionName of extensionsToPackage) {
    const spinner = ora(
      i18n.t('commands:package.packaging', { name: extensionName })
    ).start();

    // Find extension path
    const extensionInfo = await findExtensionPath(extensionName, config);

    if (!extensionInfo) {
      spinner.fail(
        chalk.red(
          i18n.t('commands:package.errors.extensionNotFound', { name: extensionName })
        )
      );
      failCount++;
      continue;
    }

    const { path: extensionPath, extensionConfig } = extensionInfo;

    // Package extension
    const result = await packageExtension(
      extensionName,
      extensionPath,
      extensionConfig,
      outputDir
    );

    if (result) {
      packages.push(result);
      spinner.succeed(
        chalk.green(
          i18n.t('commands:package.success', {
            name: extensionName,
            file: path.basename(result.zipPath),
          })
        )
      );
      successCount++;
    } else {
      spinner.fail(
        chalk.red(i18n.t('commands:package.failed', { name: extensionName }))
      );
      failCount++;
    }
  }

  // Save checksums file
  if (packages.length > 0) {
    await saveChecksums(packages, outputDir);
    console.log();
    console.log(
      chalk.gray(
        i18n.t('commands:package.info.checksumsSaved', {
          path: path.join(outputDir, 'checksums.txt'),
        })
      )
    );
  }

  // Display summary
  console.log();
  console.log(chalk.cyan(`${i18n.t('commands:package.summary.title')}`));
  console.log(
    chalk.white(
      `  ${i18n.t('commands:package.summary.total')}: ${extensionsToPackage.length}`
    )
  );
  console.log(
    chalk.green(`  ${i18n.t('commands:package.summary.success')}: ${successCount}`)
  );

  if (failCount > 0) {
    console.log(chalk.red(`  ${i18n.t('commands:package.summary.failed')}: ${failCount}`));
  }

  // Calculate total size
  const totalSize = packages.reduce((sum, pkg) => sum + pkg.size, 0);
  console.log(
    chalk.white(
      `  ${i18n.t('commands:package.summary.totalSize')}: ${formatBytes(totalSize)}`
    )
  );

  console.log();

  // Exit with error if any packages failed
  if (failCount > 0) {
    process.exit(1);
  }
}
