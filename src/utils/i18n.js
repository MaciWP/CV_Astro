import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18n
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18n
  .init({
    // Default language
    fallbackLng: 'en',
    // Debug mode in development
    debug: import.meta.env.DEV,
    // Resources will be loaded on demand from /public/locales folder
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // Default namespace
    defaultNS: 'translation',
    // Cache translations
    cache: {
      enabled: true,
    },
    interpolation: {
      // React already escapes values
      escapeValue: false,
    },
  });

export default i18n;