/**
 * Tests for vite-config.ts utility functions
 */

import { describe, it, expect } from 'vitest';
import { generateViteConfig, generateViteConfigFile } from '@/utils/vite-config';
import type { ViteConfigOptions } from '@/utils/vite-config';
import type { ExtensionConfig } from '@/types/config';

describe('vite-config.ts', () => {
  const baseConfig: ExtensionConfig = {
    name: 'testextension',
    type: 'component',
    namespace: 'Test\\Component\\TestExtension',
    description: 'Test extension',
    author: 'Test Author',
    authorEmail: 'test@example.com',
    authorUrl: 'https://example.com',
    version: '1.0.0',
    license: 'GPL-2.0-or-later',
    copyright: 'Copyright (C) 2025 Test Author',
  };

  describe('generateViteConfig', () => {
    describe('basic configuration', () => {
      it('should generate basic Vite config for development mode', () => {
        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test/path',
          outDir: '/test/out',
          mode: 'development',
          port: 5173,
        };

        const config = generateViteConfig(options);

        expect(config.mode).toBe('development');
        expect(config.root).toBe('/test/path');
        expect(config.base).toBe('./');
        expect(config.build?.outDir).toBe('/test/out');
        expect(config.build?.sourcemap).toBe(true);
        expect(config.build?.minify).toBe(false);
        expect(config.server?.port).toBe(5173);
      });

      it('should generate basic Vite config for production mode', () => {
        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test/path',
          outDir: '/test/out',
          mode: 'production',
        };

        const config = generateViteConfig(options);

        expect(config.mode).toBe('production');
        expect(config.build?.sourcemap).toBe(false);
        expect(config.build?.minify).toBe('esbuild');
        expect(config.build?.cssMinify).toBe(true);
      });

      it('should default to development mode when mode is not specified', () => {
        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test/path',
          outDir: '/test/out',
        };

        const config = generateViteConfig(options);

        expect(config.mode).toBe('development');
        expect(config.build?.minify).toBe(false);
      });

      it('should default to port 5173 when port is not specified', () => {
        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test/path',
          outDir: '/test/out',
        };

        const config = generateViteConfig(options);

        expect(config.server?.port).toBe(5173);
      });
    });

    describe('build configuration', () => {
      it('should configure output file names for production', () => {
        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test/path',
          outDir: '/test/out',
          mode: 'production',
        };

        const config = generateViteConfig(options);

        expect(config.build?.rollupOptions?.output).toBeDefined();
        const output = config.build?.rollupOptions?.output as any;
        expect(output.entryFileNames).toBe('js/[name].min.js');
        expect(output.chunkFileNames).toBe('js/[name]-[hash].min.js');
      });

      it('should configure output file names for development', () => {
        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test/path',
          outDir: '/test/out',
          mode: 'development',
        };

        const config = generateViteConfig(options);

        const output = config.build?.rollupOptions?.output as any;
        expect(output.entryFileNames).toBe('js/[name].js');
        expect(output.chunkFileNames).toBe('js/[name]-[hash].js');
      });

      it('should configure asset file names correctly', () => {
        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test/path',
          outDir: '/test/out',
          mode: 'production',
        };

        const config = generateViteConfig(options);

        const output = config.build?.rollupOptions?.output as any;
        const assetFileNames = output.assetFileNames;

        // Test CSS file pattern
        expect(assetFileNames({ name: 'style.css' })).toBe('css/[name].min[extname]');
        // Test other asset pattern
        expect(assetFileNames({ name: 'image.png' })).toBe('assets/[name]-[hash][extname]');
      });

      it('should not empty output directory', () => {
        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test/path',
          outDir: '/test/out',
        };

        const config = generateViteConfig(options);

        expect(config.build?.emptyOutDir).toBe(false);
      });

      it('should target ES2015', () => {
        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test/path',
          outDir: '/test/out',
        };

        const config = generateViteConfig(options);

        expect(config.build?.target).toBe('es2015');
      });
    });

    describe('server configuration', () => {
      it('should configure development server', () => {
        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test/path',
          outDir: '/test/out',
          port: 3000,
        };

        const config = generateViteConfig(options);

        expect(config.server?.port).toBe(3000);
        expect(config.server?.strictPort).toBe(false);
        expect(config.server?.open).toBe(false);
        expect(config.server?.cors).toBe(true);
        expect(config.server?.hmr).toEqual({ overlay: true });
      });
    });

    describe('CSS configuration', () => {
      it('should configure CSS preprocessing', () => {
        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test/path',
          outDir: '/test/out',
          mode: 'production',
        };

        const config = generateViteConfig(options);

        expect(config.css?.devSourcemap).toBe(true);
        expect(config.css?.preprocessorOptions?.scss?.additionalData).toBe('$env: production;');
      });

      it('should include environment in SCSS preprocessor', () => {
        const devOptions: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test/path',
          outDir: '/test/out',
          mode: 'development',
        };

        const devConfig = generateViteConfig(devOptions);
        expect(devConfig.css?.preprocessorOptions?.scss?.additionalData).toBe(
          '$env: development;'
        );
      });
    });

    describe('resolve configuration', () => {
      it('should configure path alias', () => {
        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test/path',
          outDir: '/test/out',
        };

        const config = generateViteConfig(options);

        expect(config.resolve?.alias).toBeDefined();
        expect((config.resolve?.alias as any)['@']).toContain('/test/path/src');
      });
    });

    describe('entry points', () => {
      it('should generate default entry points for component', () => {
        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: baseConfig,
          sourcePath: '/test',
          outDir: '/test/out',
        };

        const config = generateViteConfig(options);
        const input = config.build?.rollupOptions?.input as Record<string, string>;

        expect(input['com_test']).toContain('/test/media/js/com_test.ts');
        expect(input['com_test-css']).toContain('/test/media/css/com_test.scss');
      });

      it('should generate default entry points for module', () => {
        const options: ViteConfigOptions = {
          extensionType: 'module',
          extensionName: 'mod_test',
          extensionConfig: { ...baseConfig, type: 'module' },
          sourcePath: '/test',
          outDir: '/test/out',
        };

        const config = generateViteConfig(options);
        const input = config.build?.rollupOptions?.input as Record<string, string>;

        expect(input['mod_test']).toContain('/test/media/js/mod_test.ts');
        expect(input['mod_test-css']).toContain('/test/media/css/mod_test.scss');
      });

      it('should generate default entry points for plugin', () => {
        const options: ViteConfigOptions = {
          extensionType: 'plugin',
          extensionName: 'plg_test',
          extensionConfig: { ...baseConfig, type: 'plugin' },
          sourcePath: '/test',
          outDir: '/test/out',
        };

        const config = generateViteConfig(options);
        const input = config.build?.rollupOptions?.input as Record<string, string>;

        expect(input['plg_test']).toContain('/test/media/js/plg_test.ts');
        expect(input['plg_test-css']).toContain('/test/media/css/plg_test.scss');
      });

      it('should generate default entry points for template', () => {
        const options: ViteConfigOptions = {
          extensionType: 'template',
          extensionName: 'tpl_test',
          extensionConfig: { ...baseConfig, type: 'template' },
          sourcePath: '/test',
          outDir: '/test/out',
        };

        const config = generateViteConfig(options);
        const input = config.build?.rollupOptions?.input as Record<string, string>;

        expect(input['template']).toContain('/test/js/template.ts');
        expect(input['template-css']).toContain('/test/scss/template.scss');
      });

      it('should generate default entry points for library', () => {
        const options: ViteConfigOptions = {
          extensionType: 'library',
          extensionName: 'lib_test',
          extensionConfig: { ...baseConfig, type: 'library' },
          sourcePath: '/test',
          outDir: '/test/out',
        };

        const config = generateViteConfig(options);
        const input = config.build?.rollupOptions?.input as Record<string, string>;

        expect(input['lib_test']).toContain('/test/media/js/lib_test.ts');
        expect(input['lib_test-css']).toContain('/test/media/css/lib_test.scss');
      });

      it('should use custom entry points when provided', () => {
        const customConfig: ExtensionConfig = {
          ...baseConfig,
          entryPoints: {
            main: 'custom/main.ts',
            css: 'custom/style.scss',
            admin: 'custom/admin.ts',
          },
        };

        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: customConfig,
          sourcePath: '/test',
          outDir: '/test/out',
        };

        const config = generateViteConfig(options);
        const input = config.build?.rollupOptions?.input as Record<string, string>;

        expect(input.main).toContain('/test/custom/main.ts');
        expect(input.css).toContain('/test/custom/style.scss');
        expect(input.admin).toContain('/test/custom/admin.ts');
      });

      it('should include additional custom entry points', () => {
        const customConfig: ExtensionConfig = {
          ...baseConfig,
          entryPoints: {
            main: 'main.ts',
            frontend: 'frontend.ts',
            backend: 'backend.ts',
          },
        };

        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: customConfig,
          sourcePath: '/test',
          outDir: '/test/out',
        };

        const config = generateViteConfig(options);
        const input = config.build?.rollupOptions?.input as Record<string, string>;

        expect(input.frontend).toContain('/test/frontend.ts');
        expect(input.backend).toContain('/test/backend.ts');
      });
    });

    describe('config merging', () => {
      it('should merge custom Vite config', () => {
        const customConfig: ExtensionConfig = {
          ...baseConfig,
          vite: {
            server: {
              port: 8080,
              host: 'localhost',
            },
            build: {
              target: 'esnext',
            },
          },
        };

        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: customConfig,
          sourcePath: '/test',
          outDir: '/test/out',
          port: 5173,
        };

        const config = generateViteConfig(options);

        expect(config.server?.port).toBe(8080);
        expect((config.server as any).host).toBe('localhost');
        expect(config.build?.target).toBe('esnext');
      });

      it('should preserve plugins from both configs', () => {
        const mockPlugin1 = { name: 'plugin1' };
        const mockPlugin2 = { name: 'plugin2' };

        const customConfig: ExtensionConfig = {
          ...baseConfig,
          vite: {
            plugins: [mockPlugin2],
          },
        };

        const options: ViteConfigOptions = {
          extensionType: 'component',
          extensionName: 'com_test',
          extensionConfig: customConfig,
          sourcePath: '/test',
          outDir: '/test/out',
        };

        const config = generateViteConfig(options);

        expect(config.plugins).toEqual([mockPlugin2]);
      });
    });
  });

  describe('generateViteConfigFile', () => {
    it('should generate Vite config file content', () => {
      const config = {
        mode: 'development',
        root: '/test',
        build: {
          outDir: '/test/out',
        },
      };

      const content = generateViteConfigFile(config);

      expect(content).toContain("import { defineConfig } from 'vite'");
      expect(content).toContain('export default defineConfig(');
      expect(content).toContain('"mode": "development"');
      expect(content).toContain('"root": "/test"');
      expect(content).toContain('"outDir": "/test/out"');
    });

    it('should format JSON with proper indentation', () => {
      const config = {
        mode: 'production',
        build: {
          minify: true,
        },
      };

      const content = generateViteConfigFile(config);

      expect(content).toContain('  "mode"');
      expect(content).toContain('  "build"');
      expect(content).toContain('    "minify"');
    });
  });
});
