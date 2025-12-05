/**
 * Projects data with multilingual support
 * File: src/data/projects.js
 */

// Import helper function from new unified icons system
import { getTechIcon } from './icons';

// Personal projects with GitHub links and multilingual descriptions
const personalProjectsData = [
    {
        id: "swiss-cv",
        title: {
            en: "CV Portfolio",
            es: "Portfolio CV",
            fr: "Portfolio CV",
            de: "CV Portfolio"
        },
        description: {
            en: "Professional CV/portfolio website built with a clean, minimalist aesthetic, strong typography and structured layout for optimal presentation of credentials.",
            es: "Sitio web de CV/portfolio profesional construido con una estética limpia y minimalista, tipografía fuerte y diseño estructurado para una presentación óptima de credenciales.",
            fr: "Site web CV/portfolio professionnel construit avec une esthétique propre et minimaliste, une typographie forte et une mise en page structurée pour une présentation optimale des références.",
            de: "Professionelle CV/Portfolio-Webseite mit klarer, minimalistischer Ästhetik, starker Typografie und strukturiertem Layout für optimale Präsentation der Qualifikationen."
        },
        longDescription: {
            en: "This project is a responsive web application designed for optimal presentation of professional credentials. It features theme switching between light and dark modes, multilingual support, responsive design for all devices, and the ability to export the CV as PDF with a single click. The design follows international style principles with sharp corners, strong typography, and strategic use of accent colors.",
            es: "Este proyecto es una aplicación web responsiva diseñada para la presentación óptima de credenciales profesionales. Presenta cambio de tema entre modos claro y oscuro, soporte multilingüe, diseño responsivo para todos los dispositivos y la capacidad de exportar el CV como PDF con un solo clic. El diseño sigue principios de estilo internacional con esquinas afiladas, tipografía fuerte y uso estratégico de colores de acento.",
            fr: "Ce projet est une application web responsive conçue pour une présentation optimale des références professionnelles. Il comprend un changement de thème entre les modes clair et sombre, un support multilingue, un design responsive pour tous les appareils et la possibilité d'exporter le CV au format PDF en un seul clic. Le design suit les principes du style international avec des coins nets, une typographie forte et une utilisation stratégique des couleurs d'accentuation.",
            de: "Dieses Projekt ist eine responsive Webanwendung für die optimale Präsentation beruflicher Qualifikationen. Es bietet Theme-Wechsel zwischen Hell- und Dunkelmodus, mehrsprachige Unterstützung, responsives Design für alle Geräte und die Möglichkeit, den Lebenslauf mit einem Klick als PDF zu exportieren. Das Design folgt internationalen Stilprinzipien mit scharfen Ecken, starker Typografie und strategischem Einsatz von Akzentfarben."
        },
        technologies: ["Astro", "React", "Tailwind CSS", "i18n", "PWA"],
        icon: "fas fa-id-card",
        githubUrl: "https://github.com/MaciWP/CV_Astro",
        highlight: true,
        keyFeatures: {
            en: [
                "Responsive design optimized for all devices",
                "Theme switching with smooth transitions",
                "PDF export functionality",
                "Multilingual support (EN, ES, FR, DE)",
                "Progressive Web App capabilities"
            ],
            es: [
                "Diseño responsivo optimizado para todos los dispositivos",
                "Cambio de tema con transiciones suaves",
                "Funcionalidad de exportación a PDF",
                "Soporte multilingüe (EN, ES, FR, DE)",
                "Capacidades de Progressive Web App"
            ],
            fr: [
                "Design responsive optimisé pour tous les appareils",
                "Changement de thème avec transitions fluides",
                "Fonctionnalité d'exportation PDF",
                "Support multilingue (EN, ES, FR, DE)",
                "Capacités d'application web progressive"
            ],
            de: [
                "Responsives Design für alle Geräte optimiert",
                "Theme-Wechsel mit fliessenden Übergängen",
                "PDF-Export-Funktionalität",
                "Mehrsprachige Unterstützung (EN, ES, FR, DE)",
                "Progressive Web App Funktionen"
            ]
        }
    },
    {
        id: "snmp-monitor",
        title: {
            en: "SNMP Monitor",
            es: "Monitor SNMP",
            fr: "Moniteur SNMP",
            de: "SNMP-Monitor"
        },
        description: {
            en: "Comprehensive platform for network device monitoring via SNMP protocol, featuring automated discovery, real-time visualization, and MIB management for infrastructure tracking.",
            es: "Plataforma integral para la monitorización de dispositivos de red a través del protocolo SNMP, con descubrimiento automatizado, visualización en tiempo real y gestión MIB para el seguimiento de infraestructura.",
            fr: "Plateforme complète pour la surveillance des périphériques réseau via le protocole SNMP, comprenant la découverte automatisée, la visualisation en temps réel et la gestion MIB pour le suivi des infrastructures.",
            de: "Umfassende Plattform zur Überwachung von Netzwerkgeräten über das SNMP-Protokoll mit automatischer Erkennung, Echtzeit-Visualisierung und MIB-Verwaltung zur Infrastrukturüberwachung."
        },
        longDescription: {
            en: "SNMP Monitor is a specialized web platform for managing and monitoring network devices using the SNMP Protocol. The system automates the discovery, monitoring, and real-time visualization, significantly reducing problem detection time and improving incident response capability. The application is based on Django with asynchronous processing for intensive tasks.",
            es: "SNMP Monitor es una plataforma web especializada para la gestión y monitorización de dispositivos de red utilizando el Protocolo SNMP. El sistema automatiza el descubrimiento, monitorización y visualización en tiempo real, reduciendo significativamente el tiempo de detección de problemas y mejorando la capacidad de respuesta a incidentes. La aplicación está basada en Django con procesamiento asíncrono para tareas intensivas.",
            fr: "SNMP Monitor est une plateforme web spécialisée pour la gestion et la surveillance des périphériques réseau utilisant le protocole SNMP. Le système automatise la découverte, la surveillance et la visualisation en temps réel, réduisant considérablement le temps de détection des problèmes et améliorant la capacité de réponse aux incidents. L'application est basée sur Django avec un traitement asynchrone pour les tâches intensives.",
            de: "SNMP Monitor ist eine spezialisierte Webplattform zur Verwaltung und Überwachung von Netzwerkgeräten mit dem SNMP-Protokoll. Das System automatisiert Erkennung, Überwachung und Echtzeit-Visualisierung, reduziert die Problemerkennungszeit erheblich und verbessert die Incident-Response-Fähigkeit. Die Anwendung basiert auf Django mit asynchroner Verarbeitung für intensive Aufgaben."
        },
        technologies: ["Python", "Django", "PostgreSQL", "Celery", "Redis", "SNMP"],
        icon: "fas fa-network-wired",
        githubUrl: "https://github.com/MaciWP/TrackData",
        highlight: true,
        keyFeatures: {
            en: [
                "Automatic network device discovery",
                "Real-time monitoring with 5-second updates",
                "MIB management for enriched monitoring information",
                "Customizable visualization with various time ranges",
                "Scalable background task system for managing large device numbers"
            ],
            es: [
                "Descubrimiento automático de dispositivos de red",
                "Monitorización en tiempo real con actualizaciones cada 5 segundos",
                "Gestión MIB para información de monitorización enriquecida",
                "Visualización personalizable con varios rangos de tiempo",
                "Sistema de tareas en segundo plano escalable para gestionar gran número de dispositivos"
            ],
            fr: [
                "Découverte automatique des périphériques réseau",
                "Surveillance en temps réel avec mises à jour toutes les 5 secondes",
                "Gestion MIB pour des informations de surveillance enrichies",
                "Visualisation personnalisable avec différentes plages de temps",
                "Système de tâches en arrière-plan évolutif pour gérer un grand nombre d'appareils"
            ],
            de: [
                "Automatische Netzwerkgeräte-Erkennung",
                "Echtzeit-Überwachung mit 5-Sekunden-Updates",
                "MIB-Verwaltung für erweiterte Überwachungsinformationen",
                "Anpassbare Visualisierung mit verschiedenen Zeitbereichen",
                "Skalierbares Hintergrund-Task-System zur Verwaltung grosser Gerätezahlen"
            ]
        }
    },
    {
        id: "card-vision-tracker",
        title: {
            en: "Card Vision Tracker",
            es: "Rastreador de Cartas con Visión",
            fr: "Suivi de Cartes par Vision",
            de: "Karten-Vision-Tracker"
        },
        description: {
            en: "Computer vision application for real-time card detection and score tracking using ONNX models, achieving >90% accuracy in card recognition.",
            es: "Aplicación de visión por computadora para detección de cartas en tiempo real y seguimiento de puntuación usando modelos ONNX, logrando >90% de precisión en reconocimiento.",
            fr: "Application de vision par ordinateur pour la détection de cartes en temps réel et le suivi des scores utilisant des modèles ONNX, atteignant >90% de précision.",
            de: "Computer-Vision-Anwendung für Echtzeit-Kartenerkennung und Punkteverfolgung mit ONNX-Modellen, >90% Genauigkeit bei der Kartenerkennung."
        },
        longDescription: {
            en: "This computer vision application automates card detection and score tracking using machine learning. It provides real-time card recognition through a trained ONNX model, capable of processing multiple cards simultaneously with over 90% accuracy. The system includes player management, score calculation, image processing pipeline, and game history tracking components.",
            es: "Esta aplicación de visión por computadora automatiza la detección de cartas y el seguimiento de puntuación usando aprendizaje automático. Proporciona reconocimiento de cartas en tiempo real a través de un modelo ONNX entrenado, capaz de procesar múltiples cartas simultáneamente con más del 90% de precisión. El sistema incluye gestión de jugadores, cálculo de puntuación, pipeline de procesamiento de imágenes y seguimiento del historial.",
            fr: "Cette application de vision par ordinateur automatise la détection des cartes et le suivi des scores en utilisant l'apprentissage automatique. Elle fournit une reconnaissance des cartes en temps réel grâce à un modèle ONNX entraîné, capable de traiter plusieurs cartes simultanément avec plus de 90% de précision. Le système comprend la gestion des joueurs, le calcul des scores, le pipeline de traitement d'images et le suivi de l'historique.",
            de: "Diese Computer-Vision-Anwendung automatisiert Kartenerkennung und Punkteverfolgung mittels maschinellem Lernen. Sie bietet Echtzeit-Kartenerkennung durch ein trainiertes ONNX-Modell, das mehrere Karten gleichzeitig mit über 90% Genauigkeit verarbeiten kann. Das System umfasst Spielerverwaltung, Punkteberechnung, Bildverarbeitungs-Pipeline und Spielhistorie-Tracking."
        },
        technologies: ["Python", "Kivy", "ONNX", "NumPy"],
        icon: "fas fa-eye",
        githubUrl: "https://github.com/MaciWP/SnapScore",
        highlight: true,
        keyFeatures: {
            en: [
                "Real-time card detection using ONNX neural network",
                "Computer vision achieving >90% recognition accuracy",
                "Cross-platform interface built with Kivy",
                "Processes up to 10 cards simultaneously per image",
                "80% faster than manual score tracking",
                "Complete player and game history management"
            ],
            es: [
                "Detección de cartas en tiempo real usando red neuronal ONNX",
                "Visión por computadora con >90% de precisión en reconocimiento",
                "Interfaz multiplataforma construida con Kivy",
                "Procesa hasta 10 cartas simultáneamente por imagen",
                "80% más rápido que el seguimiento manual de puntuación",
                "Gestión completa de jugadores e historial de juegos"
            ],
            fr: [
                "Détection de cartes en temps réel utilisant un réseau neuronal ONNX",
                "Vision par ordinateur atteignant >90% de précision de reconnaissance",
                "Interface multiplateforme construite avec Kivy",
                "Traite jusqu'à 10 cartes simultanément par image",
                "80% plus rapide que le suivi manuel des scores",
                "Gestion complète des joueurs et de l'historique des jeux"
            ],
            de: [
                "Echtzeit-Kartenerkennung mit ONNX-Neuronalnetz",
                "Computer Vision mit >90% Erkennungsgenauigkeit",
                "Plattformübergreifende Oberfläche mit Kivy erstellt",
                "Verarbeitet bis zu 10 Karten gleichzeitig pro Bild",
                "80% schneller als manuelle Punkteverfolgung",
                "Vollständige Spieler- und Spielhistorie-Verwaltung"
            ]
        }
    }
];

