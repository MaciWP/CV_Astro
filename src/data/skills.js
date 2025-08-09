/**
 * Skills data for CV with multilingual support
 * File: src/data/skills.js
 */

// Importar el nuevo sistema unificado de iconos
import { techIcons, getTechIcon } from './icons';

// Section titles with multilingual support
export const sectionTitles = {
    skills: {
        en: "Technical Skills",
        es: "Habilidades Técnicas",
        fr: "Compétences Techniques"
    },
    languages: {
        en: "Programming Languages",
        es: "Lenguajes de Programación",
        fr: "Langages de Programmation"
    },
    libraries: {
        en: "Libraries & Frameworks",
        es: "Librerías y Frameworks",
        fr: "Bibliothèques et Frameworks"
    },
    technologies: {
        en: "Technologies & Databases",
        es: "Tecnologías y Bases de Datos",
        fr: "Technologies et Bases de Données"
    },
    tools: {
        en: "Tools & Applications",
        es: "Herramientas y Aplicaciones",
        fr: "Outils et Applications"
    },
    protocols: {
        en: "Protocols",
        es: "Protocolos",
        fr: "Protocoles"
    }
};

// Base skills data with consistent IDs
const skillsData = {
    // Programming Languages
    languages: [
        { id: "csharp", name: "C#", icon: "fab fa-microsoft" },
        { id: "python", name: "Python", icon: "fab fa-python" },
        { id: "java", name: "Java", icon: "fab fa-java" },
        { id: "dotnet", name: ".NET", icon: "fab fa-windows" },
        { id: "javascript", name: "JavaScript", icon: "fab fa-js" },
        { id: "html", name: "HTML", icon: "fab fa-html5" },
        { id: "xml", name: "XML", icon: "fas fa-file-code" },
        { id: "json", name: "JSON", icon: "fas fa-file-code" },
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
        { id: "black", name: "Black", icon: "fas fa-check" },
        { id: "flake8", name: "Flake8", icon: "fas fa-ruler" },
        { id: "mypy", name: "Mypy", icon: "fas fa-check-circle" },
    ],

    // Technologies and Databases
    technologies: [
        { id: "docker", name: "Docker", icon: "fab fa-docker" },
        { id: "github", name: "GitHub", icon: "fab fa-github" },
        { id: "aws", name: "AWS", icon: "fab fa-aws" },
        { id: "postgresql", name: "PostgreSQL", icon: "fas fa-database" },
        { id: "mysql", name: "MySQL", icon: "fas fa-database" },
        { id: "redis", name: "Redis", icon: "fas fa-server" },
        { id: "git", name: "Git", icon: "fab fa-git-alt" },
        { id: "cicd", name: "CI/CD", icon: "fas fa-sync-alt" },
        { id: "github-actions", name: "GitHub Actions", icon: "fab fa-github" },
        { id: "rest-api", name: "REST API", icon: "fas fa-exchange-alt" },
        { id: "soap-api", name: "SOAP API", icon: "fas fa-envelope-open-text" },
        { id: "jwt", name: "JWT", icon: "fas fa-key" },
        { id: "vmware", name: "VMware", icon: "fab fa-vmware" },
        { id: "nfc", name: "NFC", icon: "fas fa-wifi" },
    ],

    // Tools and Applications
    tools: [
        { id: "pycharm", name: "PyCharm", icon: "fas fa-edit" },
        { id: "visual-studio", name: "Visual Studio", icon: "fas fa-tv" },
        { id: "vscode", name: "VS Code", icon: "fas fa-code" },
        { id: "cursor", name: "Cursor", icon: "fas fa-i-cursor" },
        { id: "postman", name: "Postman", icon: "fas fa-paper-plane" },
        { id: "bruno", name: "Bruno", icon: "fas fa-cube" },
        { id: "mibrowser", name: "MiBrowser", icon: "fas fa-search" },
        { id: "modscan", name: "Modscan", icon: "fas fa-network-wired" },
        { id: "ita", name: "ITA", icon: "fas fa-server" },
        { id: "dce", name: "DCE", icon: "fas fa-cogs" },
        { id: "poweriq", name: "PowerIQ", icon: "fas fa-bolt" },
        { id: "itracs", name: "iTRACS", icon: "fas fa-map-marked" },
        { id: "hpe-imc", name: "HPE IMC", icon: "fas fa-network-wired" },
        { id: "gunicorn", name: "Gunicorn", icon: "fas fa-server" },
        { id: "nginx", name: "Nginx", icon: "fas fa-server" },
    ],

    // Protocols
    protocols: [
        { id: "snmp", name: "SNMP", icon: "fas fa-exchange-alt" },
        { id: "modbus", name: "Modbus", icon: "fas fa-plug" },
        { id: "bacnet", name: "BACnet", icon: "fas fa-building" },
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
    const language = ['en', 'es', 'fr'].includes(lang) ? lang : 'en';

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
        technologies: {
            title: getSectionTitle('technologies', currentLang),
            items: skillsData.technologies
        },
        tools: {
            title: getSectionTitle('tools', currentLang),
            items: skillsData.tools
        },
        protocols: {
            title: getSectionTitle('protocols', currentLang),
            items: skillsData.protocols
        }
    };
};

// Re-exportamos tanto getTechIcon como techIcons para mantener compatibilidad con el código existente
export { getTechIcon, techIcons };

// For compatibility with existing code
export default skillsData;