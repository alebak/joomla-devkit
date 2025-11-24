# 📚 jkit Documentation

This directory contains comprehensive documentation for jkit (Joomla Development Kit).

## Available Documents

### Tutorials

We provide two versions of the complete tutorial:

#### GitHub-Optimized Versions (Recommended)

Best for reading on GitHub with enhanced features:

- **[TUTORIAL_GITHUB.md](TUTORIAL_GITHUB.md)** - English version
- **[TUTORIAL_GITHUB.es.md](TUTORIAL_GITHUB.es.md)** - Spanish version

**Features:**
- ✅ GitHub Alerts/Admonitions (Note, Tip, Warning, Important)
- ✅ Collapsible sections (`<details>`)
- ✅ Tables with proper formatting
- ✅ Mermaid diagrams
- ✅ Better link structure
- ✅ Enhanced code blocks with syntax highlighting
- ✅ Automatic table of contents

#### Plain Text Versions

Best for terminal viewing or offline reading:

- **[TUTORIAL.md](TUTORIAL.md)** - English version
- **[TUTORIAL.es.md](TUTORIAL.es.md)** - Spanish version

**Features:**
- ✅ Works in any markdown viewer
- ✅ Terminal-friendly (`less`, `cat`, etc.)
- ✅ No special GitHub features required
- ✅ Simpler formatting

### Other Documentation

- **[TESTING_KNOWN_ISSUES.md](TESTING_KNOWN_ISSUES.md)** - Known issues with the test suite

## Tutorial Content Overview

Both tutorial versions cover:

1. **Installation** - Setting up jkit
2. **Project Creation** - Initialize your first project
3. **Extensions** - Create all 6 types:
   - Components (com_*)
   - Modules (mod_*)
   - Plugins (plg_*)
   - Templates (tpl_*)
   - Libraries (lib_*)
   - Packages (pkg_*)
4. **Development Workflow** - Build, package, and deploy
5. **Best Practices** - Tips and recommendations
6. **Troubleshooting** - Common issues and solutions
7. **Complete Example** - Full blog system with 8 extensions

## Quick Links

| Document | Description | Best For |
|----------|-------------|----------|
| [TUTORIAL_GITHUB.md](TUTORIAL_GITHUB.md) | GitHub-optimized English tutorial | Reading on GitHub |
| [TUTORIAL_GITHUB.es.md](TUTORIAL_GITHUB.es.md) | GitHub-optimized Spanish tutorial | Lectura en GitHub |
| [TUTORIAL.md](TUTORIAL.md) | Plain text English tutorial | Terminal/offline |
| [TUTORIAL.es.md](TUTORIAL.es.md) | Plain text Spanish tutorial | Terminal/offline |
| [TESTING_KNOWN_ISSUES.md](TESTING_KNOWN_ISSUES.md) | Test suite known issues | Contributors/developers |

## Contributing to Documentation

Found a typo or want to improve the docs? Contributions are welcome!

1. Fork the repository
2. Create a branch: `git checkout -b docs/improve-tutorial`
3. Make your changes
4. Test your changes (preview markdown)
5. Submit a pull request

### Documentation Guidelines

- Keep language clear and concise
- Include code examples for all commands
- Show expected output where helpful
- Use proper markdown formatting
- Test all commands before documenting
- Keep both language versions in sync

## Viewing Documentation

### On GitHub

Simply click the file links above. GitHub will render the markdown with all features.

### In Terminal

```bash
# View with pagination
less docs/TUTORIAL.md

# View with syntax highlighting (if bat is installed)
bat docs/TUTORIAL.md

# Simple view
cat docs/TUTORIAL.md
```

### In VS Code

```bash
# Open in editor
code docs/TUTORIAL.md

# Preview with Markdown Preview
# Press Ctrl+Shift+V (Cmd+Shift+V on Mac)
```

### With Markdown Viewers

Many markdown viewers support GitHub-flavored markdown:
- **Typora** - Desktop markdown editor
- **Marked 2** - macOS markdown preview
- **Markdown Preview Enhanced** - VS Code extension
- **grip** - Command-line GitHub markdown renderer

## Need Help?

- 📖 Start with the tutorial: [TUTORIAL_GITHUB.md](TUTORIAL_GITHUB.md)
- 💬 Open an issue: https://github.com/alebak/joomla-devkit/issues
- 📧 Contact: See [CONTRIBUTING.md](../CONTRIBUTING.md)

---

**Last Updated:** 2025-11-24
**Maintainer:** alebak
