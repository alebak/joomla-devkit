import chalk from 'chalk';
import ora from 'ora';

const VALID_TYPES = ['component', 'module', 'plugin', 'template', 'library'];

export async function createCommand(type, name, options) {
  // Validate extension type
  if (!VALID_TYPES.includes(type)) {
    console.error(
      chalk.red(`\nError: Invalid extension type "${type}"`)
    );
    console.log(
      chalk.yellow(`Valid types: ${VALID_TYPES.join(', ')}\n`)
    );
    process.exit(1);
  }

  const spinner = ora(`Creating ${type}: ${name}...`).start();

  // TODO: Implement extension creation logic
  spinner.info(
    chalk.yellow(`Create command not yet implemented for ${type}`)
  );

  console.log(chalk.cyan('\nPlanned features:'));
  console.log(chalk.white('  - Generate extension scaffolding'));
  console.log(chalk.white('  - Create manifest XML'));
  console.log(chalk.white('  - Setup Vite configuration'));
  console.log(chalk.white('  - Add example files\n'));
}
