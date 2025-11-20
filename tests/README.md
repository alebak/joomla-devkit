# Testing Guide

This directory contains all test files for the jkit project using [Vitest](https://vitest.dev/).

## Directory Structure

```
tests/
├── unit/              # Unit tests
│   ├── utils/        # Tests for utility functions
│   └── cli/          # Tests for CLI commands
├── integration/      # Integration tests
├── helpers/          # Test helpers and utilities
│   ├── fs-helpers.ts    # File system mocking utilities
│   ├── cli-helpers.ts   # CLI testing utilities
│   └── fixtures.ts      # Test data and fixtures
├── fixtures/         # Test fixture files
└── setup.ts         # Global test setup
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Writing Tests

### Basic Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '@/utils/myModule';

describe('myModule', () => {
  describe('myFunction', () => {
    it('should do something', () => {
      const result = myFunction('input');
      expect(result).toBe('expected output');
    });
  });
});
```

### Using Test Helpers

#### File System Mocking

```typescript
import { createMockFS, resetMockFS } from '@tests/helpers';
import { afterEach } from 'vitest';

afterEach(() => {
  resetMockFS();
});

it('should work with file system', () => {
  createMockFS({
    'package.json': JSON.stringify({ name: 'test' }),
    'src/index.ts': '// code',
  });

  // Your test code here
});
```

#### CLI Testing

```typescript
import { mockConsole, mockInquirer } from '@tests/helpers';

it('should handle user input', async () => {
  const console = mockConsole();
  const prompt = mockInquirer({ name: 'test' });

  // Your test code here

  console.restore();
});
```

#### Using Fixtures

```typescript
import { defaultExtensionConfig, validExtensionNames } from '@tests/helpers';

it('should use fixture data', () => {
  const config = { ...defaultExtensionConfig };
  expect(validExtensionNames).toContain('mycomponent');
});
```

## Test Coverage

We aim for the following coverage targets:

- **Utilities**: 90%+ coverage
- **CLI Commands**: 80%+ coverage
- **Overall**: 80%+ coverage

View coverage report after running:
```bash
npm run test:coverage
```

The HTML report is available at `coverage/index.html`.

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names with `it('should...')`
- Follow the Arrange-Act-Assert pattern

### 2. Mocking
- Always reset mocks in `afterEach` hooks
- Use `vi.mock()` for module mocking
- Use test helpers for common mocking scenarios

### 3. Assertions
- Use specific assertions (`toBe`, `toEqual`, `toContain`, etc.)
- Test both success and failure cases
- Test edge cases and boundary conditions

### 4. Async Tests
```typescript
it('should handle async operations', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});
```

### 5. Error Testing
```typescript
it('should throw error for invalid input', () => {
  expect(() => {
    dangerousFunction('invalid');
  }).toThrow('Expected error message');
});
```

## Continuous Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

The CI workflow tests on Node.js versions 18, 20, and 21.

## Debugging Tests

### VSCode Debugging
Add to `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest Tests",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "test"],
  "console": "integratedTerminal"
}
```

### Run specific test file
```bash
npx vitest run tests/unit/utils/validation.test.ts
```

### Run tests matching pattern
```bash
npx vitest run -t "validation"
```

## Common Issues

### Issue: Tests fail with module resolution errors
**Solution**: Check that path aliases are correctly configured in both `tsconfig.json` and `vitest.config.ts`.

### Issue: File system mocks not working
**Solution**: Ensure you're using `memfs` and resetting it in `afterEach` hooks.

### Issue: Coverage not reaching targets
**Solution**: Run `npm run test:coverage` to see which lines are not covered, then add tests for those cases.

## Contributing

When adding new features:
1. Write tests first (TDD approach)
2. Ensure tests pass: `npm test`
3. Check coverage: `npm run test:coverage`
4. Follow existing test patterns and helpers

For more information, see [CONTRIBUTING.md](../CONTRIBUTING.md).
