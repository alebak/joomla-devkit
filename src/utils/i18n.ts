import i18next from 'i18next';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Detect system language
function getSystemLanguage(): string {
  const envLang = process.env.LANG || process.env.LANGUAGE || process.env.LC_ALL || process.env.LC_MESSAGES;

  if (envLang) {
    // Extract language code (e.g., "es_ES.UTF-8" -> "es")
    const langCode = envLang.split('_')[0]?.split('.')[0]?.toLowerCase();
    if (langCode === 'es' || langCode === 'en') {
      return langCode;
    }
  }

  // Default to English
  return 'en';
}

// Load translation files
function loadTranslations(lang: string) {
  const localesPath = join(__dirname, '../locales', lang);

  const common = JSON.parse(
    readFileSync(join(localesPath, 'common.json'), 'utf-8')
  ) as Record<string, unknown>;

  const commands = JSON.parse(
    readFileSync(join(localesPath, 'commands.json'), 'utf-8')
  ) as Record<string, unknown>;

  return {
    common,
    commands,
  };
}

// Initialize i18next
export async function initI18n(): Promise<typeof i18next> {
  const language = getSystemLanguage();

  const enTranslations = loadTranslations('en');
  const esTranslations = loadTranslations('es');

  await i18next.init({
    lng: language,
    fallbackLng: 'en',
    resources: {
      en: enTranslations,
      es: esTranslations,
    },
    interpolation: {
      escapeValue: false,
    },
  });

  return i18next;
}

// Export singleton instance
let i18nInstance: typeof i18next | null = null;

export async function getI18n(): Promise<typeof i18next> {
  if (!i18nInstance) {
    i18nInstance = await initI18n();
  }
  return i18nInstance;
}

export { i18next };
