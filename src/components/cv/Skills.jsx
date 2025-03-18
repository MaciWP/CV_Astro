import React, { useEffect, useState } from 'react';

const Skills = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('programming');
    const [animating, setAnimating] = useState(false);

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

    // Manejo de cambio de tab con animación
    const handleTabChange = (tabName) => {
        if (tabName === activeTab || animating) return;

        setAnimating(true);

        // Cambio del tab con un pequeño delay para la animación
        setTimeout(() => {
            setActiveTab(tabName);
            // Dar tiempo a que se complete la animación
            setTimeout(() => {
                setAnimating(false);
            }, 400);
        }, 100);
    };

    // All skill categories
    const skillCategories = {
        programming: [
            { name: "C#", percent: 95 },
            { name: "Java", percent: 85 },
            { name: "Android", percent: 75 },
            { name: "Json", percent: 90 },
            { name: ".NET", percent: 90 },
            { name: "XML", percent: 80 },
            { name: "SQL", percent: 85 },
            { name: "ODF", percent: 70 }
        ],
        tools: [
            "Visual Studio",
            "REST",
            "SOAP",
            ".NET 4.8",
            "WPF",
            "Postman",
            "SoapUI",
            "MySQL",
            "Postgres",
            "Beaver",
            "MVware",
            "Oracle Express"
        ],
        methodologies: [
            { name: "Agile/Scrum", percent: 95 },
            { name: "Test-Driven Development", percent: 85 },
            { name: "CI/CD", percent: 75 },
            { name: "DevOps", percent: 70 }
        ]
    };

    // Function to render skill progress bar with advanced animation
    const SkillBar = ({ name, percent, index }) => (
        <div
            className={`mb-8 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: `${100 * index}ms` }}
        >
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{percent}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-none overflow-hidden">
                {isVisible && (
                    <div
                        className="h-full bg-brand-red"
                        style={{
                            width: `${percent}%`,
                            animation: `fill-bar 1.5s ease-out forwards`,
                            animationDelay: `${150 * index}ms`
                        }}
                    ></div>
                )}
            </div>
        </div>
    );

    // Function to render skill pill with improved hover and animation
    const SkillPill = ({ name, index }) => (
        <div
            className={`bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border px-4 py-2 rounded-none inline-flex items-center justify-center text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-brand-red dark:hover:bg-gray-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{
                transitionDelay: `${50 * index}ms`,
                animation: isVisible ? `appear 0.4s ease-out forwards ${index * 100}ms` : 'none'
            }}
        >
            {name}
        </div>
    );

    return (
        <section id="skills" className="mb-24"> {/* Increased bottom margin */}
            <div
                className={`flex items-center mb-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
            >
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <i className="fas fa-code"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3">Technical Skills</h2>
            </div>

            <div
                className={`bg-white dark:bg-dark-surface p-8 border border-gray-200 dark:border-dark-border rounded-none shadow-sm transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} overflow-hidden`}
                style={{ transitionDelay: '200ms' }}
            >
                {/* Tabs navigation with improved hover effects */}
                <div className="flex border-b border-gray-200 dark:border-dark-border mb-10"> {/* Increased margin bottom */}
                    {Object.keys(skillCategories).map((category) => (
                        <button
                            key={category}
                            onClick={() => handleTabChange(category)}
                            className={`relative px-8 py-3 text-center focus:outline-none transition-all duration-300 overflow-hidden ${activeTab === category
                                    ? 'text-brand-red'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            {/* Animated underline */}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-red transform transition-transform duration-300 ${activeTab === category ? 'scale-x-100' : 'scale-x-0'
                                }`}></span>

                            {/* Category name with first letter capitalized */}
                            {category.charAt(0).toUpperCase() + category.slice(1)}

                            {/* Hover indicator */}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-red/30 transform scale-x-0 transition-transform duration-300 hover:scale-x-100 ${activeTab === category ? 'opacity-0' : 'opacity-100'
                                }`}></span>
                        </button>
                    ))}
                </div>

                {/* Content container with enhanced transitions */}
                <div className="relative min-h-[280px]"> {/* Increased min-height */}
                    {/* Programming Skills Tab */}
                    <div
                        className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 transition-all duration-300 absolute w-full ${activeTab === 'programming'
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-20 pointer-events-none absolute'
                            }`}
                    >
                        {skillCategories.programming.map((skill, index) => (
                            <SkillBar key={skill.name} name={skill.name} percent={skill.percent} index={index} />
                        ))}
                    </div>

                    {/* Tools Tab with improved animations */}
                    <div
                        className={`flex flex-wrap gap-4 transition-all duration-300 absolute w-full ${activeTab === 'tools'
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-20 pointer-events-none absolute'
                            }`}
                    >
                        {skillCategories.tools.map((tool, index) => (
                            <SkillPill key={tool} name={tool} index={index} />
                        ))}
                    </div>

                    {/* Methodologies Tab */}
                    <div
                        className={`grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 transition-all duration-300 absolute w-full ${activeTab === 'methodologies'
                                ? 'opacity-100 translate-x-0'
                                : 'opacity-0 translate-x-20 pointer-events-none absolute'
                            }`}
                    >
                        {skillCategories.methodologies.map((method, index) => (
                            <SkillBar key={method.name} name={method.name} percent={method.percent} index={index} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;