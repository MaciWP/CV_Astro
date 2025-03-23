/**
 * Projects data file
 * File: src/data/projects.js
 * 
 * Contains structured data for both personal and professional projects
 * Extracted from components for better maintainability
 */

// Personal projects with GitHub links
export const personalProjects = [
    {
        id: "swiss-cv",
        title: "CV Portfolio",
        description: "Professional CV/portfolio website built with a clean, minimalist aesthetic, strong typography and structured layout for optimal presentation of credentials.",
        longDescription: "This project is a responsive web application designed for optimal presentation of professional credentials. It features theme switching between light and dark modes, multilingual support, responsive design for all devices, and the ability to export the CV as PDF with a single click. The design follows international style principles with sharp corners, strong typography, and strategic use of accent colors.",
        technologies: ["Astro", "React", "Tailwind CSS", "i18n", "PWA"],
        icon: "fas fa-id-card",
        githubUrl: "https://github.com/MaciWP/CV_Astro",
        highlight: true,
        keyFeatures: [
            "Responsive design optimized for all devices",
            "Theme switching with smooth transitions",
            "PDF export functionality",
            "Multilingual support (EN, ES, FR)",
            "Progressive Web App capabilities"
        ]
    },
    {
        id: "snmp-monitor",
        title: "SNMP Monitor",
        description: "Comprehensive platform for network device monitoring via SNMP protocol, featuring automated discovery, real-time visualization, and MIB management for infrastructure tracking.",
        longDescription: "SNMP Monitor is a specialized web platform for managing and monitoring network devices using the SNMP Protocol. The system automates the discovery, monitoring, and real-time visualization, significantly reducing problem detection time and improving incident response capability. The application is based on Django with asynchronous processing for intensive tasks.",
        technologies: ["Python", "Django", "PostgreSQL", "Celery", "Redis", "SNMP"],
        icon: "fas fa-network-wired",
        githubUrl: "https://github.com/MaciWP/TrackData",
        highlight: true,
        keyFeatures: [
            "Automatic network device discovery",
            "Real-time monitoring with 5-second updates",
            "MIB management for enriched monitoring information",
            "Customizable visualization with various time ranges",
            "Scalable background task system for managing large device numbers"
        ]
    },
    {
        id: "pelusas-calculator",
        title: "Pelusas Calculator",
        description: "Specialized application for calculating and managing scores for the card game 'Pelusas', featuring both manual score entry and automatic card detection through image processing.",
        longDescription: "This application was developed to automate the calculation and tracking of scores for the card game 'Pelusas'. It provides a versatile tool that allows both manual score entry and automatic card detection using computer vision. The system includes player management, score calculation, image processing, and game history tracking components. The computer vision component uses a trained model to recognize specific numbered cards (values 1-10).",
        technologies: ["Python", "Kivy", "ONNX", "NumPy"],
        icon: "fas fa-calculator",
        githubUrl: "https://github.com/MaciWP/SnapScore",
        highlight: true,
        keyFeatures: [
            "Cross-platform interface built with Kivy",
            "Computer vision for automatic card detection (>90% accuracy)",
            "Player management system",
            "Game history tracking",
            "Reduces calculation time by 80% compared to manual methods",
            "Processes up to 10 cards simultaneously in a single image"
        ]
    }
];

