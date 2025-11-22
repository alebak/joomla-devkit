/**
 * Tests for variables.ts utility functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateComponentVariables,
  generateModuleVariables,
  generatePluginVariables,
  generateTemplateVariables,
  generateLibraryVariables,
  generateVariables,
} from '@/utils/variables';
import type { CreateExtensionOptions } from '@/types/config';

describe('variables.ts', () => {
  let baseOptions: CreateExtensionOptions;

  beforeEach(() => {
    // Mock current date to January 2025
    vi.setSystemTime(new Date('2025-01-15'));

    baseOptions = {
      type: 'component',
      name: 'testextension',
      author: 'Test Author',
      email: 'test@example.com',
      url: 'https://example.com',
      description: 'Test extension',
      license: 'GPL-2.0-or-later',
      version: '1.0.0',
      namespace: 'TestAuthor\\Component\\Test',
    };
  });

  describe('generateComponentVariables', () => {
    it('should generate basic component variables', () => {
      const vars = generateComponentVariables('mycomponent', baseOptions);

      expect(vars.COMPONENT_NAME).toBe('com_mycomponent');
      expect(vars.COM_NAME).toBe('COM_MYCOMPONENT');
      expect(vars.COMPONENT_CLASS).toBe('Mycomponent');
      expect(vars.COMPONENT_UPPER).toBe('MYCOMPONENT');
      expect(vars.DEFAULT_VIEW).toBe('items');
    });

    it('should handle component names with com_ prefix', () => {
      const vars = generateComponentVariables('com_mycomponent', baseOptions);

      expect(vars.COMPONENT_NAME).toBe('com_mycomponent');
      expect(vars.COM_NAME).toBe('COM_MYCOMPONENT');
      expect(vars.COMPONENT_CLASS).toBe('Mycomponent');
    });

    it('should handle underscore-separated names', () => {
      const vars = generateComponentVariables('my_component', baseOptions);

      expect(vars.COMPONENT_NAME).toBe('com_my_component');
      expect(vars.COMPONENT_CLASS).toBe('MyComponent');
      expect(vars.COMPONENT_UPPER).toBe('MY_COMPONENT');
    });

    it('should include base variables', () => {
      const vars = generateComponentVariables('mycomponent', baseOptions);

      expect(vars.AUTHOR).toBe('Test Author');
      expect(vars.AUTHOR_EMAIL).toBe('test@example.com');
      expect(vars.AUTHOR_URL).toBe('https://example.com');
      expect(vars.LICENSE).toBe('GPL-2.0-or-later');
      expect(vars.VERSION).toBe('1.0.0');
      expect(vars.DESCRIPTION).toBe('Test extension');
      expect(vars.CREATION_DATE).toBe('January 2025');
      expect(vars.NAMESPACE).toBe('TestAuthor\\Component\\Test');
    });

    it('should use default values for missing options', () => {
      const minimalOptions: CreateExtensionOptions = {
        type: 'component',
        name: 'test',
      };
      const vars = generateComponentVariables('test', minimalOptions);

      expect(vars.AUTHOR).toBe('Your Name');
      expect(vars.AUTHOR_EMAIL).toBe('your.email@example.com');
      expect(vars.AUTHOR_URL).toBe('https://example.com');
      expect(vars.LICENSE).toBe('GPL-2.0-or-later');
      expect(vars.VERSION).toBe('1.0.0');
      expect(vars.DEFAULT_VIEW).toBe('items');
    });

    it('should handle custom default view', () => {
      const opts = { ...baseOptions, defaultView: 'dashboard' };
      const vars = generateComponentVariables('test', opts);

      expect(vars.DEFAULT_VIEW).toBe('dashboard');
    });

    it('should generate COPYRIGHT with current year', () => {
      const vars = generateComponentVariables('test', baseOptions);

      expect(vars.COPYRIGHT).toBe('Copyright (C) 2025 Test Author. All rights reserved.');
    });
  });

  describe('generateModuleVariables', () => {
    beforeEach(() => {
      baseOptions.type = 'module';
    });

    it('should generate basic module variables', () => {
      const vars = generateModuleVariables('mymodule', baseOptions);

      expect(vars.MODULE_NAME).toBe('mod_mymodule');
      expect(vars.MOD_NAME).toBe('MOD_MYMODULE');
      expect(vars.MODULE_CLASS).toBe('Mymodule');
      expect(vars.MODULE_UPPER).toBe('MYMODULE');
      expect(vars.CLIENT).toBe('site');
      expect(vars.CLIENT_CLASS).toBe('Site');
    });

    it('should handle module names with mod_ prefix', () => {
      const vars = generateModuleVariables('mod_mymodule', baseOptions);

      expect(vars.MODULE_NAME).toBe('mod_mymodule');
      expect(vars.MOD_NAME).toBe('MOD_MYMODULE');
    });

    it('should handle admin client', () => {
      const opts = { ...baseOptions, client: 'administrator' as const };
      const vars = generateModuleVariables('mymodule', opts);

      expect(vars.CLIENT).toBe('administrator');
      expect(vars.CLIENT_CLASS).toBe('Administrator');
    });

    it('should handle uppercase client values', () => {
      const opts = { ...baseOptions, client: 'SITE' };
      const vars = generateModuleVariables('mymodule', opts);

      expect(vars.CLIENT).toBe('SITE');
      expect(vars.CLIENT_CLASS).toBe('Site');
    });

    it('should include base variables', () => {
      const vars = generateModuleVariables('mymodule', baseOptions);

      expect(vars.AUTHOR).toBe('Test Author');
      expect(vars.LICENSE).toBe('GPL-2.0-or-later');
      expect(vars.VERSION).toBe('1.0.0');
    });
  });

  describe('generatePluginVariables', () => {
    beforeEach(() => {
      baseOptions.type = 'plugin';
      baseOptions.pluginGroup = 'content';
    });

    it('should generate basic plugin variables', () => {
      const vars = generatePluginVariables('myplugin', 'content', baseOptions);

      expect(vars.PLUGIN_NAME).toBe('myplugin');
      expect(vars.PLG_NAME).toBe('PLG_CONTENT_MYPLUGIN');
      expect(vars.PLUGIN_CLASS).toBe('Myplugin');
      expect(vars.PLUGIN_UPPER).toBe('MYPLUGIN');
      expect(vars.PLUGIN_GROUP).toBe('content');
      expect(vars.PLUGIN_GROUP_CLASS).toBe('Content');
      expect(vars.PLUGIN_GROUP_UPPER).toBe('CONTENT');
    });

    it('should handle plugin names with plg_ prefix', () => {
      const vars = generatePluginVariables('plg_myplugin', 'system', baseOptions);

      expect(vars.PLUGIN_NAME).toBe('myplugin');
      expect(vars.PLG_NAME).toBe('PLG_SYSTEM_MYPLUGIN');
    });

    it('should handle different plugin groups', () => {
      const groups = ['system', 'authentication', 'user', 'editors'];

      groups.forEach((group) => {
        const vars = generatePluginVariables('test', group, baseOptions);
        expect(vars.PLUGIN_GROUP).toBe(group.toLowerCase());
        expect(vars.PLUGIN_GROUP_UPPER).toBe(group.toUpperCase());
      });
    });

    it('should handle hyphenated plugin groups', () => {
      const vars = generatePluginVariables('test', 'editors-xtd', baseOptions);

      expect(vars.PLUGIN_GROUP).toBe('editors-xtd');
      expect(vars.PLUGIN_GROUP_CLASS).toBe('EditorsXtd');
      expect(vars.PLUGIN_GROUP_UPPER).toBe('EDITORS-XTD');
    });

    it('should include base variables', () => {
      const vars = generatePluginVariables('myplugin', 'content', baseOptions);

      expect(vars.AUTHOR).toBe('Test Author');
      expect(vars.LICENSE).toBe('GPL-2.0-or-later');
    });
  });

  describe('generateTemplateVariables', () => {
    beforeEach(() => {
      baseOptions.type = 'template';
    });

    it('should generate basic template variables', () => {
      const vars = generateTemplateVariables('mytemplate', baseOptions);

      expect(vars.TEMPLATE_NAME).toBe('mytemplate');
      expect(vars.TEMPLATE_CLASS).toBe('Mytemplate');
      expect(vars.TEMPLATE_UPPER).toBe('MYTEMPLATE');
      expect(vars.CLIENT).toBe('site');
    });

    it('should handle template names with tpl_ prefix', () => {
      const vars = generateTemplateVariables('tpl_mytemplate', baseOptions);

      expect(vars.TEMPLATE_NAME).toBe('mytemplate');
      expect(vars.TEMPLATE_CLASS).toBe('Mytemplate');
    });

    it('should handle admin client', () => {
      const opts = { ...baseOptions, client: 'administrator' as const };
      const vars = generateTemplateVariables('mytemplate', opts);

      expect(vars.CLIENT).toBe('administrator');
    });

    it('should handle underscore-separated names', () => {
      const vars = generateTemplateVariables('my_template', baseOptions);

      expect(vars.TEMPLATE_NAME).toBe('my_template');
      expect(vars.TEMPLATE_CLASS).toBe('MyTemplate');
    });

    it('should include base variables', () => {
      const vars = generateTemplateVariables('mytemplate', baseOptions);

      expect(vars.AUTHOR).toBe('Test Author');
      expect(vars.LICENSE).toBe('GPL-2.0-or-later');
    });
  });

  describe('generateLibraryVariables', () => {
    beforeEach(() => {
      baseOptions.type = 'library';
    });

    it('should generate basic library variables', () => {
      const vars = generateLibraryVariables('mylibrary', baseOptions);

      expect(vars.LIBRARY_NAME).toBe('mylibrary');
      expect(vars.LIB_NAME).toBe('Mylibrary');
      expect(vars.LIBRARY_CLASS).toBe('Mylibrary');
      expect(vars.LIBRARY_UPPER).toBe('MYLIBRARY');
    });

    it('should handle library names with lib_ prefix', () => {
      const vars = generateLibraryVariables('lib_mylibrary', baseOptions);

      expect(vars.LIBRARY_NAME).toBe('mylibrary');
      expect(vars.LIB_NAME).toBe('Mylibrary');
    });

    it('should handle underscore-separated names', () => {
      const vars = generateLibraryVariables('my_library', baseOptions);

      expect(vars.LIBRARY_NAME).toBe('my_library');
      expect(vars.LIBRARY_CLASS).toBe('MyLibrary');
    });

    it('should include base variables', () => {
      const vars = generateLibraryVariables('mylibrary', baseOptions);

      expect(vars.AUTHOR).toBe('Test Author');
      expect(vars.LICENSE).toBe('GPL-2.0-or-later');
    });
  });

  describe('generateVariables', () => {
    it('should generate component variables', () => {
      const vars = generateVariables('component', 'test', baseOptions);

      expect(vars.COMPONENT_NAME).toBe('com_test');
      expect(vars.COM_NAME).toBe('COM_TEST');
    });

    it('should generate module variables', () => {
      const opts = { ...baseOptions, type: 'module' as const };
      const vars = generateVariables('module', 'test', opts);

      expect(vars.MODULE_NAME).toBe('mod_test');
      expect(vars.MOD_NAME).toBe('MOD_TEST');
    });

    it('should generate plugin variables', () => {
      const opts = { ...baseOptions, type: 'plugin' as const, pluginGroup: 'content' };
      const vars = generateVariables('plugin', 'test', opts);

      expect(vars.PLUGIN_NAME).toBe('test');
      expect(vars.PLG_NAME).toBe('PLG_CONTENT_TEST');
    });

    it('should generate template variables', () => {
      const opts = { ...baseOptions, type: 'template' as const };
      const vars = generateVariables('template', 'test', opts);

      expect(vars.TEMPLATE_NAME).toBe('test');
    });

    it('should generate library variables', () => {
      const opts = { ...baseOptions, type: 'library' as const };
      const vars = generateVariables('library', 'test', opts);

      expect(vars.LIBRARY_NAME).toBe('test');
    });

    it('should throw error for plugin without group', () => {
      const opts = { ...baseOptions, type: 'plugin' as const };
      delete opts.pluginGroup;

      expect(() => {
        generateVariables('plugin', 'test', opts);
      }).toThrow('Plugin group is required for plugin extensions');
    });

    it('should throw error for unknown extension type', () => {
      expect(() => {
        // @ts-expect-error - Testing invalid type
        generateVariables('invalid', 'test', baseOptions);
      }).toThrow('Unknown extension type: invalid');
    });
  });

  describe('date formatting', () => {
    it('should format CREATION_DATE correctly for different months', () => {
      const months = [
        { date: '2025-01-15', expected: 'January 2025' },
        { date: '2025-06-15', expected: 'June 2025' },
        { date: '2025-12-15', expected: 'December 2025' },
      ];

      months.forEach(({ date, expected }) => {
        vi.setSystemTime(new Date(date));
        const vars = generateComponentVariables('test', baseOptions);
        expect(vars.CREATION_DATE).toBe(expected);
      });
    });
  });

  describe('package name generation', () => {
    it('should use custom package name if provided', () => {
      const opts = { ...baseOptions, packageName: 'custom-package' };
      const vars = generateComponentVariables('test', opts);

      expect(vars.PACKAGE_NAME).toBe('custom-package');
    });

    it('should sanitize extension name for package name', () => {
      const opts = { ...baseOptions, name: 'My Test Component' };
      const vars = generateComponentVariables('My Test Component', opts);

      expect(vars.PACKAGE_NAME).toBe('my_test_component');
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings gracefully', () => {
      const opts: CreateExtensionOptions = {
        type: 'component',
        name: '',
      };
      const vars = generateComponentVariables('test', opts);

      expect(vars.COMPONENT_NAME).toBe('com_test');
      expect(vars.AUTHOR).toBe('Your Name');
    });

    it('should handle special characters in names', () => {
      const vars = generateComponentVariables('test@component#123', baseOptions);

      expect(vars.COMPONENT_CLASS).toBe('TestComponent123');
    });

    it('should preserve namespace from options', () => {
      const customNamespace = 'Custom\\Namespace\\Test';
      const opts = { ...baseOptions, namespace: customNamespace };
      const vars = generateComponentVariables('test', opts);

      expect(vars.NAMESPACE).toBe(customNamespace);
    });
  });
});
