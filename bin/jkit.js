#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Commands
import { initCommand } from '../src/cli/init.js';
import { createCommand } from '../src/cli/create.js';
import { devCommand } from '../src/cli/dev.js';
import { buildCommand } from '../src/cli/build.js';
import { packageCommand } from '../src/cli/package.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf-8')
);

console.log(chalk.cyan.bold('\n🚀 jkit - Joomla Development Kit\n'));

program
  .name('jkit')
  .description('Modern CLI tool for Joomla extension development')
  .version(packageJson.version);

// Init command - Create new project with Dev Container
program
  .command('init')
  .description('Initialize a new Joomla extension project with Dev Container')
  .argument('[name]', 'Project name')
  .option('-j, --joomla-version <version>', 'Joomla version', '5.0')
  .option('--no-devcontainer', 'Skip Dev Container setup')
  .action(initCommand);

// Create command - Create new extension
program
  .command('create <type> <name>')
  .description('Create a new Joomla extension')
  .option('-a, --author <author>', 'Extension author')
  .option('-e, --email <email>', 'Author email')
  .option('-l, --license <license>', 'License', 'GPL-2.0-or-later')
  .action(createCommand);

// Dev command - Start development server
program
  .command('dev')
  .description('Start development server with watch mode')
  .option('-p, --port <port>', 'Dev server port', '5173')
  .action(devCommand);

// Build command - Build for production
program
  .command('build')
  .description('Build extension for production')
  .option('-e, --extension <name>', 'Build specific extension')
  .action(buildCommand);

// Package command - Create distribution package
program
  .command('package')
  .description('Create distribution package (.zip)')
  .option('-e, --extension <name>', 'Package specific extension')
  .option('-o, --output <path>', 'Output directory', './dist')
  .action(packageCommand);

program.parse();
