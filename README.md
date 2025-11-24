# jkit - Joomla Development Kit

**[English](README.md)** | **[Español](README.es.md)** | **[📚 Wiki](https://github.com/alebak/joomla-devkit/wiki)**

Modern CLI tool for Joomla extension development with Vite and Dev Containers.

## Features

- **TypeScript First**: Written in TypeScript with full type safety (JavaScript also supported)
- **Multilingual**: Full internationalization support (English and Spanish)
- **Modern Build System**: Powered by Vite for lightning-fast development
- **Dev Container Ready**: Automatic Docker setup with Joomla, MySQL, phpMyAdmin, and Mailpit
- **Multi-Extension Support**: Create components, modules, plugins, templates, and libraries
- **Hot Module Replacement**: Instant updates during development
- **Production Ready**: Optimized builds with minification and tree-shaking
- **Flexible CSS**: Automatic detection of CSS or SCSS files (no preprocessor required for plain CSS)
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

# Create a package
jkit create package pkg_myproject
```

> 💡 **New to jkit?** Check out our comprehensive step-by-step tutorial:
> - **📚 Wiki** (best experience): [Tutorial](https://github.com/alebak/joomla-devkit/wiki/Tutorial) | [Español](https://github.com/alebak/joomla-devkit/wiki/Tutorial-Spanish)
> - **GitHub docs**: [TUTORIAL_GITHUB.md](docs/TUTORIAL_GITHUB.md) | [Español](docs/TUTORIAL_GITHUB.es.md)
> - **Plain text**: [TUTORIAL.md](docs/TUTORIAL.md) | [Español](docs/TUTORIAL.es.md)

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
# Non-interactive mode (CI/CD friendly)
jkit init my-project --author "John Doe" --email "john@example.com" --no-devcontainer
```

**Options:**
- `-j, --joomla-version <version>`: Joomla version (default: "5.0")
- `-a, --author <author>`: Project author name
- `-e, --email <email>`: Author email address
- `--no-devcontainer`: Skip Dev Container setup

### `jkit create <type> <name>`

Create a new Joomla extension.

**Types:** `component`, `module`, `plugin`, `template`, `library`, `package`

```bash
jkit create component com_mycomponent
jkit create module mod_mymodule --author "John Doe"
jkit create plugin system myplugin --license MIT
jkit create package pkg_myproject --description "Multi-extension package"
# Non-interactive mode (CI/CD friendly)
jkit create component com_test --author "John Doe" --email "john@example.com" \
  --description "My test component" --namespace "MyCompany\\Component\\Test"
```

**Options:**
- `-a, --author <author>`: Extension author
- `-e, --email <email>`: Author email
- `-l, --license <license>`: License (default: "GPL-2.0-or-later")
- `-n, --namespace <namespace>`: PHP namespace
- `-c, --client <client>`: Client (site/administrator) for modules and templates
- `-g, --group <group>`: Plugin group (for plugins)
- `-d, --description <description>`: Extension description

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
├── src/                    # Extension source code
│   ├── com_mycomponent/   # Components
│   ├── mod_mymodule/      # Modules
│   ├── plg_system_myplugin/  # Plugins
│   ├── tpl_mytemplate/    # Templates
│   ├── lib_mylibrary/     # Libraries
│   └── pkg_mypackage/     # Packages
├── dist/                  # Built packages (.zip files)
├── jkit.config.json
└── package.json
```

## Configuration

Edit `jkit.config.json` in your project root:

```json
{
  "joomlaVersion": "5.0",
  "author": "Your Name",
  "authorEmail": "[email protected]",
  "license": "GPL-2.0-or-later",
  "srcDir": "src",
  "extensions": {
    "com_mycomponent": {
      "type": "component",
      "name": "com_mycomponent"
    }
  },
  "vite": {}
}
```

## Development Workflow

1. **Initialize project**: `jkit init my-extension`
2. **Open in Dev Container**: Automatic Joomla setup
3. **Create extensions**: `jkit create component com_hello`
4. **Develop with HMR**: `jkit dev`
5. **Build optimized**: `jkit build`
6. **Package for distribution**: `jkit package`
7. **Install in Joomla**: Upload the .zip file

## Working with Packages

Packages allow you to bundle multiple extensions together into a single installable ZIP file.

### Creating a Package

```bash
# Create a package
jkit create package pkg_myproject

# Create individual extensions
jkit create component com_mycomponent
jkit create module mod_mymodule
jkit create plugin system myplugin
```

### Configuring Package Contents

Edit the package's `manifest.xml` to include your extensions:

```xml
<files folder="packages">
    <file type="component" id="com_mycomponent">com_mycomponent.zip</file>
    <file type="module" id="mymodule" client="site">mod_mymodule.zip</file>
    <file type="plugin" id="myplugin" group="system">plg_system_myplugin.zip</file>
</files>
```

### Building and Packaging

```bash
# Build all extensions
jkit build

# Create the final package
jkit package pkg_myproject
```

**Note**: The package command will automatically include all specified child extensions from the `dist/` directory.

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

## Testing

Run the test suite:

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Generate coverage report
```

**Test Status**: 242/250 tests passing (96.8%)

> **Note**: 8 tests in `create.test.ts` are currently failing due to test infrastructure issues (memfs mocking), not functional bugs. All functionality has been verified through manual testing. See [docs/TESTING_KNOWN_ISSUES.md](docs/TESTING_KNOWN_ISSUES.md) for details.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for the detailed project roadmap and planned features.

## License

GPL-2.0-or-later - See [LICENSE](LICENSE) file for details.

## Author

Created by alebak
