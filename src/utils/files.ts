import fs from 'fs/promises';
import path from 'path';
import { replaceVariables } from './template.js';

/**
 * Ensures a directory exists, creating it recursively if needed
 *
 * @param dirPath - Path to directory
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    throw new Error(
      `Failed to create directory ${dirPath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Checks if a path exists
 *
 * @param filePath - Path to check
 * @returns True if exists
 */
export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if a directory is empty
 *
 * @param dirPath - Directory path
 * @returns True if empty
 */
export async function isDirectoryEmpty(dirPath: string): Promise<boolean> {
  try {
    const files = await fs.readdir(dirPath);
    return files.length === 0;
  } catch {
    return true; // If directory doesn't exist, consider it empty
  }
}

/**
 * Copies a file with dynamic naming based on variables
 *
 * @param source - Source file path
 * @param destination - Destination path (can contain {{VAR}} placeholders)
 * @param variables - Variables for path replacement
 */
export async function copyFileWithRename(
  source: string,
  destination: string,
  variables: Record<string, string>
): Promise<void> {
  try {
    // Replace variables in destination path
    const finalDestination = replaceVariables(destination, variables);

    // Ensure destination directory exists
    const destDir = path.dirname(finalDestination);
    await ensureDir(destDir);

    // Copy file
    await fs.copyFile(source, finalDestination);
  } catch (error) {
    throw new Error(
      `Failed to copy file from ${source} to ${destination}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Copies a directory recursively with dynamic naming
 *
 * @param sourceDir - Source directory
 * @param destDir - Destination directory (can contain {{VAR}} placeholders)
 * @param variables - Variables for path replacement
 * @param options - Copy options
 */
export async function copyDirectoryWithRename(
  sourceDir: string,
  destDir: string,
  variables: Record<string, string>,
  options: {
    /** Files/directories to exclude */
    exclude?: string[];
    /** Only copy specific file extensions */
    extensions?: string[];
  } = {}
): Promise<void> {
  const { exclude = [], extensions = [] } = options;

  try {
    // Replace variables in destination directory
    const finalDestDir = replaceVariables(destDir, variables);

    // Ensure destination directory exists
    await ensureDir(finalDestDir);

    // Get all items in source directory
    const items = await fs.readdir(sourceDir, { withFileTypes: true });

    for (const item of items) {
      const sourcePath = path.join(sourceDir, item.name);
      const relativePath = path.relative(sourceDir, sourcePath);

      // Skip excluded items
      if (exclude.some((pattern) => relativePath.includes(pattern))) {
        continue;
      }

      // Replace variables in item name
      const itemName = replaceVariables(item.name, variables);
      const destPath = path.join(finalDestDir, itemName);

      if (item.isDirectory()) {
        // Recursively copy directory
        await copyDirectoryWithRename(sourcePath, destPath, variables, options);
      } else if (item.isFile()) {
        // Check file extension if filter is set
        const ext = path.extname(item.name);
        if (extensions.length === 0 || extensions.includes(ext)) {
          await copyFileWithRename(sourcePath, destPath, variables);
        }
      }
    }
  } catch (error) {
    throw new Error(
      `Failed to copy directory from ${sourceDir} to ${destDir}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Removes a file or directory recursively
 *
 * @param targetPath - Path to remove
 */
export async function remove(targetPath: string): Promise<void> {
  try {
    await fs.rm(targetPath, { recursive: true, force: true });
  } catch (error) {
    throw new Error(
      `Failed to remove ${targetPath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Reads a JSON file and parses it
 *
 * @param filePath - Path to JSON file
 * @returns Parsed JSON object
 */
export async function readJsonFile<T = any>(filePath: string): Promise<T> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    throw new Error(
      `Failed to read JSON file ${filePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Writes an object to a JSON file
 *
 * @param filePath - Path to JSON file
 * @param data - Data to write
 * @param indent - Indentation spaces (default: 2)
 */
export async function writeJsonFile(filePath: string, data: any, indent: number = 2): Promise<void> {
  try {
    const content = JSON.stringify(data, null, indent);
    await fs.writeFile(filePath, content, 'utf-8');
  } catch (error) {
    throw new Error(
      `Failed to write JSON file ${filePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Gets the size of a file in bytes
 *
 * @param filePath - Path to file
 * @returns File size in bytes
 */
export async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

/**
 * Gets the size of a directory recursively in bytes
 *
 * @param dirPath - Path to directory
 * @returns Total size in bytes
 */
export async function getDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0;

  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);

      if (item.isDirectory()) {
        totalSize += await getDirectorySize(itemPath);
      } else if (item.isFile()) {
        totalSize += await getFileSize(itemPath);
      }
    }
  } catch {
    // Ignore errors
  }

  return totalSize;
}

/**
 * Formats bytes to human-readable string
 *
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Lists all files in a directory recursively
 *
 * @param dirPath - Directory path
 * @param options - List options
 * @returns Array of file paths
 */
export async function listFiles(
  dirPath: string,
  options: {
    /** File extensions to include */
    extensions?: string[];
    /** Patterns to exclude */
    exclude?: string[];
    /** Return relative paths */
    relative?: boolean;
  } = {}
): Promise<string[]> {
  const { extensions = [], exclude = [], relative = false } = options;
  const files: string[] = [];

  try {
    const items = await fs.readdir(dirPath, { withFileTypes: true });

    for (const item of items) {
      const itemPath = path.join(dirPath, item.name);
      const relativePath = path.relative(dirPath, itemPath);

      // Skip excluded items
      if (exclude.some((pattern) => relativePath.includes(pattern))) {
        continue;
      }

      if (item.isDirectory()) {
        // Recursively list files in subdirectory
        const subFiles = await listFiles(itemPath, options);
        files.push(...subFiles);
      } else if (item.isFile()) {
        // Check extension filter
        const ext = path.extname(item.name);
        if (extensions.length === 0 || extensions.includes(ext)) {
          files.push(relative ? relativePath : itemPath);
        }
      }
    }
  } catch {
    // Ignore errors
  }

  return files;
}
