/**
 * Navigation items with multilingual support
 * File: src/data/navigation.js
 */

// Base navigation items with translations
// Note: "About" removed from nav to save header space - logo click scrolls to top
export const navItems = [
    {
        id: 'experience',
        name: {
            en: 'Experience',
            es: 'Experiencia',
            fr: 'Expérience'
        },
        href: '#experience'
    },
    {
        id: 'skills',
        name: {
            en: 'Skills',
            es: 'Habilidades',
            fr: 'Compétences'
        },
        href: '#skills'
    },
    {
        id: 'education',
        name: {
            en: 'Education',
            es: 'Educación',
            fr: 'Formation'
        },
        href: '#education'
    },
    {
        id: 'languages',
        name: {
            en: 'Languages',
            es: 'Idiomas',
            fr: 'Langues'
        },
        href: '#languages'
    },
    {
        id: 'projects',
        name: {
            en: 'Projects',
            es: 'Proyectos',
            fr: 'Projets'
        },
        href: '#projects'
    }
];

// UI translations
export const uiTranslations = {
    downloadCV: {
        en: 'Download CV',
        es: 'Descargar CV',
        fr: 'Télécharger CV'
    },
    backToTop: {
        en: 'Back to top',
        es: 'Volver arriba',
        fr: 'Retour en haut'
    },
    openMenu: {
        en: 'Open menu',
        es: 'Abrir menú',
        fr: 'Ouvrir le menu'
    },
    closeMenu: {
        en: 'Close menu',
        es: 'Cerrar menú',
        fr: 'Fermer le menu'
    }
};

/**
 * Get navigation items in the specified language
 * @param {string} lang - Language code (en, es, fr)
 * @returns {Array} Navigation items with names in the specified language
 */
export const getNavItems = (lang = 'en') => {
    // Default to English if language not supported
    const language = ['en', 'es', 'fr'].includes(lang) ? lang : 'en';

    // Transform data structure to use the specified language
    return navItems.map(item => ({
        id: item.id,
        name: item.name[language] || item.name.en, // Fallback to English
        href: item.href
    }));
};

/**
 * Get UI translation in the specified language
 * @param {string} key - UI element key
 * @param {string} lang - Language code (en, es, fr)
 * @returns {string} Translation in the specified language
 */
export const getUITranslation = (key, lang = 'en') => {
    // Default to English if language not supported
    const language = ['en', 'es', 'fr'].includes(lang) ? lang : 'en';

    if (uiTranslations[key] && uiTranslations[key][language]) {
        return uiTranslations[key][language];
    }

    // Fallback to English or key itself
    return uiTranslations[key]?.en || key;
};

/**
 * Get navigation items for the current UI language
 * @returns {Array} Navigation items with names in the current UI language
 */
export const getCurrentLanguageNavItems = () => {
    // Get current language from window object if available
    const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';
    return getNavItems(currentLang);
};

/**
 * Get UI translation for the current UI language
 * @param {string} key - UI element key
 * @returns {string} Translation in the current UI language
 */
export const getCurrentUITranslation = (key) => {
    // Get current language from window object if available
    const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';
    return getUITranslation(key, currentLang);
};

// For compatibility with existing code - English nav items
export default navItems.map(item => ({
    id: item.id,
    name: item.name.en,
    href: item.href
}));