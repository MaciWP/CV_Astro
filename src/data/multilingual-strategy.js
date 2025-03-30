/**
 * Multilingual Data Strategy
 * 
 * This file outlines the approach for handling multilingual data in the CV/Portfolio.
 * It defines which data should be translated and where the translations should be stored.
 */

/**
 * MULTILINGUAL DATA STRATEGY
 * 
 * 1. UI ELEMENTS (Titles, Labels, Buttons)
 * ----------------------------------------
 * All UI elements should be translated using the i18n system.
 * These translations should be stored in the translation.json files.
 * 
 * Example: 
 * - Section titles ("Experience", "Education", "Skills")
 * - Button labels ("Download PDF", "Change Language")
 * - Navigation items ("About", "Projects")
 * 
 * 
 * 2. PERSONAL INFORMATION (Name, Contact, Profile Photo)
 * ------------------------------------------------------
 * This information typically remains the same across languages, except for:
 * - Professional title (can be translated)
 * - Professional summary (should be translated for best impact)
 * 
 * Professional title and summary should be included in translation.json.
 * 
 * 
 * 3. STRUCTURED CONTENT (Experience, Education, Skills)
 * -----------------------------------------------------
 * 3.1. OPTION A: MINIMAL TRANSLATION (RECOMMENDED)
 * 
 * Keep most structured content in the original language, translating only:
 * - Section titles 
 * - Category labels
 * 
 * This is especially appropriate for:
 * - Company names
 * - Technology names
 * - Institution names
 * - Dates/timeframes
 * 
 * 3.2. OPTION B: PARTIAL TRANSLATION
 * 
 * For some fields like descriptions, responsibilities, achievements:
 * - Create multilingual versions in a nested object
 * - Select the appropriate language version during rendering
 * 
 * Example:
 * {
 *   title: "Senior Developer",
 *   company: "Bjumper",
 *   description: {
 *     en: "Developed backend services...",
 *     es: "Desarrolló servicios backend...",
 *     fr: "A développé des services backend..."
 *   }
 * }
 * 
 * 3.3. OPTION C: FULLY SEPARATED DATA FILES
 * 
 * For completely different content by language:
 * - Create separate data files for each language (e.g., experiences.en.js, experiences.es.js)
 * - Import the appropriate file based on current language
 * 
 * 
 * 4. PROJECTS (Technical descriptions, features)
 * ----------------------------------------------
 * Projects often contain specialized vocabulary and technical terms.
 * 
 * Recommended approach:
 * - Translate project titles
 * - Translate short descriptions
 * - Keep technical details in original language
 * - Translate key features if possible
 * 
 * 
 * 5. IMPLEMENTATION RECOMMENDATIONS
 * ---------------------------------
 * 
 * 5.1. For structured data with minor translations (Option A or B)
 */

// Example: Experiences with multilingual descriptions
export const getExperienceData = (language = 'en') => {
    const baseExperiences = [
        {
            id: "bjumper",
            title: "Senior Backend Developer", // Same in all languages
            company: "Bjumper", // Same in all languages
            companyUrl: "https://www.bjumper.com/",
            period: "2018 - Present", // Same in all languages
            description: {
                en: "Design, development, and maintenance of integration solutions between industrial protocols (SNMP, MODBUS, BACnet, etc.) or external applications and DCIM platforms.",
                es: "Diseño, desarrollo y mantenimiento de soluciones de integración entre protocolos industriales (SNMP, MODBUS, BACnet, etc.) o aplicaciones externas y plataformas DCIM.",
                fr: "Conception, développement et maintenance de solutions d'intégration entre protocoles industriels (SNMP, MODBUS, BACnet, etc.) ou applications externes et plateformes DCIM."
            },
            // Technologies are typically not translated
            technologies: ["Python", "Django", "C#", ".NET", "PostgreSQL"]
        },
        // More experiences...
    ];

    // Transform the data structure to use the current language
    return baseExperiences.map(exp => ({
        ...exp,
        description: exp.description[language] || exp.description.en // Fallback to English
    }));
};

/**
 * 5.2. For completely separate multilingual data (Option C)
 */

// Import based on language
export const getLocalizedData = (dataType, language = 'en') => {
    try {
        // Dynamic import for the requested language
        const data = require(`./${dataType}.${language}.js`).default;
        return data;
    } catch (e) {
        // Fallback to English if translation doesn't exist
        try {
            const defaultData = require(`./${dataType}.en.js`).default;
            return defaultData;
        } catch (e) {
            console.error(`Could not load data for ${dataType}`);
            return [];
        }
    }
};

/**
 * 5.3. For component-level translation
 */

// Inside a component
export const useTranslatedContent = (contentKey) => {
    // Get current language from window
    const language = typeof window !== 'undefined' ? (window.CURRENT_LANGUAGE || 'en') : 'en';

    // Access translation from window.t or fallback
    const getTranslation = (key) => {
        if (typeof window !== 'undefined' && typeof window.t === 'function') {
            return window.t(key);
        }
        return key;
    };

    // Return translated content
    return getTranslation(contentKey);
};

export default {
    getExperienceData,
    getLocalizedData,
    useTranslatedContent
};