# {{PACKAGE_NAME}}

{{DESCRIPTION}}

## Package Contents

This package includes the following extensions:

<!-- List your extensions here -->
- Component: com_example
- Module: mod_example
- Plugin: plg_system_example

## Installation

1. Download the package ZIP file
2. In Joomla administrator, go to System > Extensions > Install
3. Upload and install the package
4. All included extensions will be installed automatically

## Configuration

After installation, you can configure each extension separately:

- **Component**: Go to Components > {{PACKAGE_NAME}}
- **Modules**: Go to Content > Site Modules
- **Plugins**: Go to System > Plugins

## Adding Extensions to Package

To add extensions to this package:

1. Build each extension individually using `jkit build`
2. The ZIP files will be in the `dist/` directory
3. Update the `manifest.xml` file to include the new extensions
4. Run `jkit package {{PACKAGE_NAME_LOWER}}` to create the final package

### Manifest Example

```xml
<files folder="packages">
    <file type="component" id="com_example">com_example.zip</file>
    <file type="module" id="example" client="site">mod_example.zip</file>
    <file type="plugin" id="example" group="system">plg_system_example.zip</file>
</files>
```

## Development

```bash
# Build all extensions
jkit build

# Create package
jkit package {{PACKAGE_NAME_LOWER}}
```

## Author

**{{AUTHOR}}**
- Email: {{AUTHOR_EMAIL}}
- Website: {{AUTHOR_URL}}

## License

{{LICENSE}}

{{COPYRIGHT}}
