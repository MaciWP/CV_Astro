/**
 * Projects component with simplified animations and multilingual support
 * File: src/components/cv/Projects.jsx
 */
import React, { useEffect, useState } from 'react';
import {
    getCurrentLanguagePersonalProjects,
    getCurrentLanguageProfessionalProjects,
    getTechIcon
} from '../../data/projects';

const Projects = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showAllDetails, setShowAllDetails] = useState(false);
    const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'professional'
    const [personalProjects, setPersonalProjects] = useState([]);
    const [professionalProjects, setProfessionalProjects] = useState([]);
    const [translations, setTranslations] = useState({
        title: 'Key Projects',
        technologies: 'Technologies',
        keyFeatures: 'Key Features',
        viewOnGithub: 'View on GitHub',
        showAllDetails: 'Show all details',
        showLessDetails: 'Show less details',
        personalProjects: 'Personal Projects',
        professionalWork: 'Professional Work',
        personalProjectsNote: 'These are personal projects I\'ve developed to explore technologies and solve specific challenges.',
        professionalProjectsNote: 'These are just some of the professional projects developed during my work at Bjumper. Repositories are private due to confidentiality agreements.'
    });

    // Load translations for UI elements
    const loadTranslations = () => {
        if (typeof window !== 'undefined' && typeof window.t === 'function') {
            setTranslations({
                title: window.t('projects.title') || 'Key Projects',
                technologies: window.t('projects.technologies') || 'Technologies',
                keyFeatures: window.t('projects.keyFeatures') || 'Key Features',
                viewOnGithub: window.t('projects.viewOnGithub') || 'View on GitHub',
                showAllDetails: window.t('projects.showAllDetails') || 'Show all details',
                showLessDetails: window.t('projects.showLessDetails') || 'Show less details',
                personalProjects: window.t('projects.personalProjects') || 'Personal Projects',
                professionalWork: window.t('projects.professionalWork') || 'Professional Work',
                personalProjectsNote: window.t('projects.personalProjectsNote') || 'These are personal projects I\'ve developed to explore technologies and solve specific challenges.',
                professionalProjectsNote: window.t('projects.professionalProjectsNote') || 'These are just some of the professional projects developed during my work at Bjumper. Repositories are private due to confidentiality agreements.'
            });
        }
    };

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

        // Load initial project data and translations
        setPersonalProjects(getCurrentLanguagePersonalProjects());
        setProfessionalProjects(getCurrentLanguageProfessionalProjects());
        loadTranslations();

        // Listen for language changes
        const handleLanguageChanged = () => {
            setPersonalProjects(getCurrentLanguagePersonalProjects());
            setProfessionalProjects(getCurrentLanguageProfessionalProjects());
            loadTranslations();
        };

        document.addEventListener('languageChanged', handleLanguageChanged);
        document.addEventListener('translationsLoaded', handleLanguageChanged);

        return () => {
            observer.disconnect();
            document.removeEventListener('languageChanged', handleLanguageChanged);
            document.removeEventListener('translationsLoaded', handleLanguageChanged);
        };
    }, []);

    // Toggle show all project descriptions
    const toggleAllProjectDetails = () => {
        setShowAllDetails(!showAllDetails);
    };

    // Get the proper icon, making sure VMware has its icon
    const getFixedIcon = (project) => {
        if (project.id === "vmware-service" && !project.icon) {
            return "fab fa-vmware";
        }
        return project.icon || "fas fa-code";
    };

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
            aria-label={`${translations.viewOnGithub}: ${project.title}`}
        >
            {/* Red header bar with icon */}
            <div className="bg-brand-red p-3 flex items-center justify-between gap-3 text-white z-20 relative">
                <div className="flex items-center gap-2">
                    <i className={`${getFixedIcon(project)} text-xl`}></i>
                    <h3 className="font-bold text-lg">{project.title}</h3>
                </div>

                {/* GitHub link */}
                {project.githubUrl && (

                    <a href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white/80 transition-colors z-30 relative"
                        aria-label={`GitHub: ${project.title}`}
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
                        <h4 className="text-sm uppercase text-brand-red dark:text-brand-red font-semibold mb-2 tracking-wider" data-i18n="projects.keyFeatures">
                            {translations.keyFeatures}
                        </h4>
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
                    <h4 className="text-xs uppercase text-light-text-secondary dark:text-dark-text-secondary font-semibold mb-2" data-i18n="projects.technologies">
                        {translations.technologies}
                    </h4>
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
                    {translations.viewOnGithub}
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
            aria-label={`${project.title}`}
        >
            {/* Red header bar with icon */}
            <div className="bg-brand-red p-3 flex items-center justify-between gap-3 text-white z-20 relative">
                <div className="flex items-center gap-2">
                    <i className={`${getFixedIcon(project)} text-xl`}></i>
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
                        <h4 className="text-sm uppercase text-brand-red dark:text-brand-red font-semibold mb-2 tracking-wider" data-i18n="projects.keyFeatures">
                            {translations.keyFeatures}
                        </h4>
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
                    <h4 className="text-xs uppercase text-light-text-secondary dark:text-dark-text-secondary font-semibold mb-2" data-i18n="projects.technologies">
                        {translations.technologies}
                    </h4>
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
                <h2 className="text-2xl font-bold ml-3" data-i18n="projects.title">{translations.title}</h2>

                {/* Toggle all projects details button */}
                <button
                    onClick={toggleAllProjectDetails}
                    className="ml-auto text-brand-red hover:text-brand-red/80 text-sm inline-flex items-center gap-1 focus:outline-none"
                >
                    {showAllDetails ? (
                        <>
                            <i className="fas fa-chevron-up text-xs"></i>
                            {translations.showLessDetails}
                        </>
                    ) : (
                        <>
                            <i className="fas fa-chevron-down text-xs"></i>
                            {translations.showAllDetails}
                        </>
                    )}
                </button>
            </div>

            {/* Project type tabs */}
            <div className="flex border-b border-light-border dark:border-dark-border mb-6">
                <button
                    onClick={() => setActiveTab('personal')}
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'personal'
                        ? 'text-brand-red dark:text-red-400 border-b-2 border-brand-red dark:border-red-400'
                        : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-red/70 dark:hover:text-red-400/70'}`}
                    data-i18n="projects.personalProjects"
                >
                    {translations.personalProjects}
                </button>
                <button
                    onClick={() => setActiveTab('professional')}
                    className={`py-2 px-4 font-medium text-sm ${activeTab === 'professional'
                        ? 'text-brand-red dark:text-red-400 border-b-2 border-brand-red dark:border-red-400'
                        : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-brand-red/70 dark:hover:text-red-400/70'}`}
                    data-i18n="projects.professionalWork"
                >
                    {translations.professionalWork}
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
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary" data-i18n="projects.personalProjectsNote">
                        {translations.personalProjectsNote}
                    </p>
                ) : (
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary" data-i18n="projects.professionalProjectsNote">
                        {translations.professionalProjectsNote}
                    </p>
                )}
            </div>
        </section>
    );
};

export default Projects;