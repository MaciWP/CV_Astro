import React, { useEffect, useState, useRef } from 'react';

/**
 * Enhanced Skills component with improved layout and optimized for theme changes
 * For professional Swiss CV standards
 */
const Skills = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

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

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Skill categories organized into sections with icons
    const skillData = {
        programming: [
            { name: "C#", percent: 95, icon: "fab fa-microsoft", years: 6 },
            { name: "Java", percent: 85, icon: "fab fa-java", years: 4 },
            { name: "Android", percent: 75, icon: "fab fa-android", years: 3 },
            { name: "Json", percent: 90, icon: "fas fa-code", years: 5 },
            { name: ".NET", percent: 90, icon: "fab fa-windows", years: 5 },
            { name: "XML", percent: 80, icon: "fas fa-file-code", years: 4 },
            { name: "SQL", percent: 85, icon: "fas fa-database", years: 5 },
            { name: "ODF", percent: 70, icon: "fas fa-file-alt", years: 2 }
        ],
        methodologies: [
            { name: "Agile/Scrum", percent: 95, icon: "fas fa-tasks", years: 5 },
            { name: "Test-Driven Dev", percent: 85, icon: "fas fa-vial", years: 3 },
            { name: "CI/CD", percent: 75, icon: "fas fa-code-branch", years: 2 },
            { name: "DevOps", percent: 70, icon: "fas fa-sync", years: 2 }
        ],
        tools: [
            { name: "Visual Studio", icon: "fas fa-tv", years: 6 },
            { name: "REST", icon: "fas fa-exchange-alt", years: 5 },
            { name: "SOAP", icon: "fas fa-soap", years: 3 },
            { name: ".NET 4.8", icon: "fab fa-microsoft", years: 4 },
            { name: "WPF", icon: "fas fa-desktop", years: 3 },
            { name: "Postman", icon: "fas fa-paper-plane", years: 4 },
            { name: "SoapUI", icon: "fas fa-tools", years: 3 },
            { name: "MySQL", icon: "fas fa-database", years: 4 },
            { name: "Postgres", icon: "fas fa-database", years: 3 },
            { name: "Beaver", icon: "fas fa-stream", years: 2 },
            { name: "MVware", icon: "fas fa-server", years: 3 },
            { name: "Oracle Express", icon: "fas fa-database", years: 2 }
        ]
    };

    // Optimized SkillBar component - only animate when visible and avoid unnecessary re-animations
    const SkillBar = ({ name, percent, icon, index, years }) => {
        const barRef = useRef(null);
        const [animated, setAnimated] = useState(false);

        useEffect(() => {
            if (isVisible && !animated && barRef.current) {
                // Set a delay based on index for cascade effect
                const timer = setTimeout(() => {
                    setAnimated(true);
                }, 50 + index * 30); // Faster animations

                return () => clearTimeout(timer);
            }
        }, [isVisible, animated, index]);

        // Memory efficient - using CSS variables for transitions
        const barStyle = {
            width: animated ? `${percent}%` : '0%',
            transition: `width ${animated ? '400ms' : '0ms'} cubic-bezier(0.34, 1.56, 0.64, 1)`,
            transitionDelay: `${30 * index}ms`,
        };

        return (
            <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                        <i className={`${icon} text-brand-red text-sm`}></i>
                        <span className="font-medium text-sm">{name}</span>
                        {years && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-sm text-gray-600 dark:text-gray-400">
                                {years} {years === 1 ? 'year' : 'years'}
                            </span>
                        )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{percent}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-none overflow-hidden" ref={barRef}>
                    <div
                        className="h-full bg-brand-red"
                        style={barStyle}
                    ></div>
                </div>
            </div>
        );
    };

    // Optimized SkillPill component - simplified with better structure
    const SkillPill = ({ name, icon, index, years }) => (
        <div
            className={`bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border 
                       px-3 py-1.5 rounded-none inline-flex items-center justify-center text-sm gap-2
                       transition-all duration-150 hover:border-brand-red
                       hover:shadow-sm dark:hover:bg-gray-800
                       ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{
                transitionDelay: `${40 * index}ms`,
                transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
        >
            <i className={`${icon} text-brand-red`}></i>
            <span>{name}</span>
            {years && (
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-sm text-gray-600 dark:text-gray-400">
                    {years} {years === 1 ? 'yr' : 'yrs'}
                </span>
            )}
        </div>
    );

    return (
        <section id="skills" ref={sectionRef} className="mb-16">
            {/* Section Header */}
            <div className={`flex items-center mb-6 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <i className="fas fa-code"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3">Technical Skills</h2>
            </div>

            {/* Skills Container with improved spacing and visual organization */}
            <div className={`bg-white dark:bg-dark-surface p-6 border border-gray-200 dark:border-dark-border 
                           rounded-none shadow-sm transition-all duration-500 transform 
                           ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: '100ms' }}>

                {/* Improved layout with more space and better organization */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Programming Skills Section */}
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <div className="w-8 h-8 bg-brand-red bg-opacity-10 flex items-center justify-center rounded-none">
                                    <i className="fas fa-laptop-code text-brand-red"></i>
                                </div>
                                Programming Languages & Technologies
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-3">
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

                    {/* Methodologies Section */}
                    <div className="space-y-4 pt-2">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <div className="w-8 h-8 bg-brand-red bg-opacity-10 flex items-center justify-center rounded-none">
                                    <i className="fas fa-sitemap text-brand-red"></i>
                                </div>
                                Development Methodologies
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-3">
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

                    {/* Tools Section */}
                    <div className="space-y-4 pt-2">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <div className="w-8 h-8 bg-brand-red bg-opacity-10 flex items-center justify-center rounded-none">
                                    <i className="fas fa-tools text-brand-red"></i>
                                </div>
                                Tools & Technologies
                            </h3>
                        </div>

                        <div className="flex flex-wrap gap-3">
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