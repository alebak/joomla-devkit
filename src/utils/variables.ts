import type { ExtensionType, CreateExtensionOptions } from '../types/config.js';
import { sanitizeClassName, sanitizeFileName } from './validation.js';

/**
 * Base variables that are common to all extension types
 */
interface BaseVariables {
  AUTHOR: string;
  AUTHOR_EMAIL: string;
  AUTHOR_URL: string;
  COPYRIGHT: string;
  LICENSE: string;
  VERSION: string;
  DESCRIPTION: string;
  CREATION_DATE: string;
  NAMESPACE: string;
  PACKAGE_NAME: string;
  [key: string]: string;
}

/**
 * Component-specific variables
 */
export interface ComponentVariables extends BaseVariables {
  COM_NAME: string;
  COMPONENT_NAME: string;
  COMPONENT_CLASS: string;
  COMPONENT_UPPER: string;
  DEFAULT_VIEW: string;
  [key: string]: string;
}

/**
 * Module-specific variables
 */
export interface ModuleVariables extends BaseVariables {
  MOD_NAME: string;
  MODULE_NAME: string;
  MODULE_CLASS: string;
  MODULE_UPPER: string;
  CLIENT: string;
  CLIENT_CLASS: string;
  [key: string]: string;
}

/**
 * Plugin-specific variables
 */
export interface PluginVariables extends BaseVariables {
  PLG_NAME: string;
  PLUGIN_NAME: string;
  PLUGIN_CLASS: string;
  PLUGIN_UPPER: string;
  PLUGIN_GROUP: string;
  PLUGIN_GROUP_CLASS: string;
  PLUGIN_GROUP_UPPER: string;
  [key: string]: string;
}

/**
 * Template-specific variables
 */
export interface TemplateVariables extends BaseVariables {
  TEMPLATE_NAME: string;
  TEMPLATE_CLASS: string;
  TEMPLATE_UPPER: string;
  CLIENT: string;
  [key: string]: string;
}

/**
 * Library-specific variables
 */
export interface LibraryVariables extends BaseVariables {
  LIB_NAME: string;
  LIBRARY_NAME: string;
  LIBRARY_CLASS: string;
  LIBRARY_UPPER: string;
  [key: string]: string;
}

/**
 * Generates common base variables for all extension types
 *
 * @param options - Extension creation options
 * @returns Base variables object
 */
