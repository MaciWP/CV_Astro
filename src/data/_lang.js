/**
 * Single source of truth for the supported-language guard used across src/data.
 * Normalizes a language code to a supported one (en/es/fr/de), defaulting to English.
 * File: src/data/_lang.js
 */
export const normalizeLang = (lang) =>
    ['en', 'es', 'fr', 'de'].includes(lang) ? lang : 'en';