// Professional projects without GitHub links (proprietary) with multilingual support
const professionalProjectsData = [
    {
        id: "thinkdata-backend",
        title: {
            en: "ThinkData Backend",
            es: "Backend ThinkData",
            fr: "Backend ThinkData",
            de: "ThinkData Backend"
        },
        company: "Bjumper",
        description: {
            en: "Advanced datacenter management platform with AI capabilities, providing real-time monitoring, analysis and optimization of datacenter infrastructure.",
            es: "Plataforma avanzada de gestión de centros de datos con capacidades de IA, que proporciona monitorización en tiempo real, análisis y optimización de infraestructura de centros de datos.",
            fr: "Plateforme avancée de gestion de centre de données avec des capacités d'IA, fournissant une surveillance en temps réel, une analyse et une optimisation de l'infrastructure du centre de données.",
            de: "Fortschrittliche Rechenzentrum-Management-Plattform mit KI-Funktionen, die Echtzeit-Überwachung, Analyse und Optimierung der Rechenzentrumsinfrastruktur bietet."
        },
        longDescription: {
            en: "ThinkData is a comprehensive datacenter management platform that provides a unified experience for infrastructure administration. The system includes advanced features like natural language queries through AI technologies, multitenancy architecture, and real-time metric analysis. The platform supports complex datacenter hierarchies and integrates with various data sources for comprehensive monitoring and management.",
            es: "ThinkData es una plataforma integral de gestión de centros de datos que proporciona una experiencia unificada para la administración de infraestructura. El sistema incluye características avanzadas como consultas en lenguaje natural a través de tecnologías de IA, arquitectura multiinquilino y análisis de métricas en tiempo real. La plataforma admite jerarquías complejas de centros de datos y se integra con varias fuentes de datos para una monitorización y gestión integral.",
            fr: "ThinkData est une plateforme complète de gestion de centre de données qui offre une expérience unifiée pour l'administration de l'infrastructure. Le système comprend des fonctionnalités avancées comme des requêtes en langage naturel grâce aux technologies d'IA, une architecture multi-locataires et une analyse métrique en temps réel. La plateforme prend en charge des hiérarchies complexes de centres de données et s'intègre à diverses sources de données pour une surveillance et une gestion complètes.",
            de: "ThinkData ist eine umfassende Rechenzentrum-Management-Plattform, die eine einheitliche Erfahrung für die Infrastrukturverwaltung bietet. Das System umfasst erweiterte Funktionen wie natürlichsprachliche Abfragen durch KI-Technologien, Mandantenfähigkeit und Echtzeit-Metrikanalyse. Die Plattform unterstützt komplexe Rechenzentrumshierarchien und integriert verschiedene Datenquellen für umfassende Überwachung und Verwaltung."
        },
        technologies: ["Python", "Django", "PostgreSQL", "Docker", "REST API", "AWS"],
        icon: "fas fa-server",
        highlight: true,
        keyFeatures: {
            en: [
                "AI-powered natural language queries for datacenter data",
                "Multitenancy architecture with isolated databases per client",
                "Complex hierarchical modeling of datacenter components",
                "Real-time monitoring and visualization of infrastructure metrics",
                "Asynchronous processing of metric and structure files"
            ],
            es: [
                "Consultas en lenguaje natural impulsadas por IA para datos de centros de datos",
                "Arquitectura multiinquilino con bases de datos aisladas por cliente",
                "Modelado jerárquico complejo de componentes de centros de datos",
                "Monitorización y visualización en tiempo real de métricas de infraestructura",
                "Procesamiento asíncrono de archivos de métricas y estructura"
            ],
            fr: [
                "Requêtes en langage naturel alimentées par l'IA pour les données du centre de données",
                "Architecture multi-locataires avec bases de données isolées par client",
                "Modélisation hiérarchique complexe des composants du centre de données",
                "Surveillance et visualisation en temps réel des métriques d'infrastructure",
                "Traitement asynchrone des fichiers de métriques et de structure"
            ],
            de: [
                "KI-gestützte natürlichsprachliche Abfragen für Rechenzentrumsdaten",
                "Mandantenfähige Architektur mit isolierten Datenbanken pro Kunde",
                "Komplexe hierarchische Modellierung von Rechenzentrumskomponenten",
                "Echtzeit-Überwachung und Visualisierung von Infrastrukturmetriken",
                "Asynchrone Verarbeitung von Metrik- und Strukturdateien"
            ]
        }
    },
    {
        id: "itracs-service",
        title: {
            en: "iTRACS MicroService",
            es: "MicroServicio iTRACS",
            fr: "MicroService iTRACS",
            de: "iTRACS MicroService"
        },
        company: "Bjumper",
        description: {
            en: "Bidirectional integration platform for synchronizing datacenter infrastructure data between multiple heterogeneous systems and iTRACS DCIM platform.",
            es: "Plataforma de integración bidireccional para sincronizar datos de infraestructura de centros de datos entre múltiples sistemas heterogéneos y la plataforma iTRACS DCIM.",
            fr: "Plateforme d'intégration bidirectionnelle pour synchroniser les données d'infrastructure de centre de données entre plusieurs systèmes hétérogènes et la plateforme iTRACS DCIM.",
            de: "Bidirektionale Integrationsplattform zur Synchronisierung von Rechenzentrumsinfrastrukturdaten zwischen mehreren heterogenen Systemen und der iTRACS DCIM-Plattform."
        },
        longDescription: {
            en: "This integration platform provides seamless synchronization between various datacenter management systems (HPE IMC, VMware, TakeData, ThinkData) and the iTRACS DCIM platform. The system automates asset documentation, optimizes infrastructure monitoring, and centralizes critical operational data in real-time, significantly improving datacenter management efficiency.",
            es: "Esta plataforma de integración proporciona sincronización perfecta entre varios sistemas de gestión de centros de datos (HPE IMC, VMware, TakeData, ThinkData) y la plataforma iTRACS DCIM. El sistema automatiza la documentación de activos, optimiza la monitorización de infraestructura y centraliza datos operativos críticos en tiempo real, mejorando significativamente la eficiencia en la gestión de centros de datos.",
            fr: "Cette plateforme d'intégration fournit une synchronisation transparente entre divers systèmes de gestion de centre de données (HPE IMC, VMware, TakeData, ThinkData) et la plateforme iTRACS DCIM. Le système automatise la documentation des actifs, optimise la surveillance de l'infrastructure et centralise les données opérationnelles critiques en temps réel, améliorant considérablement l'efficacité de la gestion des centres de données.",
            de: "Diese Integrationsplattform bietet nahtlose Synchronisation zwischen verschiedenen Rechenzentrum-Managementsystemen (HPE IMC, VMware, TakeData, ThinkData) und der iTRACS DCIM-Plattform. Das System automatisiert Asset-Dokumentation, optimiert Infrastrukturüberwachung und zentralisiert kritische Betriebsdaten in Echtzeit, wodurch die Rechenzentrumsverwaltungseffizienz erheblich verbessert wird."
        },
        technologies: ["Python", "Django", "REST API", "PostgreSQL", "Docker"],
        icon: "fas fa-exchange-alt",
        highlight: true,
        keyFeatures: {
            en: [
                "Bidirectional data synchronization with 99.5% success rate",
                "Intelligent retry mechanism with batch processing",
                "Comprehensive error handling with detailed contextual information",
                "Reduced data update time between systems by 95%",
                "Improved asset inventory accuracy by 85%"
            ],
            es: [
                "Sincronización de datos bidireccional con tasa de éxito del 99,5%",
                "Mecanismo inteligente de reintento con procesamiento por lotes",
                "Manejo integral de errores con información contextual detallada",
                "Tiempo de actualización de datos entre sistemas reducido en un 95%",
                "Precisión del inventario de activos mejorada en un 85%"
            ],
            fr: [
                "Synchronisation bidirectionnelle des données avec un taux de réussite de 99,5%",
                "Mécanisme de réessai intelligent avec traitement par lots",
                "Gestion complète des erreurs avec informations contextuelles détaillées",
                "Temps de mise à jour des données entre systèmes réduit de 95%",
                "Amélioration de la précision de l'inventaire des actifs de 85%"
            ],
            de: [
                "Bidirektionale Datensynchronisation mit 99,5% Erfolgsrate",
                "Intelligenter Wiederholungsmechanismus mit Stapelverarbeitung",
                "Umfassende Fehlerbehandlung mit detaillierten Kontextinformationen",
                "Datenaktualisierungszeit zwischen Systemen um 95% reduziert",
                "Asset-Inventargenauigkeit um 85% verbessert"
            ]
        }
    },
    {
        id: "hpeimc-service",
        title: {
            en: "HPE IMC Service",
            es: "Servicio HPE IMC",
            fr: "Service HPE IMC",
            de: "HPE IMC Service"
        },
        company: "Bjumper",
        description: {
            en: "Service designed to extract, process and synchronize network infrastructure data from HPE Intelligent Management Center (IMC) to external systems.",
            es: "Servicio diseñado para extraer, procesar y sincronizar datos de infraestructura de red desde HPE Intelligent Management Center (IMC) a sistemas externos.",
            fr: "Service conçu pour extraire, traiter et synchroniser les données d'infrastructure réseau du Centre de Gestion Intelligent HPE (IMC) vers des systèmes externes.",
            de: "Service zur Extraktion, Verarbeitung und Synchronisation von Netzwerkinfrastrukturdaten vom HPE Intelligent Management Center (IMC) zu externen Systemen."
        },
        longDescription: {
            en: "This integration service automates the collection and processing of network performance metrics from HPE IMC, facilitating centralized monitoring and optimizing IT infrastructure management. The system implements a comprehensive ETL process with robust error handling and retry mechanisms to ensure data reliability and consistency.",
            es: "Este servicio de integración automatiza la recolección y procesamiento de métricas de rendimiento de red desde HPE IMC, facilitando la monitorización centralizada y optimizando la gestión de infraestructura de TI. El sistema implementa un proceso ETL integral con manejo robusto de errores y mecanismos de reintento para asegurar la fiabilidad y consistencia de los datos.",
            fr: "Ce service d'intégration automatise la collecte et le traitement des métriques de performance réseau de HPE IMC, facilitant la surveillance centralisée et optimisant la gestion de l'infrastructure informatique. Le système implémente un processus ETL complet avec une gestion robuste des erreurs et des mécanismes de réessai pour assurer la fiabilité et la cohérence des données.",
            de: "Dieser Integrationsservice automatisiert die Erfassung und Verarbeitung von Netzwerk-Performance-Metriken aus HPE IMC, erleichtert zentralisierte Überwachung und optimiert das IT-Infrastrukturmanagement. Das System implementiert einen umfassenden ETL-Prozess mit robuster Fehlerbehandlung und Wiederholungsmechanismen zur Gewährleistung von Datenzuverlässigkeit und -konsistenz."
        },
        technologies: ["Python", "Django", "PostgreSQL", "Docker", "REST API"],
        icon: "fas fa-network-wired",
        highlight: true,
        keyFeatures: {
            en: [
                "Efficient data collection from 1,000+ network devices in under 5 minutes",
                "95% reduction in infrastructure problem detection time",
                "Optimized database queries reducing API response time by 60%",
                "Advanced retry mechanisms with exponential backoff",
                "Detailed logging and error tracking system"
            ],
            es: [
                "Recolección eficiente de datos de más de 1.000 dispositivos de red en menos de 5 minutos",
                "Reducción del 95% en el tiempo de detección de problemas de infraestructura",
                "Consultas de base de datos optimizadas que reducen el tiempo de respuesta de la API en un 60%",
                "Mecanismos avanzados de reintento con retroceso exponencial",
                "Sistema detallado de registro y seguimiento de errores"
            ],
            fr: [
                "Collecte efficace de données de plus de 1 000 périphériques réseau en moins de 5 minutes",
                "Réduction de 95% du temps de détection des problèmes d'infrastructure",
                "Requêtes de base de données optimisées réduisant le temps de réponse de l'API de 60%",
                "Mécanismes de réessai avancés avec backoff exponentiel",
                "Système détaillé de journalisation et de suivi des erreurs"
            ],
            de: [
                "Effiziente Datenerfassung von über 1.000 Netzwerkgeräten in unter 5 Minuten",
                "95% Reduzierung der Infrastruktur-Problemerkennungszeit",
                "Optimierte Datenbankabfragen reduzieren API-Antwortzeit um 60%",
                "Erweiterte Wiederholungsmechanismen mit exponentiellem Backoff",
                "Detailliertes Logging- und Fehlerverfolgungssystem"
            ]
        }
    },
    {
        id: "vmware-service",
        title: {
            en: "VMware MicroService",
            es: "MicroServicio VMware",
            fr: "MicroService VMware",
            de: "VMware MicroService"
        },
        company: "Bjumper",
        description: {
            en: "Backend service for collecting, storing and exposing VMware infrastructure data, including hypervisors and virtual machines, through RESTful APIs.",
            es: "Servicio backend para recopilar, almacenar y exponer datos de infraestructura VMware, incluyendo hipervisores y máquinas virtuales, a través de APIs RESTful.",
            fr: "Service backend pour collecter, stocker et exposer les données d'infrastructure VMware, y compris les hyperviseurs et les machines virtuelles, via des API RESTful.",
            de: "Backend-Service zur Erfassung, Speicherung und Bereitstellung von VMware-Infrastrukturdaten, einschliesslich Hypervisoren und virtuellen Maschinen, über RESTful-APIs."
        },
        longDescription: {
            en: "This project provides an abstraction layer for monitoring virtualized resources and facilitating integration with other enterprise systems. The service implements asynchronous ETL processes to extract data from VMware, transform it according to the domain model, and load it into the database. It includes a synchronization service with external systems and features robust error handling and logging.",
            es: "Este proyecto proporciona una capa de abstracción para monitorizar recursos virtualizados y facilitar la integración con otros sistemas empresariales. El servicio implementa procesos ETL asíncronos para extraer datos de VMware, transformarlos según el modelo de dominio y cargarlos en la base de datos. Incluye un servicio de sincronización con sistemas externos y cuenta con un sólido manejo de errores y registro.",
            fr: "Ce projet fournit une couche d'abstraction pour surveiller les ressources virtualisées et faciliter l'intégration avec d'autres systèmes d'entreprise. Le service implémente des processus ETL asynchrones pour extraire les données de VMware, les transformer selon le modèle de domaine et les charger dans la base de données. Il comprend un service de synchronisation avec des systèmes externes et dispose d'une gestion robuste des erreurs et de journalisation.",
            de: "Dieses Projekt bietet eine Abstraktionsschicht zur Überwachung virtualisierter Ressourcen und zur Erleichterung der Integration mit anderen Unternehmenssystemen. Der Service implementiert asynchrone ETL-Prozesse zur Extraktion von Daten aus VMware, deren Transformation gemäss Domänenmodell und Laden in die Datenbank. Er umfasst einen Synchronisationsservice mit externen Systemen und verfügt über robuste Fehlerbehandlung und Logging."
        },
        technologies: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic"],
        icon: "fas fa-cloud",
        highlight: true,
        keyFeatures: {
            en: [
                "Asynchronous ETL for VMware infrastructure data",
                "FastAPI RESTful endpoints with automatic OpenAPI documentation",
                "Batch processing with 70% faster data collection",
                "99.9% data accuracy through automated capture processes",
                "Structured logging and error management",
                "Integration with external systems through API"
            ],
            es: [
                "ETL asíncrono para datos de infraestructura VMware",
                "Endpoints RESTful de FastAPI con documentación automática OpenAPI",
                "Procesamiento por lotes con recopilación de datos un 70% más rápida",
                "Precisión de datos del 99,9% mediante procesos de captura automatizados",
                "Registro estructurado y gestión de errores",
                "Integración con sistemas externos a través de API"
            ],
            fr: [
                "ETL asynchrone pour les données d'infrastructure VMware",
                "Points de terminaison RESTful FastAPI avec documentation OpenAPI automatique",
                "Traitement par lots avec collecte de données 70% plus rapide",
                "Précision des données de 99,9% grâce à des processus de capture automatisés",
                "Journalisation structurée et gestion des erreurs",
                "Intégration avec des systèmes externes via API"
            ],
            de: [
                "Asynchroner ETL für VMware-Infrastrukturdaten",
                "FastAPI RESTful-Endpunkte mit automatischer OpenAPI-Dokumentation",
                "Stapelverarbeitung mit 70% schnellerer Datenerfassung",
                "99,9% Datengenauigkeit durch automatisierte Erfassungsprozesse",
                "Strukturiertes Logging und Fehlermanagement",
                "Integration mit externen Systemen über API"
            ]
        }
    },
    {
        id: "nfc-assets-manager",
        title: {
            en: "NFC Assets Manager",
            es: "Gestor de Activos NFC",
            fr: "Gestionnaire d'Actifs NFC",
            de: "NFC Asset-Manager"
        },
        company: "Bjumper",
        description: {
            en: "Comprehensive IT asset management system using NFC technology to track and manage datacenter equipment and infrastructure assets.",
            es: "Sistema integral de gestión de activos de TI que utiliza tecnología NFC para rastrear y administrar equipos de centro de datos y activos de infraestructura.",
            fr: "Système complet de gestion des actifs informatiques utilisant la technologie NFC pour suivre et gérer les équipements de centre de données et les actifs d'infrastructure.",
            de: "Umfassendes IT-Asset-Management-System mit NFC-Technologie zur Verfolgung und Verwaltung von Rechenzentrumsausrüstung und Infrastruktur-Assets."
        },
        longDescription: {
            en: "This system provides complete lifecycle management for IT infrastructure assets with NFC tracking capabilities. It features a multi-tenant architecture with separate databases per client, hierarchical location management, and comprehensive asset categorization. The system supports audit workflows, maintenance tracking, and integration with external systems through webhooks.",
            es: "Este sistema proporciona una gestión completa del ciclo de vida de los activos de infraestructura de TI con capacidades de seguimiento NFC. Presenta una arquitectura multiinquilino con bases de datos separadas por cliente, gestión jerárquica de ubicaciones y categorización integral de activos. El sistema admite flujos de trabajo de auditoría, seguimiento de mantenimiento e integración con sistemas externos a través de webhooks.",
            fr: "Ce système fournit une gestion complète du cycle de vie des actifs d'infrastructure informatique avec des capacités de suivi NFC. Il présente une architecture multi-locataires avec des bases de données séparées par client, une gestion hiérarchique des emplacements et une catégorisation complète des actifs. Le système prend en charge les flux de travail d'audit, le suivi de maintenance et l'intégration avec des systèmes externes via des webhooks.",
            de: "Dieses System bietet vollständiges Lebenszyklusmanagement für IT-Infrastruktur-Assets mit NFC-Tracking-Funktionen. Es verfügt über eine mandantenfähige Architektur mit separaten Datenbanken pro Kunde, hierarchische Standortverwaltung und umfassende Asset-Kategorisierung. Das System unterstützt Audit-Workflows, Wartungsverfolgung und Integration mit externen Systemen über Webhooks."
        },
        technologies: ["Python", "Django", "PostgreSQL", "REST API", "NFC", "AWS"],
        icon: "fas fa-tags",
        highlight: true,
        keyFeatures: {
            en: [
                "Multi-tenant architecture with database isolation per client",
                "NFC-based asset tracking reducing inventory time by 85%",
                "Hierarchical location management (DataCenter → Room → Row → Rack)",
                "JWT authentication with 2FA via email OTP",
                "Comprehensive asset categorization (IT, Network, Energy, Climate)",
                "S3 integration for image and file storage"
            ],
            es: [
                "Arquitectura multiinquilino con aislamiento de base de datos por cliente",
                "Seguimiento de activos basado en NFC reduciendo el tiempo de inventario en un 85%",
                "Gestión jerárquica de ubicaciones (Centro de Datos → Sala → Fila → Rack)",
                "Autenticación JWT con 2FA vía OTP por correo electrónico",
                "Categorización integral de activos (TI, Red, Energía, Clima)",
                "Integración con S3 para almacenamiento de imágenes y archivos"
            ],
            fr: [
                "Architecture multi-locataires avec isolation de base de données par client",
                "Suivi d'actifs basé sur NFC réduisant le temps d'inventaire de 85%",
                "Gestion hiérarchique des emplacements (Centre de Données → Salle → Rangée → Rack)",
                "Authentification JWT avec 2FA via OTP par e-mail",
                "Catégorisation complète des actifs (IT, Réseau, Énergie, Climat)",
                "Intégration S3 pour le stockage d'images et de fichiers"
            ],
            de: [
                "Mandantenfähige Architektur mit Datenbank-Isolation pro Kunde",
                "NFC-basiertes Asset-Tracking reduziert Inventarzeit um 85%",
                "Hierarchische Standortverwaltung (Rechenzentrum → Raum → Reihe → Rack)",
                "JWT-Authentifizierung mit 2FA über E-Mail-OTP",
                "Umfassende Asset-Kategorisierung (IT, Netzwerk, Energie, Klima)",
                "S3-Integration für Bild- und Dateispeicherung"
            ]
        }
    },
    {
        id: "poweriq-integration",
        title: {
            en: "PowerIQ-ITA Service",
            es: "Servicio PowerIQ-ITA",
            fr: "Service PowerIQ-ITA",
            de: "PowerIQ-ITA Service"
        },
        company: "Bjumper",
        description: {
            en: "Bidirectional integration between Data Center Operations (DCO/ITA) and PowerIQ for unified datacenter infrastructure management.",
            es: "Integración bidireccional entre Data Center Operations (DCO/ITA) y PowerIQ para una gestión unificada de infraestructura de centro de datos.",
            fr: "Intégration bidirectionnelle entre Data Center Operations (DCO/ITA) et PowerIQ pour une gestion unifiée de l'infrastructure de centre de données.",
            de: "Bidirektionale Integration zwischen Data Center Operations (DCO/ITA) und PowerIQ für einheitliches Rechenzentrumsinfrastruktur-Management."
        },
        longDescription: {
            en: "This integration solution enables bidirectional synchronization of devices, configurations, and states between DCO/ITA and PowerIQ systems. The project created a unified system for monitoring, control, and efficient management of datacenter infrastructure, with special focus on energy management.",
            es: "Esta solución de integración permite la sincronización bidireccional de dispositivos, configuraciones y estados entre los sistemas DCO/ITA y PowerIQ. El proyecto creó un sistema unificado para la monitorización, control y gestión eficiente de la infraestructura del centro de datos, con especial enfoque en la gestión energética.",
            fr: "Cette solution d'intégration permet la synchronisation bidirectionnelle des appareils, des configurations et des états entre les systèmes DCO/ITA et PowerIQ. Le projet a créé un système unifié pour la surveillance, le contrôle et la gestion efficace de l'infrastructure du centre de données, avec un accent particulier sur la gestion de l'énergie.",
            de: "Diese Integrationslösung ermöglicht bidirektionale Synchronisation von Geräten, Konfigurationen und Zuständen zwischen DCO/ITA- und PowerIQ-Systemen. Das Projekt schuf ein einheitliches System für Überwachung, Steuerung und effizientes Management der Rechenzentrumsinfrastruktur mit besonderem Fokus auf Energiemanagement."
        },
        technologies: ["C#", ".NET", "REST API", "PostgreSQL", "XML"],
        icon: "fas fa-bolt",
        highlight: true,
        keyFeatures: {
            en: [
                "Bidirectional synchronization with object mapping system",
                "85% reduction in energy infrastructure management time",
                "Real-time monitoring of power status for all datacenter devices",
                "Automated report generation reducing time from 4 hours to 2 minutes",
                "100% improvement in data accuracy through duplication elimination"
            ],
            es: [
                "Sincronización bidireccional con sistema de mapeo de objetos",
                "Reducción del 85% en el tiempo de gestión de infraestructura energética",
                "Monitorización en tiempo real del estado de energía de todos los dispositivos del centro de datos",
                "Generación automatizada de informes reduciendo el tiempo de 4 horas a 2 minutos",
                "Mejora del 100% en la precisión de datos mediante la eliminación de duplicaciones"
            ],
            fr: [
                "Synchronisation bidirectionnelle avec système de mappage d'objets",
                "Réduction de 85% du temps de gestion de l'infrastructure énergétique",
                "Surveillance en temps réel de l'état d'alimentation de tous les périphériques du centre de données",
                "Génération automatisée de rapports réduisant le temps de 4 heures à 2 minutes",
                "Amélioration de 100% de la précision des données par élimination des doublons"
            ],
            de: [
                "Bidirektionale Synchronisation mit Objekt-Mapping-System",
                "85% Reduzierung der Energieinfrastruktur-Verwaltungszeit",
                "Echtzeit-Überwachung des Stromstatus aller Rechenzentrumsgeräte",
                "Automatisierte Berichtserstellung reduziert Zeit von 4 Stunden auf 2 Minuten",
                "100% Verbesserung der Datengenauigkeit durch Duplikateliminierung"
            ]
        }
    }
];

