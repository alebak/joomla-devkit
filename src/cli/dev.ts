import chalk from 'chalk';
import ora from 'ora';
import { getI18n } from '../utils/i18n.js';

interface DevOptions {
  port?: string;
}

export async function devCommand(options: DevOptions): Promise<void> {
  const i18n = await getI18n();
  const spinner = ora(i18n.t('commands:dev.starting')).start();

  // TODO: Implement dev server with Vite
  spinner.info(chalk.yellow(i18n.t('commands:dev.notImplemented')));

  console.log(chalk.cyan(`\n${i18n.t('commands:dev.plannedFeatures')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:dev.features.hmr')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:dev.features.watch')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:dev.features.autoRebuild')}`));
  console.log(chalk.white(`  - ${i18n.t('commands:dev.features.liveReload')}\n`));
}
