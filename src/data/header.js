// path: src/data/header.js
/**
 * Header data for CV with multilingual support
 * Adjusted to match the real profile: backend (Python/Django), REST APIs,
 * industrial integration (SNMP, Modbus, BACnet), and practical CI/CD/testing experience.
 */

// Base header data structure with translations
const headerData = {
  fullName: "Oriol Macias",
  jobTitle: {
    en: "Backend Developer",
    es: "Desarrollador Backend",
    fr: "Développeur Backend",
    de: "Backend-Entwickler"
  },
  summary: {
    en: "Backend developer with around 7 years of programming experience, specialized in Python/Django and REST APIs. Experienced in integrating industrial protocols (SNMP, Modbus, BACnet) and delivering reliable solutions. Practical experience with CI/CD and testing, currently expanding knowledge in performance optimization and AI-assisted automation.",
    es: "Desarrollador backend con aproximadamente 7 años de experiencia en programación, especializado en Python/Django y APIs REST. Experiencia en integración de protocolos industriales (SNMP, Modbus, BACnet) y entrega de soluciones fiables. Experiencia práctica con CI/CD y testing, actualmente ampliando conocimientos en optimización de rendimiento y automatización asistida por IA.",
    fr: "Développeur backend avec environ 7 ans d'expérience en programmation, spécialisé en Python/Django et APIs REST. Expérimenté dans l'intégration de protocoles industriels (SNMP, Modbus, BACnet) et la livraison de solutions fiables. Expérience pratique avec CI/CD et tests, actuellement en train d'élargir mes connaissances en optimisation des performances et automatisation assistée par IA.",
    de: "Backend-Entwickler mit rund 7 Jahren Programmiererfahrung, spezialisiert auf Python/Django und REST-APIs. Erfahren in der Integration industrieller Protokolle (SNMP, Modbus, BACnet) und der Bereitstellung zuverlässiger Lösungen. Praktische Erfahrung mit CI/CD und Testing, derzeit Erweiterung der Kenntnisse in Leistungsoptimierung und KI-gestützter Automatisierung."
  },
  photoAlt: {
    en: "Oriol Macias - Backend Developer",
    es: "Oriol Macias - Desarrollador Backend",
    fr: "Oriol Macias - Développeur Backend",
    de: "Oriol Macias - Backend-Entwickler"
  },
  contactInfo: [
    {
      type: "email",
      label: {
        en: "Email",
        es: "Correo",
        fr: "Email",
        de: "E-Mail"
      },
      value: "oriolomb@gmail.com",
      icon: "fas fa-envelope",
    },
    {
      type: "linkedin",
      label: {
        en: "LinkedIn",
        es: "LinkedIn",
        fr: "LinkedIn",
        de: "LinkedIn"
      },
      value: "oriolmaciasbadosa",
      url: "https://linkedin.com/in/oriolmaciasbadosa",
      icon: "fab fa-linkedin",
    },
    {
      type: "github",
      label: {
        en: "GitHub",
        es: "GitHub",
        fr: "GitHub",
        de: "GitHub"
      },
      value: "MaciWP",
      url: "https://github.com/MaciWP",
      icon: "fab fa-github",
    },
  ],
  photoUrl: "/images/oriol_macias-960.avif",
};

/**
 * Get header data in the specified language
 * @param {string} lang - Language code (en, es, fr, de)
 * @returns {Object} Header data with texts in the specified language
 */
export const getHeader = (lang = 'en') => {
  // Default to English if language not supported
  const language = ['en', 'es', 'fr', 'de'].includes(lang) ? lang : 'en';

  return {
    fullName: headerData.fullName,
    jobTitle: headerData.jobTitle[language] || headerData.jobTitle.en,
    summary: headerData.summary[language] || headerData.summary.en,
    photoAlt: headerData.photoAlt[language] || headerData.photoAlt.en,
    photoUrl: headerData.photoUrl,
    contactInfo: headerData.contactInfo.map(contact => ({
      ...contact,
      label: contact.label[language] || contact.label.en
    }))
  };
};

/**
 * Get header data for the current UI language
 * @returns {Object} Header data with texts in the current UI language
 */
export const getCurrentLanguageHeader = () => {
  const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';
  return getHeader(currentLang);
};

// For compatibility with existing code - export English version as default
const defaultHeader = {
  fullName: headerData.fullName,
  jobTitle: headerData.jobTitle.en,
  summary: headerData.summary.en,
  photoAlt: headerData.photoAlt.en,
  photoUrl: headerData.photoUrl,
  contactInfo: headerData.contactInfo.map(contact => ({
    ...contact,
    label: contact.label.en
  }))
};

export default defaultHeader;
