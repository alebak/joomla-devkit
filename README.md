# jkit - Joomla Development Kit

Modern CLI tool for Joomla extension development with Vite and Dev Containers.

## Features

- **TypeScript First**: Written in TypeScript with full type safety (JavaScript also supported)
- **Modern Build System**: Powered by Vite for lightning-fast development
- **Dev Container Ready**: Automatic Docker setup with Joomla, MySQL, phpMyAdmin, and Mailpit
- **Multi-Extension Support**: Create components, modules, plugins, templates, and libraries
- **Hot Module Replacement**: Instant updates during development
- **Production Ready**: Optimized builds with minification and tree-shaking
- **Easy Distribution**: One-command packaging for Joomla installation

## Installation

```bash
npm install -g jkit
```

## Quick Start

### 1. Create a new project

```bash
jkit init my-extension
cd my-extension
```

### 2. Open in VS Code with Dev Container

```bash
code .
# Click "Reopen in Container" when prompted
```

### 3. Create your first extension

```bash
# Create a component
jkit create component com_hello

# Create a module
jkit create module mod_latest

# Create a plugin
jkit create plugin system myplugin

# Create a template
jkit create template mytemplate

# Create a library
jkit create library mylib
```

### 4. Start development

```bash
jkit dev
```

### 5. Build and package

```bash
jkit build
jkit package
```

## Commands

### `jkit init [name]`

Initialize a new Joomla extension project with Dev Container.

```bash
jkit init my-project
jkit init my-project --joomla-version 4.4
jkit init my-project --no-devcontainer
```

**Options:**
- `-j, --joomla-version <version>`: Joomla version (default: "5.0")
- `--no-devcontainer`: Skip Dev Container setup

### `jkit create <type> <name>`

Create a new Joomla extension.

**Types:** `component`, `module`, `plugin`, `template`, `library`

```bash
jkit create component com_mycomponent
jkit create module mod_mymodule --author "John Doe"
jkit create plugin system myplugin --license MIT
```

**Options:**
- `-a, --author <author>`: Extension author
- `-e, --email <email>`: Author email
- `-l, --license <license>`: License (default: "GPL-2.0-or-later")

### `jkit dev`

Start development server with watch mode and Hot Module Replacement.

```bash
jkit dev
jkit dev --port 3000
```

**Options:**
- `-p, --port <port>`: Dev server port (default: 5173)

### `jkit build`

Build extension for production with optimizations.

```bash
jkit build
jkit build --extension com_mycomponent
```

**Options:**
- `-e, --extension <name>`: Build specific extension

### `jkit package`

Create distribution package (.zip) ready for Joomla installation.

```bash
jkit package
jkit package --extension com_mycomponent
jkit package --output ./releases
```

**Options:**
- `-e, --extension <name>`: Package specific extension
- `-o, --output <path>`: Output directory (default: "./dist")

## Dev Container Services

When you initialize a project with Dev Container, you get:

- **Joomla**: http://localhost:8080
- **phpMyAdmin**: http://localhost:8081
- **Mailpit UI**: http://localhost:8025 (email testing)
- **MySQL**: localhost:3306
  - Database: `joomla`
  - User: `joomla`
  - Password: `joomla`
  - Root password: `root`

## Project Structure

```
my-project/
├── .devcontainer/
│   ├── devcontainer.json
│   └── docker-compose.yml
├── extensions/
│   ├── com_mycomponent/
│   ├── mod_mymodule/
│   └── plg_system_myplugin/
├── src/
│   ├── assets/
│   └── shared/
├── dist/
├── jkit.config.js
└── package.json
```

## Configuration

Edit `jkit.config.js` in your project root:

```javascript
export default {
  joomlaVersion: '5.0',
  author: 'Your Name',
  authorEmail: '[email protected]',
  license: 'GPL-2.0-or-later',

  extensions: {
    'com_mycomponent': {
      // Extension-specific config
    }
  },

  vite: {
    // Custom Vite configuration
  }
};
```

## Development Workflow

1. **Initialize project**: `jkit init my-extension`
2. **Open in Dev Container**: Automatic Joomla setup
3. **Create extensions**: `jkit create component com_hello`
4. **Develop with HMR**: `jkit dev`
5. **Build optimized**: `jkit build`
6. **Package for distribution**: `jkit package`
7. **Install in Joomla**: Upload the .zip file

## Comparison with joomla-gulp

| Feature | joomla-gulp | jkit |
|---------|-------------|------|
| Language | JavaScript | TypeScript |
| Build System | Gulp | Vite |
| Speed | Moderate | Very Fast |
| HMR | No | Yes |
| Dev Container | No | Yes |
| Docker Setup | Manual | Automatic |
| CLI | No | Yes |
| Extension Scaffolding | Manual | Automatic |
| Type Safety | No | Yes |
| Modern JavaScript | Limited | Full ES6+ |

## Requirements

- Node.js >= 18
- Docker (for Dev Container)
- VS Code (recommended for Dev Container)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Conventional Commits

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages. This enables automatic semantic versioning and changelog generation.

**Commit Message Format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature (triggers minor version bump)
- `fix`: Bug fix (triggers patch version bump)
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or dependency changes
- `ci`: CI/CD configuration changes
- `chore`: Other changes that don't modify src or test files
- `revert`: Reverts a previous commit

**Breaking Changes:**

Add `!` after the type or add `BREAKING CHANGE:` in the footer to trigger a major version bump:

```
feat!: new CLI structure

BREAKING CHANGE: Commands have been reorganized
```

**Examples:**

```bash
feat(cli): add support for library extensions
fix(build): resolve Vite configuration for PHP files
docs(readme): update installation instructions
chore(deps): update dependencies to latest versions
```

### Commit Validation

Commits are automatically validated using commitlint through a git hook. If your commit message doesn't follow the convention, the commit will be rejected.

To bypass the hook (not recommended):
```bash
git commit --no-verify -m "message"
```

### Semantic Versioning

This project uses [Semantic Versioning](https://semver.org/):
- **Major (X.0.0)**: Breaking changes
- **Minor (0.X.0)**: New features (backwards compatible)
- **Patch (0.0.X)**: Bug fixes (backwards compatible)

Releases are automated via [semantic-release](https://github.com/semantic-release/semantic-release) when commits are pushed to the main branch.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes
4. Commit with conventional commits: `git commit -m "feat: add my feature"`
5. Push to your fork: `git push origin feat/my-feature`
6. Create a Pull Request

## License

MIT

## Author

Created by alebak

## Roadmap

- [x] Project initialization
- [x] Dev Container setup
- [ ] Extension scaffolding (component, module, plugin, template, library)
- [ ] Vite integration for assets
- [ ] Hot Module Replacement
- [ ] Production builds
- [ ] Package creation
- [ ] Auto-installation to local Joomla
- [ ] Code quality tools (ESLint, PHP CS Fixer)
- [ ] Testing framework integration
- [ ] CI/CD templates
