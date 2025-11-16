# Contributing to jkit

Thank you for your interest in contributing to jkit! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and encourage diverse perspectives
- Focus on constructive feedback
- Collaborate openly

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/joomla-devkit.git
   cd joomla-devkit
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feat/my-new-feature
   ```

## Development Setup

This project uses a Dev Container for development. You can either:

### Option 1: Dev Container (Recommended)

1. Open the project in VS Code
2. Click "Reopen in Container" when prompted
3. Wait for the container to build
4. Start developing!

### Option 2: Local Development

1. Install Node.js >= 18
2. Run `npm install`
3. Start development: `npm run dev`

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- **feat**: A new feature (minor version bump)
- **fix**: A bug fix (patch version bump)
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: CI/CD configuration changes
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Breaking Changes

For breaking changes, add `!` after the type or include `BREAKING CHANGE:` in the footer:

```bash
feat!: redesign CLI interface

BREAKING CHANGE: The command structure has been completely redesigned.
Old commands will no longer work.
```

### Examples

```bash
# New feature
feat(cli): add library extension support

# Bug fix
fix(vite): resolve asset path in production build

# Documentation
docs(readme): update installation instructions

# Breaking change
feat(init)!: change default Joomla version to 5.0

BREAKING CHANGE: Default Joomla version is now 5.0 instead of 4.4
```

## Commit Validation

This project uses **commitlint** with a git hook to validate commit messages.

If your commit message doesn't follow the convention:
```bash
$ git commit -m "bad commit message"
⧗   input: bad commit message
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

Fix it by using the correct format:
```bash
git commit -m "feat: add new feature"
```

## Pull Request Process

1. **Update your branch** with the latest changes from main:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run tests and linting**:
   ```bash
   npm run lint
   npm test
   ```

3. **Push your changes**:
   ```bash
   git push origin feat/my-new-feature
   ```

4. **Create a Pull Request** on GitHub:
   - Use a clear, descriptive title
   - Follow the PR template (if available)
   - Link any related issues
   - Describe what changed and why
   - Add screenshots/examples if applicable

5. **Wait for review**:
   - Address any feedback from reviewers
   - Keep commits clean and atomic
   - Update your PR as needed

## Coding Standards

### JavaScript

- Use ES6+ features
- Follow the ESLint configuration
- Use Prettier for formatting
- Write descriptive variable and function names
- Add JSDoc comments for public APIs

### File Structure

```
src/
├── cli/           # CLI command implementations
├── templates/     # Extension and project templates
├── builders/      # Build logic for extensions
└── utils/         # Utility functions
```

### Testing

- Add tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage

## Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (0.X.0): New features (backwards compatible)
- **PATCH** (0.0.X): Bug fixes (backwards compatible)

Version bumps are **automatically determined** by commit messages:
- `feat:` → Minor version bump
- `fix:` → Patch version bump
- `feat!:` or `BREAKING CHANGE:` → Major version bump

## Release Process

Releases are **fully automated** using semantic-release:

1. Commits are pushed to `main` branch
2. GitHub Actions runs semantic-release
3. Semantic-release analyzes commits
4. New version is determined
5. CHANGELOG.md is generated
6. Git tag is created
7. GitHub release is published
8. Package is published to npm (if configured)

You don't need to manually version or create releases!

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for questions or ideas
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
