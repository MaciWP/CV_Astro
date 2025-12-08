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
        title: {
            en: "Senior Backend Developer",
            es: "Desarrollador Backend Senior",
            fr: "Développeur Backend Senior",
            de: "Senior Backend-Entwickler"
        },
        company: "Bjumper",
        companyUrl: "https://www.bjumper.com/",
        period: {
            en: "2018 - Present",
            es: "2018 - Actualidad",
            fr: "2018 - Présent",
            de: "2018 - Heute"
        },
        keyResponsibilities: {
            en: [
                "Design, development, and maintenance of integration solutions between industrial protocols (SNMP, Modbus, BACnet, etc.) or external applications (PowerIQ, HPE IMC, Invision, VMware, etc.) and DCIM platforms (iTRACS, ITA, DCE, etc.)",
                "Development of scalable, agnostic microservices for data extraction, transformation, and loading (ETL) using REST APIs",
                "Participated in 8+ operational projects using agile methodologies (Kanban, Scrum)",
                "Used C#, Python, JavaScript, .NET (Framework & Core), Django, and Django REST Framework",
                "Worked with PostgreSQL, Docker, GitHub, AWS for database and DevOps operations"
            ],
            es: [
                "Diseño, desarrollo y mantenimiento de soluciones de integración entre protocolos industriales (SNMP, Modbus, BACnet, etc.) o aplicaciones externas (PowerIQ, HPE IMC, Invision, VMware, etc.) y plataformas DCIM (iTRACS, ITA, DCE, etc.)",
                "Desarrollo de microservicios escalables y agnósticos para extracción, transformación y carga de datos (ETL) utilizando APIs REST",
                "Participación en más de 8 proyectos operativos utilizando metodologías ágiles (Kanban, Scrum)",
                "Uso de C#, Python, JavaScript, .NET (Framework y Core), Django y Django REST Framework",
                "Trabajo con PostgreSQL, Docker, GitHub, AWS para operaciones de base de datos y DevOps"
            ],
            fr: [
                "Conception, développement et maintenance de solutions d'intégration entre protocoles industriels (SNMP, Modbus, BACnet, etc.) ou applications externes (PowerIQ, HPE IMC, Invision, VMware, etc.) et plateformes DCIM (iTRACS, ITA, DCE, etc.)",
                "Développement de microservices évolutifs et agnostiques pour l'extraction, la transformation et le chargement de données (ETL) utilisant des API REST",
                "Participation à plus de 8 projets opérationnels utilisant des méthodologies agiles (Kanban, Scrum)",
                "Utilisation de C#, Python, JavaScript, .NET (Framework & Core), Django et Django REST Framework",
                "Travail avec PostgreSQL, Docker, GitHub, AWS pour les opérations de base de données et DevOps"
            ],
            de: [
                "Entwurf, Entwicklung und Wartung von Integrationslösungen zwischen industriellen Protokollen (SNMP, Modbus, BACnet, etc.) oder externen Anwendungen (PowerIQ, HPE IMC, Invision, VMware, etc.) und DCIM-Plattformen (iTRACS, ITA, DCE, etc.)",
                "Entwicklung skalierbarer, agnostischer Microservices für Datenextraktion, -transformation und -laden (ETL) mit REST-APIs",
                "Teilnahme an über 8 operativen Projekten mit agilen Methoden (Kanban, Scrum)",
                "Verwendung von C#, Python, JavaScript, .NET (Framework & Core), Django und Django REST Framework",
                "Arbeit mit PostgreSQL, Docker, GitHub, AWS für Datenbank- und DevOps-Operationen"
            ]
        },
        extraResponsibilities: {
            en: [],
            es: [],
            fr: [],
            de: []
        },
        achievements: {
            en: [
                "Independently developed an SNMP monitoring tool with an autodiscovery method that significantly reduced discovery time",
                "Created an application to generate DDF configuration files using MIBs and SNMP walks, drastically reducing development time",
                "Led the development of several core systems used by major enterprise clients"
            ],
            es: [
                "Desarrollé de forma independiente una herramienta de monitorización SNMP con un método de autodescubrimiento que redujo significativamente el tiempo de descubrimiento",
                "Creé una aplicación para generar archivos de configuración DDF utilizando MIBs y SNMP walks, reduciendo drásticamente el tiempo de desarrollo",
                "Lideré el desarrollo de varios sistemas centrales utilizados por importantes clientes empresariales"
            ],
            fr: [
                "Développement indépendant d'un outil de surveillance SNMP avec une méthode d'auto-découverte qui a réduit significativement le temps de découverte",
                "Création d'une application pour générer des fichiers de configuration DDF en utilisant MIBs et SNMP walks, réduisant drastiquement le temps de développement",
                "Direction du développement de plusieurs systèmes centraux utilisés par d'importants clients entreprises"
            ],
            de: [
                "Eigenständige Entwicklung eines SNMP-Überwachungstools mit einer Autodiscovery-Methode, die die Erkennungszeit erheblich reduzierte",
                "Erstellung einer Anwendung zur Generierung von DDF-Konfigurationsdateien mit MIBs und SNMP-Walks, wodurch die Entwicklungszeit drastisch reduziert wurde",
                "Leitung der Entwicklung mehrerer Kernsysteme für grosse Unternehmenskunden"
            ]
        },
        techStack: ["Python", "Django", "Docker", "Modbus/SNMP", "PostgreSQL"]
    },
    {
        id: "busmatick",
        title: {
            en: "Junior Developer (Android/C#)",
            es: "Desarrollador Junior (Android/C#)",
            fr: "Développeur Junior (Android/C#)",
            de: "Junior-Entwickler (Android/C#)"
        },
        company: "Busmatick",
        companyUrl: "https://www.busmatick.com/",
        period: "2018",
        keyResponsibilities: {
            en: [
                "Developed mobile applications for Android and desktop applications for Windows focused on public transport card management",
                "Built a SOAP API to manage the backend for both applications",
                "Implemented NFC technology for MIFARE Classic 1K card operations"
            ],
            es: [
                "Desarrollo de aplicaciones móviles para Android y aplicaciones de escritorio para Windows enfocadas en la gestión de tarjetas de transporte público",
                "Construcción de una API SOAP para gestionar el backend de ambas aplicaciones",
                "Implementación de tecnología NFC para operaciones con tarjetas MIFARE Classic 1K"
            ],
            fr: [
                "Développement d'applications mobiles pour Android et d'applications de bureau pour Windows axées sur la gestion des cartes de transport public",
                "Construction d'une API SOAP pour gérer le backend des deux applications",
                "Implémentation de la technologie NFC pour les opérations de cartes MIFARE Classic 1K"
            ],
            de: [
                "Entwicklung von mobilen Anwendungen für Android und Desktop-Anwendungen für Windows mit Fokus auf ÖV-Kartenverwaltung",
                "Aufbau einer SOAP-API zur Verwaltung des Backends für beide Anwendungen",
                "Implementierung von NFC-Technologie für MIFARE Classic 1K-Kartenoperationen"
            ]
        },
        extraResponsibilities: {
            en: [],
            es: [],
            fr: [],
            de: []
        },
        achievements: {
            en: [
                "Successfully implemented the complete RDR application for public transport cards",
                "Created a secure system for handling encrypted sensitive card operations",
                "Developed Bluetooth printing functionality for transaction receipts"
            ],
            es: [
                "Implementación exitosa de la aplicación RDR completa para tarjetas de transporte público",
                "Creación de un sistema seguro para manejar operaciones sensibles encriptadas de tarjetas",
                "Desarrollo de funcionalidad de impresión Bluetooth para recibos de transacciones"
            ],
            fr: [
                "Implémentation réussie de l'application RDR complète pour les cartes de transport public",
                "Création d'un système sécurisé pour gérer les opérations sensibles de cartes cryptées",
                "Développement de fonctionnalité d'impression Bluetooth pour les reçus de transactions"
            ],
            de: [
                "Erfolgreiche Implementierung der vollständigen RDR-Anwendung für ÖV-Karten",
                "Erstellung eines sicheren Systems für verschlüsselte sensible Kartenoperationen",
                "Entwicklung von Bluetooth-Druckfunktionalität für Transaktionsbelege"
            ]
        },
        techStack: ["C#", "Android", "SOAP", "NFC"]
    },
    {
        id: "early-career",
        title: {
            en: "Systems Administrator & IT Support",
            es: "Administrador de Sistemas y Soporte IT",
            fr: "Administrateur Systèmes et Support IT",
            de: "Systemadministrator & IT-Support"
        },
        company: "SERES, Educand SCCL, Salt City Council",
        companyUrl: null,
        period: "2014 - 2017",
        collapsible: true, // This job will be collapsed by default at the card level
        keyResponsibilities: {
            en: [
                "SERES (2017): Technical support for electronic invoicing platform, resolving EDI/XML format issues and ensuring compliance with Spanish e-invoicing regulations",
                "Educand SCCL (2015-2017): End-to-end administration of IT infrastructure for an educational center (800+ users). Managed deployment and maintenance of 500 workstations, 300 laptops, 10 physical servers, and full network topology (cabling, switching, and 20+ Access Points).",
                "Salt City Council (2014-2016): Development intern creating internal WPF/C# applications for municipal database management and citizen services"
            ],
            es: [
                "SERES (2017): Soporte técnico para plataforma de facturación electrónica, resolviendo incidencias en formatos EDI/XML y asegurando cumplimiento con normativa española de factura-e",
                "Educand SCCL (2015-2017): Administración integral de infraestructura IT para centro educativo (800+ usuarios). Gestión de despliegue y mantenimiento de 500 estaciones de trabajo, 300 portátiles, 10 servidores físicos y topología de red completa (cableado, switching y 20+ puntos de acceso).",
                "Ayuntamiento de Salt (2014-2016): Becario de desarrollo creando aplicaciones internas WPF/C# para gestión de bases de datos municipales y servicios ciudadanos"
            ],
            fr: [
                "SERES (2017): Support technique pour plateforme de facturation électronique, résolution des problèmes de formats EDI/XML et conformité aux réglementations espagnoles",
                "Educand SCCL (2015-2017): Administration complète de l'infrastructure IT pour un centre éducatif (800+ utilisateurs). Gestion du déploiement et maintenance de 500 postes de travail, 300 ordinateurs portables, 10 serveurs physiques et topologie réseau complète (câblage, commutation et 20+ points d'accès).",
                "Mairie de Salt (2014-2016): Stagiaire développement créant des applications internes WPF/C# pour gestion de bases de données municipales et services citoyens"
            ],
            de: [
                "SERES (2017): Technischer Support für elektronische Rechnungsplattform, Lösung von EDI/XML-Formatproblemen und Einhaltung spanischer E-Rechnungsvorschriften",
                "Educand SCCL (2015-2017): Vollständige IT-Infrastrukturverwaltung für ein Bildungszentrum (800+ Benutzer). Verwaltung von Bereitstellung und Wartung von 500 Arbeitsplätzen, 300 Laptops, 10 physischen Servern und vollständiger Netzwerktopologie (Verkabelung, Switching und 20+ Access Points).",
                "Stadtverwaltung Salt (2014-2016): Entwicklungspraktikant mit Erstellung interner WPF/C#-Anwendungen für kommunale Datenbankverwaltung und Bürgerdienste"
            ]
        },
        extraResponsibilities: {
            en: [],
            es: [],
            fr: [],
            de: []
        },
        achievements: {
            en: [
                "Resolved 200+ technical support tickets at SERES with high first-contact resolution rate",
                "Implemented network infrastructure upgrade at Educand SCCL with measurable reduction in downtime",
                "Delivered municipal database application still in active use at Salt City Council",
                "Completed Higher Technical Degree professional internship with distinction"
            ],
            es: [
                "Resolví más de 200 tickets de soporte técnico en SERES con alta tasa de resolución en primer contacto",
                "Implementé actualización de infraestructura de red en Educand SCCL con reducción medible del tiempo de inactividad",
                "Entregué aplicación de base de datos municipal aún en uso activo en el Ayuntamiento de Salt",
                "Completé prácticas profesionales del Grado Superior con mención de honor"
            ],
            fr: [
                "Résolution de plus de 200 tickets de support technique chez SERES avec un taux élevé de résolution au premier contact",
                "Mise en œuvre d'une mise à niveau de l'infrastructure réseau chez Educand SCCL avec réduction mesurable des temps d'arrêt",
                "Livraison d'une application de base de données municipale toujours en utilisation active à la Mairie de Salt",
                "Stage professionnel du Diplôme Supérieur complété avec mention"
            ],
            de: [
                "Lösung von über 200 technischen Support-Tickets bei SERES mit hoher Erstlösungsquote",
                "Implementierung eines Netzwerk-Infrastruktur-Upgrades bei Educand SCCL mit messbarer Reduzierung der Ausfallzeiten",
                "Bereitstellung einer kommunalen Datenbankanwendung, die bei der Stadtverwaltung Salt noch aktiv genutzt wird",
                "Berufspraktikum des höheren Fachdiploms mit Auszeichnung abgeschlossen"
            ]
        },
        techStack: ["Windows Server", "Network Admin", "Hardware Maintenance"]
    }
];

