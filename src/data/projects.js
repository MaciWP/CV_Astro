/**
 * Projects data with multilingual support
 * File: src/data/projects.js
 */

// Import helper function for tech icons
import { getTechIcon } from './techIcons';

// Personal projects with GitHub links and multilingual descriptions
const personalProjectsData = [
    {
        id: "swiss-cv",
        title: {
            en: "CV Portfolio",
            es: "Portfolio CV",
            fr: "Portfolio CV"
        },
        description: {
            en: "Professional CV/portfolio website built with a clean, minimalist aesthetic, strong typography and structured layout for optimal presentation of credentials.",
            es: "Sitio web de CV/portfolio profesional construido con una estética limpia y minimalista, tipografía fuerte y diseño estructurado para una presentación óptima de credenciales.",
            fr: "Site web CV/portfolio professionnel construit avec une esthétique propre et minimaliste, une typographie forte et une mise en page structurée pour une présentation optimale des références."
        },
        longDescription: {
            en: "This project is a responsive web application designed for optimal presentation of professional credentials. It features theme switching between light and dark modes, multilingual support, responsive design for all devices, and the ability to export the CV as PDF with a single click. The design follows international style principles with sharp corners, strong typography, and strategic use of accent colors.",
            es: "Este proyecto es una aplicación web responsiva diseñada para la presentación óptima de credenciales profesionales. Presenta cambio de tema entre modos claro y oscuro, soporte multilingüe, diseño responsivo para todos los dispositivos y la capacidad de exportar el CV como PDF con un solo clic. El diseño sigue principios de estilo internacional con esquinas afiladas, tipografía fuerte y uso estratégico de colores de acento.",
            fr: "Ce projet est une application web responsive conçue pour une présentation optimale des références professionnelles. Il comprend un changement de thème entre les modes clair et sombre, un support multilingue, un design responsive pour tous les appareils et la possibilité d'exporter le CV au format PDF en un seul clic. Le design suit les principes du style international avec des coins nets, une typographie forte et une utilisation stratégique des couleurs d'accentuation."
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
                "Multilingual support (EN, ES, FR)",
                "Progressive Web App capabilities"
            ],
            es: [
                "Diseño responsivo optimizado para todos los dispositivos",
                "Cambio de tema con transiciones suaves",
                "Funcionalidad de exportación a PDF",
                "Soporte multilingüe (EN, ES, FR)",
                "Capacidades de Progressive Web App"
            ],
            fr: [
                "Design responsive optimisé pour tous les appareils",
                "Changement de thème avec transitions fluides",
                "Fonctionnalité d'exportation PDF",
                "Support multilingue (EN, ES, FR)",
                "Capacités d'application web progressive"
            ]
        }
    },
    {
        id: "snmp-monitor",
        title: {
            en: "SNMP Monitor",
            es: "Monitor SNMP",
            fr: "Moniteur SNMP"
        },
        description: {
            en: "Comprehensive platform for network device monitoring via SNMP protocol, featuring automated discovery, real-time visualization, and MIB management for infrastructure tracking.",
            es: "Plataforma integral para la monitorización de dispositivos de red a través del protocolo SNMP, con descubrimiento automatizado, visualización en tiempo real y gestión MIB para el seguimiento de infraestructura.",
            fr: "Plateforme complète pour la surveillance des périphériques réseau via le protocole SNMP, comprenant la découverte automatisée, la visualisation en temps réel et la gestion MIB pour le suivi des infrastructures."
        },
        longDescription: {
            en: "SNMP Monitor is a specialized web platform for managing and monitoring network devices using the SNMP Protocol. The system automates the discovery, monitoring, and real-time visualization, significantly reducing problem detection time and improving incident response capability. The application is based on Django with asynchronous processing for intensive tasks.",
            es: "SNMP Monitor es una plataforma web especializada para la gestión y monitorización de dispositivos de red utilizando el Protocolo SNMP. El sistema automatiza el descubrimiento, monitorización y visualización en tiempo real, reduciendo significativamente el tiempo de detección de problemas y mejorando la capacidad de respuesta a incidentes. La aplicación está basada en Django con procesamiento asíncrono para tareas intensivas.",
            fr: "SNMP Monitor est une plateforme web spécialisée pour la gestion et la surveillance des périphériques réseau utilisant le protocole SNMP. Le système automatise la découverte, la surveillance et la visualisation en temps réel, réduisant considérablement le temps de détection des problèmes et améliorant la capacité de réponse aux incidents. L'application est basée sur Django avec un traitement asynchrone pour les tâches intensives."
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
            ]
        }
    },
    {
        id: "pelusas-calculator",
        title: {
            en: "Pelusas Calculator",
            es: "Calculadora Pelusas",
            fr: "Calculateur Pelusas"
        },
        description: {
            en: "Specialized application for calculating and managing scores for the card game 'Pelusas', featuring both manual score entry and automatic card detection through image processing.",
            es: "Aplicación especializada para calcular y gestionar puntuaciones para el juego de cartas 'Pelusas', con entrada manual de puntuación y detección automática de cartas mediante procesamiento de imágenes.",
            fr: "Application spécialisée pour calculer et gérer les scores du jeu de cartes 'Pelusas', comprenant à la fois la saisie manuelle des scores et la détection automatique des cartes par traitement d'image."
        },
        longDescription: {
            en: "This application was developed to automate the calculation and tracking of scores for the card game 'Pelusas'. It provides a versatile tool that allows both manual score entry and automatic card detection using computer vision. The system includes player management, score calculation, image processing, and game history tracking components. The computer vision component uses a trained model to recognize specific numbered cards (values 1-10).",
            es: "Esta aplicación fue desarrollada para automatizar el cálculo y seguimiento de puntuaciones para el juego de cartas 'Pelusas'. Proporciona una herramienta versátil que permite tanto la entrada manual de puntuaciones como la detección automática de cartas mediante visión por computadora. El sistema incluye componentes de gestión de jugadores, cálculo de puntuación, procesamiento de imágenes y seguimiento del historial de juegos. El componente de visión por computadora utiliza un modelo entrenado para reconocer cartas numeradas específicas (valores 1-10).",
            fr: "Cette application a été développée pour automatiser le calcul et le suivi des scores pour le jeu de cartes 'Pelusas'. Elle fournit un outil polyvalent qui permet à la fois la saisie manuelle des scores et la détection automatique des cartes à l'aide de la vision par ordinateur. Le système comprend des composants de gestion des joueurs, de calcul des scores, de traitement d'images et de suivi de l'historique des jeux. Le composant de vision par ordinateur utilise un modèle entraîné pour reconnaître des cartes numérotées spécifiques (valeurs 1-10)."
        },
        technologies: ["Python", "Kivy", "ONNX", "NumPy"],
        icon: "fas fa-calculator",
        githubUrl: "https://github.com/MaciWP/SnapScore",
        highlight: true,
        keyFeatures: {
            en: [
                "Cross-platform interface built with Kivy",
                "Computer vision for automatic card detection (>90% accuracy)",
                "Player management system",
                "Game history tracking",
                "Reduces calculation time by 80% compared to manual methods",
                "Processes up to 10 cards simultaneously in a single image"
            ],
            es: [
                "Interfaz multiplataforma construida con Kivy",
                "Visión por computadora para detección automática de cartas (>90% de precisión)",
                "Sistema de gestión de jugadores",
                "Seguimiento del historial de juegos",
                "Reduce el tiempo de cálculo en un 80% comparado con métodos manuales",
                "Procesa hasta 10 cartas simultáneamente en una sola imagen"
            ],
            fr: [
                "Interface multiplateforme construite avec Kivy",
                "Vision par ordinateur pour la détection automatique des cartes (précision >90%)",
                "Système de gestion des joueurs",
                "Suivi de l'historique des jeux",
                "Réduit le temps de calcul de 80% par rapport aux méthodes manuelles",
                "Traite jusqu'à 10 cartes simultanément dans une seule image"
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
            fr: "Backend ThinkData"
        },
        company: "Bjumper",
        description: {
            en: "Advanced datacenter management platform with AI capabilities, providing real-time monitoring, analysis and optimization of datacenter infrastructure.",
            es: "Plataforma avanzada de gestión de centros de datos con capacidades de IA, que proporciona monitorización en tiempo real, análisis y optimización de infraestructura de centros de datos.",
            fr: "Plateforme avancée de gestion de centre de données avec des capacités d'IA, fournissant une surveillance en temps réel, une analyse et une optimisation de l'infrastructure du centre de données."
        },
        longDescription: {
            en: "ThinkData is a comprehensive datacenter management platform that provides a unified experience for infrastructure administration. The system includes advanced features like natural language queries through AI technologies, multitenancy architecture, and real-time metric analysis. The platform supports complex datacenter hierarchies and integrates with various data sources for comprehensive monitoring and management.",
            es: "ThinkData es una plataforma integral de gestión de centros de datos que proporciona una experiencia unificada para la administración de infraestructura. El sistema incluye características avanzadas como consultas en lenguaje natural a través de tecnologías de IA, arquitectura multiinquilino y análisis de métricas en tiempo real. La plataforma admite jerarquías complejas de centros de datos y se integra con varias fuentes de datos para una monitorización y gestión integral.",
            fr: "ThinkData est une plateforme complète de gestion de centre de données qui offre une expérience unifiée pour l'administration de l'infrastructure. Le système comprend des fonctionnalités avancées comme des requêtes en langage naturel grâce aux technologies d'IA, une architecture multi-locataires et une analyse métrique en temps réel. La plateforme prend en charge des hiérarchies complexes de centres de données et s'intègre à diverses sources de données pour une surveillance et une gestion complètes."
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
            ]
        }
    },
    {
        id: "itracs-service",
        title: {
            en: "iTRACS MicroService",
            es: "MicroServicio iTRACS",
            fr: "MicroService iTRACS"
        },
        company: "Bjumper",
        description: {
            en: "Bidirectional integration platform for synchronizing datacenter infrastructure data between multiple heterogeneous systems and iTRACS DCIM platform.",
            es: "Plataforma de integración bidireccional para sincronizar datos de infraestructura de centros de datos entre múltiples sistemas heterogéneos y la plataforma iTRACS DCIM.",
            fr: "Plateforme d'intégration bidirectionnelle pour synchroniser les données d'infrastructure de centre de données entre plusieurs systèmes hétérogènes et la plateforme iTRACS DCIM."
        },
        longDescription: {
            en: "This integration platform provides seamless synchronization between various datacenter management systems (HPE IMC, VMware, TakeData, ThinkData) and the iTRACS DCIM platform. The system automates asset documentation, optimizes infrastructure monitoring, and centralizes critical operational data in real-time, significantly improving datacenter management efficiency.",
            es: "Esta plataforma de integración proporciona sincronización perfecta entre varios sistemas de gestión de centros de datos (HPE IMC, VMware, TakeData, ThinkData) y la plataforma iTRACS DCIM. El sistema automatiza la documentación de activos, optimiza la monitorización de infraestructura y centraliza datos operativos críticos en tiempo real, mejorando significativamente la eficiencia en la gestión de centros de datos.",
            fr: "Cette plateforme d'intégration fournit une synchronisation transparente entre divers systèmes de gestion de centre de données (HPE IMC, VMware, TakeData, ThinkData) et la plateforme iTRACS DCIM. Le système automatise la documentation des actifs, optimise la surveillance de l'infrastructure et centralise les données opérationnelles critiques en temps réel, améliorant considérablement l'efficacité de la gestion des centres de données."
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
            ]
        }
    }, {
        id: "hpeimc-service",
        title: {
            en: "HPE IMC Service",
            es: "Servicio HPE IMC",
            fr: "Service HPE IMC"
        },
        company: "Bjumper",
        description: {
            en: "Service designed to extract, process and synchronize network infrastructure data from HPE Intelligent Management Center (IMC) to external systems.",
            es: "Servicio diseñado para extraer, procesar y sincronizar datos de infraestructura de red desde HPE Intelligent Management Center (IMC) a sistemas externos.",
            fr: "Service conçu pour extraire, traiter et synchroniser les données d'infrastructure réseau du Centre de Gestion Intelligent HPE (IMC) vers des systèmes externes."
        },
        longDescription: {
            en: "This integration service automates the collection and processing of network performance metrics from HPE IMC, facilitating centralized monitoring and optimizing IT infrastructure management. The system implements a comprehensive ETL process with robust error handling and retry mechanisms to ensure data reliability and consistency.",
            es: "Este servicio de integración automatiza la recolección y procesamiento de métricas de rendimiento de red desde HPE IMC, facilitando la monitorización centralizada y optimizando la gestión de infraestructura de TI. El sistema implementa un proceso ETL integral con manejo robusto de errores y mecanismos de reintento para asegurar la fiabilidad y consistencia de los datos.",
            fr: "Ce service d'intégration automatise la collecte et le traitement des métriques de performance réseau de HPE IMC, facilitant la surveillance centralisée et optimisant la gestion de l'infrastructure informatique. Le système implémente un processus ETL complet avec une gestion robuste des erreurs et des mécanismes de réessai pour assurer la fiabilité et la cohérence des données."
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
            ]
        }
    },
    {
        id: "vmware-service",
        title: {
            en: "VMware MicroService",
            es: "MicroServicio VMware",
            fr: "MicroService VMware"
        },
        company: "Bjumper",
        description: {
            en: "Backend service for collecting, storing and exposing VMware infrastructure data, including hypervisors and virtual machines, through RESTful APIs.",
            es: "Servicio backend para recopilar, almacenar y exponer datos de infraestructura VMware, incluyendo hipervisores y máquinas virtuales, a través de APIs RESTful.",
            fr: "Service backend pour collecter, stocker et exposer les données d'infrastructure VMware, y compris les hyperviseurs et les machines virtuelles, via des API RESTful."
        },
        longDescription: {
            en: "This project provides an abstraction layer for monitoring virtualized resources and facilitating integration with other enterprise systems. The service implements asynchronous ETL processes to extract data from VMware, transform it according to the domain model, and load it into the database. It includes a synchronization service with external systems and features robust error handling and logging.",
            es: "Este proyecto proporciona una capa de abstracción para monitorizar recursos virtualizados y facilitar la integración con otros sistemas empresariales. El servicio implementa procesos ETL asíncronos para extraer datos de VMware, transformarlos según el modelo de dominio y cargarlos en la base de datos. Incluye un servicio de sincronización con sistemas externos y cuenta con un sólido manejo de errores y registro.",
            fr: "Ce projet fournit une couche d'abstraction pour surveiller les ressources virtualisées et faciliter l'intégration avec d'autres systèmes d'entreprise. Le service implémente des processus ETL asynchrones pour extraire les données de VMware, les transformer selon le modèle de domaine et les charger dans la base de données. Il comprend un service de synchronisation avec des systèmes externes et dispose d'une gestion robuste des erreurs et de journalisation."
        },
        technologies: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic"],
        icon: "fab fa-vmware",
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
            ]
        }
    },
    {
        id: "nfc-assets-manager",
        title: {
            en: "NFC Assets Manager",
            es: "Gestor de Activos NFC",
            fr: "Gestionnaire d'Actifs NFC"
        },
        company: "Bjumper",
        description: {
            en: "Comprehensive IT asset management system using NFC technology to track and manage datacenter equipment and infrastructure assets.",
            es: "Sistema integral de gestión de activos de TI que utiliza tecnología NFC para rastrear y administrar equipos de centro de datos y activos de infraestructura.",
            fr: "Système complet de gestion des actifs informatiques utilisant la technologie NFC pour suivre et gérer les équipements de centre de données et les actifs d'infrastructure."
        },
        longDescription: {
            en: "This system provides complete lifecycle management for IT infrastructure assets with NFC tracking capabilities. It features a multi-tenant architecture with separate databases per client, hierarchical location management, and comprehensive asset categorization. The system supports audit workflows, maintenance tracking, and integration with external systems through webhooks.",
            es: "Este sistema proporciona una gestión completa del ciclo de vida de los activos de infraestructura de TI con capacidades de seguimiento NFC. Presenta una arquitectura multiinquilino con bases de datos separadas por cliente, gestión jerárquica de ubicaciones y categorización integral de activos. El sistema admite flujos de trabajo de auditoría, seguimiento de mantenimiento e integración con sistemas externos a través de webhooks.",
            fr: "Ce système fournit une gestion complète du cycle de vie des actifs d'infrastructure informatique avec des capacités de suivi NFC. Il présente une architecture multi-locataires avec des bases de données séparées par client, une gestion hiérarchique des emplacements et une catégorisation complète des actifs. Le système prend en charge les flux de travail d'audit, le suivi de maintenance et l'intégration avec des systèmes externes via des webhooks."
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
            ]
        }
    },
    {
        id: "poweriq-integration",
        title: {
            en: "PowerIQ-ITA Service",
            es: "Servicio PowerIQ-ITA",
            fr: "Service PowerIQ-ITA"
        },
        company: "Bjumper",
        description: {
            en: "Bidirectional integration between Data Center Operations (DCO/ITA) and PowerIQ for unified datacenter infrastructure management.",
            es: "Integración bidireccional entre Data Center Operations (DCO/ITA) y PowerIQ para una gestión unificada de infraestructura de centro de datos.",
            fr: "Intégration bidirectionnelle entre Data Center Operations (DCO/ITA) et PowerIQ pour une gestion unifiée de l'infrastructure de centre de données."
        },
        longDescription: {
            en: "This integration solution enables bidirectional synchronization of devices, configurations, and states between DCO/ITA and PowerIQ systems. The project created a unified system for monitoring, control, and efficient management of datacenter infrastructure, with special focus on energy management.",
            es: "Esta solución de integración permite la sincronización bidireccional de dispositivos, configuraciones y estados entre los sistemas DCO/ITA y PowerIQ. El proyecto creó un sistema unificado para la monitorización, control y gestión eficiente de la infraestructura del centro de datos, con especial enfoque en la gestión energética.",
            fr: "Cette solution d'intégration permet la synchronisation bidirectionnelle des appareils, des configurations et des états entre les systèmes DCO/ITA et PowerIQ. Le projet a créé un système unifié pour la surveillance, le contrôle et la gestion efficace de l'infrastructure du centre de données, avec un accent particulier sur la gestion de l'énergie."
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
            ]
        }
    }

];

