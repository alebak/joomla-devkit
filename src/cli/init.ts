import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { getI18n } from '../utils/i18n.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface InitOptions {
  joomlaVersion?: string;
  devcontainer?: boolean;
  author?: string;
  email?: string;
}

interface ProjectConfig {
  author: string;
  email: string;
  joomlaVersion: string;
  useDevContainer: boolean;
}

export async function initCommand(name: string | undefined, options: InitOptions): Promise<void> {
  const i18n = await getI18n();

  console.log(chalk.blue(i18n.t('commands:init.starting') + '\n'));

  let projectName = name;

  // If no name provided, ask for it
  if (!projectName) {
    const answers = await inquirer.prompt<{ projectName: string }>([
      {
        type: 'input',
        name: 'projectName',
        message: i18n.t('common:prompts.projectName'),
        default: 'my-joomla-extension',
        validate: (input: string) => {
          if (!input) return i18n.t('common:validation.projectNameRequired');
          if (!/^[a-z0-9-_]+$/.test(input))
            return i18n.t('common:validation.projectNameInvalid');
          return true;
        },
      },
    ]);
    projectName = answers.projectName;
  }

  // Ask additional questions
  const questions: any[] = [];

  if (!options.author) {
    questions.push({
      type: 'input',
      name: 'author',
      message: i18n.t('common:prompts.authorName'),
      default: 'Your Name',
    });
  }

  if (!options.email) {
    questions.push({
      type: 'input',
      name: 'email',
      message: i18n.t('common:prompts.authorEmail'),
      default: '[email protected]',
    });
  }

  if (!options.joomlaVersion) {
    questions.push({
      type: 'list',
      name: 'joomlaVersion',
      message: i18n.t('common:prompts.joomlaVersion'),
      choices: ['5.0', '4.4', '4.3'],
      default: '5.0',
    });
  }

  if (options.devcontainer !== false && options.devcontainer !== true) {
    questions.push({
      type: 'confirm',
      name: 'useDevContainer',
      message: i18n.t('common:prompts.setupDevContainer'),
      default: true,
    });
  }

  const answers = questions.length > 0 ? await inquirer.prompt(questions) : {};

  const config: ProjectConfig = {
    author: options.author || answers.author || 'Your Name',
    email: options.email || answers.email || '[email protected]',
    joomlaVersion: options.joomlaVersion || answers.joomlaVersion || '5.0',
    useDevContainer: options.devcontainer !== false ? (answers.useDevContainer ?? true) : false,
  };

  const projectPath = path.join(process.cwd(), projectName);

  // Check if directory exists
  if (await fs.pathExists(projectPath)) {
    console.error(chalk.red(`\n${i18n.t('common:errors.directoryExists', { name: projectName })}`));
    process.exit(1);
  }

  const spinner = ora(i18n.t('commands:init.creatingStructure')).start();

  try {
    // Create project directory
    await fs.ensureDir(projectPath);

    // Create basic structure
    await fs.ensureDir(path.join(projectPath, 'src'));
    await fs.ensureDir(path.join(projectPath, 'dist'));

    // Copy Dev Container template if needed
    if (config.useDevContainer) {
      spinner.text = i18n.t('commands:init.settingUpDevContainer');
      const devcontainerTemplatePath = path.join(
        __dirname,
        '../templates/devcontainer'
      );
      await fs.copy(
        devcontainerTemplatePath,
        path.join(projectPath, '.devcontainer')
      );

      // Update docker-compose.yml with Joomla version
      const dockerComposePath = path.join(
        projectPath,
        '.devcontainer/docker-compose.yml'
      );
      let dockerCompose = await fs.readFile(dockerComposePath, 'utf-8');
      dockerCompose = dockerCompose.replace(
        /JOOMLA_VERSION/g,
        config.joomlaVersion
      );
      await fs.writeFile(dockerComposePath, dockerCompose);
    }

    // Create package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      description: `Joomla extension project - ${projectName}`,
      type: 'module',
      scripts: {
        dev: 'jkit dev',
        build: 'jkit build',
        package: 'jkit package',
      },
      author: `${config.author} <${config.email}>`,
      license: 'GPL-2.0-or-later',
      devDependencies: {
        jkit: 'latest',
      },
    };
    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, {
      spaces: 2,
    });

    // Create jkit.config.json
    const jkitConfig = {
      joomlaVersion: config.joomlaVersion,
      author: config.author,
      authorEmail: config.email,
      license: 'GPL-2.0-or-later',
      extensions: {},
      vite: {
        // Custom Vite configuration can be added here
      }
    };
    await fs.writeJSON(path.join(projectPath, 'jkit.config.json'), jkitConfig, {
      spaces: 2,
    });

    // Create README.md
    const devContainerSection = config.useDevContainer
      ? `### ${i18n.t('commands:init.usingDevContainer')}

${(i18n.t('commands:init.devContainerSteps', { returnObjects: true }) as string[]).map((step: string, index: number) => `${index + 1}. ${step}`).join('\n')}
`
      : '';

    const readme = `# ${projectName}

Joomla extension project created with jkit.

## Getting Started

${devContainerSection}

### Development

\`\`\`bash
# Start development server
npm run dev

# Build for production
npm run build

# Create distribution package
npm run package
\`\`\`

## Create Extensions

\`\`\`bash
# Create a component
jkit create component com_mycomponent

# Create a module
jkit create module mod_mymodule

# Create a plugin
jkit create plugin system myplugin

# Create a template
jkit create template mytemplate

# Create a library
jkit create library mylib
\`\`\`

## Project Structure

\`\`\`
${projectName}/
├── .devcontainer/      # Dev Container configuration
├── src/                # Extension source code
│   ├── com_*/         # Components
│   ├── mod_*/         # Modules
│   ├── plg_*/         # Plugins
│   ├── tpl_*/         # Templates
│   ├── lib_*/         # Libraries
│   └── pkg_*/         # Packages
├── dist/              # Built packages (.zip files)
└── jkit.config.json   # jkit configuration
\`\`\`
`;
    await fs.writeFile(path.join(projectPath, 'README.md'), readme);

    // Create .gitignore
    const gitignore = `node_modules/
dist/
*.zip
.env
.DS_Store
`;
    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);

    spinner.succeed(chalk.green(i18n.t('common:success.projectCreated')));

    console.log(chalk.cyan(`\n${i18n.t('common:nextSteps')}\n`));
    console.log(chalk.white(`  ${i18n.t('commands:init.steps.changeDirectory', { name: projectName })}`));
    if (config.useDevContainer) {
      console.log(chalk.white(`  ${i18n.t('commands:init.steps.openInCode')}`));
      console.log(chalk.white(`  ${i18n.t('commands:init.steps.reopenInContainer')}`));
    } else {
      console.log(chalk.white(`  ${i18n.t('commands:init.steps.installDependencies')}`));
    }
    console.log(chalk.white(`  ${i18n.t('commands:init.steps.createExtension')}\n`));
  } catch (error) {
    spinner.fail(chalk.red(i18n.t('common:errors.projectCreationFailed')));
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    }
    process.exit(1);
  }
}