/**
 * Get personal projects in the specified language
 * @param {string} lang - Language code (en, es, fr, de)
 * @returns {Array} Projects with texts in the specified language
 */
export function getPersonalProjects(lang = 'en') {
    // Default to English if language not supported
    const language = ['en', 'es', 'fr', 'de'].includes(lang) ? lang : 'en';

    // Transform data structure to use the specified language
    return personalProjectsData.map(project => ({
        ...project,
        title: project.title[language] || project.title.en,
        description: project.description[language] || project.description.en,
        longDescription: project.longDescription[language] || project.longDescription.en,
        keyFeatures: project.keyFeatures[language] || project.keyFeatures.en
    }));
}

/**
 * Get professional projects in the specified language
 * @param {string} lang - Language code (en, es, fr, de)
 * @returns {Array} Projects with texts in the specified language
 */
export function getProfessionalProjects(lang = 'en') {
    // Default to English if language not supported
    const language = ['en', 'es', 'fr', 'de'].includes(lang) ? lang : 'en';

    // Transform data structure to use the specified language
    return professionalProjectsData.map(project => ({
        ...project,
        title: project.title[language] || project.title.en,
        description: project.description[language] || project.description.en,
        longDescription: project.longDescription[language] || project.longDescription.en,
        keyFeatures: project.keyFeatures[language] || project.keyFeatures.en
    }));
}

/**
 * Get personal projects for the current UI language
 * @returns {Array} Projects with texts in the current UI language
 */
export function getCurrentLanguagePersonalProjects() {
    // Get current language from window object if available
    const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';
    return getPersonalProjects(currentLang);
}

/**
 * Get professional projects for the current UI language
 * @returns {Array} Projects with texts in the current UI language
 */
export function getCurrentLanguageProfessionalProjects() {
    // Get current language from window object if available
    const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';
    return getProfessionalProjects(currentLang);
}

// Re-export getTechIcon for compatibility
export { getTechIcon };

// For compatibility with existing code - now after defining the functions
export const personalProjects = getPersonalProjects('en');
export const professionalProjects = getProfessionalProjects('en');

export default {
    personalProjects,
    professionalProjects
};

