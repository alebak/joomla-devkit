import chalk from 'chalk';
import ora from 'ora';
import { getI18n } from '../utils/i18n.js';

interface BuildOptions {
  extension?: string;
}

export async function buildCommand(options: BuildOptions): Promise<void> {
  const i18n = await getI18n();
  const spinner = ora(i18n.t('commands:build.building')).start();

  // TODO: Implement production build with Vite
  spinner.info(chalk.yellow(i18n.t('commands:build.notImplemented')));

  console.log(chalk.cyan(`\n${i18n.t('commands:build.plannedFeatures')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:build.features.minify')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:build.features.optimize')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:build.features.sourceMaps')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:build.features.treeShaking')}\n`));
}
