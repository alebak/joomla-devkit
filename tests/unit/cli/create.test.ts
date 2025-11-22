/**
 * Tests for create.ts CLI command
 *
 * Note: These tests focus on validation logic and error handling.
 * Full integration tests would require mocking the entire template system.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { vol } from 'memfs';

// Mock dependencies
vi.mock('chalk', () => ({
  default: {
    cyan: { bold: (text: string) => text },
    red: (text: string) => text,
    green: (text: string) => text,
    yellow: (text: string) => text,
    white: (text: string) => text,
    gray: (text: string) => text,
  },
}));

vi.mock('ora', () => ({
  default: vi.fn(() => ({
    start: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
  })),
}));

// Mock inquirer
let inquirerAnswers: any = {};
vi.mock('inquirer', () => ({
  default: {
    prompt: vi.fn(async () => inquirerAnswers),
  },
}));

// Mock fs/promises
vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn(async (path: string, options?: any) => {
      vol.mkdirSync(path, options);
    }),
    access: vi.fn(async (path: string) => {
      if (!vol.existsSync(path)) {
        throw new Error('ENOENT');
      }
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
    copyFile: vi.fn(async (src: string, dest: string) => {
      const content = vol.readFileSync(src);
      vol.writeFileSync(dest, content);
    }),
    readFile: vi.fn(async (path: string, encoding?: string) => {
      return vol.readFileSync(path, encoding || 'utf-8');
    }),
    writeFile: vi.fn(async (path: string, content: string) => {
      vol.writeFileSync(path, content);
    }),
    stat: vi.fn(async (path: string) => {
      return vol.statSync(path);
    }),
  },
}));

// Mock console and process.exit


describe('create.ts', () => {
  let consoleLogSpy: any;
  let consoleErrorSpy: any;
  let processExitSpy: any;

  beforeEach(() => {
    vol.reset();
    vi.clearAllMocks();
    vi.resetModules();

    // Spy on console methods
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    processExitSpy = vi.spyOn(process, 'exit').mockImplementation((code?: any) => {
      throw new Error(`process.exit(${code})`);
    }) as any;

    // Reset inquirer answers
    inquirerAnswers = {};

    // Mock process.cwd()
    vi.spyOn(process, 'cwd').mockReturnValue('/test/project');
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
    vi.restoreAllMocks();
  });

  describe('createCommand - validation', () => {
    it('should reject invalid extension type', async () => {
      const { createCommand } = await import('@/cli/create');

      await expect(createCommand('invalid', 'test', {})).rejects.toThrow('process.exit(1)');

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should accept component type', async () => {
      const { createCommand } = await import('@/cli/create');

      // Setup minimal environment
      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
      });

      // Will fail on template check, but should pass type validation
      await expect(createCommand('component', 'com_test', {})).rejects.toThrow();

      // Should not fail on type validation (first check)
      const errorCalls = consoleErrorSpy.mock.calls;
      const hasTypeError = errorCalls.some((call: any) =>
        call[0]?.includes?.('invalid') && call[0]?.includes?.('type')
      );
      expect(hasTypeError).toBe(false);
    });

    it('should accept module type', async () => {
      const { createCommand } = await import('@/cli/create');

      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
      });

      await expect(createCommand('module', 'mod_test', {})).rejects.toThrow();

      const errorCalls = consoleErrorSpy.mock.calls;
      const hasTypeError = errorCalls.some((call: any) =>
        call[0]?.includes?.('invalid') && call[0]?.includes?.('type')
      );
      expect(hasTypeError).toBe(false);
    });

    it('should accept plugin type', async () => {
      const { createCommand } = await import('@/cli/create');

      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
      });

      await expect(createCommand('plugin', 'plg_test', {})).rejects.toThrow();

      const errorCalls = consoleErrorSpy.mock.calls;
      const hasTypeError = errorCalls.some((call: any) =>
        call[0]?.includes?.('invalid') && call[0]?.includes?.('type')
      );
      expect(hasTypeError).toBe(false);
    });

    it('should accept template type', async () => {
      const { createCommand } = await import('@/cli/create');

      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
      });

      await expect(createCommand('template', 'tpl_test', {})).rejects.toThrow();

      const errorCalls = consoleErrorSpy.mock.calls;
      const hasTypeError = errorCalls.some((call: any) =>
        call[0]?.includes?.('invalid') && call[0]?.includes?.('type')
      );
      expect(hasTypeError).toBe(false);
    });

    it('should accept library type', async () => {
      const { createCommand } = await import('@/cli/create');

      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
      });

      await expect(createCommand('library', 'lib_test', {})).rejects.toThrow();

      const errorCalls = consoleErrorSpy.mock.calls;
      const hasTypeError = errorCalls.some((call: any) =>
        call[0]?.includes?.('invalid') && call[0]?.includes?.('type')
      );
      expect(hasTypeError).toBe(false);
    });

    it('should validate extension name for components', async () => {
      const { createCommand } = await import('@/cli/create');

      await expect(createCommand('component', 'invalid-name', {})).rejects.toThrow(
        'process.exit(1)'
      );

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should validate extension name for modules', async () => {
      const { createCommand } = await import('@/cli/create');

      await expect(createCommand('module', 'invalid', {})).rejects.toThrow('process.exit(1)');

      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should prompt for name if not provided', async () => {
      const inquirer = (await import('inquirer')).default;
      const { createCommand } = await import('@/cli/create');

      inquirerAnswers = {
        name: 'com_test',
      };

      // Will fail later, but should call prompt
      await expect(createCommand('component', undefined, {})).rejects.toThrow();

      expect(inquirer.prompt).toHaveBeenCalled();
    });

    it('should exit if template does not exist', async () => {
      const { createCommand } = await import('@/cli/create');

      // No template directory exists
      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
      });

      await expect(
        createCommand('component', 'com_test', {
          author: 'Test',
          email: 'test@test.com',
          license: 'GPL-2.0-or-later',
        })
      ).rejects.toThrow('process.exit(1)');

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should exit if extension already exists', async () => {
      const { createCommand } = await import('@/cli/create');

      // Extension directory already exists
      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
        '/test/project/extensions/component/com_test/file.txt': 'exists',
        '/workspaces/joomla-devkit/dist/templates/extension/component/file.txt': 'template',
      });

      inquirerAnswers = {
        description: 'Test',
      };

      await expect(
        createCommand('component', 'com_test', {
          author: 'Test',
          email: 'test@test.com',
          license: 'GPL-2.0-or-later',
        })
      ).rejects.toThrow('process.exit(1)');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorCalls = consoleErrorSpy.mock.calls;
      const hasExistsError = errorCalls.some((call: any) => call[0]?.includes?.('exists'));
      expect(hasExistsError).toBe(true);
    });
  });

  describe('createCommand - plugin validation', () => {
    it('should reject invalid plugin group', async () => {
      const { createCommand } = await import('@/cli/create');

      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
        '/workspaces/joomla-devkit/dist/templates/extension/plugin/file.txt': 'template',
      });

      inquirerAnswers = {
        description: 'Test',
      };

      await expect(
        createCommand('plugin', 'plg_test', {
          author: 'Test',
          email: 'test@test.com',
          license: 'GPL-2.0-or-later',
          group: 'invalid_group',
        })
      ).rejects.toThrow('process.exit(1)');

      expect(consoleErrorSpy).toHaveBeenCalled();
      const errorCalls = consoleErrorSpy.mock.calls;
      const hasGroupError = errorCalls.some((call: any) => call[0]?.includes?.('group'));
      expect(hasGroupError).toBe(true);
    });

    it('should accept valid plugin groups', async () => {
      // const { createCommand } = await import('@/cli/create');

      const validGroups = [
        'system',
        'content',
        'user',
        'authentication',
        'editors',
        'editors-xtd',
        'finder',
        'installer',
        'quickicon',
        'privacy',
        'webservices',
        'workflow',
        'task',
      ];

      for (const group of validGroups) {
        vi.resetModules();
        vol.reset();
        vol.fromJSON({
          '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
          '/workspaces/joomla-devkit/dist/templates/extension/plugin/file.txt': 'template',
        });

        inquirerAnswers = {
          description: 'Test',
        };

        const { createCommand } = await import('@/cli/create');

        await expect(
          createCommand('plugin', 'plg_test', {
            author: 'Test',
            email: 'test@test.com',
            license: 'GPL-2.0-or-later',
            group,
          })
        ).rejects.toThrow();

        // Should not have group validation error
        const errorCalls = consoleErrorSpy.mock.calls;
        const hasInvalidGroupError = errorCalls.some(
          (call: any) =>
            call[0]?.includes?.('Invalid') && call[0]?.includes?.('group')
        );
        expect(hasInvalidGroupError).toBe(false);

        consoleErrorSpy.mockClear();
      }
    });
  });

  describe('createCommand - configuration', () => {
    it('should work without existing jkit.config.json', async () => {
      const { createCommand } = await import('@/cli/create');

      // No config file
      vol.fromJSON({
        '/workspaces/joomla-devkit/dist/templates/extension/component/file.txt': 'template',
      });

      inquirerAnswers = {
        description: 'Test',
        author: 'Test',
        email: 'test@test.com',
        license: 'GPL-2.0-or-later',
      };

      // Will fail on template processing, but should not fail on config loading
      await expect(createCommand('component', 'com_test', {})).rejects.toThrow();

      // Should not have config-related error
      const errorCalls = consoleErrorSpy.mock.calls;
      const hasConfigError = errorCalls.some((call: any) => call[0]?.toLowerCase().includes('config'));
      expect(hasConfigError).toBe(false);
    });

    it('should handle existing jkit.config.json', async () => {
      const { createCommand } = await import('@/cli/create');

      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({
          author: 'Default Author',
          authorEmail: 'default@example.com',
          license: 'MIT',
          extensions: {},
        }),
        '/workspaces/joomla-devkit/dist/templates/extension/component/file.txt': 'template',
      });

      inquirerAnswers = {
        description: 'Test',
      };

      await expect(createCommand('component', 'com_test', {})).rejects.toThrow();

      // Should successfully read config (no error about it)
      const errorCalls = consoleErrorSpy.mock.calls;
      const hasConfigError = errorCalls.some((call: any) => call[0]?.includes?.('config'));
      expect(hasConfigError).toBe(false);
    });
  });

  describe('createCommand - options handling', () => {
    it('should accept author option', async () => {
      const { createCommand } = await import('@/cli/create');

      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
        '/workspaces/joomla-devkit/dist/templates/extension/component/file.txt': 'template',
      });

      inquirerAnswers = {
        description: 'Test',
      };

      await expect(
        createCommand('component', 'com_test', {
          author: 'Test Author',
          email: 'test@test.com',
          license: 'GPL-2.0-or-later',
        })
      ).rejects.toThrow();

      // No validation errors expected for valid options
      expect(processExitSpy).not.toHaveBeenCalledWith(1);
    });

    it('should accept email option', async () => {
      const { createCommand } = await import('@/cli/create');

      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
        '/workspaces/joomla-devkit/dist/templates/extension/component/file.txt': 'template',
      });

      inquirerAnswers = {
        description: 'Test',
      };

      await expect(
        createCommand('component', 'com_test', {
          author: 'Test',
          email: 'custom@example.com',
          license: 'GPL-2.0-or-later',
        })
      ).rejects.toThrow();

      expect(processExitSpy).not.toHaveBeenCalledWith(1);
    });

    it('should accept license option', async () => {
      const { createCommand } = await import('@/cli/create');

      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
        '/workspaces/joomla-devkit/dist/templates/extension/component/file.txt': 'template',
      });

      inquirerAnswers = {
        description: 'Test',
      };

      await expect(
        createCommand('component', 'com_test', {
          author: 'Test',
          email: 'test@test.com',
          license: 'MIT',
        })
      ).rejects.toThrow();

      expect(processExitSpy).not.toHaveBeenCalledWith(1);
    });

    it('should accept namespace option', async () => {
      const { createCommand } = await import('@/cli/create');

      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
        '/workspaces/joomla-devkit/dist/templates/extension/component/file.txt': 'template',
      });

      inquirerAnswers = {
        description: 'Test',
      };

      await expect(
        createCommand('component', 'com_test', {
          author: 'Test',
          email: 'test@test.com',
          license: 'GPL-2.0-or-later',
          namespace: 'Custom\\Namespace\\Component',
        })
      ).rejects.toThrow();

      expect(processExitSpy).not.toHaveBeenCalledWith(1);
    });

    it('should accept client option for modules', async () => {
      const { createCommand } = await import('@/cli/create');

      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
        '/workspaces/joomla-devkit/dist/templates/extension/module/file.txt': 'template',
      });

      inquirerAnswers = {
        description: 'Test',
      };

      await expect(
        createCommand('module', 'mod_test', {
          author: 'Test',
          email: 'test@test.com',
          license: 'GPL-2.0-or-later',
          client: 'administrator',
        })
      ).rejects.toThrow();

      expect(processExitSpy).not.toHaveBeenCalledWith(1);
    });

    it('should accept group option for plugins', async () => {
      const { createCommand } = await import('@/cli/create');

      vol.fromJSON({
        '/test/project/jkit.config.json': JSON.stringify({ extensions: {} }),
        '/workspaces/joomla-devkit/dist/templates/extension/plugin/file.txt': 'template',
      });

      inquirerAnswers = {
        description: 'Test',
      };

      await expect(
        createCommand('plugin', 'plg_test', {
          author: 'Test',
          email: 'test@test.com',
          license: 'GPL-2.0-or-later',
          group: 'system',
        })
      ).rejects.toThrow();

      expect(processExitSpy).not.toHaveBeenCalledWith(1);
    });
  });
});
