import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import path from 'path';
import { getI18n } from '../utils/i18n.js';
import { validateExtensionName, validateEmail, validatePluginGroup, generateNamespace } from '../utils/validation.js';
import { generateVariables } from '../utils/variables.js';
import { processTemplateDirectory, templateExists, getTemplateDirectory } from '../utils/template.js';
import { pathExists, ensureDir, readJsonFile, writeJsonFile } from '../utils/files.js';
import type { ExtensionType, CreateExtensionOptions, JkitConfig } from '../types/config.js';

const VALID_TYPES: ExtensionType[] = ['component', 'module', 'plugin', 'template', 'library'];

interface CreateCommandOptions {
  author?: string;
  email?: string;
  license?: string;
  namespace?: string;
  client?: 'site' | 'administrator';
  group?: string;
}

/**
 * Loads jkit configuration from project
 *
 * @returns Jkit configuration or null if not found
 */
async function loadJkitConfig(): Promise<Partial<JkitConfig> | null> {
  const configPath = path.join(process.cwd(), 'jkit.config.json');

  if (await pathExists(configPath)) {
    try {
      return await readJsonFile<JkitConfig>(configPath);
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Prompts user for extension details
 *
 * @param type - Extension type
 * @param name - Extension name
 * @param options - Command options
 * @param config - Project config
 * @returns Complete extension options
 */
async function promptForDetails(
  type: ExtensionType,
  name: string,
  options: CreateCommandOptions,
  config: Partial<JkitConfig> | null
): Promise<CreateExtensionOptions> {
  const i18n = await getI18n();

  const questions: any[] = [];

  // Author name
  if (!options.author && !config?.author) {
    questions.push({
      type: 'input',
      name: 'author',
      message: i18n.t('common:prompts.authorName'),
      default: 'Your Name',
      validate: (input: string) => input.trim().length > 0 || i18n.t('common:errors.required'),
    });
  }

  // Author email
  if (!options.email && !config?.authorEmail) {
    questions.push({
      type: 'input',
      name: 'email',
      message: i18n.t('common:prompts.authorEmail'),
      default: 'your.email@example.com',
      validate: (input: string) => validateEmail(input) || i18n.t('common:errors.invalidEmail'),
    });
  }

  // License
  if (!options.license && !config?.license) {
    questions.push({
      type: 'list',
      name: 'license',
      message: i18n.t('common:prompts.license'),
      choices: ['GPL-2.0-or-later', 'MIT', 'Apache-2.0', 'BSD-3-Clause', 'Proprietary'],
      default: 'GPL-2.0-or-later',
    });
  }

  // Plugin group
  if (type === 'plugin' && !options.group) {
    questions.push({
      type: 'list',
      name: 'group',
      message: i18n.t('commands:create.prompts.pluginGroup'),
      choices: [
        'system',
        'content',
        'user',
        'authentication',
        'editors',
        'editors-xtd',
        'finder',
        'installer',
        'quickicon',
        'privacy',
        'webservices',
        'workflow',
        'task',
      ],
      default: 'system',
    });
  }

  // Module/Template client
  if ((type === 'module' || type === 'template') && !options.client) {
    questions.push({
      type: 'list',
      name: 'client',
      message: i18n.t('commands:create.prompts.client'),
      choices: [
        { name: i18n.t('commands:create.choices.site'), value: 'site' },
        { name: i18n.t('commands:create.choices.administrator'), value: 'administrator' },
      ],
      default: 'site',
    });
  }

  // Description
  questions.push({
    type: 'input',
    name: 'description',
    message: i18n.t('common:prompts.description'),
    default: `${name} ${type} for Joomla`,
  });

  const answers = questions.length > 0 ? await inquirer.prompt(questions) : {};

  // Merge with options and config
  const author = options.author || answers.author || config?.author || 'Your Name';
  const email = options.email || answers.email || config?.authorEmail || 'your.email@example.com';
  const license = options.license || answers.license || config?.license || 'GPL-2.0-or-later';

  // Generate namespace if not provided
  const namespace = options.namespace || generateNamespace(author, type, name);

  const createOptions: CreateExtensionOptions = {
    type,
    name,
    author,
    email,
    url: config?.authorUrl,
    namespace,
    version: '1.0.0',
    description: answers.description,
    license,
    client: answers.client || options.client,
    pluginGroup: answers.group || options.group,
    group: answers.group || options.group,
  };

  return createOptions;
}

/**
 * Updates jkit configuration with new extension
 *
 * @param extensionOptions - Extension options
 */
async function updateJkitConfig(extensionOptions: CreateExtensionOptions): Promise<void> {
  const configPath = path.join(process.cwd(), 'jkit.config.json');

  let config: Partial<JkitConfig> = {};

  if (await pathExists(configPath)) {
    config = await readJsonFile<JkitConfig>(configPath);
  }

  // Initialize extensions object if not exists
  if (!config.extensions) {
    config.extensions = {};
  }

  // Add extension configuration
  const extensionKey = extensionOptions.name;
  config.extensions[extensionKey] = {
    type: extensionOptions.type,
    name: extensionOptions.name,
    author: extensionOptions.author,
    authorEmail: extensionOptions.email,
    license: extensionOptions.license,
    version: extensionOptions.version,
    description: extensionOptions.description,
  };

  // Add plugin group if applicable
  if (extensionOptions.type === 'plugin' && extensionOptions.pluginGroup) {
    config.extensions[extensionKey].plugin = {
      group: extensionOptions.pluginGroup,
    };
  }

  // Add module client if applicable
  if (extensionOptions.type === 'module' && extensionOptions.client) {
    config.extensions[extensionKey].module = {
      client: extensionOptions.client,
    };
  }

  // Save configuration
  await writeJsonFile(configPath, config, 2);
}

/**
 * Creates a new extension
 *
 * @param type - Extension type
 * @param name - Extension name
 * @param options - Command options
 */
export async function createCommand(
  type: string,
  name: string | undefined,
  options: CreateCommandOptions
): Promise<void> {
  const i18n = await getI18n();

  console.log(chalk.cyan.bold(`\n${i18n.t('commands:create.title')}\n`));

  // Validate extension type
  if (!VALID_TYPES.includes(type as ExtensionType)) {
    console.error(chalk.red(`${i18n.t('common:errors.invalidExtensionType', { type })}`));
    console.log(chalk.yellow(`${i18n.t('common:validTypes', { types: VALID_TYPES.join(', ') })}\n`));
    process.exit(1);
  }

  const extensionType = type as ExtensionType;

  // Prompt for name if not provided
  if (!name) {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: i18n.t('commands:create.prompts.extensionName', { type }),
        validate: (input: string) =>
          validateExtensionName(input, extensionType) ||
          i18n.t('common:errors.invalidExtensionName'),
      },
    ]);
    name = answer.name;
  }

  // Validate name (at this point name is guaranteed to be defined)
  if (!name || !validateExtensionName(name, extensionType)) {
    console.error(chalk.red(`\n${i18n.t('common:errors.invalidExtensionName')}\n`));
    process.exit(1);
  }

  // Check if template exists
  if (!(await templateExists(extensionType))) {
    console.error(
      chalk.red(`\n${i18n.t('commands:create.errors.templateNotFound', { type: extensionType })}\n`)
    );
    process.exit(1);
  }

  // Load project configuration
  const config = await loadJkitConfig();

  // Prompt for additional details
  const extensionOptions = await promptForDetails(extensionType, name, options, config);

  // Validate plugin group
  if (extensionType === 'plugin' && extensionOptions.pluginGroup) {
    if (!validatePluginGroup(extensionOptions.pluginGroup)) {
      console.error(
        chalk.red(
          `\n${i18n.t('commands:create.errors.invalidPluginGroup', { group: extensionOptions.pluginGroup })}\n`
        )
      );
      process.exit(1);
    }
  }

  // Generate variables for template processing (name is now guaranteed to be string)
  const variables = generateVariables(extensionType, name!, extensionOptions);

  // Determine output directory
  const extensionsDir = config?.extensionsDir || 'extensions';
  const outputDir = path.join(process.cwd(), extensionsDir, extensionType, variables.COMPONENT_NAME || variables.MODULE_NAME || variables.PLUGIN_NAME || variables.TEMPLATE_NAME || variables.LIBRARY_NAME || name);

  // Check if extension already exists
  if (await pathExists(outputDir)) {
    console.error(
      chalk.red(`\n${i18n.t('commands:create.errors.extensionExists', { name: name!, path: outputDir })}\n`)
    );
    process.exit(1);
  }

  // Create extension
  const spinner = ora(i18n.t('commands:create.creating', { type: extensionType, name: name! })).start();

  try {
    // Ensure extensions directory exists
    await ensureDir(path.join(process.cwd(), extensionsDir, extensionType));

    // Get template directory
    const templateDir = getTemplateDirectory(extensionType);

    // Process template
    await processTemplateDirectory(templateDir, outputDir, variables, {
      extensions: [], // Process all files
      exclude: ['.DS_Store', 'Thumbs.db'],
    });

    // Update jkit configuration
    await updateJkitConfig(extensionOptions);

    spinner.succeed(chalk.green(i18n.t('commands:create.success', { name: name! })));

    // Display next steps
    console.log(chalk.cyan(`\n${i18n.t('commands:create.nextSteps')}`));
    console.log(chalk.white(`  1. cd ${path.relative(process.cwd(), outputDir)}`));
    console.log(chalk.white(`  2. ${i18n.t('commands:create.steps.reviewFiles')}`));
    console.log(chalk.white(`  3. jkit dev ${name} ${i18n.t('commands:create.steps.startDev')}`));
    console.log(chalk.white(`  4. jkit build ${name} ${i18n.t('commands:create.steps.buildProduction')}`));
    console.log(chalk.white(`  5. jkit package ${name} ${i18n.t('commands:create.steps.createPackage')}\n`));

    console.log(chalk.gray(i18n.t('commands:create.info.location', { path: outputDir })));
    console.log(chalk.gray(i18n.t('commands:create.info.namespace', { namespace: variables.NAMESPACE })) + '\n');
  } catch (error) {
    spinner.fail(chalk.red(i18n.t('commands:create.errors.failed')));
    console.error(chalk.red(`\n${error instanceof Error ? error.message : String(error)}\n`));
    process.exit(1);
  }
}
