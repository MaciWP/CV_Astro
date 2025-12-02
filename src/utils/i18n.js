/**
 * Internationalization system that loads translations dynamically
 * Avoids importing files from the public folder directly
 *
 * src/utils/i18n.js
 */

// Cache to store loaded translations
const translationsCache = {
  en: null,
  es: null,
  fr: null,
  de: null
};

/**
 * Detects the current language based on the URL or stored value
 * @returns {string} Language code (en, es, fr)
 */
export const detectLanguage = () => {
  // First, try to use the global variable set in the layout
  if (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) {
    return window.CURRENT_LANGUAGE;
  }

  // If not available, detect by URL
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    if (path.startsWith('/es/') || path === '/es') return 'es';
    if (path.startsWith('/fr/') || path === '/fr') return 'fr';
    if (path.startsWith('/de/') || path === '/de') return 'de';
  }

  // Default value
  return 'en';
};

/**
 * Loads a translation file
 * @param {string} lang - Language code
 * @returns {Promise<Object>} - Promise that resolves to the translation object
 */
export const loadTranslation = async (lang) => {
  // If we already have the translation in cache, use it
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }

  try {
    // Use relative URL to work in development and production
    const response = await fetch(`/locales/${lang}/translation.json?v=${new Date().getTime()}`);

    if (!response.ok) {
      console.warn(`Failed to load ${lang} translations, status: ${response.status}`);
      // If it fails, try English as fallback
      if (lang !== 'en') {
        return loadTranslation('en');
      }
      return {};
    }

    const translations = await response.json();
    // Save in cache
    translationsCache[lang] = translations;
    return translations;
  } catch (error) {
    console.error(`Error loading ${lang} translations:`, error);
    // If there's an error and it's not English, try English
    if (lang !== 'en') {
      return loadTranslation('en');
    }
    return {};
  }
};

/**
 * Gets the translation value from a nested object using a dot-separated path
 * @param {Object} obj - Translations object
 * @param {string} path - Access path with dots (e.g. 'header.title')
 * @returns {*} Found value or undefined
 */
const getValueByPath = (obj, path) => {
  if (!obj || !path) return undefined;

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
      return undefined;
    }
  }

  return result;
};

// In-memory translation data for immediate use (basic fallbacks)
const fallbackTranslations = {
  en: {
    header: {
      jobTitle: "Software Developer",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      photoAlt: "Oriol Macias - Software Developer"
    },
    sections: {
      summary: "Professional Summary",
      experience: "Work Experience",
      education: "Education",
      skills: "Skills",
      languages: "Languages",
      projects: "Projects"
    }
  },
  es: {
    header: {
      jobTitle: "Desarrollador de Software",
      email: "Correo",
      linkedin: "LinkedIn",
      github: "GitHub",
      photoAlt: "Oriol Macias - Desarrollador de Software"
    },
    sections: {
      summary: "Resumen Profesional",
      experience: "Experiencia Laboral",
      education: "Formación",
      skills: "Habilidades",
      languages: "Idiomas",
      projects: "Proyectos"
    }
  },
  fr: {
    header: {
      jobTitle: "Développeur Logiciel",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      photoAlt: "Oriol Macias - Développeur Logiciel"
    },
    sections: {
      summary: "Résumé Professionnel",
      experience: "Expérience Professionnelle",
      education: "Formation",
      skills: "Compétences",
      languages: "Langues",
      projects: "Projets"
    }
  },
  de: {
    header: {
      jobTitle: "Software-Entwickler",
      email: "E-Mail",
      linkedin: "LinkedIn",
      github: "GitHub",
      photoAlt: "Oriol Macias - Software-Entwickler"
    },
    sections: {
      summary: "Berufsprofil",
      experience: "Berufserfahrung",
      education: "Ausbildung",
      skills: "Fähigkeiten",
      languages: "Sprachen",
      projects: "Projekte"
    }
  }
};

/**
 * Main translation function - synchronous version with fallbacks
 * @param {string} key - Translation key (with dot notation)
 * @param {string} lang - Language code (optional, auto-detects if not provided)
 * @returns {string} Translated text or original key as fallback
 */
export const translate = (key, lang = null) => {
  // Determine language to use
  const langToUse = lang || detectLanguage();

  // First, search in loaded translations
  const cached = translationsCache[langToUse];
  if (cached) {
    const translated = getValueByPath(cached, key);
    if (translated !== undefined) return translated;
  }

  // Then search in fallbacks
  const fallback = getValueByPath(fallbackTranslations[langToUse], key);
  if (fallback !== undefined) return fallback;

  // If still no translation, try English
  if (langToUse !== 'en') {
    const enFallback = getValueByPath(fallbackTranslations.en, key);
    if (enFallback !== undefined) return enFallback;
  }

  // Last resort: return the last part of the key
  const parts = key.split('.');
  return parts[parts.length - 1];
};

/**
 * Function to preload all translations
 * @returns {Promise<void>}
 */
export const preloadTranslations = async () => {
  try {
    await Promise.all([
      loadTranslation('en'),
      loadTranslation('es'),
      loadTranslation('fr'),
      loadTranslation('de')
    ]);
    console.log('All translations preloaded successfully');
  } catch (error) {
    console.error('Error preloading translations:', error);
  }
};

/**
 * Hook for use in React components
 * @returns {Object} Object with useful functions
 */
export const useI18n = () => {
  const lang = detectLanguage();

  // SSG OPTIMIZATION: Use inlined translations from Layout.astro if available
  // This avoids unnecessary HTTP fetches since translations are already in window.TRANSLATIONS
  if (!translationsCache[lang]) {
    if (typeof window !== 'undefined' && window.TRANSLATIONS && window.TRANSLATIONS[lang]) {
      // Use SSG inlined translations - no fetch needed
      translationsCache[lang] = window.TRANSLATIONS[lang];
    }
    // Note: We no longer fetch here - if SSG didn't inline it, use fallbacks
  }

  return {
    t: (key) => translate(key, lang),
    lang,
    // Function to create localized URLs
    localizeUrl: (path) => {
      if (lang === 'en') return path.startsWith('/') ? path : `/${path}`;
      return `/${lang}${path.startsWith('/') ? path : `/${path}`}`;
    },
    // Get native name of the current language
    languageName: {
      en: 'English',
      es: 'Español',
      fr: 'Français',
      de: 'Deutsch'
    }[lang] || 'English'
  };
};

// SSG OPTIMIZATION: Removed auto-preload of ALL 4 translations
// Layout.astro now inlines the current language's translations at build time
// This eliminates 4 HTTP requests (~4s latency) that were blocking LCP
// Translations are available via window.TRANSLATIONS[lang] immediately

export default {
  translate,
  detectLanguage,
  useI18n,
  preloadTranslations
};
