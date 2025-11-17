/**
 * jkit configuration types
 *
 * These types define the structure of jkit.config.js files
 * used in Joomla extension projects.
 */

import type { UserConfig as ViteConfig } from 'vite';

/**
 * Extension types supported by jkit
 */
export type ExtensionType = 'component' | 'module' | 'plugin' | 'template' | 'library';

/**
 * Joomla versions supported by jkit
 */
export type JoomlaVersion = '3.10' | '4.0' | '4.1' | '4.2' | '4.3' | '4.4' | '5.0' | '5.1';

/**
 * Configuration for a specific extension
 */
export interface ExtensionConfig {
  /** Extension type */
  type: ExtensionType;

  /** Extension name (e.g., "com_example" for component) */
  name: string;

  /** Author name */
  author?: string;

  /** Author email */
  authorEmail?: string;

  /** Author URL */
  authorUrl?: string;

  /** Copyright information */
  copyright?: string;

  /** License */
  license?: string;

  /** Extension version */
  version?: string;

  /** Extension description */
  description?: string;

  /** Entry points for assets */
  entryPoints?: {
    /** Main JavaScript entry */
    main?: string;
    /** Main CSS entry */
    css?: string;
    /** Admin JavaScript entry (for components) */
    admin?: string;
    /** Additional entries */
    [key: string]: string | undefined;
  };

  /** Plugin-specific configuration */
  plugin?: {
    /** Plugin group (e.g., "system", "content", "user") */
    group: string;
  };

  /** Module-specific configuration */
  module?: {
    /** Module position */
    position?: string;
    /** Client side (site/administrator) */
    client?: 'site' | 'administrator';
  };

  /** Custom Vite configuration for this extension */
  vite?: ViteConfig;
}

/**
 * Main jkit configuration
 */
export interface JkitConfig {
  /** Joomla version */
  joomlaVersion: JoomlaVersion;

  /** Default author name */
  author: string;

  /** Default author email */
  authorEmail: string;

  /** Default author URL */
  authorUrl?: string;

  /** Default copyright */
  copyright?: string;

  /** Default license */
  license: string;

  /** Extensions configuration */
  extensions: Record<string, ExtensionConfig>;

  /** Global Vite configuration */
  vite?: ViteConfig;

  /** Build output directory */
  outDir?: string;

  /** Source directory */
  srcDir?: string;

  /** Extensions directory */
  extensionsDir?: string;
}

/**
 * Options for initializing a new project
 */
export interface InitProjectOptions {
  /** Project name */
  name: string;

  /** Joomla version */
  joomlaVersion: JoomlaVersion;

  /** Author name */
  author: string;

  /** Author email */
  authorEmail: string;

  /** Setup Dev Container */
  useDevContainer: boolean;
}

/**
 * Options for creating a new extension
 */
export interface CreateExtensionOptions {
  /** Extension type */
  type: ExtensionType;

  /** Extension name */
  name: string;

  /** Author name */
  author?: string;

  /** Author email */
  email?: string;

  /** License */
  license?: string;

  /** Plugin group (for plugins only) */
  group?: string;

  /** Module position (for modules only) */
  position?: string;

  /** Client side (for modules only) */
  client?: 'site' | 'administrator';
}
