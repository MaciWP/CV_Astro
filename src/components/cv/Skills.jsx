import React, { useEffect, useState, useRef } from 'react';

/**
 * Enhanced Skills component with improved categorization and layout
 * For professional Swiss CV standards - Pills-only design without progress bars
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

    // Skill categories organized into better structured sections with representative icons
    const skillData = {
        // Programming Languages
        languages: [
            { name: "C#", icon: "fab fa-microsoft" },
            { name: "Python", icon: "fab fa-python" },
            { name: "Java", icon: "fab fa-java" },
            { name: ".NET", icon: "fab fa-windows" },
            { name: "JavaScript", icon: "fab fa-js" },
            { name: "TypeScript", icon: "fab fa-js" },
            { name: "HTML", icon: "fab fa-html5" },
            { name: "CSS", icon: "fab fa-css3-alt" },
            { name: "XML", icon: "fas fa-file-code" },
            { name: "JSON", icon: "fas fa-file-code" },
            { name: "YAML", icon: "fas fa-file-code" },
        ],

        // Libraries and Frameworks
        libraries: [
            { name: "Django", icon: "fas fa-cubes" },
            { name: "Django REST", icon: "fas fa-exchange-alt" },
            { name: "FastAPI", icon: "fas fa-bolt" },
            { name: "Flask", icon: "fas fa-flask" },
            { name: "React", icon: "fab fa-react" },
            { name: "Astro", icon: "fas fa-rocket" },
            { name: "Tailwind CSS", icon: "fab fa-css3-alt" },
            { name: "Pytest", icon: "fas fa-vial" },
            { name: "SQLAlchemy", icon: "fas fa-database" },
            { name: "Alembic", icon: "fas fa-code-branch" },
            { name: "Celery", icon: "fas fa-tasks" },
            { name: "WPF", icon: "fas fa-desktop" },
            { name: "Windows Forms", icon: "fas fa-window-maximize" },
            { name: "PyVmomi", icon: "fab fa-vmware" },
            { name: "NumPy", icon: "fas fa-calculator" },
            { name: "Pandas", icon: "fas fa-table" },
            { name: "Kivy", icon: "fas fa-mobile-alt" },
            { name: "ONNX", icon: "fas fa-brain" },
            { name: "Black", icon: "fas fa-check" },
            { name: "Flake8", icon: "fas fa-ruler" },
            { name: "Mypy", icon: "fas fa-check-circle" },
            { name: "Nox", icon: "fas fa-tools" },
            { name: "pre-commit", icon: "fas fa-code-branch" },
        ],

        // Technologies and Databases
        technologies: [
            { name: "Docker", icon: "fab fa-docker" },
            { name: "GitHub", icon: "fab fa-github" },
            { name: "AWS", icon: "fab fa-aws" },
            { name: "PostgreSQL", icon: "fas fa-database" },
            { name: "MySQL", icon: "fas fa-database" },
            { name: "Redis", icon: "fas fa-server" },
            { name: "Git", icon: "fab fa-git-alt" },
            { name: "CI/CD", icon: "fas fa-sync-alt" },
            { name: "GitHub Actions", icon: "fab fa-github" },
            { name: "REST API", icon: "fas fa-exchange-alt" },
            { name: "SOAP API", icon: "fas fa-envelope-open-text" },
            { name: "JWT", icon: "fas fa-key" },
            { name: "OTP/2FA", icon: "fas fa-shield-alt" },
            { name: "Windows Services", icon: "fab fa-windows" },
            { name: "VMware", icon: "fab fa-vmware" },
            { name: "i18n", icon: "fas fa-language" },
            { name: "PWA", icon: "fas fa-globe" },
            { name: "NFC", icon: "fas fa-wifi" },
        ],

        // Tools and Applications
        tools: [
            { name: "PyCharm", icon: "fas fa-edit" },
            { name: "Visual Studio", icon: "fas fa-tv" },
            { name: "VS Code", icon: "fas fa-code" },
            { name: "Cursor", icon: "fas fa-i-cursor" },
            { name: "Postman", icon: "fas fa-paper-plane" },
            { name: "Bruno", icon: "fas fa-cube" },
            { name: "MiBrowser", icon: "fas fa-search" },
            { name: "Modscan", icon: "fas fa-network-wired" },
            { name: "ITA", icon: "fas fa-server" },
            { name: "DCE", icon: "fas fa-cogs" },
            { name: "PowerIQ", icon: "fas fa-bolt" },
            { name: "iTRACS", icon: "fas fa-map-marked" },
            { name: "HPE IMC", icon: "fas fa-network-wired" },
            { name: "Gunicorn", icon: "fas fa-server" },
            { name: "Nginx", icon: "fas fa-server" },
        ],

        // Protocols
        protocols: [
            { name: "SNMP", icon: "fas fa-exchange-alt" },
            { name: "MODBUS", icon: "fas fa-plug" },
            { name: "BACnet", icon: "fas fa-building" },
        ],

        // Methodologies
        methodologies: [
            { name: "Scrum", icon: "fas fa-users" },
            { name: "Kanban", icon: "fas fa-columns" },
            { name: "DevOps", icon: "fas fa-infinity" },
        ]
    };

    // Optimized SkillPill component - simplified with better structure
    const SkillPill = ({ name, icon, index }) => (
        <div
            className={`bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border 
                       px-3 py-2 rounded-none inline-flex items-center justify-center text-sm gap-2
                       transition-all duration-150 hover:border-brand-red hover:translate-x-1
                       hover:shadow-sm dark:hover:bg-gray-800
                       ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{
                transitionDelay: `${30 * index}ms`,
                transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
        >
            <i className={`${icon} text-brand-red`}></i>
            <span>{name}</span>
        </div>
    );

    // Section header component to reduce repetition
    const SectionHeader = ({ icon, title }) => (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-red bg-opacity-10 flex items-center justify-center rounded-none">
                    <i className={`${icon} text-brand-red`}></i>
                </div>
                {title}
            </h3>
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
                    {/* Programming Languages Section */}
                    <div className="space-y-4">
                        <SectionHeader icon="fas fa-code" title="Programming Languages" />
                        <div className="flex flex-wrap gap-3">
                            {skillData.languages.map((skill, index) => (
                                <SkillPill
                                    key={skill.name}
                                    name={skill.name}
                                    icon={skill.icon}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Libraries & Frameworks Section */}
                    <div className="space-y-4 pt-2">
                        <SectionHeader icon="fas fa-puzzle-piece" title="Libraries & Frameworks" />
                        <div className="flex flex-wrap gap-3">
                            {skillData.libraries.map((lib, index) => (
                                <SkillPill
                                    key={lib.name}
                                    name={lib.name}
                                    icon={lib.icon}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Technologies & Databases Section */}
                    <div className="space-y-4 pt-2">
                        <SectionHeader icon="fas fa-server" title="Technologies & Databases" />
                        <div className="flex flex-wrap gap-3">
                            {skillData.technologies.map((tech, index) => (
                                <SkillPill
                                    key={tech.name}
                                    name={tech.name}
                                    icon={tech.icon}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Tools & Applications Section */}
                    <div className="space-y-4 pt-2">
                        <SectionHeader icon="fas fa-tools" title="Tools & Applications" />
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

                    {/* Protocols Section */}
                    <div className="space-y-4 pt-2">
                        <SectionHeader icon="fas fa-network-wired" title="Protocols" />
                        <div className="flex flex-wrap gap-3">
                            {skillData.protocols.map((protocol, index) => (
                                <SkillPill
                                    key={protocol.name}
                                    name={protocol.name}
                                    icon={protocol.icon}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Methodologies Section */}
                    <div className="space-y-4 pt-2">
                        <SectionHeader icon="fas fa-sitemap" title="Methodologies" />
                        <div className="flex flex-wrap gap-3">
                            {skillData.methodologies.map((methodology, index) => (
                                <SkillPill
                                    key={methodology.name}
                                    name={methodology.name}
                                    icon={methodology.icon}
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