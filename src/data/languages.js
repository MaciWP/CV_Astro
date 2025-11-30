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
            de: "Spanisch"
        },
        level: {
            en: "Native",
            es: "Nativo",
            fr: "Langue Maternelle",
            de: "Muttersprache"
        },
        badge: "NATIVE",
        percent: 100
    },
    {
        id: "catalan",
        language: {
            en: "Catalan",
            es: "Catalán",
            fr: "Catalan",
            de: "Katalanisch"
        },
        level: {
            en: "Native",
            es: "Nativo",
            fr: "Langue Maternelle",
            de: "Muttersprache"
        },
        badge: "NATIVE",
        percent: 100
    },
    {
        id: "english",
        language: {
            en: "English",
            es: "Inglés",
            fr: "Anglais",
            de: "Englisch"
        },
        level: {
            en: "Intermediate",
            es: "Intermedio",
            fr: "Intermédiaire",
            de: "Mittelstufe"
        },
        badge: "B1",
        percent: 60
    }
];

/**
 * Get languages data in the specified language
 * @param {string} lang - Language code (en, es, fr, de)
 * @returns {Array} Languages with texts in the specified language
 */
export const getLanguages = (lang = 'en') => {
    // Default to English if language not supported
    const language = ['en', 'es', 'fr', 'de'].includes(lang) ? lang : 'en';

    // Transform data structure to use the specified language
    return languagesData.map(l => ({
        language: l.language[language] || l.language.en,
        level: l.level[language] || l.level.en,
        badge: l.badge,
        percent: l.percent
    }));
};

/**
 * Get languages data for the current UI language
 * @returns {Array} Languages with texts in the current UI language
 */
export const getCurrentLanguageLanguages = () => {
    // Get current language from window object if available
    const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';
    return getLanguages(currentLang);
};

// For compatibility with existing code
const languages = getLanguages('en');
export default languages;
