import React, { useEffect, useState, useRef } from 'react';

/**
 * Enhanced Skills component with improved layout and without re-animation on theme change
 * For professional Swiss CV standards
 */
const Skills = () => {
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

        observer.observe(document.getElementById('skills'));

        return () => observer.disconnect();
    }, []);

    // Skill categories organized into sections with icons
    const skillData = {
        programming: [
            { name: "C#", percent: 95, icon: "fab fa-microsoft" },
            { name: "Java", percent: 85, icon: "fab fa-java" },
            { name: "Android", percent: 75, icon: "fab fa-android" },
            { name: "Json", percent: 90, icon: "fas fa-code" },
            { name: ".NET", percent: 90, icon: "fab fa-windows" },
            { name: "XML", percent: 80, icon: "fas fa-file-code" },
            { name: "SQL", percent: 85, icon: "fas fa-database" },
            { name: "ODF", percent: 70, icon: "fas fa-file-alt" }
        ],
        methodologies: [
            { name: "Agile/Scrum", percent: 95, icon: "fas fa-tasks" },
            { name: "Test-Driven Dev", percent: 85, icon: "fas fa-vial" },
            { name: "CI/CD", percent: 75, icon: "fas fa-code-branch" },
            { name: "DevOps", percent: 70, icon: "fas fa-sync" }
        ],
        tools: [
            { name: "Visual Studio", icon: "fas fa-tv" },
            { name: "REST", icon: "fas fa-exchange-alt" },
            { name: "SOAP", icon: "fas fa-soap" },
            { name: ".NET 4.8", icon: "fab fa-microsoft" },
            { name: "WPF", icon: "fas fa-desktop" },
            { name: "Postman", icon: "fas fa-paper-plane" },
            { name: "SoapUI", icon: "fas fa-tools" },
            { name: "MySQL", icon: "fas fa-database" },
            { name: "Postgres", icon: "fas fa-database" },
            { name: "Beaver", icon: "fas fa-stream" },
            { name: "MVware", icon: "fas fa-server" },
            { name: "Oracle Express", icon: "fas fa-database" }
        ]
    };

    // SkillBar component for programming and methodologies with smaller bars
    const SkillBar = ({ name, percent, icon, index }) => {
        const [animated, setAnimated] = useState(false);

        useEffect(() => {
            // Animate when section becomes visible with cascading delay
            if (isVisible) {
                const timer = setTimeout(() => {
                    setAnimated(true);
                }, 100 + index * 50);

                return () => clearTimeout(timer);
            }
        }, [isVisible]);

        return (
            <div className="mb-3 transition-all duration-150 theme-transition">
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                        <i className={`${icon} text-brand-red text-sm theme-transition-text`}></i>
                        <span className="font-medium text-sm theme-transition-text">{name}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 theme-transition-text">{percent}%</span>
                </div>
                <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-none overflow-hidden theme-transition-bg">
                    <div
                        className="h-full bg-brand-red transition-all duration-500"
                        style={{
                            width: animated ? `${percent}%` : '0%',
                        }}
                    ></div>
                </div>
            </div>
        );
    };

    // SkillPill component for tools
    const SkillPill = ({ name, icon, index }) => (
        <div
            className={`bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border 
                       px-2 py-1 rounded-none inline-flex items-center justify-center text-xs gap-1
                       transition-all duration-150 hover:border-brand-red
                       hover:shadow-sm dark:hover:bg-gray-800 theme-transition-bg theme-transition-text
                       ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{
                transitionDelay: `${50 * index}ms`,
                animation: isVisible ? `enhanced-appear 0.3s var(--animation-easing) forwards ${index * 30}ms` : 'none'
            }}
        >
            <i className={`${icon} text-brand-red text-xs theme-transition-text`}></i>
            {name}
        </div>
    );

    return (
        <section id="skills" className="mb-16 section-animate">
            <div
                className={`flex items-center mb-6 transition-all duration-700 transform section-animate-header ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none theme-transition-bg">
                    <i className="fas fa-code"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3 theme-transition-text">Technical Skills</h2>
            </div>

            <div
                className={`bg-white dark:bg-dark-surface p-5 border border-gray-200 dark:border-dark-border 
                          rounded-none shadow-sm transition-all duration-700 transform section-animate-content
                          theme-transition-bg ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: '200ms' }}
            >
                {/* Improved layout for better readability */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
                    {/* Programming Skills section - 5/12 columns on large screens */}
                    <div className="lg:col-span-5 space-y-3">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-3 theme-transition-bg">
                            <h3 className="text-base font-semibold flex items-center gap-2 theme-transition-text">
                                <i className="fas fa-laptop-code text-brand-red theme-transition-text"></i>
                                Programming
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 section-animate-items">
                            {skillData.programming.map((skill, index) => (
                                <SkillBar
                                    key={skill.name}
                                    name={skill.name}
                                    percent={skill.percent}
                                    icon={skill.icon}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Methodologies section - 3/12 columns on large screens */}
                    <div className="lg:col-span-3 space-y-3">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-3 theme-transition-bg">
                            <h3 className="text-base font-semibold flex items-center gap-2 theme-transition-text">
                                <i className="fas fa-sitemap text-brand-red theme-transition-text"></i>
                                Methodologies
                            </h3>
                        </div>

                        <div className="section-animate-items">
                            {skillData.methodologies.map((method, index) => (
                                <SkillBar
                                    key={method.name}
                                    name={method.name}
                                    percent={method.percent}
                                    icon={method.icon}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Tools section - 4/12 columns on large screens */}
                    <div className="lg:col-span-4 space-y-3">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-2 mb-3 theme-transition-bg">
                            <h3 className="text-base font-semibold flex items-center gap-2 theme-transition-text">
                                <i className="fas fa-tools text-brand-red theme-transition-text"></i>
                                Tools & Technologies
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-1.5 section-animate-items">
                            {skillData.tools.map((tool, index) => (
                                <SkillPill
                                    key={tool.name}
                                    name={tool.name}
                                    icon={tool.icon}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;