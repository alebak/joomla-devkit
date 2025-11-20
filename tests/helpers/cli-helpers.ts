/**
 * CLI testing helpers
 * Utilities for mocking and testing CLI operations
 */

import { vi } from 'vitest';

/**
 * Mock console methods
 */
export function mockConsole() {
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
  };

  const mocks = {
    log: vi.spyOn(console, 'log').mockImplementation(() => {}),
    error: vi.spyOn(console, 'error').mockImplementation(() => {}),
    warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
    info: vi.spyOn(console, 'info').mockImplementation(() => {}),
  };

  return {
    mocks,
    restore: () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
    },
  };
}

/**
 * Mock inquirer prompts
 * @param answers - Object with answers to return for prompts
 */
export function mockInquirer(answers: Record<string, any>) {
  return vi.fn().mockResolvedValue(answers);
}

/**
 * Mock ora spinner
 */
export function mockOra() {
  const spinner = {
    start: vi.fn().mockReturnThis(),
    stop: vi.fn().mockReturnThis(),
    succeed: vi.fn().mockReturnThis(),
    fail: vi.fn().mockReturnThis(),
    warn: vi.fn().mockReturnThis(),
    info: vi.fn().mockReturnThis(),
    text: '',
  };

  return vi.fn().mockReturnValue(spinner);
}

/**
 * Mock chalk for testing
 * Returns the text without any formatting
 */
export function mockChalk() {
  const chain = (text: string) => text;
  const chalk: any = new Proxy(chain, {
    get: () => chalk,
    apply: (_target, _thisArg, [text]) => text,
  });
  return chalk;
}

/**
 * Captures console output
 */
export class ConsoleCapture {
  private logs: string[] = [];
  private errors: string[] = [];
  private originalLog: typeof console.log;
  private originalError: typeof console.error;

  constructor() {
    this.originalLog = console.log;
    this.originalError = console.error;
  }

  start() {
    this.logs = [];
    this.errors = [];

    console.log = (...args: any[]) => {
      this.logs.push(args.map(String).join(' '));
    };

    console.error = (...args: any[]) => {
      this.errors.push(args.map(String).join(' '));
    };
  }

  stop() {
    console.log = this.originalLog;
    console.error = this.originalError;
  }

  getLogs(): string[] {
    return this.logs;
  }

  getErrors(): string[] {
    return this.errors;
  }

  getAll(): { logs: string[]; errors: string[] } {
    return {
      logs: this.logs,
      errors: this.errors,
    };
  }
}

/**
 * Mock process.exit
 */
export function mockProcessExit() {
  const originalExit = process.exit;
  const exitMock = vi.fn();

  // @ts-expect-error - Mocking process.exit
  process.exit = exitMock;

  return {
    exitMock,
    restore: () => {
      process.exit = originalExit;
    },
  };
}

/**
 * Mock commander Command for testing CLI commands
 */
export function createMockCommand() {
  const command = {
    name: vi.fn().mockReturnThis(),
    description: vi.fn().mockReturnThis(),
    argument: vi.fn().mockReturnThis(),
    option: vi.fn().mockReturnThis(),
    action: vi.fn().mockReturnThis(),
    parse: vi.fn().mockReturnThis(),
    opts: vi.fn().mockReturnValue({}),
    args: [],
  };

  return command;
}
