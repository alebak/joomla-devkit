import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface InitOptions {
  joomlaVersion?: string;
  devcontainer?: boolean;
}

interface ProjectConfig {
  author: string;
  email: string;
  joomlaVersion: string;
  useDevContainer: boolean;
}

export async function initCommand(name: string | undefined, options: InitOptions): Promise<void> {
  console.log(chalk.blue('Initializing new Joomla project...\n'));

  let projectName = name;

  // If no name provided, ask for it
  if (!projectName) {
    const answers = await inquirer.prompt<{ projectName: string }>([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'my-joomla-extension',
        validate: (input: string) => {
          if (!input) return 'Project name is required';
          if (!/^[a-z0-9-_]+$/.test(input))
            return 'Project name must contain only lowercase letters, numbers, hyphens and underscores';
          return true;
        },
      },
    ]);
    projectName = answers.projectName;
  }

  // Ask additional questions
  const config = await inquirer.prompt<ProjectConfig>([
    {
      type: 'input',
      name: 'author',
      message: 'Author name:',
      default: 'Your Name',
    },
    {
      type: 'input',
      name: 'email',
      message: 'Author email:',
      default: '[email protected]',
    },
    {
      type: 'list',
      name: 'joomlaVersion',
      message: 'Joomla version:',
      choices: ['5.0', '4.4', '4.3'],
      default: options.joomlaVersion || '5.0',
    },
    {
      type: 'confirm',
      name: 'useDevContainer',
      message: 'Setup Dev Container?',
      default: options.devcontainer !== false,
    },
  ]);

  const projectPath = path.join(process.cwd(), projectName);

  // Check if directory exists
  if (await fs.pathExists(projectPath)) {
    console.error(chalk.red(`\nError: Directory "${projectName}" already exists`));
    process.exit(1);
  }

  const spinner = ora('Creating project structure...').start();

  try {
    // Create project directory
    await fs.ensureDir(projectPath);

    // Create basic structure
    await fs.ensureDir(path.join(projectPath, 'src'));
    await fs.ensureDir(path.join(projectPath, 'dist'));
    await fs.ensureDir(path.join(projectPath, 'extensions'));

    // Copy Dev Container template if needed
    if (config.useDevContainer) {
      spinner.text = 'Setting up Dev Container...';
      const devcontainerTemplatePath = path.join(
        __dirname,
        '../../templates/devcontainer'
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

    // Create jkit.config.js
    const jkitConfig = `export default {
  joomlaVersion: '${config.joomlaVersion}',
  author: '${config.author}',
  authorEmail: '${config.email}',
  license: 'GPL-2.0-or-later',

  extensions: {},

  vite: {
    // Custom Vite configuration
  }
};
`;
    await fs.writeFile(path.join(projectPath, 'jkit.config.js'), jkitConfig);

    // Create README.md
    const readme = `# ${projectName}

Joomla extension project created with jkit.

## Getting Started

${
  config.useDevContainer
    ? `### Using Dev Container (Recommended)

1. Open this project in VS Code
2. Click "Reopen in Container" when prompted
3. Wait for the container to build and Joomla to be installed
4. Access Joomla at http://localhost:8080
`
    : ''
}

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
├── extensions/         # Extension source code
├── src/               # Shared source files
├── dist/              # Built files
└── jkit.config.js     # jkit configuration
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

    spinner.succeed(chalk.green('Project created successfully!'));

    console.log(chalk.cyan('\n📦 Next steps:\n'));
    console.log(chalk.white(`  cd ${projectName}`));
    if (config.useDevContainer) {
      console.log(chalk.white('  code .'));
      console.log(chalk.white('  # Reopen in Dev Container when prompted'));
    } else {
      console.log(chalk.white('  npm install'));
    }
    console.log(chalk.white('  jkit create component com_mycomponent\n'));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create project'));
    if (error instanceof Error) {
      console.error(chalk.red(error.message));
    }
    process.exit(1);
  }
}
