import React, { useEffect, useState } from 'react';

const Projects = () => {
    const [isVisible, setIsVisible] = useState(false);

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

    // Mapping of technology names to appropriate Font Awesome icons
    const techIcons = {
        'C#': 'fab fa-microsoft',
        '.NET': 'fab fa-windows',
        'REST API': 'fas fa-exchange-alt',
        'SQL': 'fas fa-database',
        'Java': 'fab fa-java',
        'Android': 'fab fa-android',
        'SQLite': 'fas fa-database',
        'React': 'fab fa-react',
        'Node.js': 'fab fa-node-js',
        'JavaScript': 'fab fa-js',
        'HTML': 'fab fa-html5',
        'CSS': 'fab fa-css3-alt',
        'Python': 'fab fa-python',
        'Git': 'fab fa-git-alt',
        'Docker': 'fab fa-docker',
        // Default icon for any unlisted technology
        'default': 'fas fa-code'
    };

    // Function to get the appropriate icon for a technology
    const getTechIcon = (techName) => {
        return techIcons[techName] || techIcons.default;
    };

    const projects = [
        {
            title: "Integration Platform",
            description: "Developed a comprehensive integration platform that connects various systems and applications, enabling seamless data flow and process automation.",
            technologies: ["C#", ".NET", "REST API", "SQL"],
            icon: "fas fa-cogs",
            githubUrl: "https://github.com/oriol-macias",
            demoUrl: null,
            highlight: true,
            inProgress: false
        },
        {
            title: "Mobile Application for Data Collection",
            description: "Created an Android application for field data collection, featuring offline capabilities and synchronization with central database.",
            technologies: ["Java", "Android", "SQLite", "REST API"],
            icon: "fas fa-mobile-alt",
            githubUrl: "https://github.com/oriol-macias",
            demoUrl: null,
            highlight: false,
            inProgress: true
        }
    ];

    // Handle card click - defaults to GitHub link if available
    const handleCardClick = (project) => {
        if (project.githubUrl) {
            window.open(project.githubUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <section id="projects">
            <div
                className={`flex items-center mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <i className="fas fa-project-diagram"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3">Key Projects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className={`group bg-light-surface dark:bg-dark-surface rounded-none overflow-hidden border border-light-border dark:border-dark-border shadow-sm hover:shadow-md transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:translate-y-[-8px] ${project.highlight ? 'border-l-4 border-l-brand-red' : ''} project-card relative`}
                        style={{ transitionDelay: `${200 * index}ms` }}
                        onClick={() => handleCardClick(project)}
                        role="link"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleCardClick(project);
                            }
                        }}
                        aria-label={`View ${project.title} project on GitHub`}
                    >
                        {/* Invisible overlay to make entire card clickable */}
                        {project.githubUrl && (
                            <div className="absolute inset-0 cursor-pointer z-10"></div>
                        )}

                        {/* Red header bar with icon */}
                        <div className="bg-brand-red p-3 flex items-center justify-between gap-3 text-white z-20 relative">
                            <div className="flex items-center gap-2">
                                <i className={`${project.icon} text-xl`}></i>
                                <h3 className="font-bold text-lg">{project.title}</h3>
                                {project.inProgress && (
                                    <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-none">In Progress</span>
                                )}
                            </div>

                            {/* External links for GitHub and Demo */}
                            <div className="flex items-center gap-3 z-30">
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

                                {project.demoUrl && (
                                    <a
                                        href={project.demoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-white/80 transition-colors z-30 relative"
                                        aria-label={`Live demo for ${project.title}`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <i className="fas fa-external-link-alt"></i>
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="p-5 z-20 relative">
                            <p className="mb-4 text-light-text-secondary dark:text-dark-text-secondary">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {project.technologies.map((tech, techIndex) => (
                                    <span
                                        key={techIndex}
                                        className="px-3 py-1 text-xs border border-light-border dark:border-dark-border rounded-none 
                                      bg-light-secondary dark:bg-dark-secondary hover:border-brand-red
                                      transition-colors duration-150 flex items-center gap-1.5 z-20 relative"
                                    >
                                        <i className={`${getTechIcon(tech)} text-brand-red`}></i>
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {/* Click indicator to make it clear the card is clickable */}
                            <div className="mt-4 flex items-center text-xs text-light-text-secondary dark:text-dark-text-secondary opacity-0 group-hover:opacity-100 transition-opacity z-20 relative">
                                <i className="fas fa-mouse-pointer mr-1 text-brand-red"></i>
                                Click to view on GitHub
                            </div>

                            {/* Bottom indicator line */}
                            <div className="w-0 h-0.5 bg-brand-red mt-4 transition-all duration-150 group-hover:w-full z-20 relative"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add project link */}
            <div
                className={`mt-6 text-center transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '500ms' }}
            >
                <a
                    href="https://github.com/oriol-macias"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-brand-red hover:text-brand-red/80 transition-colors"
                >
                    <i className="fab fa-github mr-2"></i>
                    View more projects on GitHub
                </a>
            </div>
        </section>
    );
};

export default Projects;