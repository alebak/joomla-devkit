# 🛠️ Development Guide

**jkit** development guide for contributors and maintainers.

**[English](DEVELOPMENT.md)** | **[Español](DEVELOPMENT.es.md)**

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Adding New Features](#adding-new-features)
- [Testing](#testing)
- [Code Style](#code-style)
- [Git Workflow](#git-workflow)
- [Release Process](#release-process)
- [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: >= 18.0.0 (LTS recommended)
- **npm**: >= 9.0.0 (comes with Node.js)
- **Git**: >= 2.30.0
- **VS Code**: Recommended (with Dev Container support)
- **Docker**: For Dev Container development (optional)

### Recommended VS Code Extensions

- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier** (esbenp.prettier-vscode)
- **TypeScript Vue Plugin** (Vue.volar)
- **Dev Containers** (ms-vscode-remote.remote-containers)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/alebak/joomla-devkit.git
cd joomla-devkit
```

### 2. Install Dependencies

```bash
npm install
```

This will install all dependencies and set up Husky git hooks automatically.

### 3. Open in Dev Container (Optional)

If you have VS Code with Dev Containers:

```bash
code .
```

Then:
1. Press `F1` or `Ctrl+Shift+P`
2. Select **"Dev Containers: Reopen in Container"**
3. Wait for container to build and open

The Dev Container includes all necessary tools pre-configured.

### 4. Verify Installation

```bash
# Check if TypeScript compiles
npm run build

# Run the CLI in dev mode
npm run dev -- --help

# Should display jkit help message
```

---

## 🔄 Development Workflow

### Running the CLI

#### Option 1: Development Mode (tsx)

Run TypeScript files directly without compilation:

```bash
# Run any command
npm run dev -- init test-project

# Examples
npm run dev -- --help
npm run dev -- init my-project
npm run dev -- create component hello
```

**Pros**: Fast, no compilation needed
**Cons**: Slower execution, not production-ready

#### Option 2: Build and Run

Compile TypeScript and run the compiled output:

```bash
# Compile TypeScript
npm run build

# Link globally
npm link

# Use jkit command globally
jkit init test-project
```

**Pros**: Production-like, faster execution
**Cons**: Need to rebuild after changes

#### Option 3: Watch Mode

Auto-compile on file changes:

```bash
# Terminal 1: Watch and compile
npm run build:watch

# Terminal 2: Test changes
jkit init test-project
```

---

## 📁 Project Structure

```
joomla-devkit/
├── .claude/                    # Context documentation for AI
│   └── context-es.md
├── .devcontainer/             # Dev Container configuration
│   └── devcontainer.json
├── .github/
│   └── workflows/             # GitHub Actions CI/CD
│       ├── release.yml        # Automated releases
│       └── commitlint.yml     # Commit validation
├── .husky/                    # Git hooks
│   └── commit-msg            # Commitlint hook
├── src/                       # 🔥 Main source code
│   ├── bin/
│   │   └── jkit.ts           # CLI entry point
│   ├── cli/                   # Command implementations
│   │   ├── init.ts           # ✅ Functional
│   │   ├── create.ts         # ⚠️ TODO
│   │   ├── dev.ts            # ⚠️ TODO
│   │   ├── build.ts          # ⚠️ TODO
│   │   └── package.ts        # ⚠️ TODO
│   ├── locales/               # i18n translations
│   │   ├── en/               # English
│   │   └── es/               # Spanish
│   ├── templates/             # Extension templates
│   │   ├── devcontainer/      # Dev Container templates
│   │   └── extension/         # Joomla extension templates
│   │       ├── component/     # ✅ Complete
│   │       ├── module/        # ✅ Complete
│   │       ├── plugin/        # ✅ Complete
│   │       ├── template/      # ✅ Complete
│   │       └── library/       # ✅ Complete
│   ├── types/                 # TypeScript type definitions
│   │   ├── config.ts
│   │   ├── manifest.ts
│   │   └── index.ts
│   └── utils/                 # Utility functions
│       └── i18n.ts            # Internationalization
├── tests/                     # ⚠️ TODO: Test files
├── dist/                      # Compiled output (gitignored)
├── .commitlintrc.json         # Commit lint config
├── .eslintrc.json             # ESLint config
├── .prettierrc.json           # Prettier config
├── .releaserc.json            # Semantic release config
├── package.json               # NPM package configuration
├── tsconfig.json              # TypeScript configuration
├── ROADMAP.md                 # Project roadmap
└── README.md                  # Main documentation
```

### Key Files Explained

#### `src/bin/jkit.ts`
Main CLI entry point. Sets up Commander.js and initializes i18n.

#### `src/cli/*.ts`
Individual command implementations. Each file exports a command function.

#### `src/utils/i18n.ts`
Internationalization setup with automatic language detection from system locale.

#### `src/types/*.ts`
TypeScript interfaces for type safety. Use these throughout the codebase.

#### `src/templates/`
All template files. Use `{{VARIABLE}}` placeholders for dynamic content.

---

## ➕ Adding New Features

### Adding a New CLI Command

1. **Create command file**: `src/cli/mycommand.ts`

```typescript
import chalk from 'chalk';
import { getI18n } from '../utils/i18n.js';

export async function myCommand(options: any): Promise<void> {
  const i18n = await getI18n();

  console.log(chalk.blue(i18n.t('commands:mycommand.starting')));

  // Your implementation here

  console.log(chalk.green(i18n.t('commands:mycommand.success')));
}
```

2. **Add translations**: `src/locales/en/commands.json` and `src/locales/es/commands.json`

```json
{
  "mycommand": {
    "description": "Description of my command",
    "starting": "Starting my command...",
    "success": "Command completed successfully!"
  }
}
```

3. **Register in CLI**: `src/bin/jkit.ts`

```typescript
import { myCommand } from '../cli/mycommand.js';

program
  .command('mycommand')
  .description(i18n.t('commands:mycommand.description'))
  .action(myCommand);
```

4. **Add TypeScript types** (if needed): `src/types/config.ts`

5. **Test your command**:

```bash
npm run dev -- mycommand
```

### Adding a New Extension Template

1. **Create template directory**:

```bash
mkdir -p src/templates/extension/myextension
```

2. **Add template files** with `{{PLACEHOLDERS}}`:

```
src/templates/extension/myextension/
├── manifest.xml
├── src/
│   └── Main.php
└── README.md
```

3. **Document variables** in `.claude/context-es.md`

4. **Update types** in `src/types/manifest.ts` if needed

### Adding a New Utility

1. **Create utility file**: `src/utils/myutil.ts`

```typescript
/**
 * My utility function
 *
 * @param param - Description
 * @returns Description
 */
export function myUtility(param: string): string {
  return param.toUpperCase();
}
```

2. **Add tests** (when testing is set up): `tests/utils/myutil.test.ts`

3. **Export from index** if needed: `src/utils/index.ts`

### Adding i18n Translations

Always add translations in **both** English and Spanish:

**`src/locales/en/common.json`**:
```json
{
  "myFeature": {
    "title": "My Feature Title",
    "description": "Feature description"
  }
}
```

**`src/locales/es/common.json`**:
```json
{
  "myFeature": {
    "title": "Título de Mi Función",
    "description": "Descripción de la función"
  }
}
```

**Usage in code**:
```typescript
const i18n = await getI18n();
console.log(i18n.t('common:myFeature.title'));
```

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

> **Note**: Testing framework (Vitest) is not yet set up. See [ROADMAP.md](ROADMAP.md) for details.

### Writing Tests

Follow this structure:

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../src/utils/myutil.js';

describe('myFunction', () => {
  it('should do something', () => {
    const result = myFunction('input');
    expect(result).toBe('expected');
  });

  it('should handle edge cases', () => {
    expect(() => myFunction('')).toThrow();
  });
});
```

---

## 🎨 Code Style

### TypeScript Style Guide

- **Strict mode**: All code must pass `strict: true` TypeScript checks
- **Explicit types**: Prefer explicit return types for functions
- **Interfaces over types**: Use `interface` instead of `type` when possible
- **Named exports**: Use named exports, not default exports
- **JSDoc/TSDoc**: Document all public functions and interfaces

**Example**:

```typescript
/**
 * Process a template file
 *
 * @param templatePath - Path to the template
 * @param variables - Variables to replace
 * @returns Processed content
 */
export async function processTemplate(
  templatePath: string,
  variables: Record<string, string>
): Promise<string> {
  // Implementation
}
```

### Formatting

Code is automatically formatted with Prettier:

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

### Linting

```bash
# Lint all files
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

**ESLint will check for**:
- TypeScript errors
- Code quality issues
- Import/export consistency
- Unused variables

---

## 🔀 Git Workflow

### Conventional Commits

**All commits MUST follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.**

Commitlint will automatically validate your commits.

#### Commit Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- `feat`: New feature (triggers minor version bump)
- `fix`: Bug fix (triggers patch version bump)
- `docs`: Documentation only
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or dependencies
- `ci`: CI/CD changes
- `chore`: Other changes
- `revert`: Revert a previous commit

#### Breaking Changes

Add `!` after type or `BREAKING CHANGE:` in footer:

```
feat!: redesign CLI interface

BREAKING CHANGE: All command syntax has changed
```

This triggers a **major version bump**.

#### Examples

```bash
# Feature
git commit -m "feat(cli): add create command for extensions"

# Bug fix
git commit -m "fix(template): correct component manifest namespace"

# Documentation
git commit -m "docs(readme): add installation instructions"

# Breaking change
git commit -m "feat(cli)!: change init command parameters"
```

### Branch Strategy

- **`main`**: Production-ready code
- **`feat/*`**: New features
- **`fix/*`**: Bug fixes
- **`docs/*`**: Documentation updates
- **`refactor/*`**: Code refactoring

#### Workflow

```bash
# Create feature branch
git checkout -b feat/add-create-command

# Make changes and commit
git add .
git commit -m "feat(cli): implement create command"

# Push to GitHub
git push origin feat/add-create-command

# Create Pull Request on GitHub
# After review, merge to main
```

### Pull Request Process

1. Create branch from `main`
2. Make changes with conventional commits
3. Push to GitHub
4. Create Pull Request
5. Wait for CI checks to pass
6. Request review
7. Address feedback
8. Merge to `main`

---

## 🚀 Release Process

Releases are **fully automated** using semantic-release.

### How It Works

1. **Commit to `main`** (via merge or direct push)
2. **GitHub Actions** runs semantic-release
3. **Analyzes commits** since last release
4. **Determines version bump**:
   - `feat` → minor (0.X.0)
   - `fix` → patch (0.0.X)
   - `feat!` or `BREAKING CHANGE` → major (X.0.0)
5. **Generates CHANGELOG.md**
6. **Creates Git tag**
7. **Publishes GitHub Release**
8. **Publishes to npm** (if configured)

### Manual Testing Before Release

Before merging to `main`:

```bash
# Build the project
npm run build

# Link locally
npm link

# Test commands
jkit init test-project
cd test-project
# Verify everything works

# Unlink
npm unlink jkit
```

### Version Numbers

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features (backward compatible)
- **PATCH** (0.0.1): Bug fixes

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: `command not found: jkit`

**Solution**: Link the package globally

```bash
npm link
```

#### Issue: TypeScript compilation errors

**Solution**: Clean build and rebuild

```bash
rm -rf dist/
npm run build
```

#### Issue: Commitlint failing

**Solution**: Check commit message format

```bash
# ❌ Wrong
git commit -m "added new feature"

# ✅ Correct
git commit -m "feat: add new feature"
```

#### Issue: i18n translations not loading

**Solution**: Verify language files exist

```bash
ls src/locales/en/
ls src/locales/es/
```

Make sure both `common.json` and `commands.json` exist.

#### Issue: Template files not found

**Solution**: Check paths in template loading

Templates are loaded relative to `src/templates/`. Ensure paths are correct:

```typescript
// In init.ts
const templatePath = path.join(__dirname, '../../templates/devcontainer');
```

### Getting Help

- **GitHub Issues**: https://github.com/alebak/joomla-devkit/issues
- **GitHub Discussions**: https://github.com/alebak/joomla-devkit/discussions
- **Documentation**: Check README.md and ROADMAP.md

---

## 📚 Additional Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Commander.js Documentation](https://github.com/tj/commander.js)
- [i18next Documentation](https://www.i18next.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Joomla! Development Documentation](https://docs.joomla.org/)

---

## 👥 Team

**Maintainer**: [alebak](https://github.com/alebak)

**Contributors**: See [GitHub Contributors](https://github.com/alebak/joomla-devkit/graphs/contributors)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Last Updated**: 2025-01-17
**Version**: 0.1.0
**Status**: 🚧 In Active Development

Happy coding! 🚀
