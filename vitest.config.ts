import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts'],
    exclude: [
      'node_modules',
      'dist',
      'src/templates/**/*',
      '.git',
      '.cache',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/**',
        'dist/**',
        'src/templates/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/**',
      ],
      // Coverage thresholds
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
    setupFiles: ['./tests/setup.ts'],
    // Timeout for tests (5 seconds)
    testTimeout: 5000,
    // Hook timeout
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
});
