import path from 'path';
import type { UserConfig } from 'vite';
import type { ExtensionType, ExtensionConfig } from '../types/config.js';

/**
 * Options for generating Vite configuration
 */
export interface ViteConfigOptions {
  /** Extension type */
  extensionType: ExtensionType;
  /** Extension name */
  extensionName: string;
  /** Extension configuration */
  extensionConfig: ExtensionConfig;
  /** Source directory path */
  sourcePath: string;
  /** Output directory path */
  outDir: string;
  /** Development mode */
  mode?: 'development' | 'production';
  /** Port for dev server */
  port?: number;
}

/**
 * Generates Vite configuration for a Joomla extension
 *
 * @param options - Vite configuration options
 * @returns Vite UserConfig object
 */
export function generateViteConfig(options: ViteConfigOptions): UserConfig {
  const {
    extensionType,
    extensionName,
    extensionConfig,
    sourcePath,
    outDir,
    mode = 'development',
    port = 5173,
  } = options;

  // Determine entry points based on extension type
  const entryPoints = getEntryPoints(extensionType, extensionName, sourcePath, extensionConfig);

  const config: UserConfig = {
    mode,
    root: sourcePath,
    base: './',

    // Build configuration
    build: {
      outDir,
      emptyOutDir: false, // Don't delete PHP files
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'esbuild' : false,
      rollupOptions: {
        input: entryPoints,
        output: {
          entryFileNames: mode === 'production' ? 'js/[name].min.js' : 'js/[name].js',
          chunkFileNames: mode === 'production' ? 'js/[name]-[hash].min.js' : 'js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name || '';
            if (/\.(css)$/.test(info)) {
              return mode === 'production' ? 'css/[name].min[extname]' : 'css/[name][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
      // Target modern browsers
      target: 'es2015',
      cssMinify: mode === 'production',
    },

    // Development server
    server: {
      port,
      strictPort: false,
      open: false,
      cors: true,
      hmr: {
        overlay: true,
      },
    },

    // CSS configuration
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          additionalData: `$env: ${mode};`,
        },
      },
    },

    // Resolve configuration
    resolve: {
      alias: {
        '@': path.resolve(sourcePath, 'src'),
      },
    },

    // Plugin configuration (can be extended)
    plugins: [],
  };

  // Merge with extension-specific Vite config if provided
  if (extensionConfig.vite) {
    return mergeViteConfig(config, extensionConfig.vite);
  }

  return config;
}

/**
 * Gets entry points for an extension based on its type
 *
 * @param type - Extension type
 * @param name - Extension name
 * @param sourcePath - Source path
 * @param config - Extension configuration
 * @returns Entry points object
 */
function getEntryPoints(
  type: ExtensionType,
  name: string,
  sourcePath: string,
  config: ExtensionConfig
): Record<string, string> {
  const entries: Record<string, string> = {};

  // Use custom entry points if provided
  if (config.entryPoints) {
    if (config.entryPoints.main) {
      entries.main = path.resolve(sourcePath, config.entryPoints.main);
    }
    if (config.entryPoints.css) {
      entries.css = path.resolve(sourcePath, config.entryPoints.css);
    }
    if (config.entryPoints.admin) {
      entries.admin = path.resolve(sourcePath, config.entryPoints.admin);
    }
    // Add any additional custom entry points
    for (const [key, value] of Object.entries(config.entryPoints)) {
      if (key !== 'main' && key !== 'css' && key !== 'admin' && value) {
        entries[key] = path.resolve(sourcePath, value);
      }
    }
    return entries;
  }

  // Default entry points based on extension type
  switch (type) {
    case 'component': {
      // Components typically have media files
      const jsPath = path.resolve(sourcePath, 'media', 'js', `${name}.ts`);
      const cssPath = path.resolve(sourcePath, 'media', 'css', `${name}.scss`);
      entries[name] = jsPath;
      entries[`${name}-css`] = cssPath;
      break;
    }

    case 'module': {
      // Modules may have media files
      const jsPath = path.resolve(sourcePath, 'media', 'js', `${name}.ts`);
      const cssPath = path.resolve(sourcePath, 'media', 'css', `${name}.scss`);
      entries[name] = jsPath;
      entries[`${name}-css`] = cssPath;
      break;
    }

    case 'plugin': {
      // Plugins may have media files
      const jsPath = path.resolve(sourcePath, 'media', 'js', `${name}.ts`);
      const cssPath = path.resolve(sourcePath, 'media', 'css', `${name}.scss`);
      entries[name] = jsPath;
      entries[`${name}-css`] = cssPath;
      break;
    }

    case 'template': {
      // Templates have their own structure
      const jsPath = path.resolve(sourcePath, 'js', 'template.ts');
      const cssPath = path.resolve(sourcePath, 'scss', 'template.scss');
      entries.template = jsPath;
      entries['template-css'] = cssPath;
      break;
    }

    case 'library': {
      // Libraries may have media files
      const jsPath = path.resolve(sourcePath, 'media', 'js', `${name}.ts`);
      const cssPath = path.resolve(sourcePath, 'media', 'css', `${name}.scss`);
      entries[name] = jsPath;
      entries[`${name}-css`] = cssPath;
      break;
    }
  }

  return entries;
}

/**
 * Deep merges two Vite configurations
 *
 * @param base - Base configuration
 * @param override - Override configuration
 * @returns Merged configuration
 */
function mergeViteConfig(base: UserConfig, override: UserConfig): UserConfig {
  return {
    ...base,
    ...override,
    build: {
      ...base.build,
      ...override.build,
      rollupOptions: {
        ...(base.build?.rollupOptions || {}),
        ...(override.build?.rollupOptions || {}),
      },
    },
    server: {
      ...base.server,
      ...override.server,
    },
    css: {
      ...base.css,
      ...override.css,
    },
    resolve: {
      ...base.resolve,
      ...override.resolve,
    },
    plugins: [...(base.plugins || []), ...(override.plugins || [])],
  };
}

/**
 * Writes Vite configuration to a file
 *
 * @param config - Vite configuration
 * @param outputPath - Path to write configuration file
 * @returns Configuration file content
 */
export function generateViteConfigFile(config: UserConfig): string {
  return `import { defineConfig } from 'vite';

export default defineConfig(${JSON.stringify(config, null, 2)});
`;
}
