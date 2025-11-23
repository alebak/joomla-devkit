/**
 * Extension utilities
 *
 * Shared utilities for extension discovery, type detection, and path resolution.
 */

import path from 'path';
import type { ExtensionType, JkitConfig, ExtensionConfig } from '../types/config.js';
import { pathExists } from './files.js';
import fs from 'fs/promises';

/**
 * Detect extension type from name prefix
 *
 * @param name - Extension name (e.g., "com_example", "mod_latest", "plg_system_myplugin")
 * @returns Extension type or null if prefix is not recognized
 *
 * @example
 * detectExtensionType('com_example') // 'component'
 * detectExtensionType('mod_latest') // 'module'
 * detectExtensionType('plg_system_example') // 'plugin'
 * detectExtensionType('pkg_myproject') // 'package'
 * detectExtensionType('invalid') // null
 */
export function detectExtensionType(name: string): ExtensionType | null {
  if (name.startsWith('com_')) return 'component';
  if (name.startsWith('mod_')) return 'module';
  if (name.startsWith('plg_')) return 'plugin';
  if (name.startsWith('tpl_')) return 'template';
  if (name.startsWith('lib_')) return 'library';
  if (name.startsWith('pkg_')) return 'package';
  return null;
}

/**
 * Find extension path and configuration
 *
 * Searches for an extension in the project and returns its path and configuration.
 * Supports both explicit configuration and auto-detection.
 *
 * @param extensionName - Extension name to find
 * @param config - Project configuration
 * @returns Extension path and config, or null if not found
 *
 * @example
 * const result = await findExtensionPath('com_example', config);
 * if (result) {
 *   console.log(result.path); // '/project/src/com_example'
 *   console.log(result.extensionConfig.type); // 'component'
 * }
 */
export async function findExtensionPath(
  extensionName: string,
  config: JkitConfig
): Promise<{ path: string; extensionConfig: ExtensionConfig } | null> {
  const srcDir = config.srcDir || config.extensionsDir || 'src';

  // Try direct path in flat structure (new approach)
  const directPath = path.join(process.cwd(), srcDir, extensionName);

  if (await pathExists(directPath)) {
    let extConfig = config.extensions[extensionName];

    // Auto-detect if not in config
    if (!extConfig) {
      const type = detectExtensionType(extensionName);
      if (!type) return null;

      // Generate default config
      extConfig = {
        type,
        name: extensionName,
        author: config.author,
        authorEmail: config.authorEmail,
        license: config.license || 'GPL-2.0-or-later',
        version: '1.0.0',
      };
    }

    return { path: directPath, extensionConfig: extConfig };
  }

  // Fallback: Try old nested structure (extensions/type/name) for backward compatibility
  if (config.extensions[extensionName]) {
    const extConfig = config.extensions[extensionName];
    const types: ExtensionType[] = ['component', 'module', 'plugin', 'template', 'library'];

    for (const type of types) {
      const nestedPath = path.join(process.cwd(), srcDir, type, extensionName);
      if (await pathExists(nestedPath)) {
        return { path: nestedPath, extensionConfig: extConfig };
      }
    }
  }

  // Also try type-based search for extensions not in config (backward compatibility)
  const type = detectExtensionType(extensionName);
  if (type) {
    const types: ExtensionType[] = ['component', 'module', 'plugin', 'template', 'library'];
    for (const searchType of types) {
      const nestedPath = path.join(process.cwd(), srcDir, searchType, extensionName);
      if (await pathExists(nestedPath)) {
        // Generate default config
        const extConfig: ExtensionConfig = {
          type,
          name: extensionName,
          author: config.author,
          authorEmail: config.authorEmail,
          license: config.license || 'GPL-2.0-or-later',
          version: '1.0.0',
        };
        return { path: nestedPath, extensionConfig: extConfig };
      }
    }
  }

  return null;
}

/**
 * List all extensions in source directory
 *
 * Scans the source directory and returns all valid extension names.
 * Only includes directories with recognized extension prefixes.
 *
 * @param config - Project configuration
 * @returns Array of extension names
 *
 * @example
 * const extensions = await listExtensions(config);
 * // ['com_example', 'mod_latest', 'plg_system_myplugin']
 */
export async function listExtensions(config: JkitConfig): Promise<string[]> {
  const srcDir = config.srcDir || config.extensionsDir || 'src';
  const srcPath = path.join(process.cwd(), srcDir);

  if (!(await pathExists(srcPath))) {
    return [];
  }

  try {
    const entries = await fs.readdir(srcPath, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isDirectory())
      .filter((entry) => detectExtensionType(entry.name) !== null)
      .map((entry) => entry.name);
  } catch (error) {
    return [];
  }
}

/**
 * Extract plugin group from plugin name
 *
 * Extracts the plugin group from a plugin name like "plg_system_myplugin".
 *
 * @param pluginName - Plugin name (e.g., "plg_system_myplugin")
 * @returns Plugin group or null if not a valid plugin name
 *
 * @example
 * extractPluginGroup('plg_system_example') // 'system'
 * extractPluginGroup('plg_content_vote') // 'content'
 * extractPluginGroup('com_example') // null
 */
export function extractPluginGroup(pluginName: string): string | null {
  if (!pluginName.startsWith('plg_')) {
    return null;
  }

  const match = pluginName.match(/^plg_([^_]+)_/);
  return match && match[1] ? match[1] : null;
}
