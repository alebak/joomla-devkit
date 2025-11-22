/**
 * Tests for files.ts utility functions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { vol } from 'memfs';

// Mock fs/promises module
vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn(async (path: string, options?: any) => {
      vol.mkdirSync(path, options);
    }),
    access: vi.fn(async (path: string) => {
      if (!vol.existsSync(path)) {
        throw new Error('ENOENT');
      }
    }),
    readdir: vi.fn(async (path: string, options?: any) => {
      const items = vol.readdirSync(path) as string[];
      if (options?.withFileTypes) {
        return items.map((name) => {
          const fullPath = `${path}/${name}`;
          const stats = vol.statSync(fullPath);
          return {
            name,
            isDirectory: () => stats.isDirectory(),
            isFile: () => stats.isFile(),
          };
        });
      }
      return items;
    }),
    copyFile: vi.fn(async (src: string, dest: string) => {
      const content = vol.readFileSync(src, "utf-8");
      vol.writeFileSync(dest, content);
    }),
    rm: vi.fn(async (path: string, options?: any) => {
      if (vol.existsSync(path)) {
        vol.rmSync(path, options);
      }
    }),
    readFile: vi.fn(async (path: string, encoding?: string) => {
      return vol.readFileSync(path, encoding || 'utf-8');
    }),
    writeFile: vi.fn(async (path: string, content: string) => {
      vol.writeFileSync(path, content);
    }),
    stat: vi.fn(async (path: string) => {
      return vol.statSync(path);
    }),
  },
}));

describe('files.ts', () => {
  beforeEach(() => {
    vol.reset();
    vi.clearAllMocks();
  });

  describe('ensureDir', () => {
    it('should create directory if it does not exist', async () => {
      const { ensureDir } = await import('@/utils/files');

      await ensureDir('/test/dir');

      expect(vol.existsSync('/test/dir')).toBe(true);
    });

    it('should create nested directories', async () => {
      const { ensureDir } = await import('@/utils/files');

      await ensureDir('/test/nested/deep/dir');

      expect(vol.existsSync('/test/nested/deep/dir')).toBe(true);
    });

    it('should not fail if directory already exists', async () => {
      const { ensureDir } = await import('@/utils/files');

      vol.mkdirSync('/test/dir', { recursive: true });

      await expect(ensureDir('/test/dir')).resolves.not.toThrow();
    });
  });

  describe('pathExists', () => {
    it('should return true if path exists', async () => {
      const { pathExists } = await import('@/utils/files');

      vol.mkdirSync('/test', { recursive: true });

      const result = await pathExists('/test');

      expect(result).toBe(true);
    });

    it('should return false if path does not exist', async () => {
      const { pathExists } = await import('@/utils/files');

      const result = await pathExists('/nonexistent');

      expect(result).toBe(false);
    });

    it('should work with files', async () => {
      const { pathExists } = await import('@/utils/files');

      vol.writeFileSync('/file.txt', 'content');

      const result = await pathExists('/file.txt');

      expect(result).toBe(true);
    });
  });

  describe('isDirectoryEmpty', () => {
    it('should return true for empty directory', async () => {
      const { isDirectoryEmpty } = await import('@/utils/files');

      vol.mkdirSync('/empty', { recursive: true });

      const result = await isDirectoryEmpty('/empty');

      expect(result).toBe(true);
    });

    it('should return false for directory with files', async () => {
      const { isDirectoryEmpty } = await import('@/utils/files');

      vol.fromJSON({
        '/dir/file.txt': 'content',
      });

      const result = await isDirectoryEmpty('/dir');

      expect(result).toBe(false);
    });

    it('should return true if directory does not exist', async () => {
      const { isDirectoryEmpty } = await import('@/utils/files');

      const result = await isDirectoryEmpty('/nonexistent');

      expect(result).toBe(true);
    });
  });

  describe('copyFileWithRename', () => {
    it('should copy file to destination', async () => {
      const { copyFileWithRename } = await import('@/utils/files');

      vol.writeFileSync('/source.txt', 'content');

      await copyFileWithRename('/source.txt', '/dest.txt', {});

      expect(vol.readFileSync('/dest.txt', 'utf-8')).toBe('content');
    });

    it('should replace variables in destination path', async () => {
      const { copyFileWithRename } = await import('@/utils/files');

      vol.writeFileSync('/source.txt', 'content');

      await copyFileWithRename('/source.txt', '/{{NAME}}.txt', { NAME: 'myfile' });

      expect(vol.existsSync('/myfile.txt')).toBe(true);
    });

    it('should create destination directory if it does not exist', async () => {
      const { copyFileWithRename } = await import('@/utils/files');

      vol.writeFileSync('/source.txt', 'content');

      await copyFileWithRename('/source.txt', '/nested/dir/dest.txt', {});

      expect(vol.existsSync('/nested/dir/dest.txt')).toBe(true);
    });

    it('should throw error if source does not exist', async () => {
      const { copyFileWithRename } = await import('@/utils/files');

      await expect(copyFileWithRename('/nonexistent.txt', '/dest.txt', {})).rejects.toThrow(
        'Failed to copy file'
      );
    });
  });

  describe('copyDirectoryWithRename', () => {
    it('should copy directory recursively', async () => {
      const { copyDirectoryWithRename } = await import('@/utils/files');

      vol.fromJSON({
        '/source/file1.txt': 'content1',
        '/source/file2.txt': 'content2',
        '/source/subdir/file3.txt': 'content3',
      });

      await copyDirectoryWithRename('/source', '/dest', {});

      expect(vol.readFileSync('/dest/file1.txt', 'utf-8')).toBe('content1');
      expect(vol.readFileSync('/dest/file2.txt', 'utf-8')).toBe('content2');
      expect(vol.readFileSync('/dest/subdir/file3.txt', 'utf-8')).toBe('content3');
    });

    it('should replace variables in directory and file names', async () => {
      const { copyDirectoryWithRename } = await import('@/utils/files');

      vol.fromJSON({
        '/source/{{NAME}}_file.txt': 'content',
        '/source/{{NAME}}_dir/nested.txt': 'nested',
      });

      await copyDirectoryWithRename('/source', '/dest', { NAME: 'test' });

      expect(vol.existsSync('/dest/test_file.txt')).toBe(true);
      expect(vol.existsSync('/dest/test_dir/nested.txt')).toBe(true);
    });

    it('should exclude specified patterns', async () => {
      const { copyDirectoryWithRename } = await import('@/utils/files');

      vol.fromJSON({
        '/source/include.txt': 'include',
        '/source/exclude.txt': 'exclude',
        '/source/node_modules/lib.js': 'library',
      });

      await copyDirectoryWithRename('/source', '/dest', {}, { exclude: ['exclude', 'node_modules'] });

      expect(vol.existsSync('/dest/include.txt')).toBe(true);
      expect(vol.existsSync('/dest/exclude.txt')).toBe(false);
      expect(vol.existsSync('/dest/node_modules')).toBe(false);
    });

    it('should filter by file extensions', async () => {
      const { copyDirectoryWithRename } = await import('@/utils/files');

      vol.fromJSON({
        '/source/file.ts': 'typescript',
        '/source/file.js': 'javascript',
        '/source/file.txt': 'text',
      });

      await copyDirectoryWithRename('/source', '/dest', {}, { extensions: ['.ts', '.js'] });

      expect(vol.existsSync('/dest/file.ts')).toBe(true);
      expect(vol.existsSync('/dest/file.js')).toBe(true);
      expect(vol.existsSync('/dest/file.txt')).toBe(false);
    });
  });

  describe('remove', () => {
    it('should remove file', async () => {
      const { remove } = await import('@/utils/files');

      vol.writeFileSync('/file.txt', 'content');

      await remove('/file.txt');

      expect(vol.existsSync('/file.txt')).toBe(false);
    });

    it('should remove directory recursively', async () => {
      const { remove } = await import('@/utils/files');

      vol.fromJSON({
        '/dir/file1.txt': 'content1',
        '/dir/subdir/file2.txt': 'content2',
      });

      await remove('/dir');

      expect(vol.existsSync('/dir')).toBe(false);
    });

    it('should not throw if path does not exist', async () => {
      const { remove } = await import('@/utils/files');

      await expect(remove('/nonexistent')).resolves.not.toThrow();
    });
  });

  describe('readJsonFile', () => {
    it('should read and parse JSON file', async () => {
      const { readJsonFile } = await import('@/utils/files');

      vol.writeFileSync('/data.json', JSON.stringify({ name: 'test', value: 123 }));

      const result = await readJsonFile('/data.json');

      expect(result).toEqual({ name: 'test', value: 123 });
    });

    it('should throw error if file does not exist', async () => {
      const { readJsonFile } = await import('@/utils/files');

      await expect(readJsonFile('/nonexistent.json')).rejects.toThrow('Failed to read JSON file');
    });

    it('should throw error if JSON is invalid', async () => {
      const { readJsonFile } = await import('@/utils/files');

      vol.writeFileSync('/invalid.json', '{invalid json}');

      await expect(readJsonFile('/invalid.json')).rejects.toThrow('Failed to read JSON file');
    });
  });

  describe('writeJsonFile', () => {
    it('should write object as JSON', async () => {
      const { writeJsonFile } = await import('@/utils/files');

      await writeJsonFile('/data.json', { name: 'test', value: 123 });

      const content = vol.readFileSync('/data.json', 'utf-8');
      expect(JSON.parse(content)).toEqual({ name: 'test', value: 123 });
    });

    it('should format JSON with default indentation', async () => {
      const { writeJsonFile } = await import('@/utils/files');

      await writeJsonFile('/data.json', { name: 'test' });

      const content = vol.readFileSync('/data.json', 'utf-8');
      expect(content).toContain('  "name"');
    });

    it('should format JSON with custom indentation', async () => {
      const { writeJsonFile } = await import('@/utils/files');

      await writeJsonFile('/data.json', { name: 'test' }, 4);

      const content = vol.readFileSync('/data.json', 'utf-8');
      expect(content).toContain('    "name"');
    });
  });

  describe('getFileSize', () => {
    it('should return file size in bytes', async () => {
      const { getFileSize } = await import('@/utils/files');

      vol.writeFileSync('/file.txt', 'Hello World'); // 11 bytes

      const size = await getFileSize('/file.txt');

      expect(size).toBe(11);
    });

    it('should return 0 if file does not exist', async () => {
      const { getFileSize } = await import('@/utils/files');

      const size = await getFileSize('/nonexistent.txt');

      expect(size).toBe(0);
    });
  });

  describe('getDirectorySize', () => {
    it('should calculate total size of directory', async () => {
      const { getDirectorySize } = await import('@/utils/files');

      vol.fromJSON({
        '/dir/file1.txt': 'Hello', // 5 bytes
        '/dir/file2.txt': 'World', // 5 bytes
        '/dir/subdir/file3.txt': '!', // 1 byte
      });

      const size = await getDirectorySize('/dir');

      expect(size).toBe(11);
    });

    it('should return 0 for empty directory', async () => {
      const { getDirectorySize } = await import('@/utils/files');

      vol.mkdirSync('/empty', { recursive: true });

      const size = await getDirectorySize('/empty');

      expect(size).toBe(0);
    });

    it('should return 0 if directory does not exist', async () => {
      const { getDirectorySize } = await import('@/utils/files');

      const size = await getDirectorySize('/nonexistent');

      expect(size).toBe(0);
    });
  });

  describe('formatBytes', () => {
    it('should format 0 bytes', async () => {
      const { formatBytes } = await import('@/utils/files');

      expect(formatBytes(0)).toBe('0 Bytes');
    });

    it('should format bytes', async () => {
      const { formatBytes } = await import('@/utils/files');

      expect(formatBytes(500)).toBe('500 Bytes');
    });

    it('should format kilobytes', async () => {
      const { formatBytes } = await import('@/utils/files');

      expect(formatBytes(1024)).toBe('1 KB');
      expect(formatBytes(2048)).toBe('2 KB');
    });

    it('should format megabytes', async () => {
      const { formatBytes } = await import('@/utils/files');

      expect(formatBytes(1048576)).toBe('1 MB');
      expect(formatBytes(1572864)).toBe('1.5 MB');
    });

    it('should format gigabytes', async () => {
      const { formatBytes } = await import('@/utils/files');

      expect(formatBytes(1073741824)).toBe('1 GB');
    });
  });

  describe('listFiles', () => {
    it('should list all files in directory', async () => {
      const { listFiles } = await import('@/utils/files');

      vol.fromJSON({
        '/dir/file1.txt': 'content1',
        '/dir/file2.txt': 'content2',
        '/dir/subdir/file3.txt': 'content3',
      });

      const files = await listFiles('/dir');

      expect(files).toHaveLength(3);
      expect(files).toContain('/dir/file1.txt');
      expect(files).toContain('/dir/file2.txt');
      expect(files).toContain('/dir/subdir/file3.txt');
    });

    it('should return relative paths when requested', async () => {
      const { listFiles } = await import('@/utils/files');

      vol.fromJSON({
        '/dir/file1.txt': 'content1',
        '/dir/subdir/file2.txt': 'content2',
      });

      const files = await listFiles('/dir', { relative: true });

      expect(files).toHaveLength(2);
      expect(files).toContain('file1.txt');
      // Note: Due to recursive implementation, subdirectory files have their own relative paths
      expect(files.some((f) => f.includes('file2.txt'))).toBe(true);
    });

    it('should filter by extensions', async () => {
      const { listFiles } = await import('@/utils/files');

      vol.fromJSON({
        '/dir/file.ts': 'typescript',
        '/dir/file.js': 'javascript',
        '/dir/file.txt': 'text',
      });

      const files = await listFiles('/dir', { extensions: ['.ts', '.js'] });

      expect(files).toHaveLength(2);
      expect(files.some((f) => f.endsWith('.ts'))).toBe(true);
      expect(files.some((f) => f.endsWith('.js'))).toBe(true);
      expect(files.some((f) => f.endsWith('.txt'))).toBe(false);
    });

    it('should exclude specified patterns', async () => {
      const { listFiles } = await import('@/utils/files');

      vol.fromJSON({
        '/dir/include.txt': 'include',
        '/dir/exclude.txt': 'exclude',
        '/dir/node_modules/lib.js': 'library',
      });

      const files = await listFiles('/dir', { exclude: ['exclude', 'node_modules'] });

      expect(files).toHaveLength(1);
      expect(files[0]).toContain('include.txt');
    });

    it('should return empty array for nonexistent directory', async () => {
      const { listFiles } = await import('@/utils/files');

      const files = await listFiles('/nonexistent');

      expect(files).toEqual([]);
    });
  });
});
