/**
 * Education data for CV with multilingual support
 * File: src/data/education.js
 */

// Base education data structure with translations
// Cleaned for Swiss market: only most relevant entries (3 max)
// Primary education items (always visible)
const primaryEducationData = [
    {
        id: "unir-dev",
        title: {
            en: "Higher Technical Diploma in Multiplatform Application Development",
            es: "FP Superior en Desarrollo de Aplicaciones Multiplataforma",
            fr: "Diplôme Technique Supérieur en Développement d'Applications Multiplateforme",
            de: "Höhere Fachausbildung in Multiplattform-Anwendungsentwicklung"
        },
        institution: "UNIR - Universidad Internacional de La Rioja",
        period: "2025",
        details: {
            en: "Completed advanced training in cross-platform application development, software architecture, and modern development practices.",
            es: "Formación avanzada completada en desarrollo de aplicaciones multiplataforma, arquitectura de software y prácticas modernas de desarrollo.",
            fr: "Formation avancée complétée en développement d'applications multiplateforme, architecture logicielle et pratiques de développement modernes.",
            de: "Abgeschlossene Weiterbildung in plattformübergreifender Anwendungsentwicklung, Software-Architektur und modernen Entwicklungspraktiken."
        }
    }
];

// Secondary education items (collapsible)
const secondaryEducationData = [
    {
        id: "schneider-cert",
        title: {
            en: "SP2 EcoStruxure IT Advanced Technical Certification",
            es: "Certificación Técnica Avanzada SP2 EcoStruxure IT",
            fr: "Certification Technique Avancée SP2 EcoStruxure IT",
            de: "SP2 EcoStruxure IT Fortgeschrittene Technische Zertifizierung"
        },
        institution: "Schneider Electric",
        period: "2019",
        details: {
            en: "Professional certification in advanced IT infrastructure management and monitoring systems.",
            es: "Certificación profesional en gestión de infraestructura de TI avanzada y sistemas de monitorización.",
            fr: "Certification professionnelle en gestion d'infrastructure IT avancée et systèmes de surveillance.",
            de: "Professionelle Zertifizierung in fortgeschrittenem IT-Infrastrukturmanagement und Überwachungssystemen."
        }
    },
    {
        id: "tech-degree",
        title: {
            en: "Higher Technical Diploma in Multiplatform Application Development",
            es: "Grado Superior en Desarrollo de Aplicaciones Multiplataforma",
            fr: "Diplôme Technique Supérieur en Développement d'Applications Multiplateforme",
            de: "Höherer Fachabschluss in Multiplattform-Anwendungsentwicklung"
        },
        institution: "IES Montilivi",
        period: "2015",
        details: {
            en: "Specialized in web and mobile application development, database design, and software architecture.",
            es: "Especializado en desarrollo de aplicaciones web y móviles, diseño de bases de datos y arquitectura de software.",
            fr: "Spécialisé dans le développement d'applications web et mobiles, la conception de bases de données et l'architecture logicielle.",
            de: "Spezialisiert auf Web- und Mobile-Anwendungsentwicklung, Datenbankdesign und Software-Architektur."
        }
    }
];

// Combined for backwards compatibility
const educationData = [...primaryEducationData, ...secondaryEducationData];

// Helper to transform education data to language-specific format
const transformEducation = (data, language) => data.map(edu => ({
    id: edu.id,
    title: edu.title[language] || edu.title.en,
    institution: edu.institution,
    period: edu.period,
    details: edu.details[language] || edu.details.en
}));

/**
 * Get all education items in the specified language
 * @param {string} lang - Language code (en, es, fr, de)
 * @returns {Array} Education items with texts in the specified language
 */
export const getEducation = (lang = 'en') => {
    const language = ['en', 'es', 'fr', 'de'].includes(lang) ? lang : 'en';
    return transformEducation(educationData, language);
};

/**
 * Get primary education items (always visible)
 * @param {string} lang - Language code (en, es, fr, de)
 * @returns {Array} Primary education items
 */
export const getPrimaryEducation = (lang = 'en') => {
    const language = ['en', 'es', 'fr', 'de'].includes(lang) ? lang : 'en';
    return transformEducation(primaryEducationData, language);
};

/**
 * Get secondary education items (collapsible)
 * @param {string} lang - Language code (en, es, fr, de)
 * @returns {Array} Secondary education items
 */
export const getSecondaryEducation = (lang = 'en') => {
    const language = ['en', 'es', 'fr', 'de'].includes(lang) ? lang : 'en';
    return transformEducation(secondaryEducationData, language);
};

/**
 * Get education items for the current UI language
 * @returns {Array} Education items with texts in the current UI language
 */
export const getCurrentLanguageEducation = () => {
    const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';
    return getEducation(currentLang);
};

// Fallback: export default Education items in English for compatibility
const educationItems = getEducation('en');
export default educationItems;
