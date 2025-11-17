/**
 * Joomla manifest (XML) structure types
 *
 * These types represent the structure of Joomla extension manifest files.
 */

/**
 * Base manifest fields common to all extension types
 */
export interface BaseManifest {
  /** Extension name */
  name: string;

  /** Extension description */
  description: string;

  /** Extension version */
  version: string;

  /** Author name */
  author: string;

  /** Author email */
  authorEmail?: string;

  /** Author URL */
  authorUrl?: string;

  /** Copyright information */
  copyright?: string;

  /** License */
  license: string;

  /** Creation date (YYYY-MM-DD or Month YYYY) */
  creationDate: string;
}

/**
 * Component manifest structure
 */
export interface ComponentManifest extends BaseManifest {
  type: 'component';

  /** Namespace for autoloading */
  namespace?: string;

  /** Administration files */
  administration?: {
    files?: string[];
    folder?: string;
  };

  /** Site files */
  site?: {
    files?: string[];
    folder?: string;
  };

  /** Media files */
  media?: {
    folder?: string;
    files?: string[];
  };

  /** Language files */
  languages?: {
    folder?: string;
    files?: Array<{
      tag: string;
      file: string;
    }>;
  };
}

/**
 * Module manifest structure
 */
export interface ModuleManifest extends BaseManifest {
  type: 'module';

  /** Client side */
  client: 'site' | 'administrator';

  /** Module files */
  files?: string[];

  /** Language files */
  languages?: Array<{
    tag: string;
    file: string;
  }>;

  /** Module parameters */
  config?: {
    fields?: Array<{
      name: string;
      type: string;
      label?: string;
      description?: string;
      default?: string;
    }>;
  };
}

/**
 * Plugin manifest structure
 */
export interface PluginManifest extends BaseManifest {
  type: 'plugin';

  /** Plugin group */
  group: string;

  /** Plugin files */
  files?: string[];

  /** Language files */
  languages?: Array<{
    tag: string;
    file: string;
  }>;

  /** Plugin parameters */
  config?: {
    fields?: Array<{
      name: string;
      type: string;
      label?: string;
      description?: string;
      default?: string;
    }>;
  };
}

/**
 * Template manifest structure
 */
export interface TemplateManifest extends BaseManifest {
  type: 'template';

  /** Client side */
  client: 'site' | 'administrator';

  /** Template files */
  files?: string[];

  /** Template positions */
  positions?: string[];

  /** Language files */
  languages?: Array<{
    tag: string;
    file: string;
  }>;
}

/**
 * Library manifest structure
 */
export interface LibraryManifest extends BaseManifest {
  type: 'library';

  /** Library name (used in paths) */
  libraryname: string;

  /** Library files */
  files?: string[];

  /** Folder structure */
  folder?: string;
}

/**
 * Union type for all manifest types
 */
export type Manifest =
  | ComponentManifest
  | ModuleManifest
  | PluginManifest
  | TemplateManifest
  | LibraryManifest;

/**
 * Manifest generator options
 */
export interface ManifestGeneratorOptions {
  /** Extension configuration */
  extension: {
    type: string;
    name: string;
    description?: string;
    version?: string;
    author?: string;
    authorEmail?: string;
    authorUrl?: string;
    copyright?: string;
    license?: string;
  };

  /** Files to include */
  files?: string[];

  /** Additional manifest data */
  additional?: Record<string, unknown>;
}
