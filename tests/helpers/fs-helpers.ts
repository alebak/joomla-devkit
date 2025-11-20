/**
 * File system testing helpers
 * Utilities for mocking and testing file system operations
 */

import { vol } from 'memfs';
import path from 'path';

/**
 * Creates a mock file system structure
 * @param structure - Object representing the file system structure
 * @param basePath - Base path for the structure (default: /test)
 */
export function createMockFS(
  structure: Record<string, string | null>,
  basePath = '/test'
): void {
  const fullStructure: Record<string, string> = {};

  for (const [filePath, content] of Object.entries(structure)) {
    const fullPath = path.join(basePath, filePath);
    if (content === null) {
      // Directory
      vol.mkdirSync(fullPath, { recursive: true });
    } else {
      // File
      const dir = path.dirname(fullPath);
      vol.mkdirSync(dir, { recursive: true });
      fullStructure[fullPath] = content;
    }
  }

  vol.fromJSON(fullStructure);
}

/**
 * Resets the mock file system
 */
export function resetMockFS(): void {
  vol.reset();
}

/**
 * Gets all files in the mock file system
 * @returns Object with all files and their contents
 */
export function getMockFSContent(): Record<string, string> {
  return vol.toJSON() as Record<string, string>;
}

/**
 * Checks if a file exists in the mock file system
 * @param filePath - Path to check
 * @returns true if the file exists
 */
export function mockFileExists(filePath: string): boolean {
  try {
    return vol.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Reads a file from the mock file system
 * @param filePath - Path to read
 * @returns File contents or null if not found
 */
export function readMockFile(filePath: string): string | null {
  try {
    return vol.readFileSync(filePath, 'utf-8') as string;
  } catch {
    return null;
  }
}

/**
 * Creates a temporary test directory structure
 * @param name - Directory name
 * @returns Full path to the created directory
 */
export function createTestDir(name: string): string {
  const testPath = path.join('/test', name);
  vol.mkdirSync(testPath, { recursive: true });
  return testPath;
}

/**
 * Mock project structure for testing
 */
export function createMockProject(projectName: string): string {
  const projectPath = createTestDir(projectName);

  createMockFS(
    {
      'package.json': JSON.stringify({
        name: projectName,
        version: '1.0.0',
        description: 'Test project',
      }),
      'jkit.config.json': JSON.stringify({
        projectName,
        joomlaVersion: '5.0',
        extensions: [],
      }),
      'src/index.ts': '// Main entry point',
    },
    projectPath
  );

  return projectPath;
}

/**
 * Mock extension structure for testing
 */
export function createMockExtension(
  type: string,
  name: string,
  basePath = '/test'
): string {
  const extPath = path.join(basePath, `extensions/${type}_${name}`);

  createMockFS(
    {
      [`extensions/${type}_${name}/manifest.xml`]: `<?xml version="1.0" encoding="UTF-8"?>
<extension type="${type}">
  <name>${name}</name>
  <version>1.0.0</version>
</extension>`,
      [`extensions/${type}_${name}/src/index.php`]: '<?php\n// Extension entry',
    },
    basePath
  );

  return extPath;
}
