import React, { useEffect, useState } from 'react';

const Projects = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showAllDetails, setShowAllDetails] = useState(false);
    const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'professional'

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById('projects');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    // Toggle show all project descriptions
    const toggleAllProjectDetails = () => {
        setShowAllDetails(!showAllDetails);
    };

    // Mapping of technology names to appropriate Font Awesome icons
    const techIcons = {
        'Astro': 'fas fa-rocket',
        'React': 'fab fa-react',
        'Tailwind CSS': 'fab fa-css3-alt',
        'Python': 'fab fa-python',
        'Django': 'fas fa-cubes',
        'FastAPI': 'fas fa-bolt',
        'PostgreSQL': 'fas fa-database',
        'REST API': 'fas fa-exchange-alt',
        'Celery': 'fas fa-tasks',
        'Redis': 'fas fa-server',
        'SNMP': 'fas fa-network-wired',
        'Kivy': 'fas fa-mobile-alt',
        'ONNX': 'fas fa-brain',
        'NumPy': 'fas fa-calculator',
        'PWA': 'fas fa-globe',
        'i18n': 'fas fa-language',
        'C#': 'fab fa-microsoft',
        '.NET': 'fab fa-windows',
        'Docker': 'fab fa-docker',
        'AWS': 'fab fa-aws',
        'GitHub Actions': 'fab fa-github',
        'WPF': 'fas fa-desktop',
        'Windows Services': 'fab fa-windows',
        'XML': 'fas fa-file-code',
        'JSON': 'fas fa-file-code',
        'NFC': 'fas fa-wifi',
        'JWT': 'fas fa-key',
        'S3': 'fab fa-aws',
        'SQLAlchemy': 'fas fa-database',
        'Alembic': 'fas fa-code-branch',
        'PyVmomi': 'fab fa-vmware',
        // Default icon for any unlisted technology
        'default': 'fas fa-code'
    };

    // Function to get the appropriate icon for a technology
    const getTechIcon = (techName) => {
        return techIcons[techName] || techIcons.default;
    };

    // Personal projects
    const personalProjects = [
        {
            id: "cv",
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
            title: "SNMP monitor",
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

    // Professional projects
    const professionalProjects = [
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

    // Render a project card for personal projects (clickable to GitHub)
    const renderPersonalProjectCard = (project, index) => (
        <div
            key={project.id}
            className={`group bg-light-surface dark:bg-dark-surface rounded-none overflow-hidden border border-light-border dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:translate-y-[-8px] ${project.highlight ? 'border-l-4 border-l-brand-red' : ''} h-full flex flex-col cursor-pointer`}
            style={{ transitionDelay: `${200 * index}ms` }}
            onClick={() => project.githubUrl && window.open(project.githubUrl, '_blank', 'noopener,noreferrer')}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && project.githubUrl) {
                    window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
                }
            }}
            tabIndex={0}
            role="link"
            aria-label={`View ${project.title} on GitHub`}
        >
            {/* Red header bar with icon */}
            <div className="bg-brand-red p-3 flex items-center justify-between gap-3 text-white z-20 relative">
                <div className="flex items-center gap-2">
                    <i className={`${project.icon} text-xl`}></i>
                    <h3 className="font-bold text-lg">{project.title}</h3>
                </div>

                {/* GitHub link */}
                {project.githubUrl && (
                    <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white/80 transition-colors z-30 relative"
                        aria-label={`GitHub repository for ${project.title}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <i className="fab fa-github text-lg"></i>
                    </a>
                )}
            </div>

            <div className="p-5 z-20 relative flex-grow flex flex-col">
                <p className="mb-4 text-light-text-secondary dark:text-dark-text-secondary">
                    {showAllDetails ? project.longDescription : project.description}
                </p>

                {/* Key Features - only visible when expanded */}
                {showAllDetails && (
                    <div className="mb-4 animate-fade-in">
                        <h4 className="text-sm uppercase text-brand-red dark:text-brand-red font-semibold mb-2 tracking-wider">Key Features</h4>
                        <ul className="space-y-2 text-sm">
                            {project.keyFeatures.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start gap-2">
                                    <i className="fas fa-check text-brand-red flex-shrink-0 mt-1"></i>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Technologies used */}
                <div className="mt-auto">
                    <h4 className="text-xs uppercase text-light-text-secondary dark:text-dark-text-secondary font-semibold mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, techIndex) => (
                            <span
                                key={techIndex}
                                className="px-2 py-1 text-xs border border-light-border dark:border-dark-border rounded-none 
                                  bg-light-secondary dark:bg-dark-secondary hover:border-brand-red
                                  transition-colors duration-150 flex items-center gap-1.5 z-20 relative"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <i className={`${getTechIcon(tech)} text-brand-red`}></i>
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Click indicator */}
                <div className="mt-3 flex items-center text-xs text-light-text-secondary dark:text-dark-text-secondary opacity-0 group-hover:opacity-100 transition-opacity z-20 relative">
                    <i className="fas fa-external-link-alt mr-1 text-brand-red"></i>
                    Click to view on GitHub
                </div>

                {/* Bottom indicator line */}
                <div className="w-0 h-0.5 bg-brand-red mt-4 transition-all duration-150 group-hover:w-full z-20 relative"></div>
            </div>
        </div>
    );

    // Render a project card for professional projects (not clickable)
    const renderProfessionalProjectCard = (project, index) => (
        <div
            key={project.id}
            className={`group bg-light-surface dark:bg-dark-surface rounded-none overflow-hidden border border-light-border dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:translate-y-[-8px] ${project.highlight ? 'border-l-4 border-l-brand-red' : ''} h-full flex flex-col`}
            style={{ transitionDelay: `${200 * index}ms` }}
            tabIndex={0}
            role="article"
            aria-label={`Project: ${project.title}`}
        >
            {/* Red header bar with icon */}
            <div className="bg-brand-red p-3 flex items-center justify-between gap-3 text-white z-20 relative">
                <div className="flex items-center gap-2">
                    <i className={`${project.icon} text-xl`}></i>
                    <h3 className="font-bold text-lg">{project.title}</h3>
                </div>

                <div className="px-2 py-0.5 text-xs bg-white/20 rounded-none">
                    {project.company}
                </div>
            </div>

            <div className="p-5 z-20 relative flex-grow flex flex-col">
                <p className="mb-4 text-light-text-secondary dark:text-dark-text-secondary">
                    {showAllDetails ? project.longDescription : project.description}
                </p>

                {/* Key Features - only visible when expanded */}
                {showAllDetails && (
                    <div className="mb-4 animate-fade-in">
                        <h4 className="text-sm uppercase text-brand-red dark:text-brand-red font-semibold mb-2 tracking-wider">Key Features</h4>
                        <ul className="space-y-2 text-sm">
                            {project.keyFeatures.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start gap-2">
                                    <i className="fas fa-check text-brand-red flex-shrink-0 mt-1"></i>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Technologies used */}
                <div className="mt-auto">
                    <h4 className="text-xs uppercase text-light-text-secondary dark:text-dark-text-secondary font-semibold mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, techIndex) => (
                            <span
                                key={techIndex}
                                className="px-2 py-1 text-xs border border-light-border dark:border-dark-border rounded-none 
                                  bg-light-secondary dark:bg-dark-secondary hover:border-brand-red
                                  transition-colors duration-150 flex items-center gap-1.5 z-20 relative"
                            >
                                <i className={`${getTechIcon(tech)} text-brand-red`}></i>
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Bottom indicator line */}
                <div className="w-0 h-0.5 bg-brand-red mt-4 transition-all duration-150 group-hover:w-full z-20 relative"></div>
            </div>
        </div>
    );

    return (
        <section id="projects" className="pt-4">
            <div className={`flex items-center mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <i className="fas fa-project-diagram"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3">Key Projects</h2>

                {/* Toggle all projects details button */}
                <button
                    onClick={toggleAllProjectDetails}
                    className="ml-auto text-brand-red hover:text-brand-red/80 text-sm inline-flex items-center gap-1 focus:outline-none"
                >
                    {showAllDetails ? (
                        <>
                            <i className="fas fa-chevron-up text-xs"></i>
                            Show less details
                        </>
                    ) : (
                        <>
                            <i className="fas fa-chevron-down text-xs"></i>
                            Show all details
                        </>
                    )}
                </button>
            </div>

            {/* Project type tabs */}
            <div className="flex border-b border-light-border dark:border-dark-border mb-6">
                <button
                    onClick={() => setActiveTab('personal')}
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'personal'
                        ? 'text-brand-red border-b-2 border-brand-red'
                        : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-red/70'}`}
                >
                    Personal Projects
                </button>
                <button
                    onClick={() => setActiveTab('professional')}
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'professional'
                        ? 'text-brand-red border-b-2 border-brand-red'
                        : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-red/70'}`}
                >
                    Professional Work
                </button>
            </div>

            {/* Project grid - conditional rendering based on active tab */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'personal' ? (
                    personalProjects.map((project, index) => renderPersonalProjectCard(project, index))
                ) : (
                    professionalProjects.map((project, index) => renderProfessionalProjectCard(project, index))
                )}
            </div>

            {/* Footer note - different for each tab */}
            <div
                className={`mt-8 text-center transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '500ms' }}
            >
                {activeTab === 'personal' ? (
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        These are personal projects I've developed to explore technologies and solve specific challenges.
                    </p>
                ) : (
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
                        These are just some of the professional projects developed during my work at Bjumper. Repositories are private due to confidentiality agreements.
                    </p>
                )}
            </div>
        </section>
    );
};

export default Projects;