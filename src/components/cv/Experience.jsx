import React, { useEffect, useState } from 'react';

const Experience = () => {
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

        const element = document.getElementById('experience');
        if (element) {
            observer.observe(element);
        }

        return () => observer.disconnect();
    }, []);

    const experiences = [
        {
            title: "Senior Backend Developer",
            company: "Bjumper Madrid",
            period: "Mar 2018 - Present",
            responsibilities: [
                "Design and development of integration systems between industrial protocols (SNMP, DCE, MODBUS) and data center infrastructure management platforms",
                "Development of RESTful APIs for multiple Python projects using Django and Django REST Framework",
                "Implementation of ETL processes for data center infrastructure monitoring and management",
                "Architecture design for multitenancy systems with complex data hierarchies",
                "Development of authentication and authorization systems with JWT and 2FA"
            ],
            achievements: [
                "Implemented integration solutions that reduced incident response time by 75% in critical infrastructures",
                "Developed a Django backend boilerplate that reduced development time of new projects by 60-70%",
                "Created multiple ETL systems that automate data collection with 90% time reduction",
                "Implemented RAG systems for natural language querying of technical infrastructure data",
                "Led development of several core systems used by major enterprise clients"
            ]
        },
        {
            title: "Junior Developer (Android/C#)",
            company: "Busmatick",
            period: "Jun 2016 - Feb 2018",
            responsibilities: [
                "Developed mobile applications for Android platform focused on public transport card management",
                "Created applications using NFC technology for MIFARE Classic 1K card operations",
                "Implemented secure communication with backend services via SOAP",
                "Developed card lifecycle management features (initialization, recharge, query, cancellation)"
            ],
            achievements: [
                "Successfully implemented the complete RDR (Reload/Download/Reloader) application for public transport cards",
                "Created a secure system for handling encrypted sensitive card operations",
                "Developed Bluetooth printing functionality for transaction receipts"
            ]
        },
        {
            title: "Development Intern",
            company: "Salt City Council",
            period: "Sep 2014 - Jun 2015",
            responsibilities: [
                "Developed applications using Visual Studio, Access, and Excel",
                "Created a database management application for the local police using WPF and C#",
                "Utilized C#, SQL, and XML for various programming tasks"
            ],
            achievements: [
                "Successfully delivered a comprehensive database management system for the local police department",
                "Completed tasks as part of Superior Degree professional internship program"
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
                {/* Enhanced timeline line with gradient for visual appeal */}
                <div className="absolute left-2 top-4 bottom-0 w-0.5 bg-gradient-to-b from-brand-red via-brand-red/70 to-gray-300 dark:from-brand-red dark:via-brand-red/50 dark:to-gray-700"></div>

                {experiences.map((job, index) => (
                    <div
                        key={index}
                        className={`relative pl-8 pb-12 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} hover:translate-x-2`}
                        style={{ transitionDelay: `${200 * index}ms` }}
                    >
                        {/* Enhanced timeline node with subtle animation */}
                        <div
                            className={`absolute left-0 top-4 w-4 h-4 rounded-none bg-brand-red dark:bg-brand-red border-4 border-white dark:border-gray-900 shadow-sm transition-all duration-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
                            style={{
                                opacity: isVisible ? (1 - (index * 0.15)) : 0,
                                transitionDelay: `${300 * index}ms`
                            }}
                        ></div>

                        {/* Job header with enhanced hover effects */}
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
                            {/* Responsibilities section */}
                            <h4 className="text-sm uppercase text-light-text-secondary dark:text-dark-text-secondary font-semibold mb-3 tracking-wider">Responsibilities</h4>
                            <ul className="space-y-3 text-light-text dark:text-dark-text transition-colors duration-150 mb-5">
                                {job.responsibilities.map((responsibility, i) => (
                                    <li key={i} className="flex items-start gap-2 group/item hover:translate-x-1 transition-all duration-150">
                                        {/* Square bullet instead of check */}
                                        <span className="w-1.5 h-1.5 bg-brand-red flex-shrink-0 mt-2 transition-all duration-150 group-hover/item:scale-125"></span>
                                        <span>{responsibility}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Achievements section with trophy icons */}
                            <h4 className="text-sm uppercase text-brand-red dark:text-brand-red font-semibold mb-3 tracking-wider">Key Achievements</h4>
                            <ul className="space-y-3 text-light-text dark:text-dark-text transition-colors duration-150">
                                {job.achievements.map((achievement, i) => (
                                    <li key={i} className="flex items-start gap-2 group/item hover:translate-x-1 transition-all duration-150">
                                        {/* Trophy icon for achievements */}
                                        <i className="fas fa-trophy text-brand-red flex-shrink-0 mt-1 transition-all duration-150 group-hover/item:scale-125"></i>
                                        <span>{achievement}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Enhanced hover indicator with animation */}
                            <div className="w-0 h-0.5 bg-brand-red mt-4 transition-all duration-150 group-hover:w-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Experience;