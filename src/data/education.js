/**
 * Education data for CV with multilingual support
 * File: src/data/education.js
 */

// Base education data structure with translations
const educationData = [
    {
        id: "unir-dev",
        title: {
            en: "UNIR - FP Superior in Multiplatform Application Development",
            es: "UNIR - FP Superior en Desarrollo de Aplicaciones Multiplataforma",
            fr: "UNIR - FP Supérieur en Développement d'Applications Multiplateforme",
            de: "UNIR - Höhere Fachausbildung in Multiplattform-Anwendungsentwicklung"
        },
        institution: "Universidad Internacional de La Rioja",
        period: "2024 - 2025",
        details: {
            en: "Currently expanding knowledge in application development focusing on cross-platform solutions.",
            es: "Actualmente ampliando conocimientos en desarrollo de aplicaciones centrándome en soluciones multiplataforma.",
            fr: "Élargissement actuel des connaissances en développement d'applications axé sur les solutions multiplateforme.",
            de: "Derzeit Erweiterung der Kenntnisse in der Anwendungsentwicklung mit Fokus auf plattformübergreifende Lösungen."
        }
    },
    {
        id: "english-course",
        title: {
            en: "English Course B1-B2",
            es: "Curso de Inglés B1-B2",
            fr: "Cours d'Anglais B1-B2",
            de: "Englischkurs B1-B2"
        },
        institution: "IBOUX",
        period: "2024",
        details: {
            en: "Improving English language skills for professional environments.",
            es: "Mejorando habilidades de inglés para entornos profesionales.",
            fr: "Amélioration des compétences en anglais pour les environnements professionnels.",
            de: "Verbesserung der Englischkenntnisse für berufliche Umgebungen."
        }
    },
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
            en: "Technical Degree in Multiplatform Application Development",
            es: "Grado Superior en Desarrollo de Aplicaciones Multiplataforma",
            fr: "Diplôme Technique en Développement d'Applications Multiplateforme",
            de: "Technischer Abschluss in Multiplattform-Anwendungsentwicklung"
        },
        institution: "IES Montilivi",
        period: "2015",
        details: {
            en: "Specialized in web and mobile application development, database design, and software architecture.",
            es: "Especializado en desarrollo de aplicaciones web y móviles, diseño de bases de datos y arquitectura de software.",
            fr: "Spécialisé dans le développement d'applications web et mobiles, la conception de bases de données et l'architecture logicielle.",
            de: "Spezialisiert auf Web- und Mobile-Anwendungsentwicklung, Datenbankdesign und Software-Architektur."
        }
    },
    {
        id: "cas-course",
        title: {
            en: "Access Course to Higher Technical Education (CAS)",
            es: "Curso de Acceso a Grado Superior (CAS)",
            fr: "Cours d'Accès à l'Enseignement Technique Supérieur (CAS)",
            de: "Zugangskurs zur höheren Fachausbildung (CAS)"
        },
        institution: "IES Santa Eugènia",
        period: "2013",
        details: {
            en: "Preparatory course for higher technical education.",
            es: "Curso preparatorio para educación técnica superior.",
            fr: "Cours préparatoire pour l'enseignement technique supérieur.",
            de: "Vorbereitungskurs für die höhere Fachausbildung."
        }
    },
    {
        id: "micro-systems",
        title: {
            en: "Microcomputer Systems and Networks",
            es: "Sistemas Microinformáticos y Redes",
            fr: "Systèmes Micro-informatiques et Réseaux",
            de: "Mikrocomputersysteme und Netzwerke"
        },
        institution: "IES Salvador Espriu",
        period: "2012",
        details: {
            en: "Medium-grade training in computer systems and networking.",
            es: "Formación de grado medio en sistemas informáticos y redes.",
            fr: "Formation de niveau moyen en systèmes informatiques et réseaux.",
            de: "Mittlere Ausbildung in Computersystemen und Netzwerken."
        }
    },
    {
        id: "secondary",
        title: {
            en: "Secondary Education (ESO)",
            es: "Educación Secundaria Obligatoria (ESO)",
            fr: "Enseignement Secondaire Obligatoire (ESO)",
            de: "Sekundarschulbildung (ESO)"
        },
        institution: "IES Josep Brugulat",
        period: "2010",
        details: {
            en: "Focus on technology and computer science.",
            es: "Enfoque en tecnología e informática.",
            fr: "Accent sur la technologie et l'informatique.",
            de: "Schwerpunkt auf Technologie und Informatik."
        }
    }
];

/**
 * Get education items in the specified language
 * @param {string} lang - Language code (en, es, fr, de)
 * @returns {Array} Education items with texts in the specified language
 */
export const getEducation = (lang = 'en') => {
    // Default to English if language not supported
    const language = ['en', 'es', 'fr', 'de'].includes(lang) ? lang : 'en';

    // Transform data structure to use the specified language
    return educationData.map(edu => ({
        title: edu.title[language] || edu.title.en,
        institution: edu.institution,
        period: edu.period,
        details: edu.details[language] || edu.details.en
    }));
};

/**
 * Get education items for the current UI language
 * @returns {Array} Education items with texts in the current UI language
 */
export const getCurrentLanguageEducation = () => {
    // Get current language from window object if available
    const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';
    return getEducation(currentLang);
};

// Fallback: export default Education items in English for compatibility
const educationItems = getEducation('en');
export default educationItems;
