# {{LIB_NAME}}

{{DESCRIPTION}}

## Information

- **Type:** Library
- **Version:** {{VERSION}}
- **Author:** {{AUTHOR}}
- **License:** {{LICENSE}}

## Installation

1. Build the library: `jkit build`
2. Package the library: `jkit package`
3. Install the generated ZIP file through Joomla's extension manager

## Usage

### Basic Usage

```php
use {{NAMESPACE}}\{{LIBRARY_CLASS}};

// Get library instance
$library = {{LIBRARY_CLASS}}::getInstance();

// Get version
$version = $library->getVersion();

// Process data
$result = $library->processData($data);

// Validate data
$isValid = $library->validateData($data);
```

### Using Helper Class

```php
use {{NAMESPACE}}\Helper\Helper;

// Format string
$formatted = Helper::formatString($string);

// Sanitize data
$safe = Helper::sanitize($data);

// Get current date
$date = Helper::getCurrentDate();

// Translate
$text = Helper::translate('LIB_{{LIBRARY_UPPER}}_SOME_KEY');

// Log debug message
Helper::log('Debug message');

// Check permission
$canEdit = Helper::checkPermission('core.edit', 'com_content');

// Generate random string
$token = Helper::generateRandomString(64);
```

## Development

### Directory Structure

```
lib_{{LIBRARY_NAME}}/
├── src/                     # Source files
│   ├── {{LIBRARY_CLASS}}.php    # Main library class
│   └── Helper/              # Helper classes
│       └── Helper.php
├── media/                   # Assets (optional)
│   ├── js/
│   └── css/
├── language/                # Language files
└── {{LIBRARY_NAME}}.xml    # Manifest file
```

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

## Features

- Singleton pattern for library instance
- Helper class with common utilities
- Namespace-based autoloading
- Language support
- Joomla 4/5 compatible
- TypeScript/JavaScript support (optional)
- Modern PHP architecture

## API Documentation

### {{LIBRARY_CLASS}}

Main library class using Singleton pattern.

#### Methods

- `getInstance(): {{LIBRARY_CLASS}}` - Get library instance
- `getVersion(): string` - Get library version
- `processData($data): mixed` - Process data
- `validateData($data): bool` - Validate data

### Helper

Static helper class with utility methods.

#### Methods

- `formatString(string $string): string` - Format a string
- `sanitize($data): mixed` - Sanitize input data
- `getCurrentDate(string $format = 'Y-m-d H:i:s'): string` - Get current date/time
- `translate(string $key, ...$args): string` - Translate language string
- `log($data, string $category = 'library'): void` - Log debug message
- `checkPermission(string $action, string $asset = 'com_content'): bool` - Check user permission
- `generateRandomString(int $length = 32): string` - Generate random string

## Requirements

- Joomla 4.0+ or Joomla 5.0+
- PHP 7.4+

## License

{{LICENSE}}
