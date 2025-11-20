/**
 * Tests for validation.ts utility functions
 */

import { describe, it, expect } from 'vitest';
import { validateExtensionName } from '@/utils/validation';
import type { ExtensionType } from '@/types/config';

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
});
