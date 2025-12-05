/**
 * Skills data for CV with multilingual support
 * File: src/data/skills.js
 */

// Import the unified icon system
import { techIcons, getTechIcon } from './icons';

// Section titles with multilingual support
// Reorganized for Swiss market and ATS optimization
export const sectionTitles = {
    skills: {
        en: "Technical Skills",
        es: "Habilidades Técnicas",
        fr: "Compétences Techniques",
        de: "Technische Fähigkeiten"
    },
    languages: {
        en: "Programming Languages",
        es: "Lenguajes de Programación",
        fr: "Langages de Programmation",
        de: "Programmiersprachen"
    },
    libraries: {
        en: "Libraries & Frameworks",
        es: "Librerías y Frameworks",
        fr: "Bibliothèques et Frameworks",
        de: "Bibliotheken & Frameworks"
    },
    protocols: {
        en: "Protocols & Data Formats",
        es: "Protocolos y Formatos de Datos",
        fr: "Protocoles et Formats de Données",
        de: "Protokolle & Datenformate"
    },
    devops: {
        en: "DevOps & Tools",
        es: "DevOps y Herramientas",
        fr: "DevOps et Outils",
        de: "DevOps & Werkzeuge"
    },
    databases: {
        en: "Databases",
        es: "Bases de Datos",
        fr: "Bases de Données",
        de: "Datenbanken"
    }
};

// Base skills data with consistent IDs
// Reorganized for Swiss market: cleaner categories, removed IDEs, focused on ATS keywords
const skillsData = {
    // Programming Languages (removed HTML, XML, JSON - moved to protocols)
    languages: [
        { id: "python", name: "Python", icon: "fab fa-python" },
        { id: "csharp", name: "C#", icon: "fab fa-microsoft" },
        { id: "dotnet", name: ".NET", icon: "fab fa-windows" },
        { id: "java", name: "Java", icon: "fab fa-java" },
        { id: "javascript", name: "JavaScript", icon: "fab fa-js" },
    ],

    // Libraries and Frameworks
    libraries: [
        { id: "django", name: "Django", icon: "fas fa-cubes" },
        { id: "fastapi", name: "FastAPI", icon: "fas fa-bolt" },
        { id: "flask", name: "Flask", icon: "fas fa-flask" },
        { id: "react", name: "React", icon: "fab fa-react" },
        { id: "astro", name: "Astro", icon: "fas fa-rocket" },
        { id: "tailwind", name: "Tailwind CSS", icon: "fab fa-css3-alt" },
        { id: "pytest", name: "Pytest", icon: "fas fa-vial" },
        { id: "sqlalchemy", name: "SQLAlchemy", icon: "fas fa-database" },
        { id: "alembic", name: "Alembic", icon: "fas fa-code-branch" },
        { id: "celery", name: "Celery", icon: "fas fa-tasks" },
        { id: "wpf", name: "WPF", icon: "fas fa-desktop" },
        { id: "pandas", name: "Pandas", icon: "fas fa-table" },
        { id: "kivy", name: "Kivy", icon: "fas fa-mobile-alt" },
    ],

    // Protocols & Data Formats (merged industrial protocols + API formats + data formats)
    protocols: [
        { id: "snmp", name: "SNMP", icon: "fas fa-exchange-alt" },
        { id: "modbus", name: "Modbus", icon: "fas fa-plug" },
        { id: "bacnet", name: "BACnet", icon: "fas fa-building" },
        { id: "rest-api", name: "REST API", icon: "fas fa-exchange-alt" },
        { id: "soap-api", name: "SOAP API", icon: "fas fa-envelope-open-text" },
        { id: "json", name: "JSON", icon: "fas fa-file-code" },
        { id: "xml", name: "XML", icon: "fas fa-file-code" },
        { id: "jwt", name: "JWT", icon: "fas fa-key" },
        { id: "nfc", name: "NFC", icon: "fas fa-wifi" },
    ],

    // DevOps & Tools (Git, CI/CD, containers, cloud - ATS keywords)
    devops: [
        { id: "docker", name: "Docker", icon: "fab fa-docker" },
        { id: "git", name: "Git", icon: "fab fa-git-alt" },
        { id: "github", name: "GitHub", icon: "fab fa-github" },
        { id: "github-actions", name: "GitHub Actions", icon: "fab fa-github" },
        { id: "cicd", name: "CI/CD", icon: "fas fa-sync-alt" },
        { id: "aws", name: "AWS", icon: "fab fa-aws" },
        { id: "nginx", name: "Nginx", icon: "fas fa-server" },
        { id: "gunicorn", name: "Gunicorn", icon: "fas fa-server" },
    ],

    // Databases
    databases: [
        { id: "postgresql", name: "PostgreSQL", icon: "fas fa-database" },
        { id: "mysql", name: "MySQL", icon: "fas fa-database" },
        { id: "redis", name: "Redis", icon: "fas fa-server" },
    ],
};

/**
 * Get section title in the specified language
 * @param {string} section - Section key
 * @param {string} lang - Language code (en, es, fr)
 * @returns {string} Section title in the specified language
 */
export const getSectionTitle = (section, lang = 'en') => {
    // Default to English if language not supported
    const language = ['en', 'es', 'fr', 'de'].includes(lang) ? lang : 'en';

    if (sectionTitles[section] && sectionTitles[section][language]) {
        return sectionTitles[section][language];
    }

    // Fallback to English or section key itself
    return sectionTitles[section]?.en || section;
};

/**
 * Get skills data in the current UI language
 * @returns {Object} Skills data with section titles in the current UI language
 */
export const getCurrentLanguageSkills = () => {
    // Get current language from window object if available
    const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';

    // Return the structure with translated section titles
    // Updated categories for Swiss market: languages, libraries, protocols, devops, databases
    return {
        title: getSectionTitle('skills', currentLang),
        languages: {
            title: getSectionTitle('languages', currentLang),
            items: skillsData.languages
        },
        libraries: {
            title: getSectionTitle('libraries', currentLang),
            items: skillsData.libraries
        },
        protocols: {
            title: getSectionTitle('protocols', currentLang),
            items: skillsData.protocols
        },
        devops: {
            title: getSectionTitle('devops', currentLang),
            items: skillsData.devops
        },
        databases: {
            title: getSectionTitle('databases', currentLang),
            items: skillsData.databases
        }
    };
};

// Re-export both getTechIcon and techIcons for compatibility with existing code
export { getTechIcon, techIcons };

// For compatibility with existing code
export default skillsData;
