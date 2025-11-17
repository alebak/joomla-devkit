#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getI18n } from '../utils/i18n.js';

// Commands
import { initCommand } from '../cli/init.js';
import { createCommand } from '../cli/create.js';
import { devCommand } from '../cli/dev.js';
import { buildCommand } from '../cli/build.js';
import { packageCommand } from '../cli/package.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../../package.json'), 'utf-8')
) as { version: string };

async function main() {
  // Initialize i18n
  const i18n = await getI18n();

  console.log(chalk.cyan.bold(`\n${i18n.t('common:appTitle')}\n`));

  program
    .name('jkit')
    .description('Modern CLI tool for Joomla extension development')
    .version(packageJson.version);

  // Init command - Create new project with Dev Container
  program
    .command('init')
    .description(i18n.t('commands:init.description'))
    .argument('[name]', 'Project name')
    .option('-j, --joomla-version <version>', 'Joomla version', '5.0')
    .option('--no-devcontainer', 'Skip Dev Container setup')
    .action(initCommand);

  // Create command - Create new extension
  program
    .command('create <type> <name>')
    .description(i18n.t('commands:create.description'))
    .option('-a, --author <author>', 'Extension author')
    .option('-e, --email <email>', 'Author email')
    .option('-l, --license <license>', 'License', 'GPL-2.0-or-later')
    .action(createCommand);

  // Dev command - Start development server
  program
    .command('dev')
    .description(i18n.t('commands:dev.description'))
    .option('-p, --port <port>', 'Dev server port', '5173')
    .action(devCommand);

  // Build command - Build for production
  program
    .command('build')
    .description(i18n.t('commands:build.description'))
    .option('-e, --extension <name>', 'Build specific extension')
    .action(buildCommand);

  // Package command - Create distribution package
  program
    .command('package')
    .description(i18n.t('commands:package.description'))
    .option('-e, --extension <name>', 'Package specific extension')
    .option('-o, --output <path>', 'Output directory', './dist')
    .action(packageCommand);

  program.parse();
}

// Run main
main().catch((error) => {
  console.error(chalk.red('Error:'), error);
  process.exit(1);
});