/**
 * Get personal projects in the specified language
 * @param {string} lang - Language code (en, es, fr)
 * @returns {Array} Projects with texts in the specified language
 */
export const getPersonalProjects = (lang = 'en') => {
    // Default to English if language not supported
    const language = ['en', 'es', 'fr'].includes(lang) ? lang : 'en';

    // Transform data structure to use the specified language
    return personalProjectsData.map(project => ({
        ...project,
        title: project.title[language] || project.title.en,
        description: project.description[language] || project.description.en,
        longDescription: project.longDescription[language] || project.longDescription.en,
        keyFeatures: project.keyFeatures[language] || project.keyFeatures.en
    }));
};

/**
 * Get professional projects in the specified language
 * @param {string} lang - Language code (en, es, fr)
 * @returns {Array} Projects with texts in the specified language
 */
export const getProfessionalProjects = (lang = 'en') => {
    // Default to English if language not supported
    const language = ['en', 'es', 'fr'].includes(lang) ? lang : 'en';

    // Transform data structure to use the specified language
    return professionalProjectsData.map(project => ({
        ...project,
        title: project.title[language] || project.title.en,
        description: project.description[language] || project.description.en,
        longDescription: project.longDescription[language] || project.longDescription.en,
        keyFeatures: project.keyFeatures[language] || project.keyFeatures.en
    }));
};

/**
 * Get personal projects for the current UI language
 * @returns {Array} Projects with texts in the current UI language
 */
export const getCurrentLanguagePersonalProjects = () => {
    // Get current language from window object if available
    const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';
    return getPersonalProjects(currentLang);
};

/**
 * Get professional projects for the current UI language
 * @returns {Array} Projects with texts in the current UI language
 */
export const getCurrentLanguageProfessionalProjects = () => {
    // Get current language from window object if available
    const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';
    return getProfessionalProjects(currentLang);
};

// For compatibility with existing code
export const personalProjects = getPersonalProjects('en');
export const professionalProjects = getProfessionalProjects('en');

export default {
    personalProjects,
    professionalProjects
};