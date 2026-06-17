/**
 * Skills data for CV with multilingual support
 * File: src/data/skills.js
 */

import { normalizeLang } from './_lang';

// Section titles with multilingual support
// Reorganized for Swiss market and ATS optimization
const sectionTitles = {
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
    },
};

// Base skills data with consistent IDs
// Reorganized for Swiss market: cleaner categories, removed IDEs, focused on ATS keywords
const skillsData = {
    // Programming Languages (backend focused - removed JavaScript)
    languages: [
        { id: "python", name: "Python", icon: "python" },
        { id: "csharp", name: "C#", icon: "microsoft" },
        { id: "dotnet", name: ".NET", icon: "windows" },
        { id: "java", name: "Java", icon: "java" },
    ],

    // Libraries and Frameworks (backend focused)
    libraries: [
        { id: "django", name: "Django", icon: "cubes" },
        { id: "fastapi", name: "FastAPI", icon: "bolt" },
        { id: "flask", name: "Flask", icon: "flask" },
        { id: "sqlalchemy", name: "SQLAlchemy", icon: "database" },
        { id: "alembic", name: "Alembic", icon: "code-branch" },
        { id: "celery", name: "Celery", icon: "tasks" },
        { id: "wpf", name: "WPF", icon: "desktop" },
        { id: "pytest", name: "Pytest", icon: "vial" },
    ],

    // Protocols & Data Formats (industrial protocols + API formats + data formats)
    protocols: [
        { id: "snmp", name: "SNMP", icon: "exchange-alt" },
        { id: "modbus", name: "Modbus", icon: "plug" },
        { id: "bacnet", name: "BACnet", icon: "building" },
        { id: "rest-api", name: "REST API", icon: "exchange-alt" },
        { id: "json", name: "JSON", icon: "file-code" },
        { id: "xml", name: "XML", icon: "file-code" },
        { id: "jwt", name: "JWT", icon: "key" },
        { id: "nfc", name: "NFC", icon: "wifi" },
    ],

    // DevOps & Tools (Git, CI/CD, containers, cloud - ATS keywords)
    devops: [
        { id: "docker", name: "Docker", icon: "docker" },
        { id: "git", name: "Git", icon: "git-alt" },
        { id: "github", name: "GitHub", icon: "github" },
        { id: "github-actions", name: "GitHub Actions", icon: "github" },
        { id: "cicd", name: "CI/CD", icon: "sync-alt" },
        { id: "aws", name: "AWS", icon: "aws" },
        { id: "nginx", name: "Nginx", icon: "server" },
        { id: "gunicorn", name: "Gunicorn", icon: "server" },
    ],

    // Databases
    databases: [
        { id: "postgresql", name: "PostgreSQL", icon: "database" },
        { id: "mysql", name: "MySQL", icon: "database" },
        { id: "redis", name: "Redis", icon: "server" },
    ],
};

/**
 * Get section title in the specified language
 * @param {string} section - Section key
 * @param {string} lang - Language code (en, es, fr)
 * @returns {string} Section title in the specified language
 */
export const getSectionTitle = (section, lang = 'en') => {
    const language = normalizeLang(lang);

    if (sectionTitles[section] && sectionTitles[section][language]) {
        return sectionTitles[section][language];
    }

    // Fallback to English or section key itself
    return sectionTitles[section]?.en || section;
};

export default skillsData;
