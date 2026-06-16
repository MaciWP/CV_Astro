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
    en: "Senior Backend Developer | Industrial IoT, Integrations & AI",
    es: "Desarrollador Backend Senior | IoT Industrial, Integraciones e IA",
    fr: "Développeur Backend Senior | IoT Industriel, Intégrations & IA",
    de: "Senior Backend-Entwickler | Industrielles IoT, Integrationen & KI"
  },
  // Swiss market required fields
  dateOfBirth: "1994",
  nationality: {
    en: "Spanish (EU Citizen)",
    es: "Española (Ciudadano UE)",
    fr: "Espagnole (Citoyen UE)",
    de: "Spanisch (EU-Bürger)"
  },
  workPermit: {
    en: "B-Permit Eligible",
    es: "Elegible para Permiso B",
    fr: "Éligible Permis B",
    de: "B-Bewilligung berechtigt"
  },
  location: {
    en: "Madrid, Spain",
    es: "Madrid, España",
    fr: "Madrid, Espagne",
    de: "Madrid, Spanien"
  },
  relocation: {
    en: "Open to relocation to Switzerland",
    es: "Abierto a reubicación en Suiza",
    fr: "Ouvert à la relocalisation en Suisse",
    de: "Offen für Umzug in die Schweiz"
  },
  noticePeriod: {
    en: "2 weeks notice",
    es: "Preaviso de 2 semanas",
    fr: "Préavis de 2 semaines",
    de: "2 Wochen Kündigungsfrist"
  },
  summary: {
    en: "Backend developer with over 8 years of programming experience, specialized in Python/Django and REST APIs. Experienced in integrating industrial protocols (SNMP, Modbus, BACnet) and delivering reliable solutions. Practical experience with CI/CD and testing, currently expanding knowledge in performance optimization and AI-assisted automation.",
    es: "Desarrollador backend con más de 8 años de experiencia en programación, especializado en Python/Django y APIs REST. Experiencia en integración de protocolos industriales (SNMP, Modbus, BACnet) y entrega de soluciones fiables. Experiencia práctica con CI/CD y testing, actualmente ampliando conocimientos en optimización de rendimiento y automatización asistida por IA.",
    fr: "Développeur backend avec plus de 8 ans d'expérience en programmation, spécialisé en Python/Django et APIs REST. Expérimenté dans l'intégration de protocoles industriels (SNMP, Modbus, BACnet) et la livraison de solutions fiables. Expérience pratique avec CI/CD et tests, actuellement en train d'élargir mes connaissances en optimisation des performances et automatisation assistée par IA.",
    de: "Backend-Entwickler mit über 8 Jahren Programmiererfahrung, spezialisiert auf Python/Django und REST-APIs. Erfahren in der Integration industrieller Protokolle (SNMP, Modbus, BACnet) und der Bereitstellung zuverlässiger Lösungen. Praktische Erfahrung mit CI/CD und Testing, derzeit Erweiterung der Kenntnisse in Leistungsoptimierung und KI-gestützter Automatisierung."
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
};

// English-flattened version used as the default import (fallback strings)
const defaultHeader = {
  fullName: headerData.fullName,
  jobTitle: headerData.jobTitle.en,
  // Swiss market fields
  dateOfBirth: headerData.dateOfBirth,
  nationality: headerData.nationality.en,
  workPermit: headerData.workPermit.en,
  location: headerData.location.en,
  relocation: headerData.relocation.en,
  noticePeriod: headerData.noticePeriod.en,
  summary: headerData.summary.en,
  photoAlt: headerData.photoAlt.en,
  contactInfo: headerData.contactInfo.map(contact => ({
    ...contact,
    label: contact.label.en
  }))
};

export default defaultHeader;
