/**
 * Global i18n system for CV/Portfolio
 * File: public/scripts/i18n-globals.js
 */

// Global variables
window.CURRENT_LANGUAGE = localStorage.getItem('language') || 'en';
window.TRANSLATIONS = {}; // Will hold loaded translations

/**
 * Load translations for a specific language
 * @param {string} language - Language code (en, es, fr)
 * @returns {Promise} - A promise that resolves when translations are loaded
 */
window.loadTranslations = async function (language) {
    // Skip if already loaded
    if (window.TRANSLATIONS[language]) {
        return window.TRANSLATIONS[language];
    }

    try {
        // Load translations from JSON file
        const response = await fetch(`/locales/${language}/translation.json`);

        if (!response.ok) {
            console.warn(`Could not load translations for language: ${language}`);
            // Fallback to English if available, otherwise empty object
            return window.TRANSLATIONS[language] = window.TRANSLATIONS['en'] || {};
        }

        // Parse JSON
        const translations = await response.json();

        // Store in global variable
        window.TRANSLATIONS[language] = translations;

        // Dispatch event
        const event = new CustomEvent('translationsLoaded', {
            detail: { language }
        });
        document.dispatchEvent(event);

        return translations;
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to empty object
        return window.TRANSLATIONS[language] = {};
    }
};

/**
 * Get translation for a key
 * @param {string} key - Dot notation key for translation (e.g. 'buttons.downloadPDF')
 * @param {Object} options - Options for translation
 * @param {Object} options.defaultValue - Default value if translation is not found
 * @param {string} options.language - Language to use, defaults to current language
 * @returns {string} - Translated text or fallback
 */
window.t = function (key, options = {}) {
    const language = options.language || window.CURRENT_LANGUAGE || 'en';
    const defaultValue = options.defaultValue || key;

    // Get translations for language
    const translations = window.TRANSLATIONS[language] || {};

    // Split key by dots
    const keys = key.split('.');

    // Navigate through the translations object
    let result = translations;
    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = result[k];
        } else {
            // Key not found, try English fallback
            if (language !== 'en' && window.TRANSLATIONS['en']) {
                let enResult = window.TRANSLATIONS['en'];
                let found = true;

                for (const k2 of keys) {
                    if (enResult && typeof enResult === 'object' && k2 in enResult) {
                        enResult = enResult[k2];
                    } else {
                        found = false;
                        break;
                    }
                }

                if (found) {
                    return enResult;
                }
            }

            // If still not found, return default value
            return defaultValue;
        }
    }

    return result || defaultValue;
};

/**
 * Change current language
 * @param {string} language - Language code (en, es, fr)
 * @returns {Promise} - A promise that resolves when language is changed
 */
window.changeLanguage = async function (language) {
    // Skip if it's the same language
    if (language === window.CURRENT_LANGUAGE) {
        return;
    }

    // Update global variable
    window.CURRENT_LANGUAGE = language;

    // Store in localStorage
    localStorage.setItem('language', language);

    // Load translations if needed
    if (!window.TRANSLATIONS[language]) {
        await window.loadTranslations(language);
    }

    // Dispatch language changed event
    const event = new CustomEvent('languageChanged', {
        detail: { language }
    });
    document.dispatchEvent(event);
};

// Initialize translations
document.addEventListener('DOMContentLoaded', function () {
    // Load translations for current language
    window.loadTranslations(window.CURRENT_LANGUAGE);

    // Also preload English as fallback
    if (window.CURRENT_LANGUAGE !== 'en') {
        window.loadTranslations('en');
    }
});