function generateBaseVariables(options: CreateExtensionOptions): BaseVariables {
  const currentDate = new Date();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return {
    AUTHOR: options.author || 'Your Name',
    AUTHOR_EMAIL: options.email || 'your.email@example.com',
    AUTHOR_URL: options.url || 'https://example.com',
    COPYRIGHT: `Copyright (C) ${currentDate.getFullYear()} ${options.author || 'Your Name'}. All rights reserved.`,
    LICENSE: options.license || 'GPL-2.0-or-later',
    VERSION: options.version || '1.0.0',
    DESCRIPTION: options.description || `${options.type} extension for Joomla`,
    CREATION_DATE: `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
    NAMESPACE: options.namespace || '',
    PACKAGE_NAME: options.packageName || sanitizeFileName(options.name),
  };
}

/**
 * Generates all variables for a component
 *
 * @param name - Component name (without com_ prefix)
 * @param options - Extension creation options
 * @returns Component variables object
 */
export function generateComponentVariables(
  name: string,
  options: CreateExtensionOptions
): ComponentVariables {
  const baseVars = generateBaseVariables(options);

  // Remove com_ prefix if present
  const cleanName = name.replace(/^com_/i, '');
  const className = sanitizeClassName(cleanName);
  const fileName = sanitizeFileName(cleanName);

  return {
    ...baseVars,
    COM_NAME: `COM_${cleanName.toUpperCase()}`,
    COMPONENT_NAME: `com_${fileName}`,
    COMPONENT_CLASS: className,
    COMPONENT_UPPER: cleanName.toUpperCase(),
    DEFAULT_VIEW: options.defaultView || 'items',
  };
}

/**
 * Generates all variables for a module
 *
 * @param name - Module name (without mod_ prefix)
 * @param options - Extension creation options
 * @returns Module variables object
 */
export function generateModuleVariables(
  name: string,
  options: CreateExtensionOptions
): ModuleVariables {
  const baseVars = generateBaseVariables(options);

  // Remove mod_ prefix if present
  const cleanName = name.replace(/^mod_/i, '');
  const className = sanitizeClassName(cleanName);
  const fileName = sanitizeFileName(cleanName);

  const client = options.client || 'site';
  const clientClass = client.charAt(0).toUpperCase() + client.slice(1).toLowerCase();

  return {
    ...baseVars,
    MOD_NAME: `MOD_${cleanName.toUpperCase()}`,
    MODULE_NAME: `mod_${fileName}`,
    MODULE_CLASS: className,
    MODULE_UPPER: cleanName.toUpperCase(),
    CLIENT: client,
    CLIENT_CLASS: clientClass,
  };
}

/**
 * Generates all variables for a plugin
 *
 * @param name - Plugin name
 * @param group - Plugin group (system, content, etc.)
 * @param options - Extension creation options
 * @returns Plugin variables object
 */
export function generatePluginVariables(
  name: string,
  group: string,
  options: CreateExtensionOptions
): PluginVariables {
  const baseVars = generateBaseVariables(options);

  // Remove plg_ prefix if present
  const cleanName = name.replace(/^plg_/i, '');
  const className = sanitizeClassName(cleanName);
  const fileName = sanitizeFileName(cleanName);

  const groupClass = sanitizeClassName(group);
  const groupUpper = group.toUpperCase();

  return {
    ...baseVars,
    PLG_NAME: `PLG_${groupUpper}_${cleanName.toUpperCase()}`,
    PLUGIN_NAME: fileName,
    PLUGIN_CLASS: className,
    PLUGIN_UPPER: cleanName.toUpperCase(),
    PLUGIN_GROUP: group.toLowerCase(),
    PLUGIN_GROUP_CLASS: groupClass,
    PLUGIN_GROUP_UPPER: groupUpper,
  };
}

/**
 * Generates all variables for a template
 *
 * @param name - Template name
 * @param options - Extension creation options
 * @returns Template variables object
 */
export function generateTemplateVariables(
  name: string,
  options: CreateExtensionOptions
): TemplateVariables {
  const baseVars = generateBaseVariables(options);

  // Remove tpl_ prefix if present
  const cleanName = name.replace(/^tpl_/i, '');
  const className = sanitizeClassName(cleanName);
  const fileName = sanitizeFileName(cleanName);

  const client = options.client || 'site';

  return {
    ...baseVars,
    TEMPLATE_NAME: fileName,
    TEMPLATE_CLASS: className,
    TEMPLATE_UPPER: cleanName.toUpperCase(),
    CLIENT: client,
  };
}

/**
 * Generates all variables for a library
 *
 * @param name - Library name
 * @param options - Extension creation options
 * @returns Library variables object
 */
export function generateLibraryVariables(
  name: string,
  options: CreateExtensionOptions
): LibraryVariables {
  const baseVars = generateBaseVariables(options);

  // Remove lib_ prefix if present
  const cleanName = name.replace(/^lib_/i, '');
  const className = sanitizeClassName(cleanName);
  const fileName = sanitizeFileName(cleanName);

  return {
    ...baseVars,
    LIB_NAME: className,
    LIBRARY_NAME: fileName,
    LIBRARY_CLASS: className,
    LIBRARY_UPPER: cleanName.toUpperCase(),
  };
}

/**
 * Generates variables based on extension type
 *
 * @param type - Extension type
 * @param name - Extension name
 * @param options - Extension creation options
 * @returns Variables object for the specified type
 */
export function generateVariables(
  type: ExtensionType,
  name: string,
  options: CreateExtensionOptions
): Record<string, string> {
  switch (type) {
    case 'component':
      return generateComponentVariables(name, options);
    case 'module':
      return generateModuleVariables(name, options);
    case 'plugin':
      if (!options.pluginGroup) {
        throw new Error('Plugin group is required for plugin extensions');
      }
      return generatePluginVariables(name, options.pluginGroup, options);
    case 'template':
      return generateTemplateVariables(name, options);
    case 'library':
      return generateLibraryVariables(name, options);
    default:
      throw new Error(`Unknown extension type: ${type}`);
  }
}
