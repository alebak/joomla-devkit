/**
 * Tests for extensions.ts utility functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { vol } from 'memfs';
import type { JkitConfig } from '@/types/config';

// Mock fs/promises module
vi.mock('fs/promises', () => ({
  default: {
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
    access: vi.fn(async (path: string) => {
      if (!vol.existsSync(path)) {
        throw new Error('ENOENT');
      }
    }),
  },
}));

describe('extensions.ts', () => {
  beforeEach(() => {
    vol.reset();
    vi.clearAllMocks();
  });

  describe('detectExtensionType', () => {
    it('should detect component from com_ prefix', async () => {
      const { detectExtensionType } = await import('@/utils/extensions');

      expect(detectExtensionType('com_example')).toBe('component');
      expect(detectExtensionType('com_store')).toBe('component');
      expect(detectExtensionType('com_blog')).toBe('component');
    });

    it('should detect module from mod_ prefix', async () => {
      const { detectExtensionType } = await import('@/utils/extensions');

      expect(detectExtensionType('mod_latest')).toBe('module');
      expect(detectExtensionType('mod_cart')).toBe('module');
      expect(detectExtensionType('mod_custom')).toBe('module');
    });

    it('should detect plugin from plg_ prefix', async () => {
      const { detectExtensionType } = await import('@/utils/extensions');

      expect(detectExtensionType('plg_system_example')).toBe('plugin');
      expect(detectExtensionType('plg_content_vote')).toBe('plugin');
      expect(detectExtensionType('plg_authentication_ldap')).toBe('plugin');
    });

    it('should detect template from tpl_ prefix', async () => {
      const { detectExtensionType } = await import('@/utils/extensions');

      expect(detectExtensionType('tpl_mytemplate')).toBe('template');
      expect(detectExtensionType('tpl_custom')).toBe('template');
    });

    it('should detect library from lib_ prefix', async () => {
      const { detectExtensionType } = await import('@/utils/extensions');

      expect(detectExtensionType('lib_mylib')).toBe('library');
      expect(detectExtensionType('lib_framework')).toBe('library');
    });

    it('should detect package from pkg_ prefix', async () => {
      const { detectExtensionType } = await import('@/utils/extensions');

      expect(detectExtensionType('pkg_myproject')).toBe('package');
      expect(detectExtensionType('pkg_ecommerce')).toBe('package');
    });

    it('should return null for invalid names', async () => {
      const { detectExtensionType } = await import('@/utils/extensions');

      expect(detectExtensionType('invalid')).toBe(null);
      expect(detectExtensionType('test')).toBe(null);
      expect(detectExtensionType('example')).toBe(null);
      expect(detectExtensionType('')).toBe(null);
    });

    it('should be case sensitive for prefixes', async () => {
      const { detectExtensionType } = await import('@/utils/extensions');

      expect(detectExtensionType('COM_EXAMPLE')).toBe(null);
      expect(detectExtensionType('Com_example')).toBe(null);
      expect(detectExtensionType('com_example')).toBe('component');
    });
  });

  describe('findExtensionPath', () => {
    it('should find extension in flat structure', async () => {
      const { findExtensionPath } = await import('@/utils/extensions');

      vol.fromJSON({
        '/project/src/com_example/manifest.xml': 'content',
      });

      const config: JkitConfig = {
        joomlaVersion: '5.0',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        license: 'GPL-2.0-or-later',
        srcDir: 'src',
        extensions: {},
      };

      // Mock process.cwd()
      const originalCwd = process.cwd;
      process.cwd = () => '/project';

      const result = await findExtensionPath('com_example', config);

      process.cwd = originalCwd;

      expect(result).not.toBe(null);
      expect(result?.path).toBe('/project/src/com_example');
      expect(result?.extensionConfig.type).toBe('component');
      expect(result?.extensionConfig.name).toBe('com_example');
    });

    it('should use extension from config if available', async () => {
      const { findExtensionPath } = await import('@/utils/extensions');

      vol.fromJSON({
        '/project/src/com_example/manifest.xml': 'content',
      });

      const config: JkitConfig = {
        joomlaVersion: '5.0',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        license: 'GPL-2.0-or-later',
        srcDir: 'src',
        extensions: {
          com_example: {
            type: 'component',
            name: 'com_example',
            author: 'Custom Author',
            authorEmail: 'custom@example.com',
            version: '2.0.0',
            description: 'Custom description',
          },
        },
      };

      const originalCwd = process.cwd;
      process.cwd = () => '/project';

      const result = await findExtensionPath('com_example', config);

      process.cwd = originalCwd;

      expect(result).not.toBe(null);
      expect(result?.extensionConfig.author).toBe('Custom Author');
      expect(result?.extensionConfig.version).toBe('2.0.0');
      expect(result?.extensionConfig.description).toBe('Custom description');
    });

    it('should auto-generate config for extensions not in config', async () => {
      const { findExtensionPath } = await import('@/utils/extensions');

      vol.fromJSON({
        '/project/src/mod_latest/manifest.xml': 'content',
      });

      const config: JkitConfig = {
        joomlaVersion: '5.0',
        author: 'Project Author',
        authorEmail: 'project@example.com',
        license: 'MIT',
        srcDir: 'src',
        extensions: {},
      };

      const originalCwd = process.cwd;
      process.cwd = () => '/project';

      const result = await findExtensionPath('mod_latest', config);

      process.cwd = originalCwd;

      expect(result).not.toBe(null);
      expect(result?.extensionConfig.type).toBe('module');
      expect(result?.extensionConfig.author).toBe('Project Author');
      expect(result?.extensionConfig.authorEmail).toBe('project@example.com');
      expect(result?.extensionConfig.license).toBe('MIT');
      expect(result?.extensionConfig.version).toBe('1.0.0');
    });

    it('should support old nested structure for backward compatibility', async () => {
      const { findExtensionPath } = await import('@/utils/extensions');

      vol.fromJSON({
        '/project/extensions/component/com_example/manifest.xml': 'content',
      });

      const config: JkitConfig = {
        joomlaVersion: '5.0',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        license: 'GPL-2.0-or-later',
        extensionsDir: 'extensions',
        extensions: {
          com_example: {
            type: 'component',
            name: 'com_example',
          },
        },
      };

      const originalCwd = process.cwd;
      process.cwd = () => '/project';

      const result = await findExtensionPath('com_example', config);

      process.cwd = originalCwd;

      expect(result).not.toBe(null);
      expect(result?.path).toBe('/project/extensions/component/com_example');
    });

    it('should return null if extension not found', async () => {
      const { findExtensionPath } = await import('@/utils/extensions');

      const config: JkitConfig = {
        joomlaVersion: '5.0',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        license: 'GPL-2.0-or-later',
        srcDir: 'src',
        extensions: {},
      };

      const originalCwd = process.cwd;
      process.cwd = () => '/project';

      const result = await findExtensionPath('com_nonexistent', config);

      process.cwd = originalCwd;

      expect(result).toBe(null);
    });

    it('should return null for invalid extension names', async () => {
      const { findExtensionPath } = await import('@/utils/extensions');

      vol.fromJSON({
        '/project/src/invalid/manifest.xml': 'content',
      });

      const config: JkitConfig = {
        joomlaVersion: '5.0',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        license: 'GPL-2.0-or-later',
        srcDir: 'src',
        extensions: {},
      };

      const originalCwd = process.cwd;
      process.cwd = () => '/project';

      const result = await findExtensionPath('invalid', config);

      process.cwd = originalCwd;

      expect(result).toBe(null);
    });
  });

  describe('listExtensions', () => {
    it('should list all extensions in src directory', async () => {
      const { listExtensions } = await import('@/utils/extensions');

      vol.fromJSON({
        '/project/src/com_example/manifest.xml': 'content',
        '/project/src/mod_latest/manifest.xml': 'content',
        '/project/src/plg_system_example/manifest.xml': 'content',
      });

      const config: JkitConfig = {
        joomlaVersion: '5.0',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        license: 'GPL-2.0-or-later',
        srcDir: 'src',
        extensions: {},
      };

      const originalCwd = process.cwd;
      process.cwd = () => '/project';

      const result = await listExtensions(config);

      process.cwd = originalCwd;

      expect(result).toHaveLength(3);
      expect(result).toContain('com_example');
      expect(result).toContain('mod_latest');
      expect(result).toContain('plg_system_example');
    });

    it('should only include directories with valid prefixes', async () => {
      const { listExtensions } = await import('@/utils/extensions');

      vol.fromJSON({
        '/project/src/com_example/manifest.xml': 'content',
        '/project/src/invalid/manifest.xml': 'content',
        '/project/src/test/manifest.xml': 'content',
        '/project/src/mod_latest/manifest.xml': 'content',
      });

      const config: JkitConfig = {
        joomlaVersion: '5.0',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        license: 'GPL-2.0-or-later',
        srcDir: 'src',
        extensions: {},
      };

      const originalCwd = process.cwd;
      process.cwd = () => '/project';

      const result = await listExtensions(config);

      process.cwd = originalCwd;

      expect(result).toHaveLength(2);
      expect(result).toContain('com_example');
      expect(result).toContain('mod_latest');
      expect(result).not.toContain('invalid');
      expect(result).not.toContain('test');
    });

    it('should return empty array if src directory does not exist', async () => {
      const { listExtensions } = await import('@/utils/extensions');

      const config: JkitConfig = {
        joomlaVersion: '5.0',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        license: 'GPL-2.0-or-later',
        srcDir: 'src',
        extensions: {},
      };

      const originalCwd = process.cwd;
      process.cwd = () => '/project';

      const result = await listExtensions(config);

      process.cwd = originalCwd;

      expect(result).toEqual([]);
    });

    it('should return empty array if src directory is empty', async () => {
      const { listExtensions } = await import('@/utils/extensions');

      vol.fromJSON({
        '/project/src/.gitkeep': '',
      });

      const config: JkitConfig = {
        joomlaVersion: '5.0',
        author: 'Test Author',
        authorEmail: 'test@example.com',
        license: 'GPL-2.0-or-later',
        srcDir: 'src',
        extensions: {},
      };

      const originalCwd = process.cwd;
      process.cwd = () => '/project';

      const result = await listExtensions(config);

      process.cwd = originalCwd;

      expect(result).toEqual([]);
    });
  });

  describe('extractPluginGroup', () => {
    it('should extract plugin group from plugin name', async () => {
      const { extractPluginGroup } = await import('@/utils/extensions');

      expect(extractPluginGroup('plg_system_example')).toBe('system');
      expect(extractPluginGroup('plg_content_vote')).toBe('content');
      expect(extractPluginGroup('plg_authentication_ldap')).toBe('authentication');
      expect(extractPluginGroup('plg_editors_codemirror')).toBe('editors');
    });

    it('should return null for non-plugin names', async () => {
      const { extractPluginGroup } = await import('@/utils/extensions');

      expect(extractPluginGroup('com_example')).toBe(null);
      expect(extractPluginGroup('mod_latest')).toBe(null);
      expect(extractPluginGroup('tpl_template')).toBe(null);
      expect(extractPluginGroup('invalid')).toBe(null);
    });

    it('should return null for malformed plugin names', async () => {
      const { extractPluginGroup } = await import('@/utils/extensions');

      expect(extractPluginGroup('plg_')).toBe(null);
      expect(extractPluginGroup('plg_system')).toBe(null);
      expect(extractPluginGroup('plg__example')).toBe(null);
    });
  });
});
