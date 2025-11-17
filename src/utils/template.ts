import fs from 'fs/promises';
import path from 'path';

/**
 * Replaces template variables in content
 *
 * Variables are in the format {{VARIABLE_NAME}}
 *
 * @param content - Template content with {{VAR}} placeholders
 * @param variables - Object with variable values
 * @returns Processed content with variables replaced
 */
export function replaceVariables(content: string, variables: Record<string, string>): string {
  let result = content;

  // Replace each variable
  for (const [key, value] of Object.entries(variables)) {
    // Use global regex to replace all occurrences
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, value);
  }

  return result;
}

/**
 * Processes a template file and writes the result
 *
 * @param templatePath - Path to template file
 * @param outputPath - Where to write processed file
 * @param variables - Variables to replace
 */
export async function processTemplateFile(
  templatePath: string,
  outputPath: string,
  variables: Record<string, string>
): Promise<void> {
  try {
    // Read template content
    const content = await fs.readFile(templatePath, 'utf-8');

    // Replace variables
    const processed = replaceVariables(content, variables);

    // Replace variables in output path
    const finalOutputPath = replaceVariables(outputPath, variables);

    // Ensure output directory exists
    const outputDir = path.dirname(finalOutputPath);
    await fs.mkdir(outputDir, { recursive: true });

    // Write processed content
    await fs.writeFile(finalOutputPath, processed, 'utf-8');
  } catch (error) {
    throw new Error(
      `Failed to process template file ${templatePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Processes an entire template directory recursively
 *
 * @param templateDir - Source template directory
 * @param outputDir - Destination directory
 * @param variables - Variables to replace
 * @param options - Processing options
 */
export async function processTemplateDirectory(
  templateDir: string,
  outputDir: string,
  variables: Record<string, string>,
  options: {
    /** File extensions to process (default: all) */
    extensions?: string[];
    /** Files/directories to exclude */
    exclude?: string[];
  } = {}
): Promise<void> {
  const { extensions = [], exclude = [] } = options;

  try {
    // Get all items in template directory
    const items = await fs.readdir(templateDir, { withFileTypes: true });

    for (const item of items) {
      const sourcePath = path.join(templateDir, item.name);
      const relativePath = path.relative(templateDir, sourcePath);

      // Skip excluded items
      if (exclude.some((pattern) => relativePath.includes(pattern))) {
        continue;
      }

      // Replace variables in item name
      const itemName = replaceVariables(item.name, variables);
      const destPath = path.join(outputDir, itemName);

      if (item.isDirectory()) {
        // Recursively process directory
        await processTemplateDirectory(sourcePath, destPath, variables, options);
      } else if (item.isFile()) {
        // Check if file should be processed
        const ext = path.extname(item.name);
        const shouldProcess = extensions.length === 0 || extensions.includes(ext);

        if (shouldProcess) {
          // Process as template
          await processTemplateFile(sourcePath, destPath, variables);
        } else {
          // Just copy the file
          await fs.mkdir(path.dirname(destPath), { recursive: true });
          await fs.copyFile(sourcePath, destPath);
        }
      }
    }
  } catch (error) {
    throw new Error(
      `Failed to process template directory ${templateDir}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Gets the template directory path for a specific extension type
 *
 * @param type - Extension type
 * @returns Absolute path to template directory
 */
export function getTemplateDirectory(type: string): string {
  // Get the directory where this file is located
  const currentDir = new URL('.', import.meta.url).pathname;

  // Navigate to templates directory (from dist/utils/ to dist/templates/)
  return path.join(currentDir, '..', 'templates', 'extension', type);
}

/**
 * Checks if a template exists for the given extension type
 *
 * @param type - Extension type
 * @returns True if template exists
 */
export async function templateExists(type: string): Promise<boolean> {
  try {
    const templateDir = getTemplateDirectory(type);
    const stats = await fs.stat(templateDir);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Lists all available templates
 *
 * @returns Array of available template names
 */
export async function listAvailableTemplates(): Promise<string[]> {
  try {
    const currentDir = new URL('.', import.meta.url).pathname;
    const templatesDir = path.join(currentDir, '..', 'templates', 'extension');

    const items = await fs.readdir(templatesDir, { withFileTypes: true });
    return items.filter((item) => item.isDirectory()).map((item) => item.name);
  } catch {
    return [];
  }
}
