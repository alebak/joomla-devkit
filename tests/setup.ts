/**
 * Vitest setup file
 * This file is executed before all tests
 */

import { beforeAll, afterAll, afterEach } from 'vitest';
import { vol } from 'memfs';

// Set test environment variables
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.CI = 'true';
});

// Clean up after each test
afterEach(() => {
  // Reset memfs volume
  vol.reset();

  // Clear all mocks
  vi.clearAllMocks();
});

// Clean up after all tests
afterAll(() => {
  // Reset modules
  vi.resetModules();
});
