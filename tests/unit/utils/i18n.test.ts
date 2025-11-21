/**
 * Tests for i18n.ts utility functions
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('i18n.ts', () => {
  // Store original environment variables
  const originalEnv = { ...process.env };

  beforeEach(() => {
    // Reset modules to ensure clean state
    vi.resetModules();

    // Clear environment variables
    delete process.env.LANG;
    delete process.env.LANGUAGE;
    delete process.env.LC_ALL;
    delete process.env.LC_MESSAGES;
  });

  afterEach(() => {
    // Restore original environment
    process.env = { ...originalEnv };
  });

  describe('language detection', () => {
    it('should default to English when no language environment variables are set', async () => {
      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.language).toBe('en');
    });

    it('should detect Spanish from LANG environment variable', async () => {
      process.env.LANG = 'es_ES.UTF-8';
      vi.resetModules();

      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.language).toBe('es');
    });

    it('should detect English from LANG environment variable', async () => {
      process.env.LANG = 'en_US.UTF-8';
      vi.resetModules();

      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.language).toBe('en');
    });

    it('should detect language from LANGUAGE environment variable', async () => {
      process.env.LANGUAGE = 'es';
      vi.resetModules();

      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.language).toBe('es');
    });

    it('should detect language from LC_ALL environment variable', async () => {
      process.env.LC_ALL = 'es_MX.UTF-8';
      vi.resetModules();

      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.language).toBe('es');
    });

    it('should detect language from LC_MESSAGES environment variable', async () => {
      process.env.LC_MESSAGES = 'es_AR';
      vi.resetModules();

      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.language).toBe('es');
    });

    it('should default to English for unsupported languages', async () => {
      process.env.LANG = 'fr_FR.UTF-8';
      vi.resetModules();

      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.language).toBe('en');
    });

    it('should handle malformed language codes', async () => {
      process.env.LANG = 'invalid';
      vi.resetModules();

      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.language).toBe('en');
    });
  });

  describe('translation loading', () => {
    it('should load English translations correctly', async () => {
      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.t('common:appTitle')).toBe('🚀 jkit - Joomla Development Kit');
      expect(i18n.t('common:errors.generic')).toBe('An error occurred');
      expect(i18n.t('commands:init.description')).toBe(
        'Initialize a new Joomla extension project with Dev Container'
      );
    });

    it('should load Spanish translations correctly', async () => {
      process.env.LANG = 'es_ES.UTF-8';
      vi.resetModules();

      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.t('common:appTitle')).toBe('🚀 jkit - Kit de Desarrollo para Joomla');
      expect(i18n.t('common:errors.generic')).toBe('Ocurrió un error');
      expect(i18n.t('commands:init.description')).toBe(
        'Inicializar un nuevo proyecto de extensión de Joomla con Dev Container'
      );
    });

    it('should have fallback to English for missing translations', async () => {
      process.env.LANG = 'es_ES.UTF-8';
      vi.resetModules();

      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      // Test fallback behavior
      expect(i18n.options.fallbackLng).toEqual(['en']);
    });

    it('should load both common and commands namespaces', async () => {
      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.t('common:success.projectCreated')).toBe('Project created successfully!');
      expect(i18n.t('commands:create.description')).toBe('Create a new Joomla extension');
    });
  });

  describe('getI18n singleton', () => {
    it('should return same instance on multiple calls', async () => {
      const { getI18n } = await import('@/utils/i18n');

      const instance1 = await getI18n();
      const instance2 = await getI18n();

      expect(instance1).toBe(instance2);
    });

    it('should initialize i18n only once', async () => {
      vi.resetModules();
      const { getI18n } = await import('@/utils/i18n');

      // Get instance multiple times
      const instance1 = await getI18n();
      const instance2 = await getI18n();
      const instance3 = await getI18n();

      // All instances should be the same
      expect(instance1).toBe(instance2);
      expect(instance2).toBe(instance3);
      expect(instance1).toBeDefined();
    });
  });

  describe('i18next configuration', () => {
    it('should disable escape value for interpolation', async () => {
      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.options.interpolation?.escapeValue).toBe(false);
    });

    it('should support interpolation in translations', async () => {
      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      // Test with real interpolation from common.json
      expect(i18n.t('common:errors.directoryExists', { name: 'test' })).toBe(
        'Error: Directory "test" already exists'
      );
    });

    it('should have English as fallback language', async () => {
      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.options.fallbackLng).toEqual(['en']);
    });

    it('should load resources for both en and es', async () => {
      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.hasResourceBundle('en', 'common')).toBe(true);
      expect(i18n.hasResourceBundle('en', 'commands')).toBe(true);
      expect(i18n.hasResourceBundle('es', 'common')).toBe(true);
      expect(i18n.hasResourceBundle('es', 'commands')).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty language code extraction', async () => {
      process.env.LANG = '_';
      vi.resetModules();

      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.language).toBe('en');
    });

    it('should handle language code with only dots', async () => {
      process.env.LANG = '...';
      vi.resetModules();

      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.language).toBe('en');
    });

    it('should prioritize LANG over other environment variables', async () => {
      process.env.LANG = 'es_ES.UTF-8';
      process.env.LANGUAGE = 'en';
      process.env.LC_ALL = 'en';
      vi.resetModules();

      const { initI18n } = await import('@/utils/i18n');
      const i18n = await initI18n();

      expect(i18n.language).toBe('es');
    });
  });
});
