import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { build as viteBuild } from 'vite';
import { getI18n } from '../utils/i18n.js';
import { pathExists, readJsonFile, getDirectorySize, formatBytes } from '../utils/files.js';
import { generateViteConfig } from '../utils/vite-config.js';
import type { JkitConfig, ExtensionConfig } from '../types/config.js';

interface BuildOptions {
  extension?: string;
  watch?: boolean;
  sourcemap?: boolean;
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
 * Finds extension directory
 *
 * @param extensionName - Extension name
 * @param config - Jkit configuration
 * @returns Extension path and config or null
 */
async function findExtensionPath(
  extensionName: string,
  config: JkitConfig
): Promise<{ path: string; extensionConfig: ExtensionConfig } | null> {
  const extensionsDir = config.extensionsDir || 'extensions';

  // Search in extension configuration
  if (config.extensions[extensionName]) {
    const extConfig = config.extensions[extensionName];
    const extPath = path.join(
      process.cwd(),
      extensionsDir,
      extConfig.type,
      extConfig.name
    );

    if (await pathExists(extPath)) {
      return { path: extPath, extensionConfig: extConfig };
    }
  }

  // Search in all extension types
  const types = ['component', 'module', 'plugin', 'template', 'library'];
  for (const type of types) {
    const extPath = path.join(process.cwd(), extensionsDir, type, extensionName);
    if (await pathExists(extPath)) {
      const extConfig = Object.values(config.extensions).find(
        (ext) => ext.name === extensionName && ext.type === type
      );
      if (extConfig) {
        return { path: extPath, extensionConfig: extConfig };
      }
    }
  }

  return null;
}

/**
 * Builds a single extension for production
 *
 * @param extensionName - Extension name
 * @param extensionPath - Extension path
 * @param extensionConfig - Extension configuration
 * @param options - Build options
 * @returns Build success status
 */
async function buildExtension(
  extensionName: string,
  extensionPath: string,
  extensionConfig: ExtensionConfig,
  options: BuildOptions
): Promise<boolean> {
  const i18n = await getI18n();

  try {
    // Output directory for built assets
    const outDir = path.join(extensionPath, 'media');

    // Generate Vite configuration for production
    const viteConfig = generateViteConfig({
      extensionType: extensionConfig.type,
      extensionName: extensionConfig.name,
      extensionConfig,
      sourcePath: extensionPath,
      outDir,
      mode: 'production',
    });

    // Override source maps if specified
    if (options.sourcemap !== undefined && viteConfig.build) {
      viteConfig.build.sourcemap = options.sourcemap;
    }

    // Run Vite build
    await viteBuild(viteConfig);

    // Get output size
    const size = await getDirectorySize(outDir);

    console.log(
      chalk.gray(
        `  ${i18n.t('commands:build.info.outputSize')}: ${chalk.white(formatBytes(size))}`
      )
    );

    return true;
  } catch (error) {
    console.error(
      chalk.red(
        `  ${i18n.t('commands:build.errors.buildFailed', { name: extensionName })}`
      )
    );
    console.error(chalk.red(`  ${error instanceof Error ? error.message : String(error)}`));
    return false;
  }
}

/**
 * Builds extensions for production
 *
 * @param options - Build command options
 */
export async function buildCommand(options: BuildOptions): Promise<void> {
  const i18n = await getI18n();

  console.log(chalk.cyan.bold(`\n${i18n.t('commands:build.title')}\n`));

  // Load jkit configuration
  const config = await loadJkitConfig();

  if (!config) {
    console.error(chalk.red(`\n${i18n.t('commands:build.errors.noConfig')}\n`));
    console.log(chalk.yellow(i18n.t('commands:build.info.runInit')));
    process.exit(1);
  }

  // Determine which extensions to build
  const extensionsToBuild: string[] = [];

  if (options.extension) {
    // Build specific extension
    if (config.extensions[options.extension]) {
      extensionsToBuild.push(options.extension);
    } else {
      console.error(
        chalk.red(
          `\n${i18n.t('commands:build.errors.extensionNotFound', { name: options.extension })}\n`
        )
      );
      process.exit(1);
    }
  } else {
    // Build all extensions
    const allExtensions = Object.keys(config.extensions);

    if (allExtensions.length === 0) {
      console.error(chalk.red(`\n${i18n.t('commands:build.errors.noExtensions')}\n`));
      console.log(chalk.yellow(i18n.t('commands:build.info.createExtension')));
      process.exit(1);
    }

    extensionsToBuild.push(...allExtensions);
  }

  console.log(
    chalk.blue(
      i18n.t('commands:build.info.building', { count: extensionsToBuild.length })
    )
  );
  console.log();

  // Build each extension
  let successCount = 0;
  let failCount = 0;

  for (const extensionName of extensionsToBuild) {
    const spinner = ora(
      i18n.t('commands:build.building', { name: extensionName })
    ).start();

    // Find extension path
    const extensionInfo = await findExtensionPath(extensionName, config);

    if (!extensionInfo) {
      spinner.fail(
        chalk.red(
          i18n.t('commands:build.errors.extensionNotFound', { name: extensionName })
        )
      );
      failCount++;
      continue;
    }

    const { path: extensionPath, extensionConfig } = extensionInfo;

    // Build extension
    const success = await buildExtension(
      extensionName,
      extensionPath,
      extensionConfig,
      options
    );

    if (success) {
      spinner.succeed(
        chalk.green(
          i18n.t('commands:build.success', {
            name: extensionName,
            type: extensionConfig.type,
          })
        )
      );
      successCount++;
    } else {
      spinner.fail(
        chalk.red(i18n.t('commands:build.failed', { name: extensionName }))
      );
      failCount++;
    }
  }

  // Display summary
  console.log();
  console.log(chalk.cyan(`${i18n.t('commands:build.summary.title')}`));
  console.log(
    chalk.white(
      `  ${i18n.t('commands:build.summary.total')}: ${extensionsToBuild.length}`
    )
  );
  console.log(
    chalk.green(`  ${i18n.t('commands:build.summary.success')}: ${successCount}`)
  );

  if (failCount > 0) {
    console.log(chalk.red(`  ${i18n.t('commands:build.summary.failed')}: ${failCount}`));
  }

  console.log();

  // Exit with error if any builds failed
  if (failCount > 0) {
    process.exit(1);
  }
}
