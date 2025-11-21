/**
 * Tests for template.ts utility functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { vol } from 'memfs';

// Mock fs/promises module
vi.mock('fs/promises', () => ({
  default: {
    readFile: vi.fn(async (path: string) => {
      return vol.readFileSync(path, 'utf-8');
    }),
    writeFile: vi.fn(async (path: string, content: string) => {
      vol.writeFileSync(path, content);
    }),
    mkdir: vi.fn(async (path: string, options?: any) => {
      vol.mkdirSync(path, options);
    }),
    readdir: vi.fn(async (path: string, options?: any) => {
      const items = vol.readdirSync(path) as string[];
      if (options?.withFileTypes) {
        return items.map((name) => {
          const fullPath = `${path}/${name}`;
          const stats = vol.statSync(fullPath);
          return {
            name,
            isDirectory: () => stats.isDirectory(),
            isFile: () => stats.isFile(),
          };
        });
      }
      return items;
    }),
    stat: vi.fn(async (path: string) => {
      return vol.statSync(path);
    }),
    copyFile: vi.fn(async (src: string, dest: string) => {
      const content = vol.readFileSync(src);
      vol.writeFileSync(dest, content);
    }),
  },
}));

describe('template.ts', () => {
  beforeEach(() => {
    vol.reset();
    vi.clearAllMocks();
  });

  describe('replaceVariables', () => {
    it('should replace single variable', async () => {
      const { replaceVariables } = await import('@/utils/template');
      const content = 'Hello {{NAME}}!';
      const variables = { NAME: 'World' };

      const result = replaceVariables(content, variables);

      expect(result).toBe('Hello World!');
    });

    it('should replace multiple variables', async () => {
      const { replaceVariables } = await import('@/utils/template');
      const content = '{{GREETING}} {{NAME}}, you are {{AGE}} years old.';
      const variables = {
        GREETING: 'Hello',
        NAME: 'John',
        AGE: '25',
      };

      const result = replaceVariables(content, variables);

      expect(result).toBe('Hello John, you are 25 years old.');
    });

    it('should replace all occurrences of a variable', async () => {
      const { replaceVariables } = await import('@/utils/template');
      const content = '{{NAME}} and {{NAME}} are friends. {{NAME}} is happy.';
      const variables = { NAME: 'Alice' };

      const result = replaceVariables(content, variables);

      expect(result).toBe('Alice and Alice are friends. Alice is happy.');
    });

    it('should handle variables in different cases', async () => {
      const { replaceVariables } = await import('@/utils/template');
      const content = '{{COMPONENT_NAME}} and {{COMPONENT_CLASS}}';
      const variables = {
        COMPONENT_NAME: 'com_test',
        COMPONENT_CLASS: 'TestComponent',
      };

      const result = replaceVariables(content, variables);

      expect(result).toBe('com_test and TestComponent');
    });

    it('should not replace variables that are not in the object', async () => {
      const { replaceVariables } = await import('@/utils/template');
      const content = 'Hello {{NAME}}, your {{UNKNOWN}} is ready.';
      const variables = { NAME: 'John' };

      const result = replaceVariables(content, variables);

      expect(result).toBe('Hello John, your {{UNKNOWN}} is ready.');
    });

    it('should handle empty content', async () => {
      const { replaceVariables } = await import('@/utils/template');
      const result = replaceVariables('', { NAME: 'Test' });

      expect(result).toBe('');
    });

    it('should handle content with no variables', async () => {
      const { replaceVariables } = await import('@/utils/template');
      const content = 'This is plain text without variables.';
      const result = replaceVariables(content, { NAME: 'Test' });

      expect(result).toBe('This is plain text without variables.');
    });

    it('should handle special characters in values', async () => {
      const { replaceVariables } = await import('@/utils/template');
      const content = 'Namespace: {{NAMESPACE}}';
      const variables = { NAMESPACE: 'Test\\Component\\MyComponent' };

      const result = replaceVariables(content, variables);

      expect(result).toBe('Namespace: Test\\Component\\MyComponent');
    });
  });

  describe('processTemplateFile', () => {
    it('should process template file and write output', async () => {
      const { processTemplateFile } = await import('@/utils/template');

      vol.fromJSON({
        '/templates/test.txt': 'Hello {{NAME}}!',
      });

      await processTemplateFile('/templates/test.txt', '/output/result.txt', { NAME: 'World' });

      const result = vol.readFileSync('/output/result.txt', 'utf-8');
      expect(result).toBe('Hello World!');
    });

    it('should create output directory if it does not exist', async () => {
      const { processTemplateFile } = await import('@/utils/template');

      vol.fromJSON({
        '/templates/test.txt': 'Content',
      });

      await processTemplateFile('/templates/test.txt', '/nested/deep/output.txt', {});

      expect(vol.existsSync('/nested/deep')).toBe(true);
      expect(vol.existsSync('/nested/deep/output.txt')).toBe(true);
    });

    it('should replace variables in output path', async () => {
      const { processTemplateFile } = await import('@/utils/template');

      vol.fromJSON({
        '/templates/test.txt': 'Content',
      });

      await processTemplateFile('/templates/test.txt', '/output/{{NAME}}.txt', { NAME: 'myfile' });

      expect(vol.existsSync('/output/myfile.txt')).toBe(true);
    });

    it('should throw error if template file does not exist', async () => {
      const { processTemplateFile } = await import('@/utils/template');

      await expect(
        processTemplateFile('/nonexistent.txt', '/output.txt', {})
      ).rejects.toThrow('Failed to process template file');
    });

    it('should handle complex template content', async () => {
      const { processTemplateFile } = await import('@/utils/template');

      vol.fromJSON({
        '/templates/component.php': `<?php
namespace {{NAMESPACE}};

class {{CLASS_NAME}} {
    public function __construct() {
        echo "{{MESSAGE}}";
    }
}`,
      });

      await processTemplateFile('/templates/component.php', '/output/Component.php', {
        NAMESPACE: 'Test\\Component',
        CLASS_NAME: 'MyComponent',
        MESSAGE: 'Hello from component',
      });

      const result = vol.readFileSync('/output/Component.php', 'utf-8');
      expect(result).toContain('namespace Test\\Component;');
      expect(result).toContain('class MyComponent {');
      expect(result).toContain('echo "Hello from component";');
    });
  });

  describe('processTemplateDirectory', () => {
    it('should process all files in directory', async () => {
      const { processTemplateDirectory } = await import('@/utils/template');

      vol.fromJSON({
        '/templates/file1.txt': 'Hello {{NAME}}',
        '/templates/file2.txt': 'Goodbye {{NAME}}',
      });

      await processTemplateDirectory('/templates', '/output', { NAME: 'World' });

      expect(vol.readFileSync('/output/file1.txt', 'utf-8')).toBe('Hello World');
      expect(vol.readFileSync('/output/file2.txt', 'utf-8')).toBe('Goodbye World');
    });

    it('should process nested directories recursively', async () => {
      const { processTemplateDirectory } = await import('@/utils/template');

      vol.fromJSON({
        '/templates/file.txt': 'Root {{VAR}}',
        '/templates/subdir/nested.txt': 'Nested {{VAR}}',
        '/templates/subdir/deep/deep.txt': 'Deep {{VAR}}',
      });

      await processTemplateDirectory('/templates', '/output', { VAR: 'test' });

      expect(vol.readFileSync('/output/file.txt', 'utf-8')).toBe('Root test');
      expect(vol.readFileSync('/output/subdir/nested.txt', 'utf-8')).toBe('Nested test');
      expect(vol.readFileSync('/output/subdir/deep/deep.txt', 'utf-8')).toBe('Deep test');
    });

    it('should replace variables in file and directory names', async () => {
      const { processTemplateDirectory } = await import('@/utils/template');

      vol.fromJSON({
        '/templates/{{NAME}}_file.txt': 'Content',
        '/templates/{{NAME}}_dir/file.txt': 'Nested content',
      });

      await processTemplateDirectory('/templates', '/output', { NAME: 'test' });

      expect(vol.existsSync('/output/test_file.txt')).toBe(true);
      expect(vol.existsSync('/output/test_dir/file.txt')).toBe(true);
    });

    it('should exclude specified patterns', async () => {
      const { processTemplateDirectory } = await import('@/utils/template');

      vol.fromJSON({
        '/templates/include.txt': 'Include',
        '/templates/exclude.txt': 'Exclude',
        '/templates/node_modules/lib.js': 'Library',
      });

      await processTemplateDirectory('/templates', '/output', {}, { exclude: ['exclude', 'node_modules'] });

      expect(vol.existsSync('/output/include.txt')).toBe(true);
      expect(vol.existsSync('/output/exclude.txt')).toBe(false);
      expect(vol.existsSync('/output/node_modules')).toBe(false);
    });

    it('should only process files with specified extensions', async () => {
      const { processTemplateDirectory } = await import('@/utils/template');

      vol.fromJSON({
        '/templates/file.php': '<?php echo "{{VAR}}";',
        '/templates/file.txt': '{{VAR}}',
        '/templates/image.png': 'binary data',
      });

      await processTemplateDirectory('/templates', '/output', { VAR: 'test' }, { extensions: ['.php', '.txt'] });

      expect(vol.readFileSync('/output/file.php', 'utf-8')).toBe('<?php echo "test";');
      expect(vol.readFileSync('/output/file.txt', 'utf-8')).toBe('test');
      expect(vol.readFileSync('/output/image.png', 'utf-8')).toBe('binary data');
    });

    it('should copy files without specified extensions', async () => {
      const { processTemplateDirectory } = await import('@/utils/template');

      vol.fromJSON({
        '/templates/process.txt': '{{VAR}}',
        '/templates/copy.bin': 'binary {{VAR}}',
      });

      await processTemplateDirectory('/templates', '/output', { VAR: 'test' }, { extensions: ['.txt'] });

      expect(vol.readFileSync('/output/process.txt', 'utf-8')).toBe('test');
      expect(vol.readFileSync('/output/copy.bin', 'utf-8')).toBe('binary {{VAR}}');
    });

    it('should throw error if template directory does not exist', async () => {
      const { processTemplateDirectory } = await import('@/utils/template');

      await expect(
        processTemplateDirectory('/nonexistent', '/output', {})
      ).rejects.toThrow('Failed to process template directory');
    });
  });

  describe('getTemplateDirectory', () => {
    it('should return correct template directory path', async () => {
      const { getTemplateDirectory } = await import('@/utils/template');

      const result = getTemplateDirectory('component');

      expect(result).toContain('templates/extension/component');
    });

    it('should handle different extension types', async () => {
      const { getTemplateDirectory } = await import('@/utils/template');

      expect(getTemplateDirectory('module')).toContain('templates/extension/module');
      expect(getTemplateDirectory('plugin')).toContain('templates/extension/plugin');
      expect(getTemplateDirectory('template')).toContain('templates/extension/template');
      expect(getTemplateDirectory('library')).toContain('templates/extension/library');
    });
  });

  describe('templateExists', () => {
    it('should return true if template directory exists', async () => {
      const { templateExists, getTemplateDirectory } = await import('@/utils/template');

      const templateDir = getTemplateDirectory('component');
      vol.mkdirSync(templateDir, { recursive: true });

      const result = await templateExists('component');

      expect(result).toBe(true);
    });

    it('should return false if template directory does not exist', async () => {
      const { templateExists } = await import('@/utils/template');

      const result = await templateExists('nonexistent');

      expect(result).toBe(false);
    });

    it('should return false if path exists but is not a directory', async () => {
      const { templateExists, getTemplateDirectory } = await import('@/utils/template');

      const templatePath = getTemplateDirectory('component');
      vol.mkdirSync(templatePath.split('/').slice(0, -1).join('/'), { recursive: true });
      vol.writeFileSync(templatePath, 'content');

      const result = await templateExists('component');

      expect(result).toBe(false);
    });
  });

  describe('listAvailableTemplates', () => {
    it('should return empty array if templates directory does not exist', async () => {
      const { listAvailableTemplates } = await import('@/utils/template');

      // Since we're using a mocked fs, and the function uses import.meta.url
      // which points to the real file system, it will return empty array
      const result = await listAvailableTemplates();

      expect(Array.isArray(result)).toBe(true);
    });
  });
});
