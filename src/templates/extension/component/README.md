# {{COM_NAME}}

{{DESCRIPTION}}

## Information

- **Type:** Component
- **Version:** {{VERSION}}
- **Author:** {{AUTHOR}}
- **License:** {{LICENSE}}

## Installation

1. Build the extension: `jkit build`
2. Package the extension: `jkit package`
3. Install the generated ZIP file through Joomla's extension manager

## Development

### Watch mode with HMR
```bash
jkit dev
```

### Build for production
```bash
jkit build
```

### Create distribution package
```bash
jkit package
```

## Directory Structure

```
{{COMPONENT_NAME}}/
├── admin/              # Administrator files
│   ├── services/      # Dependency injection
│   ├── src/           # Source files (controllers, models, views)
│   ├── tmpl/          # View templates
│   ├── language/      # Language files
│   ├── access.xml     # Access control
│   └── config.xml     # Component configuration
├── site/              # Site (frontend) files
│   ├── src/           # Source files
│   ├── tmpl/          # View templates
│   └── language/      # Language files
├── media/             # Assets (JS, CSS, images)
│   ├── js/
│   ├── css/
│   └── images/
└── {{COMPONENT_NAME}}.xml  # Manifest file
```

## Features

- Modern Joomla 4/5 architecture
- Namespace-based autoloading
- MVC structure
- TypeScript/JavaScript support via Vite
- SCSS/CSS support
- Hot Module Replacement (HMR) during development

## License

{{LICENSE}}
