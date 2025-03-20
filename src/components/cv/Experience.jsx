import React, { useEffect, useState } from 'react';

const Experience = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [expandedJobs, setExpandedJobs] = useState({});

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

        const element = document.getElementById('experience');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    // Toggle expand/collapse for a specific job
    const toggleJobDetails = (jobId) => {
        setExpandedJobs(prev => ({
            ...prev,
            [jobId]: !prev[jobId]
        }));
    };

    const experiences = [
        {
            id: "bjumper",
            title: "Senior Backend Developer",
            company: "Bjumper",
            period: "2018 - Present",
            keyResponsibilities: [
                "Design, development, and maintenance of integration solutions between industrial protocols (SNMP, MODBUS, BACnet, etc.) or external applications (PowerIQ, HPE IMC, Invision, VMware, etc.) and DCIM platforms (iTRACS, ITA, DCE, etc.)",
                "Development of scalable, agnostic microservices for data extraction, transformation, and loading (ETL) using REST APIs",
                "Participated in 8+ operational projects using agile methodologies (Kanban, Scrum)",
                "Used C#, Python, JavaScript, .NET (Framework & Core), Django, and Django REST Framework",
                "Worked with PostgreSQL, Docker, GitHub, AWS for database and DevOps operations"
            ],
            extraResponsibilities: [
            ],
            achievements: [
                "Independently developed an SNMP monitoring tool with an autodiscovery method that reduced discovery time by 80%",
                "Created an application to generate DDF configuration files using MIBs and SNMP walks, reducing development time by 90%",
                "Led the development of several core systems used by major enterprise clients"
            ]
        },
        {
            id: "busmatick",
            title: "Junior Developer (Android/C#)",
            company: "Busmatick",
            period: "2018",
            keyResponsibilities: [
                "Developed mobile applications for Android and desktop applications for Windows focused on public transport card management",
                "Built a SOAP API to manage the backend for both applications",
                "Implemented NFC technology for MIFARE Classic 1K card operations"
            ],
            extraResponsibilities: [],
            achievements: [
                "Successfully implemented the complete RDR application for public transport cards",
                "Created a secure system for handling encrypted sensitive card operations",
                "Developed Bluetooth printing functionality for transaction receipts"
            ]
        },
        {
            id: "seres",
            title: "Support Technician",
            company: "SERES",
            period: "2017",
            keyResponsibilities: [
                "Provided bilingual customer support for electronic invoicing in EDI, XML, and proprietary formats",
                "Assisted clients in troubleshooting invoicing and data exchange issues",
                "Developed small internal applications to streamline invoice processing workflows"
            ],
            extraResponsibilities: [],
            achievements: [
                "Helped improve overall client satisfaction with faster and more accurate issue resolution"
            ]
        },
        {
            id: "educand",
            title: "IT Technician",
            company: "Educand SCCL",
            period: "2015 - 2017",
            keyResponsibilities: [
                "Installed, configured, and maintained computer equipment and network infrastructure",
                "Mentored an intern and guided practical IT training"
            ],
            extraResponsibilities: [],
            achievements: [
                "Increased operational efficiency by implementing structured maintenance schedules"
            ]
        },
        {
            id: "saltcity",
            title: "Development Intern",
            company: "Salt City Council",
            period: "2014 - 2015",
            keyResponsibilities: [
                "Developed a database management application for the local police using WPF and C#"
            ],
            extraResponsibilities: [],
            achievements: [
                "Successfully delivered a comprehensive database management system for the local police department",
                "Completed tasks as part of a Superior Degree professional internship program"
            ]
        }
    ];

    return (
        <section id="experience" className="scroll-mt-20 mb-16">
            <div
                className={`flex items-center gap-4 mb-10 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                <div className="h-10 w-10 bg-brand-red dark:bg-brand-red rounded-none flex items-center justify-center flex-shrink-0 transition-colors duration-150">
                    <i className="fas fa-briefcase text-white"></i>
                </div>
                <h2 className="text-3xl font-bold tracking-tight">Work Experience</h2>
            </div>

            <div className="relative pl-5 md:pl-8">
                {/* Timeline line with gradient */}
                <div className="absolute left-2 top-4 bottom-0 w-0.5 bg-gradient-to-b from-brand-red via-brand-red/70 to-gray-300 dark:from-brand-red dark:via-brand-red/50 dark:to-gray-700"></div>

                {experiences.map((job, index) => (
                    <div
                        key={job.id}
                        className={`relative pl-8 pb-12 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:translate-x-1`}
                        style={{ transitionDelay: `${200 * index}ms` }}
                    >
                        {/* Timeline node */}
                        <div
                            className={`absolute left-0 top-4 w-4 h-4 rounded-none bg-brand-red dark:bg-brand-red border-4 border-white dark:border-gray-900 shadow-sm transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                            style={{
                                opacity: isVisible ? (1 - (index * 0.15)) : 0,
                                transitionDelay: `${300 * index}ms`
                            }}
                        ></div>

                        {/* Job header with hover effects */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 group">
                            <div>
                                <h3 className="text-xl font-bold group-hover:text-brand-red transition-colors duration-150">{job.title}</h3>
                                <p className="text-light-text-secondary dark:text-dark-text-secondary transition-colors duration-150 flex items-center">
                                    <i className="fas fa-building mr-2 text-brand-red/70"></i>
                                    {job.company}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-light-text-secondary dark:text-dark-text-secondary bg-light-secondary dark:bg-dark-secondary px-3 py-1 rounded-none transition-all duration-150 group-hover:bg-brand-red group-hover:text-white">
                                <i className="fas fa-calendar-alt"></i>
                                <span>{job.period}</span>
                            </div>
                        </div>

                        {/* Job description with enhanced hover effects */}
                        <div className="bg-light-surface dark:bg-dark-surface p-6 rounded-none border border-light-border dark:border-dark-border group hover:border-brand-red/30 dark:hover:border-brand-red/30 transition-all duration-150 hover:shadow-md">
                            {/* Responsibilities section - condensed */}
                            <h4 className="text-sm uppercase text-light-text-secondary dark:text-dark-text-secondary font-semibold mb-3 tracking-wider">Responsibilities</h4>
                            <ul className="space-y-3 text-light-text dark:text-dark-text transition-colors duration-150 mb-3">
                                {job.keyResponsibilities.map((responsibility, i) => (
                                    <li key={i} className="flex items-start gap-2 group/item hover:translate-x-1 transition-all duration-150">
                                        <span className="w-1.5 h-1.5 bg-brand-red flex-shrink-0 mt-2 transition-all duration-150 group-hover/item:scale-125"></span>
                                        <span>{responsibility}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Extra responsibilities - expandable */}
                            {job.extraResponsibilities.length > 0 && (
                                <>
                                    {expandedJobs[job.id] && (
                                        <ul className="space-y-3 text-light-text dark:text-dark-text transition-colors duration-150 mb-3 animate-fade-in">
                                            {job.extraResponsibilities.map((responsibility, i) => (
                                                <li key={`extra-${i}`} className="flex items-start gap-2 group/item hover:translate-x-1 transition-all duration-150">
                                                    <span className="w-1.5 h-1.5 bg-brand-red flex-shrink-0 mt-2 transition-all duration-150 group-hover/item:scale-125"></span>
                                                    <span>{responsibility}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    <button
                                        onClick={() => toggleJobDetails(job.id)}
                                        className="text-xs inline-flex items-center gap-1 text-brand-red hover:text-brand-red/80 mb-5 focus:outline-none focus:underline"
                                        aria-expanded={!!expandedJobs[job.id]}
                                    >
                                        <i className={`fas fa-chevron-${expandedJobs[job.id] ? 'up' : 'down'} text-xs`}></i>
                                        {expandedJobs[job.id] ? 'Show less' : 'Show more'}
                                    </button>
                                </>
                            )}

                            {/* Achievements section with trophy icons */}
                            <h4 className="text-sm uppercase text-brand-red dark:text-brand-red font-semibold mb-3 tracking-wider">Key Achievements</h4>
                            <ul className="space-y-3 text-light-text dark:text-dark-text transition-colors duration-150">
                                {job.achievements.map((achievement, i) => (
                                    <li key={i} className="flex items-start gap-2 group/item hover:translate-x-1 transition-all duration-150">
                                        <i className="fas fa-trophy text-brand-red flex-shrink-0 mt-1 transition-all duration-150 group-hover/item:scale-125"></i>
                                        <span>{achievement}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Hover indicator animation */}
                            <div className="w-0 h-0.5 bg-brand-red mt-4 transition-all duration-150 group-hover:w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Experience;