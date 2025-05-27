/**
 * Languages data for CV with multilingual support
 * File: src/data/languages.js
 */

// Base languages data with translations
const languagesData = [
  {
    id: "spanish",
    language: {
      en: "Spanish",
      es: "Español",
      fr: "Espagnol",
    },
    level: {
      en: "Native",
      es: "Nativo",
      fr: "Langue Maternelle",
    },
    badge: "NATIVE",
    percent: 100,
  },
  {
    id: "catalan",
    language: {
      en: "Catalan",
      es: "Catalán",
      fr: "Catalan",
    },
    level: {
      en: "Native",
      es: "Nativo",
      fr: "Langue Maternelle",
    },
    badge: "NATIVE",
    percent: 100,
  },
  {
    id: "english",
    language: {
      en: "English",
      es: "Inglés",
      fr: "Anglais",
    },
    level: {
      en: "Intermediate",
      es: "Intermedio",
      fr: "Intermédiaire",
    },
    badge: "B1",
    percent: 60,
  },
];

/**
 * Get languages data in the specified language
 * @param {string} lang - Language code (en, es, fr)
 * @returns {Array} Languages with texts in the specified language
 */
export const getLanguages = (lang = "en") => {
  // Default to English if language not supported
  const language = ["en", "es", "fr"].includes(lang) ? lang : "en";

  // Transform data structure to use the specified language
  return languagesData.map((lang) => ({
    language: lang.language[language] || lang.language.en,
    level: lang.level[language] || lang.level.en,
    badge: lang.badge,
    percent: lang.percent,
  }));
};

/**
 * Get languages data for the current UI language
 * @returns {Array} Languages with texts in the current UI language
 */
export const getCurrentLanguageLanguages = () => {
  // Get current language from window object if available
  const currentLang =
    (typeof window !== "undefined" && window.CURRENT_LANGUAGE) || "en";
  return getLanguages(currentLang);
};

// For compatibility with existing code
const languages = getLanguages("en");
export default languages;
