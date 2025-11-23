import type { ExtensionType } from '../types/config.js';

/**
 * Validates an extension name based on Joomla naming conventions
 *
 * @param name - The extension name to validate
 * @param type - The type of extension
 * @returns True if valid, false otherwise
 */
export function validateExtensionName(name: string, type: ExtensionType): boolean {
  if (!name || name.trim().length === 0) {
    return false;
  }

  // Remove common prefixes if present
  const cleanName = name
    .replace(/^com_/i, '')
    .replace(/^mod_/i, '')
    .replace(/^plg_/i, '')
    .replace(/^lib_/i, '')
    .replace(/^tpl_/i, '')
    .replace(/^pkg_/i, '');

  // Check if name contains only valid characters (alphanumeric and underscores)
  const validPattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  if (!validPattern.test(cleanName)) {
    return false;
  }

  // Type-specific validation
  switch (type) {
    case 'component':
      // Components should be reasonable length
      return cleanName.length >= 2 && cleanName.length <= 50;
    case 'module':
      return cleanName.length >= 2 && cleanName.length <= 50;
    case 'plugin':
      return cleanName.length >= 2 && cleanName.length <= 50;
    case 'template':
      return cleanName.length >= 2 && cleanName.length <= 50;
    case 'library':
      return cleanName.length >= 2 && cleanName.length <= 50;
    case 'package':
      return cleanName.length >= 2 && cleanName.length <= 50;
    default:
      return false;
  }
}

/**
 * Validates a PHP namespace
 *
 * @param namespace - The namespace to validate
 * @returns True if valid, false otherwise
 */
export function validateNamespace(namespace: string): boolean {
  if (!namespace || namespace.trim().length === 0) {
    return false;
  }

  // Namespace pattern: VendorName\Category\Name
  const namespacePattern = /^[A-Z][a-zA-Z0-9]*(?:\\[A-Z][a-zA-Z0-9]*)*$/;
  return namespacePattern.test(namespace);
}

/**
 * Validates an email address
 *
 * @param email - The email to validate
 * @returns True if valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  if (!email || email.trim().length === 0) {
    return true; // Email is optional
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * Validates a URL
 *
 * @param url - The URL to validate
 * @returns True if valid, false otherwise
 */
export function validateUrl(url: string): boolean {
  if (!url || url.trim().length === 0) {
    return true; // URL is optional
  }

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates a plugin group name
 *
 * @param group - The plugin group to validate
 * @returns True if valid, false otherwise
 */
export function validatePluginGroup(group: string): boolean {
  const validGroups = [
    'actionlog',
    'api-authentication',
    'authentication',
    'behaviour',
    'captcha',
    'content',
    'editors',
    'editors-xtd',
    'extension',
    'fields',
    'filesystem',
    'finder',
    'installer',
    'media-action',
    'multifactorauth',
    'privacy',
    'quickicon',
    'sampledata',
    'system',
    'task',
    'user',
    'webservices',
    'workflow',
  ];

  return validGroups.includes(group.toLowerCase());
}

/**
 * Validates a version string (semantic versioning)
 *
 * @param version - The version to validate
 * @returns True if valid, false otherwise
 */
export function validateVersion(version: string): boolean {
  if (!version || version.trim().length === 0) {
    return false;
  }

  // Semantic versioning pattern: X.Y.Z or X.Y.Z-alpha/beta/rc
  const versionPattern = /^\d+\.\d+\.\d+(?:-(?:alpha|beta|rc)\.\d+)?$/;
  return versionPattern.test(version);
}

/**
 * Generates a valid namespace from author and extension info
 *
 * @param author - The author/vendor name
 * @param type - The extension type
 * @param name - The extension name
 * @returns A valid PHP namespace
 */
export function generateNamespace(author: string, type: ExtensionType, name: string): string {
  // Sanitize author name
  const vendorName = author
    .replace(/[^a-zA-Z0-9]/g, '')
    .replace(/^[0-9]+/, '') // Remove leading numbers
    .split(/(?=[A-Z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  // Sanitize extension name
  const extensionName = name
    .replace(/^(com_|mod_|plg_|lib_|tpl_)/i, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  // Generate namespace based on type
  switch (type) {
    case 'component':
      return `${vendorName}\\Component\\${extensionName}`;
    case 'module':
      return `${vendorName}\\Module\\${extensionName}`;
    case 'plugin':
      return `${vendorName}\\Plugin`;
    case 'template':
      return `${vendorName}\\Template\\${extensionName}`;
    case 'library':
      return `${vendorName}\\Library\\${extensionName}`;
    default:
      return `${vendorName}\\${extensionName}`;
  }
}

/**
 * Sanitizes a string to be used as a class name
 *
 * @param str - The string to sanitize
 * @returns A valid PHP class name
 */
export function sanitizeClassName(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/^[0-9]+/, '')
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

/**
 * Sanitizes a string to be used as a file name
 *
 * @param str - The string to sanitize
 * @returns A valid file name
 */
export function sanitizeFileName(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}
