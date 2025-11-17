import chalk from 'chalk';
import ora from 'ora';
import { getI18n } from '../utils/i18n.js';

interface PackageOptions {
  extension?: string;
  output?: string;
}

export async function packageCommand(_options: PackageOptions): Promise<void> {
  const i18n = await getI18n();
  const spinner = ora(i18n.t('commands:package.creating')).start();

  // TODO: Implement package creation
  spinner.info(chalk.yellow(i18n.t('commands:package.notImplemented')));

  console.log(chalk.cyan(`\n${i18n.t('commands:package.plannedFeatures')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:package.features.createZip')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:package.features.includeManifest')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:package.features.copyAssets')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:package.features.updateServer')}\n`));
}
