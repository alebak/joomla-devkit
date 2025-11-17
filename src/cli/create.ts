import chalk from 'chalk';
import ora from 'ora';
import { getI18n } from '../utils/i18n.js';

const VALID_TYPES = ['component', 'module', 'plugin', 'template', 'library'] as const;
type ExtensionType = typeof VALID_TYPES[number];

interface CreateOptions {
  author?: string;
  email?: string;
  license?: string;
}

export async function createCommand(
  type: string,
  name: string,
  options: CreateOptions
): Promise<void> {
  const i18n = await getI18n();

  // Validate extension type
  if (!VALID_TYPES.includes(type as ExtensionType)) {
    console.error(chalk.red(`\n${i18n.t('common:errors.invalidExtensionType', { type })}`));
    console.log(chalk.yellow(`${i18n.t('common:validTypes', { types: VALID_TYPES.join(', ') })}\n`));
    process.exit(1);
  }

  const spinner = ora(i18n.t('commands:create.creating', { type, name })).start();

  // TODO: Implement extension creation logic
  spinner.info(chalk.yellow(i18n.t('commands:create.notImplemented', { type })));

  console.log(chalk.cyan(`\n${i18n.t('commands:create.plannedFeatures')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:create.features.scaffolding')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:create.features.manifest')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:create.features.viteConfig')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:create.features.exampleFiles')}\n`));
}
