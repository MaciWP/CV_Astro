/**
 * Work experience data with multilingual support
 * File: src/data/experiences.js
 *
 * This data structure supports multiple languages while maintaining
 * the original terms for company names, technologies, and dates.
 */

// Base experiences data structure with translations
const experiencesData = [
  {
    id: "bjumper",
    title: "Senior Backend Developer",
    company: "Bjumper",
    companyUrl: "https://www.bjumper.com/",
    period: "2018 - Present",
    keyResponsibilities: {
      en: [
        "Design, development, and maintenance of integration solutions between industrial protocols (SNMP, MODBUS, BACnet, etc.) or external applications (PowerIQ, HPE IMC, Invision, VMware, etc.) and DCIM platforms (iTRACS, ITA, DCE, etc.)",
        "Development of scalable, agnostic microservices for data extraction, transformation, and loading (ETL) using REST APIs",
        "Participated in 8+ operational projects using agile methodologies (Kanban, Scrum)",
        "Used C#, Python, JavaScript, .NET (Framework & Core), Django, and Django REST Framework",
        "Worked with PostgreSQL, Docker, GitHub, AWS for database and DevOps operations",
      ],
      es: [
        "Diseño, desarrollo y mantenimiento de soluciones de integración entre protocolos industriales (SNMP, MODBUS, BACnet, etc.) o aplicaciones externas (PowerIQ, HPE IMC, Invision, VMware, etc.) y plataformas DCIM (iTRACS, ITA, DCE, etc.)",
        "Desarrollo de microservicios escalables y agnósticos para extracción, transformación y carga de datos (ETL) utilizando APIs REST",
        "Participación en más de 8 proyectos operativos utilizando metodologías ágiles (Kanban, Scrum)",
        "Uso de C#, Python, JavaScript, .NET (Framework y Core), Django y Django REST Framework",
        "Trabajo con PostgreSQL, Docker, GitHub, AWS para operaciones de base de datos y DevOps",
      ],
      fr: [
        "Conception, développement et maintenance de solutions d'intégration entre protocoles industriels (SNMP, MODBUS, BACnet, etc.) ou applications externes (PowerIQ, HPE IMC, Invision, VMware, etc.) et plateformes DCIM (iTRACS, ITA, DCE, etc.)",
        "Développement de microservices évolutifs et agnostiques pour l'extraction, la transformation et le chargement de données (ETL) utilisant des API REST",
        "Participation à plus de 8 projets opérationnels utilisant des méthodologies agiles (Kanban, Scrum)",
        "Utilisation de C#, Python, JavaScript, .NET (Framework & Core), Django et Django REST Framework",
        "Travail avec PostgreSQL, Docker, GitHub, AWS pour les opérations de base de données et DevOps",
      ],
    },
    extraResponsibilities: {
      en: [],
      es: [],
      fr: [],
    },
    achievements: {
      en: [
        "Independently developed an SNMP monitoring tool with an autodiscovery method that reduced discovery time by 80%",
        "Created an application to generate DDF configuration files using MIBs and SNMP walks, reducing development time by 90%",
        "Led the development of several core systems used by major enterprise clients",
      ],
      es: [
        "Desarrollé de forma independiente una herramienta de monitorización SNMP con un método de autodescubrimiento que redujo el tiempo de descubrimiento en un 80%",
        "Creé una aplicación para generar archivos de configuración DDF utilizando MIBs y SNMP walks, reduciendo el tiempo de desarrollo en un 90%",
        "Lideré el desarrollo de varios sistemas centrales utilizados por importantes clientes empresariales",
      ],
      fr: [
        "Développement indépendant d'un outil de surveillance SNMP avec une méthode d'auto-découverte qui a réduit le temps de découverte de 80%",
        "Création d'une application pour générer des fichiers de configuration DDF en utilisant MIBs et SNMP walks, réduisant le temps de développement de 90%",
        "Direction du développement de plusieurs systèmes centraux utilisés par d'importants clients entreprises",
      ],
    },
  },
  {
    id: "busmatick",
    title: "Junior Developer (Android/C#)",
    company: "Busmatick",
    companyUrl: "https://www.busmatick.com/",
    period: "2018",
    keyResponsibilities: {
      en: [
        "Developed mobile applications for Android and desktop applications for Windows focused on public transport card management",
        "Built a SOAP API to manage the backend for both applications",
        "Implemented NFC technology for MIFARE Classic 1K card operations",
      ],
      es: [
        "Desarrollo de aplicaciones móviles para Android y aplicaciones de escritorio para Windows enfocadas en la gestión de tarjetas de transporte público",
        "Construcción de una API SOAP para gestionar el backend de ambas aplicaciones",
        "Implementación de tecnología NFC para operaciones con tarjetas MIFARE Classic 1K",
      ],
      fr: [
        "Développement d'applications mobiles pour Android et d'applications de bureau pour Windows axées sur la gestion des cartes de transport public",
        "Construction d'une API SOAP pour gérer le backend des deux applications",
        "Implémentation de la technologie NFC pour les opérations de cartes MIFARE Classic 1K",
      ],
    },
    extraResponsibilities: {
      en: [],
      es: [],
      fr: [],
    },
    achievements: {
      en: [
        "Successfully implemented the complete RDR application for public transport cards",
        "Created a secure system for handling encrypted sensitive card operations",
        "Developed Bluetooth printing functionality for transaction receipts",
      ],
      es: [
        "Implementación exitosa de la aplicación RDR completa para tarjetas de transporte público",
        "Creación de un sistema seguro para manejar operaciones sensibles encriptadas de tarjetas",
        "Desarrollo de funcionalidad de impresión Bluetooth para recibos de transacciones",
      ],
      fr: [
        "Implémentation réussie de l'application RDR complète pour les cartes de transport public",
        "Création d'un système sécurisé pour gérer les opérations sensibles de cartes cryptées",
        "Développement de fonctionnalité d'impression Bluetooth pour les reçus de transactions",
      ],
    },
  },
  {
    id: "seres",
    title: "Support Technician",
    company: "SERES",
    companyUrl: "https://www.groupseres.com/",
    period: "2017",
    keyResponsibilities: {
      en: [
        "Provided bilingual customer support for electronic invoicing in EDI, XML, and proprietary formats",
        "Assisted clients in troubleshooting invoicing and data exchange issues",
        "Developed small internal applications to streamline invoice processing workflows",
      ],
      es: [
        "Proporcioné soporte al cliente bilingüe para facturación electrónica en formatos EDI, XML y propietarios",
        "Asistencia a clientes en la resolución de problemas de facturación e intercambio de datos",
        "Desarrollo de pequeñas aplicaciones internas para agilizar los flujos de trabajo de procesamiento de facturas",
      ],
      fr: [
        "Fourniture d'un support client bilingue pour la facturation électronique en formats EDI, XML et propriétaires",
        "Assistance aux clients pour la résolution des problèmes de facturation et d'échange de données",
        "Développement de petites applications internes pour simplifier les flux de travail de traitement des factures",
      ],
    },
    extraResponsibilities: {
      en: [],
      es: [],
      fr: [],
    },
    achievements: {
      en: [
        "Helped improve overall client satisfaction with faster and more accurate issue resolution",
      ],
      es: [
        "Contribuí a mejorar la satisfacción general del cliente con una resolución de problemas más rápida y precisa",
      ],
      fr: [
        "Contribution à l'amélioration de la satisfaction globale des clients grâce à une résolution plus rapide et plus précise des problèmes",
      ],
    },
  },
  {
    id: "educand",
    title: "IT Technician",
    company: "Educand SCCL",
    companyUrl: "https://iesnx.xtec.cat/",
    period: "2015 - 2017",
    keyResponsibilities: {
      en: [
        "Installed, configured, and maintained computer equipment and network infrastructure",
        "Mentored an intern and guided practical IT training",
      ],
      es: [
        "Instalación, configuración y mantenimiento de equipos informáticos e infraestructura de red",
        "Tutoría de un becario y guía de formación práctica en TI",
      ],
      fr: [
        "Installation, configuration et maintenance d'équipements informatiques et d'infrastructure réseau",
        "Mentorat d'un stagiaire et guidage de formation pratique en informatique",
      ],
    },
    extraResponsibilities: {
      en: [],
      es: [],
      fr: [],
    },
    achievements: {
      en: [
        "Increased operational efficiency by implementing structured maintenance schedules",
      ],
      es: [
        "Aumenté la eficiencia operativa mediante la implementación de programas de mantenimiento estructurados",
      ],
      fr: [
        "Augmentation de l'efficacité opérationnelle par la mise en œuvre de calendriers de maintenance structurés",
      ],
    },
  },
  {
    id: "saltcity",
    title: "Development Intern",
    company: "Salt City Council",
    companyUrl: "https://www.viladesalt.cat/",
    period: "2014 - 2015",
    keyResponsibilities: {
      en: [
        "Developed a database management application for the local police using WPF and C#",
      ],
      es: [
        "Desarrollé una aplicación de gestión de bases de datos para la policía local utilizando WPF y C#",
      ],
      fr: [
        "Développement d'une application de gestion de base de données pour la police locale utilisant WPF et C#",
      ],
    },
    extraResponsibilities: {
      en: [],
      es: [],
      fr: [],
    },
    achievements: {
      en: [
        "Successfully delivered a comprehensive database management system for the local police department",
        "Completed tasks as part of a Superior Degree professional internship program",
      ],
      es: [
        "Entregué con éxito un sistema integral de gestión de bases de datos para el departamento de policía local",
        "Completé tareas como parte de un programa de prácticas profesionales de Grado Superior",
      ],
      fr: [
        "Livraison réussie d'un système complet de gestion de base de données pour le département de police locale",
        "Réalisation des tâches dans le cadre d'un programme de stage professionnel de Degré Supérieur",
      ],
    },
  },
];

/**
 * Get experiences data in the specified language
 * @param {string} lang - Language code (en, es, fr)
 * @returns {Array} Experiences with texts in the specified language
 */
export const getExperiences = (lang = "en") => {
  // Default to English if language not supported
  const language = ["en", "es", "fr"].includes(lang) ? lang : "en";

  // Transform data structure to use the specified language
  return experiencesData.map((exp) => ({
    ...exp,
    keyResponsibilities:
      exp.keyResponsibilities[language] || exp.keyResponsibilities.en,
    extraResponsibilities:
      exp.extraResponsibilities[language] || exp.extraResponsibilities.en,
    achievements: exp.achievements[language] || exp.achievements.en,
  }));
};

/**
 * Get experiences data for the current UI language
 * @returns {Array} Experiences with texts in the current UI language
 */
export const getCurrentLanguageExperiences = () => {
  // Get current language from window object if available
  const currentLang =
    (typeof window !== "undefined" && window.CURRENT_LANGUAGE) || "en";
  return getExperiences(currentLang);
};

export default getCurrentLanguageExperiences;
