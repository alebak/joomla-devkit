import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { createServer } from 'vite';
import { getI18n } from '../utils/i18n.js';
import { pathExists, readJsonFile } from '../utils/files.js';
import { generateViteConfig } from '../utils/vite-config.js';
import type { JkitConfig, ExtensionConfig } from '../types/config.js';

interface DevOptions {
  port?: string;
  extension?: string;
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
 * @returns Extension path or null
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
      // Try to find config
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
 * Starts development server with Vite HMR
 *
 * @param options - Dev command options
 */
export async function devCommand(options: DevOptions): Promise<void> {
  const i18n = await getI18n();

  console.log(chalk.cyan.bold(`\n${i18n.t('commands:dev.title')}\n`));

  // Load jkit configuration
  const config = await loadJkitConfig();

  if (!config) {
    console.error(
      chalk.red(`\n${i18n.t('commands:dev.errors.noConfig')}\n`)
    );
    console.log(
      chalk.yellow(i18n.t('commands:dev.info.runInit'))
    );
    process.exit(1);
  }

  // Determine which extension to develop
  let extensionName = options.extension;

  if (!extensionName) {
    // If no extension specified, try to auto-detect
    const extensions = Object.keys(config.extensions);

    if (extensions.length === 0) {
      console.error(
        chalk.red(`\n${i18n.t('commands:dev.errors.noExtensions')}\n`)
      );
      console.log(
        chalk.yellow(i18n.t('commands:dev.info.createExtension'))
      );
      process.exit(1);
    }

    if (extensions.length === 1) {
      extensionName = extensions[0];
      console.log(
        chalk.blue(
          i18n.t('commands:dev.info.autoDetected', { name: extensionName })
        )
      );
    } else {
      console.error(
        chalk.red(`\n${i18n.t('commands:dev.errors.multipleExtensions')}\n`)
      );
      console.log(
        chalk.yellow(
          i18n.t('commands:dev.info.specifyExtension', {
            names: extensions.join(', '),
          })
        )
      );
      console.log(chalk.white(`\n  jkit dev --extension <name>\n`));
      process.exit(1);
    }
  }

  // Find extension path (extensionName is guaranteed to be defined at this point)
  const extensionInfo = await findExtensionPath(extensionName!, config);

  if (!extensionInfo) {
    console.error(
      chalk.red(
        `\n${i18n.t('commands:dev.errors.extensionNotFound', { name: extensionName })}\n`
      )
    );
    process.exit(1);
  }

  const { path: extensionPath, extensionConfig } = extensionInfo;

  console.log(
    chalk.gray(i18n.t('commands:dev.info.extensionPath', { path: extensionPath }))
  );

  const spinner = ora(i18n.t('commands:dev.starting')).start();

  try {
    // Parse port
    const port = options.port ? parseInt(options.port, 10) : 5173;

    // Generate Vite configuration
    const viteConfig = generateViteConfig({
      extensionType: extensionConfig.type,
      extensionName: extensionConfig.name,
      extensionConfig,
      sourcePath: extensionPath,
      outDir: path.join(extensionPath, 'dist'),
      mode: 'development',
      port,
    });

    // Create Vite server
    const server = await createServer(viteConfig);

    // Start server
    await server.listen();

    spinner.succeed(chalk.green(i18n.t('commands:dev.serverStarted')));

    const serverUrl = `http://localhost:${port}`;

    console.log(chalk.cyan(`\n${i18n.t('commands:dev.info.serverRunning')}`));
    console.log(chalk.white(`  ${i18n.t('commands:dev.info.url')}: ${chalk.cyan(serverUrl)}`));
    console.log(
      chalk.white(`  ${i18n.t('commands:dev.info.extension')}: ${chalk.yellow(extensionName)}`)
    );
    console.log(
      chalk.white(`  ${i18n.t('commands:dev.info.type')}: ${chalk.yellow(extensionConfig.type)}`)
    );

    console.log(chalk.gray(`\n${i18n.t('commands:dev.info.hmrEnabled')}`));
    console.log(chalk.gray(i18n.t('commands:dev.info.pressCtrlC')));

    // Handle shutdown
    const shutdown = async () => {
      console.log(chalk.yellow(`\n\n${i18n.t('commands:dev.info.stopping')}`));
      await server.close();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    spinner.fail(chalk.red(i18n.t('commands:dev.errors.failed')));
    console.error(
      chalk.red(`\n${error instanceof Error ? error.message : String(error)}\n`)
    );
    process.exit(1);
  }
}