// Professional projects without GitHub links (proprietary)
export const professionalProjects = [
    {
        id: "thinkdata-backend",
        title: "ThinkData Backend",
        company: "Bjumper",
        description: "Advanced datacenter management platform with AI capabilities, providing real-time monitoring, analysis and optimization of datacenter infrastructure.",
        longDescription: "ThinkData is a comprehensive datacenter management platform that provides a unified experience for infrastructure administration. The system includes advanced features like natural language queries through AI technologies, multitenancy architecture, and real-time metric analysis. The platform supports complex datacenter hierarchies and integrates with various data sources for comprehensive monitoring and management.",
        technologies: ["Python", "Django", "PostgreSQL", "Docker", "REST API", "AWS"],
        icon: "fas fa-server",
        highlight: true,
        keyFeatures: [
            "AI-powered natural language queries for datacenter data",
            "Multitenancy architecture with isolated databases per client",
            "Complex hierarchical modeling of datacenter components",
            "Real-time monitoring and visualization of infrastructure metrics",
            "Asynchronous processing of metric and structure files"
        ]
    },
    {
        id: "itracs-service",
        title: "iTRACS MicroService",
        company: "Bjumper",
        description: "Bidirectional integration platform for synchronizing datacenter infrastructure data between multiple heterogeneous systems and iTRACS DCIM platform.",
        longDescription: "This integration platform provides seamless synchronization between various datacenter management systems (HPE IMC, VMware, TakeData, ThinkData) and the iTRACS DCIM platform. The system automates asset documentation, optimizes infrastructure monitoring, and centralizes critical operational data in real-time, significantly improving datacenter management efficiency.",
        technologies: ["Python", "Django", "REST API", "PostgreSQL", "Docker"],
        icon: "fas fa-exchange-alt",
        highlight: true,
        keyFeatures: [
            "Bidirectional data synchronization with 99.5% success rate",
            "Intelligent retry mechanism with batch processing",
            "Comprehensive error handling with detailed contextual information",
            "Reduced data update time between systems by 95%",
            "Improved asset inventory accuracy by 85%"
        ]
    },
    {
        id: "hpeimc-service",
        title: "HPE IMC Service",
        company: "Bjumper",
        description: "Service designed to extract, process and synchronize network infrastructure data from HPE Intelligent Management Center (IMC) to external systems.",
        longDescription: "This integration service automates the collection and processing of network performance metrics from HPE IMC, facilitating centralized monitoring and optimizing IT infrastructure management. The system implements a comprehensive ETL process with robust error handling and retry mechanisms to ensure data reliability and consistency.",
        technologies: ["Python", "Django", "PostgreSQL", "Docker", "REST API"],
        icon: "fas fa-network-wired",
        highlight: true,
        keyFeatures: [
            "Efficient data collection from 1,000+ network devices in under 5 minutes",
            "95% reduction in infrastructure problem detection time",
            "Optimized database queries reducing API response time by 60%",
            "Advanced retry mechanisms with exponential backoff",
            "Detailed logging and error tracking system"
        ]
    },
    {
        id: "vmware-service",
        title: "VMware MicroService",
        company: "Bjumper",
        description: "Backend service for collecting, storing and exposing VMware infrastructure data, including hypervisors and virtual machines, through RESTful APIs.",
        longDescription: "This project provides an abstraction layer for monitoring virtualized resources and facilitating integration with other enterprise systems. The service implements asynchronous ETL processes to extract data from VMware, transform it according to the domain model, and load it into the database. It includes a synchronization service with external systems and features robust error handling and logging.",
        technologies: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Alembic"],
        icon: "fab fa-vmware",
        highlight: true,
        keyFeatures: [
            "Asynchronous ETL for VMware infrastructure data",
            "FastAPI RESTful endpoints with automatic OpenAPI documentation",
            "Batch processing with 70% faster data collection",
            "99.9% data accuracy through automated capture processes",
            "Structured logging and error management",
            "Integration with external systems through API"
        ]
    },
    {
        id: "nfc-assets-manager",
        title: "NFC Assets Manager",
        company: "Bjumper",
        description: "Comprehensive IT asset management system using NFC technology to track and manage datacenter equipment and infrastructure assets.",
        longDescription: "This system provides complete lifecycle management for IT infrastructure assets with NFC tracking capabilities. It features a multi-tenant architecture with separate databases per client, hierarchical location management, and comprehensive asset categorization. The system supports audit workflows, maintenance tracking, and integration with external systems through webhooks.",
        technologies: ["Python", "Django", "PostgreSQL", "REST API", "NFC", "AWS"],
        icon: "fas fa-tags",
        highlight: true,
        keyFeatures: [
            "Multi-tenant architecture with database isolation per client",
            "NFC-based asset tracking reducing inventory time by 85%",
            "Hierarchical location management (DataCenter → Room → Row → Rack)",
            "JWT authentication with 2FA via email OTP",
            "Comprehensive asset categorization (IT, Network, Energy, Climate)",
            "S3 integration for image and file storage"
        ]
    },
    {
        id: "poweriq-integration",
        title: "PowerIQ-ITA Service",
        company: "Bjumper",
        description: "Bidirectional integration between Data Center Operations (DCO/ITA) and PowerIQ for unified datacenter infrastructure management.",
        longDescription: "This integration solution enables bidirectional synchronization of devices, configurations, and states between DCO/ITA and PowerIQ systems. The project created a unified system for monitoring, control, and efficient management of datacenter infrastructure, with special focus on energy management.",
        technologies: ["C#", ".NET", "REST API", "PostgreSQL", "XML"],
        icon: "fas fa-bolt",
        highlight: true,
        keyFeatures: [
            "Bidirectional synchronization with object mapping system",
            "85% reduction in energy infrastructure management time",
            "Real-time monitoring of power status for all datacenter devices",
            "Automated report generation reducing time from 4 hours to 2 minutes",
            "100% improvement in data accuracy through duplication elimination"
        ]
    }
];

export default {
    personalProjects,
    professionalProjects
};