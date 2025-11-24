#!/bin/bash

# setup-wiki.sh - Initialize GitHub Wiki with documentation
# This script should be run once to set up the initial wiki structure

set -e

REPO_URL="https://github.com/alebak/joomla-devkit"
WIKI_REPO="${REPO_URL}.wiki.git"

echo "🚀 Setting up GitHub Wiki for joomla-devkit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if we're in the right directory
if [ ! -f "package.json" ] || ! grep -q "jkit" package.json; then
    echo "❌ Error: Must be run from the joomla-devkit root directory"
    exit 1
fi

# Check if docs exist
if [ ! -d "docs" ]; then
    echo "❌ Error: docs/ directory not found"
    exit 1
fi

# Create temp directory for wiki
WIKI_DIR=$(mktemp -d)
echo "📁 Created temporary directory: $WIKI_DIR"

# Clone or initialize wiki
echo "📥 Cloning wiki repository..."
if git clone "$WIKI_REPO" "$WIKI_DIR" 2>/dev/null; then
    echo "✅ Wiki repository cloned"
else
    echo "⚠️  Wiki doesn't exist yet, will be created on first push"
    mkdir -p "$WIKI_DIR"
    cd "$WIKI_DIR"
    git init
    git remote add origin "$WIKI_REPO"
    cd -
fi

# Copy documentation files
echo "📄 Copying documentation files..."
cp docs/TUTORIAL_GITHUB.md "$WIKI_DIR/Tutorial.md"
cp docs/TUTORIAL_GITHUB.es.md "$WIKI_DIR/Tutorial-Spanish.md"
cp docs/TESTING_KNOWN_ISSUES.md "$WIKI_DIR/Testing-Known-Issues.md"

# Create Home page
echo "🏠 Creating Home page..."
cat > "$WIKI_DIR/Home.md" << 'EOF'
# 📚 Welcome to jkit Documentation

**jkit** (Joomla Development Kit) is a modern CLI tool for Joomla extension development with TypeScript, Vite, and Dev Containers.

## 🚀 Quick Start

New to jkit? Start with our comprehensive tutorials:

### Tutorials
- **[Complete Tutorial (English)](Tutorial)** - Step-by-step guide with hands-on examples
- **[Tutorial Completo (Español)](Tutorial-Spanish)** - Guía paso a paso con ejemplos prácticos

### Getting Started in 5 Minutes

```bash
# Install jkit
npm install -g @alebak/jkit

# Create a new project
jkit init my-project

# Create your first component
cd my-project
jkit create component com_hello

# Start development
jkit dev
```

## 📖 Documentation Sections

### For Beginners
- [Installation Guide](Tutorial#part-1-installation)
- [Create Your First Project](Tutorial#part-2-create-your-first-project)
- [Understanding Extensions](Tutorial#part-3-create-extensions)

### For Developers
- [Development Workflow](Tutorial#part-6-development-and-build)
- [Best Practices](Tutorial#part-11-tips-and-best-practices)
- [Troubleshooting](Tutorial#part-12-troubleshooting)

### Reference
- [All Commands](Tutorial#part-10-useful-commands)
- [Testing Known Issues](Testing-Known-Issues)

## 🌟 Features

- ✅ **6 Extension Types**: Components, Modules, Plugins, Templates, Libraries, Packages
- ✅ **Modern Stack**: TypeScript, Vite, ESM
- ✅ **Hot Module Replacement**: Instant feedback during development
- ✅ **Dev Containers**: Isolated development environment with Joomla
- ✅ **Joomla 4 & 5**: Full support for modern Joomla versions
- ✅ **Automated Building**: Build and package with one command

## 🎯 Complete Example

Our tutorial walks you through creating a complete blog system with:
- 🔷 Component (com_blog)
- 📦 2 Modules (site + admin)
- 🔌 2 Plugins (system + content)
- 🎨 Template (tpl_blogtheme)
- 📚 Library (lib_blogutils)
- 📦 Package (pkg_myblog - all-in-one installer)

## 🔗 Resources

- **Repository**: [github.com/alebak/joomla-devkit](https://github.com/alebak/joomla-devkit)
- **Issues**: [Report bugs or request features](https://github.com/alebak/joomla-devkit/issues)
- **Contributing**: [CONTRIBUTING.md](https://github.com/alebak/joomla-devkit/blob/main/CONTRIBUTING.md)
- **Roadmap**: [ROADMAP.md](https://github.com/alebak/joomla-devkit/blob/main/ROADMAP.md)

## 📝 License

GPL-2.0-or-later - See [LICENSE](https://github.com/alebak/joomla-devkit/blob/main/LICENSE) file for details.

---

**Author**: alebak
**Last Updated**: $(date +%Y-%m-%d)
EOF

# Create Sidebar
echo "📑 Creating Sidebar navigation..."
cat > "$WIKI_DIR/_Sidebar.md" << 'EOF'
## 📚 Documentation

**[🏠 Home](Home)**

### 🚀 Getting Started
- [Tutorial (English)](Tutorial)
- [Tutorial (Español)](Tutorial-Spanish)

### 📖 Tutorial Sections
- [Installation](Tutorial#part-1-installation)
- [First Project](Tutorial#part-2-create-your-first-project)
- [Create Extensions](Tutorial#part-3-create-extensions)
- [Development](Tutorial#part-6-development-and-build)
- [Commands](Tutorial#part-10-useful-commands)
- [Best Practices](Tutorial#part-11-tips-and-best-practices)
- [Troubleshooting](Tutorial#part-12-troubleshooting)

### 🔧 Reference
- [Testing Issues](Testing-Known-Issues)

### 🔗 Links
- [Repository](https://github.com/alebak/joomla-devkit)
- [Issues](https://github.com/alebak/joomla-devkit/issues)
- [Contributing](https://github.com/alebak/joomla-devkit/blob/main/CONTRIBUTING.md)
EOF

# Create Footer
echo "📌 Creating Footer..."
cat > "$WIKI_DIR/_Footer.md" << 'EOF'
---
💡 **Tip**: Use the sidebar to navigate documentation | 📝 Found an issue? [Report it](https://github.com/alebak/joomla-devkit/issues)
EOF

# Commit and push
echo "💾 Committing changes..."
cd "$WIKI_DIR"
git add .
git config user.name "$(git config --get user.name || echo 'Wiki Setup Script')"
git config user.email "$(git config --get user.email || echo 'noreply@github.com')"

if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "ℹ️  No changes to commit"
else
    git commit -m "docs: initialize wiki with comprehensive documentation

Setup wiki structure with:
- Home page with quick start guide
- Complete tutorial (English and Spanish)
- Testing known issues documentation
- Sidebar navigation
- Footer

Synced from main repository docs/ folder.
"

    echo "📤 Pushing to GitHub Wiki..."
    if git push origin master 2>/dev/null || git push origin main 2>/dev/null; then
        echo "✅ Wiki successfully pushed to GitHub!"
    else
        echo "⚠️  Push failed. You may need to:"
        echo "   1. Enable wiki in repository settings"
        echo "   2. Create at least one page via GitHub web interface first"
        echo "   3. Ensure you have write access to the repository"
        echo ""
        echo "📍 Wiki directory preserved at: $WIKI_DIR"
        echo "   You can manually push from there once wiki is enabled"
        exit 1
    fi
fi

# Cleanup
cd -
rm -rf "$WIKI_DIR"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Wiki setup complete!"
echo ""
echo "📍 View your wiki at:"
echo "   ${REPO_URL}/wiki"
echo ""
echo "🔄 From now on, changes to docs/ will sync automatically via GitHub Actions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
