/**
 * Tests for validation.ts utility functions
 */

import { describe, it, expect } from 'vitest';
import {
  validateExtensionName,
  validateNamespace,
  validateEmail,
  validateUrl,
  validatePluginGroup,
  validateVersion,
  generateNamespace,
  sanitizeClassName,
  sanitizeFileName,
} from '@/utils/validation';

describe('validation.ts', () => {
  describe('validateExtensionName', () => {
    describe('valid extension names', () => {
      it('should accept valid component names', () => {
        expect(validateExtensionName('mycomponent', 'component')).toBe(true);
        expect(validateExtensionName('my_component', 'component')).toBe(true);
        expect(validateExtensionName('MyComponent123', 'component')).toBe(true);
      });

      it('should accept names with common prefixes', () => {
        expect(validateExtensionName('com_mycomponent', 'component')).toBe(true);
        expect(validateExtensionName('mod_mymodule', 'module')).toBe(true);
        expect(validateExtensionName('plg_myplugin', 'plugin')).toBe(true);
        expect(validateExtensionName('lib_mylibrary', 'library')).toBe(true);
        expect(validateExtensionName('tpl_mytemplate', 'template')).toBe(true);
      });

      it('should accept valid module names', () => {
        expect(validateExtensionName('mymodule', 'module')).toBe(true);
        expect(validateExtensionName('my_module', 'module')).toBe(true);
      });

      it('should accept valid plugin names', () => {
        expect(validateExtensionName('myplugin', 'plugin')).toBe(true);
        expect(validateExtensionName('my_plugin', 'plugin')).toBe(true);
      });

      it('should accept valid template names', () => {
        expect(validateExtensionName('mytemplate', 'template')).toBe(true);
        expect(validateExtensionName('my_template', 'template')).toBe(true);
      });

      it('should accept valid library names', () => {
        expect(validateExtensionName('mylibrary', 'library')).toBe(true);
        expect(validateExtensionName('my_library', 'library')).toBe(true);
      });
    });

    describe('invalid extension names', () => {
      it('should reject empty names', () => {
        expect(validateExtensionName('', 'component')).toBe(false);
        expect(validateExtensionName('   ', 'component')).toBe(false);
      });

      it('should reject names with spaces', () => {
        expect(validateExtensionName('my component', 'component')).toBe(false);
        expect(validateExtensionName('my module', 'module')).toBe(false);
      });

      it('should reject names with special characters', () => {
        expect(validateExtensionName('my-component', 'component')).toBe(false);
        expect(validateExtensionName('my@component', 'component')).toBe(false);
        expect(validateExtensionName('my.component', 'component')).toBe(false);
        expect(validateExtensionName('my/component', 'component')).toBe(false);
      });

      it('should reject names starting with numbers', () => {
        expect(validateExtensionName('123component', 'component')).toBe(false);
        expect(validateExtensionName('1module', 'module')).toBe(false);
      });

      it('should reject names that are too short', () => {
        expect(validateExtensionName('a', 'component')).toBe(false);
        expect(validateExtensionName('x', 'module')).toBe(false);
      });

      it('should reject names that are too long', () => {
        const longName = 'a'.repeat(51);
        expect(validateExtensionName(longName, 'component')).toBe(false);
      });

      it('should reject invalid extension types', () => {
        // @ts-expect-error - Testing invalid type
        expect(validateExtensionName('myextension', 'invalid')).toBe(false);
      });
    });

    describe('edge cases', () => {
      it('should handle names at minimum length (2 characters)', () => {
        expect(validateExtensionName('ab', 'component')).toBe(true);
        expect(validateExtensionName('xy', 'module')).toBe(true);
      });

      it('should handle names at maximum length (50 characters)', () => {
        const maxLengthName = 'a'.repeat(50);
        expect(validateExtensionName(maxLengthName, 'component')).toBe(true);
      });

      it('should be case-insensitive for prefixes', () => {
        expect(validateExtensionName('COM_mycomponent', 'component')).toBe(true);
        expect(validateExtensionName('MOD_mymodule', 'module')).toBe(true);
        expect(validateExtensionName('PLG_myplugin', 'plugin')).toBe(true);
      });
    });
  });

  describe('validateNamespace', () => {
    describe('valid namespaces', () => {
      it('should accept valid PHP namespaces', () => {
        expect(validateNamespace('Vendor\\Component\\Name')).toBe(true);
        expect(validateNamespace('MyCompany\\Module\\MyModule')).toBe(true);
        expect(validateNamespace('Test\\Plugin\\System\\Test')).toBe(true);
      });

      it('should accept single-level namespaces', () => {
        expect(validateNamespace('Vendor')).toBe(true);
        expect(validateNamespace('MyCompany')).toBe(true);
      });

      it('should accept namespaces with numbers', () => {
        expect(validateNamespace('Vendor123\\Component456')).toBe(true);
        expect(validateNamespace('Test2\\Module3')).toBe(true);
      });
    });

    describe('invalid namespaces', () => {
      it('should reject empty namespaces', () => {
        expect(validateNamespace('')).toBe(false);
        expect(validateNamespace('   ')).toBe(false);
      });

      it('should reject namespaces starting with lowercase', () => {
        expect(validateNamespace('vendor\\Component')).toBe(false);
        expect(validateNamespace('myCompany\\Module')).toBe(false);
      });

      it('should reject namespaces with trailing backslash', () => {
        expect(validateNamespace('Vendor\\')).toBe(false);
        expect(validateNamespace('Vendor\\Component\\')).toBe(false);
      });

      it('should reject namespaces with leading backslash', () => {
        expect(validateNamespace('\\Vendor')).toBe(false);
        expect(validateNamespace('\\Vendor\\Component')).toBe(false);
      });

      it('should reject namespaces with special characters', () => {
        expect(validateNamespace('Vendor-Company\\Component')).toBe(false);
        expect(validateNamespace('Vendor.Company\\Component')).toBe(false);
      });

      it('should reject namespaces starting with numbers', () => {
        expect(validateNamespace('123Vendor\\Component')).toBe(false);
      });
    });
  });

  describe('validateEmail', () => {
    describe('valid emails', () => {
      it('should accept valid email addresses', () => {
        expect(validateEmail('test@example.com')).toBe(true);
        expect(validateEmail('user.name@example.com')).toBe(true);
        expect(validateEmail('user+tag@example.co.uk')).toBe(true);
      });

      it('should accept empty email (optional)', () => {
        expect(validateEmail('')).toBe(true);
        expect(validateEmail('   ')).toBe(true);
      });
    });

    describe('invalid emails', () => {
      it('should reject invalid email formats', () => {
        expect(validateEmail('test')).toBe(false);
        expect(validateEmail('test@')).toBe(false);
        expect(validateEmail('@example.com')).toBe(false);
        expect(validateEmail('test@example')).toBe(false);
      });

      it('should reject emails with spaces', () => {
        expect(validateEmail('test @example.com')).toBe(false);
        expect(validateEmail('test@ example.com')).toBe(false);
      });
    });
  });

  describe('validateUrl', () => {
    describe('valid URLs', () => {
      it('should accept valid HTTP URLs', () => {
        expect(validateUrl('http://example.com')).toBe(true);
        expect(validateUrl('https://example.com')).toBe(true);
        expect(validateUrl('https://www.example.com/path')).toBe(true);
      });

      it('should accept empty URL (optional)', () => {
        expect(validateUrl('')).toBe(true);
        expect(validateUrl('   ')).toBe(true);
      });

      it('should accept URLs with ports and queries', () => {
        expect(validateUrl('https://example.com:8080')).toBe(true);
        expect(validateUrl('https://example.com?query=value')).toBe(true);
        expect(validateUrl('https://example.com/path?query=value#hash')).toBe(true);
      });
    });

    describe('invalid URLs', () => {
      it('should reject invalid URL formats', () => {
        expect(validateUrl('example.com')).toBe(false);
        expect(validateUrl('not a url')).toBe(false);
        expect(validateUrl('ftp://example')).toBe(true); // FTP is valid
      });
    });
  });

  describe('validatePluginGroup', () => {
    describe('valid plugin groups', () => {
      it('should accept valid Joomla plugin groups', () => {
        expect(validatePluginGroup('content')).toBe(true);
        expect(validatePluginGroup('system')).toBe(true);
        expect(validatePluginGroup('authentication')).toBe(true);
        expect(validatePluginGroup('user')).toBe(true);
      });

      it('should be case-insensitive', () => {
        expect(validatePluginGroup('Content')).toBe(true);
        expect(validatePluginGroup('SYSTEM')).toBe(true);
        expect(validatePluginGroup('Authentication')).toBe(true);
      });

      it('should accept all valid groups', () => {
        const validGroups = [
          'actionlog',
          'api-authentication',
          'authentication',
          'behaviour',
          'captcha',
          'content',
          'editors',
          'editors-xtd',
          'extension',
          'fields',
          'filesystem',
          'finder',
          'installer',
          'media-action',
          'multifactorauth',
          'privacy',
          'quickicon',
          'sampledata',
          'system',
          'task',
          'user',
          'webservices',
          'workflow',
        ];

        validGroups.forEach((group) => {
          expect(validatePluginGroup(group)).toBe(true);
        });
      });
    });

    describe('invalid plugin groups', () => {
      it('should reject invalid plugin groups', () => {
        expect(validatePluginGroup('invalid')).toBe(false);
        expect(validatePluginGroup('custom')).toBe(false);
        expect(validatePluginGroup('')).toBe(false);
      });
    });
  });

  describe('validateVersion', () => {
    describe('valid versions', () => {
      it('should accept semantic versions', () => {
        expect(validateVersion('1.0.0')).toBe(true);
        expect(validateVersion('0.1.0')).toBe(true);
        expect(validateVersion('10.20.30')).toBe(true);
      });

      it('should accept pre-release versions', () => {
        expect(validateVersion('1.0.0-alpha.1')).toBe(true);
        expect(validateVersion('1.0.0-beta.2')).toBe(true);
        expect(validateVersion('1.0.0-rc.3')).toBe(true);
      });
    });

    describe('invalid versions', () => {
      it('should reject invalid version formats', () => {
        expect(validateVersion('')).toBe(false);
        expect(validateVersion('1')).toBe(false);
        expect(validateVersion('1.0')).toBe(false);
        expect(validateVersion('v1.0.0')).toBe(false);
      });

      it('should reject invalid pre-release formats', () => {
        expect(validateVersion('1.0.0-alpha')).toBe(false);
        expect(validateVersion('1.0.0-dev.1')).toBe(false);
        expect(validateVersion('1.0.0-1')).toBe(false);
      });
    });
  });

  describe('generateNamespace', () => {
    it('should generate valid namespaces for components', () => {
      expect(generateNamespace('John Doe', 'component', 'mycomponent')).toBe(
        'JohnDoe\\Component\\Mycomponent'
      );
      expect(generateNamespace('TestAuthor', 'component', 'test_component')).toBe(
        'TestAuthor\\Component\\TestComponent'
      );
    });

    it('should generate valid namespaces for modules', () => {
      expect(generateNamespace('John Doe', 'module', 'mymodule')).toBe(
        'JohnDoe\\Module\\Mymodule'
      );
    });

    it('should generate valid namespaces for plugins', () => {
      expect(generateNamespace('John Doe', 'plugin', 'myplugin')).toBe('JohnDoe\\Plugin');
    });

    it('should generate valid namespaces for templates', () => {
      expect(generateNamespace('John Doe', 'template', 'mytemplate')).toBe(
        'JohnDoe\\Template\\Mytemplate'
      );
    });

    it('should generate valid namespaces for libraries', () => {
      expect(generateNamespace('John Doe', 'library', 'mylibrary')).toBe(
        'JohnDoe\\Library\\Mylibrary'
      );
    });

    it('should sanitize author name', () => {
      expect(generateNamespace('John-Doe123', 'component', 'test')).toBe(
        'JohnDoe123\\Component\\Test'
      );
      expect(generateNamespace('123John', 'component', 'test')).toBe(
        'John\\Component\\Test'
      );
    });

    it('should handle prefixed extension names', () => {
      expect(generateNamespace('Author', 'component', 'com_test')).toBe(
        'Author\\Component\\Test'
      );
      expect(generateNamespace('Author', 'module', 'mod_test')).toBe(
        'Author\\Module\\Test'
      );
    });
  });

  describe('sanitizeClassName', () => {
    it('should convert strings to PascalCase', () => {
      expect(sanitizeClassName('my_class')).toBe('MyClass');
      expect(sanitizeClassName('my-class')).toBe('MyClass');
      expect(sanitizeClassName('my class')).toBe('MyClass');
    });

    it('should remove leading numbers', () => {
      expect(sanitizeClassName('123MyClass')).toBe('Myclass');
      expect(sanitizeClassName('1test')).toBe('Test');
    });

    it('should handle special characters', () => {
      expect(sanitizeClassName('my@class#name')).toBe('MyClassName');
      expect(sanitizeClassName('test.class')).toBe('TestClass');
    });

    it('should handle empty strings', () => {
      expect(sanitizeClassName('')).toBe('');
      expect(sanitizeClassName('123')).toBe('');
    });
  });

  describe('sanitizeFileName', () => {
    it('should convert to lowercase', () => {
      expect(sanitizeFileName('MyFile')).toBe('myfile');
      expect(sanitizeFileName('TEST_FILE')).toBe('test_file');
    });

    it('should replace invalid characters with underscores', () => {
      expect(sanitizeFileName('my file.txt')).toBe('my_file_txt');
      expect(sanitizeFileName('test@file#name')).toBe('test_file_name');
    });

    it('should remove leading and trailing underscores', () => {
      expect(sanitizeFileName('_myfile_')).toBe('myfile');
      expect(sanitizeFileName('___test___')).toBe('test');
    });

    it('should collapse multiple underscores', () => {
      expect(sanitizeFileName('my___file')).toBe('my_file');
      expect(sanitizeFileName('test__name__file')).toBe('test_name_file');
    });

    it('should preserve hyphens', () => {
      expect(sanitizeFileName('my-file')).toBe('my-file');
      expect(sanitizeFileName('test-name-file')).toBe('test-name-file');
    });
  });
});
