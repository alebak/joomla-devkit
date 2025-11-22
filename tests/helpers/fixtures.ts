/**
 * Test fixtures
 * Common test data and configuration objects
 */

import type {
  ExtensionConfig,
  JkitConfig,
  InitProjectOptions,
  CreateExtensionOptions,
} from '../../src/types/config';

/**
 * Default extension config for testing
 */
export const defaultExtensionConfig: ExtensionConfig = {
  name: 'test-extension',
  type: 'component',
  description: 'Test extension description',
  author: 'Test Author',
  authorEmail: 'test@example.com',
  authorUrl: 'https://example.com',
  version: '1.0.0',
  license: 'GPL-2.0-or-later',
  copyright: 'Copyright (C) 2025 Test Author',
};

/**
 * Default jkit config for testing
 */
export const defaultJkitConfig: JkitConfig = {
  joomlaVersion: '5.0',
  author: 'Test Author',
  authorEmail: 'test@example.com',
  license: 'GPL-2.0-or-later',
  extensions: {},
};

/**
 * Default init project options
 */
export const defaultInitOptions: InitProjectOptions = {
  name: 'test-project',
  joomlaVersion: '5.0',
  author: 'Test Author',
  authorEmail: 'test@example.com',
  useDevContainer: true,
};

/**
 * Default create extension options
 */
export const defaultCreateOptions: CreateExtensionOptions = {
  type: 'component',
  name: 'test-component',
  namespace: 'TestCompany\\Component\\TestComponent',
  author: 'Test Author',
  email: 'test@example.com',
  url: 'https://example.com',
  description: 'Test component description',
  license: 'GPL-2.0-or-later',
};

/**
 * Sample package.json content
 */
export const samplePackageJson = {
  name: 'test-project',
  version: '1.0.0',
  description: 'Test project',
  main: 'index.js',
  scripts: {
    dev: 'jkit dev',
    build: 'jkit build',
  },
  author: 'Test Author',
  license: 'GPL-2.0-or-later',
};

/**
 * Sample manifest XML for component
 */
export const sampleComponentManifest = `<?xml version="1.0" encoding="UTF-8"?>
<extension type="component" method="upgrade">
  <name>COM_TESTCOMPONENT</name>
  <author>Test Author</author>
  <creationDate>January 2025</creationDate>
  <copyright>Copyright (C) 2025 Test Author</copyright>
  <license>GPL-2.0-or-later</license>
  <authorEmail>test@example.com</authorEmail>
  <authorUrl>https://example.com</authorUrl>
  <version>1.0.0</version>
  <description>COM_TESTCOMPONENT_XML_DESCRIPTION</description>
  <namespace path="src">TestCompany\\Component\\TestComponent</namespace>
</extension>`;

/**
 * Sample manifest XML for module
 */
export const sampleModuleManifest = `<?xml version="1.0" encoding="UTF-8"?>
<extension type="module" method="upgrade" client="site">
  <name>mod_testmodule</name>
  <author>Test Author</author>
  <creationDate>January 2025</creationDate>
  <copyright>Copyright (C) 2025 Test Author</copyright>
  <license>GPL-2.0-or-later</license>
  <authorEmail>test@example.com</authorEmail>
  <authorUrl>https://example.com</authorUrl>
  <version>1.0.0</version>
  <description>MOD_TESTMODULE_XML_DESCRIPTION</description>
  <namespace path="src">TestCompany\\Module\\TestModule</namespace>
</extension>`;

/**
 * Sample manifest XML for plugin
 */
export const samplePluginManifest = `<?xml version="1.0" encoding="UTF-8"?>
<extension type="plugin" group="content" method="upgrade">
  <name>plg_content_testplugin</name>
  <author>Test Author</author>
  <creationDate>January 2025</creationDate>
  <copyright>Copyright (C) 2025 Test Author</copyright>
  <license>GPL-2.0-or-later</license>
  <authorEmail>test@example.com</authorEmail>
  <authorUrl>https://example.com</authorUrl>
  <version>1.0.0</version>
  <description>PLG_CONTENT_TESTPLUGIN_XML_DESCRIPTION</description>
  <namespace path="src">TestCompany\\Plugin\\Content\\TestPlugin</namespace>
</extension>`;

/**
 * Sample TypeScript code
 */
export const sampleTypeScriptCode = `
import { Component } from 'joomla';

export class TestComponent extends Component {
  constructor() {
    super();
  }

  public render(): void {
    console.log('Test component rendered');
  }
}
`;

/**
 * Sample PHP code
 */
export const samplePhpCode = `<?php
namespace TestCompany\\Component\\TestComponent;

defined('_JEXEC') or die;

class TestComponent
{
    public function __construct()
    {
        // Constructor
    }

    public function render(): void
    {
        echo 'Test component rendered';
    }
}
`;

/**
 * Sample Vite config
 */
export const sampleViteConfig = `
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './src/index.ts',
      },
    },
  },
});
`;

/**
 * Valid extension names
 */
export const validExtensionNames = [
  'test-component',
  'mycomponent',
  'my_component',
  'component123',
];

/**
 * Invalid extension names
 */
export const invalidExtensionNames = [
  '',
  'test component',
  'test@component',
  '123component',
  'com_ponent',
];

/**
 * Valid namespaces
 */
export const validNamespaces = [
  'TestCompany\\Component\\TestComponent',
  'MyCompany\\Module\\MyModule',
  'Vendor\\Plugin\\System\\MyPlugin',
];

/**
 * Invalid namespaces
 */
export const invalidNamespaces = [
  '',
  'testcompany',
  'TestCompany',
  'TestCompany\\',
  '\\TestCompany\\Component',
];

/**
 * Valid versions
 */
export const validVersions = ['1.0.0', '0.1.0', '10.20.30', '1.0.0-alpha'];

/**
 * Invalid versions
 */
export const invalidVersions = ['', '1', '1.0', 'v1.0.0', '1.0.0.0'];

/**
 * Valid email addresses
 */
export const validEmails = [
  'test@example.com',
  'user+tag@example.co.uk',
  'firstname.lastname@example.com',
];

/**
 * Invalid email addresses
 */
export const invalidEmails = ['', 'test', 'test@', '@example.com', 'test@.com'];

/**
 * Valid URLs
 */
export const validUrls = [
  'https://example.com',
  'http://example.com',
  'https://www.example.com/path',
];

/**
 * Invalid URLs
 */
export const invalidUrls = ['', 'example.com', 'ftp://example.com', 'not a url'];