/**
 * Get experiences data in the specified language
 * @param {string} lang - Language code (en, es, fr, de)
 * @returns {Array} Experiences with texts in the specified language
 */
export const getExperiences = (lang = 'en') => {
    // Default to English if language not supported
    const language = ['en', 'es', 'fr', 'de'].includes(lang) ? lang : 'en';

    // Transform data structure to use the specified language
    return experiencesData.map(exp => ({
        ...exp,
        // Handle title - can be string or object
        title: typeof exp.title === 'object' ? (exp.title[language] || exp.title.en) : exp.title,
        // Handle period - can be string or object
        period: typeof exp.period === 'object' ? (exp.period[language] || exp.period.en) : exp.period,
        keyResponsibilities: exp.keyResponsibilities[language] || exp.keyResponsibilities.en,
        extraResponsibilities: exp.extraResponsibilities[language] || exp.extraResponsibilities.en,
        achievements: exp.achievements[language] || exp.achievements.en,
        techStack: exp.techStack || [],
        collapsible: exp.collapsible || false
    }));
};

/**
 * Get experiences data for the current UI language
 * @returns {Array} Experiences with texts in the current UI language
 */
export const getCurrentLanguageExperiences = () => {
    // Get current language from window object if available
    const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';
    return getExperiences(currentLang);
};

export default getCurrentLanguageExperiences;
