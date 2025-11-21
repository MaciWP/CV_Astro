/**
 * Skills component with fluid animations and multilingual support
 * File: src/components/cv/Skills.jsx
 */
import React, { useEffect, useState, useRef } from 'react';
// Importamos solo lo que necesitamos
import skillsData, { getCurrentLanguageSkills } from '../../data/skills';
// Importamos getTechIcon desde el sistema unificado
import { getTechIcon } from '../../data/icons';

const Skills = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    const [categories, setCategories] = useState({});
    const [titles, setTitles] = useState({
        main: 'Technical Skills',
        languages: 'Programming Languages',
        libraries: 'Libraries & Frameworks',
        technologies: 'Technologies & Databases',
        tools: 'Tools & Applications',
        protocols: 'Protocols'
    });

    // Custom delays for each type of element
    const getStaggerDelay = (index, type) => {
        const baseDelay = {
            'header': 30,
            'languages': 10,
            'libraries': 12,
            'technologies': 16,
            'tools': 18,
            'protocols': 20
        };

        // Add slight random variations for a more organic effect
        const variation = Math.random() * 10 - 5; // Between -5ms and +5ms
        return (baseDelay[type] || 20) * index + variation;
    };

    useEffect(() => {
        // Load initial titles based on current language
        updateTitles();

        // ✅ OPTIMIZED: Render everything visible immediately (no IntersectionObserver delays to prevent CLS)
        setIsVisible(true);
        setCategories({
            languages: true,
            libraries: true,
            technologies: true,
            tools: true,
            protocols: true
        });

        // Listen for language changes
        const handleLanguageChanged = () => {
            updateTitles();
        };

        document.addEventListener('languageChanged', handleLanguageChanged);
        document.addEventListener('translationsLoaded', handleLanguageChanged);

        return () => {
            document.removeEventListener('languageChanged', handleLanguageChanged);
            document.removeEventListener('translationsLoaded', handleLanguageChanged);
        };
    }, []);

    // Update section titles based on current language
    const updateTitles = () => {
        const localizedData = getCurrentLanguageSkills();

        setTitles({
            main: localizedData.title,
            languages: localizedData.languages.title,
            libraries: localizedData.libraries.title,
            technologies: localizedData.technologies.title,
            tools: localizedData.tools.title,
            protocols: localizedData.protocols.title
        });
    };

    // SkillPill with fluid animations based on physics principles
    const SkillPill = ({ name, icon, index, category }) => {
        const isActive = categories[category] || false;
        const delay = getStaggerDelay(index, category);
        const hasBounce = index % 3 === 0; // Some elements will have bounce

        return (
            <div
                className={`bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border 
                        px-3 py-2 rounded-none inline-flex items-center justify-center text-sm gap-2
                        transition-all hover:border-brand-red hover:translate-x-1
                        hover:shadow-sm dark:hover:bg-gray-800 skill-pill`}
                style={{
                    // OPTIMIZED: Use scale instead of translateY to prevent CLS
                    transform: isActive ? 'scale(1)' : 'scale(0.95)',
                    opacity: isActive ? 1 : 0,
                    transitionProperty: 'transform, opacity, border-color, box-shadow',
                    transitionDuration: `${280 + index % 120}ms`,
                    transitionDelay: `${delay}ms`,
                    transitionTimingFunction: hasBounce
                        ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' // With bounce
                        : 'cubic-bezier(0.33, 1, 0.68, 1)', // Without bounce
                    transformOrigin: 'center',
                    willChange: 'opacity, transform',
                    backfaceVisibility: 'hidden'
                }}
            >
                <i className={`${icon} text-brand-red`}></i>
                <span>{name}</span>
            </div>
        );
    };

    // Section header with fluid animation
    const SectionHeader = ({ icon, title, index, category }) => {
        const isActive = categories[category] || false;
        const delay = 50 + index * 80; // Progressive delay for headers

        return (
            <div
                className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 section-header"
                style={{
                    // OPTIMIZED: Use scale instead of translateX to prevent CLS
                    transform: isActive ? 'scale(1)' : 'scale(0.98)',
                    opacity: isActive ? 1 : 0,
                    transitionProperty: 'transform, opacity',
                    transitionDuration: '450ms',
                    transitionDelay: `${delay}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)',
                    willChange: 'opacity, transform',
                    backfaceVisibility: 'hidden'
                }}
            >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-red bg-opacity-10 flex items-center justify-center rounded-none">
                        <i className={`${icon} text-brand-red`}></i>
                    </div>
                    {title}
                </h3>
            </div>
        );
    };

    return (
        <section
            id="skills"
            ref={sectionRef}
            className="mb-16"
            style={{
                minHeight: '800px',        // Reserve space to prevent layout collapse
                contain: 'layout',         // Isolate layout shifts within section
                willChange: 'contents'     // Browser hint for optimization
            }}
        >
            {/* Section Header with optimized animation */}
            <div
                className="flex items-center mb-6"
                style={{
                    transform: isVisible ? 'scale(1)' : 'scale(0.98)',  // Use scale instead of translateY to prevent CLS
                    opacity: isVisible ? 1 : 0,
                    transition: 'transform 400ms cubic-bezier(0.33, 1, 0.68, 1), opacity 400ms ease-out',
                    transformOrigin: 'center',
                    backfaceVisibility: 'hidden'
                }}
            >
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <i className="fas fa-code"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3" data-i18n="skills.title">{titles.main}</h2>
            </div>

            {/* Main container with optimized appearance effect */}
            <div
                className="bg-white dark:bg-dark-surface p-6 border border-gray-200 dark:border-dark-border rounded-none shadow-sm"
                style={{
                    transform: isVisible ? 'scale(1)' : 'scale(0.99)',  // Use scale instead of translateY to prevent CLS
                    opacity: isVisible ? 1 : 0,
                    transition: 'transform 400ms cubic-bezier(0.33, 1, 0.68, 1), opacity 400ms ease-out',
                    transitionDelay: '100ms',
                    transformOrigin: 'center',
                    backfaceVisibility: 'hidden'
                }}
            >
                {/* Layout with natural gap */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Programming Languages */}
                    <div className="space-y-4">
                        <SectionHeader
                            icon="fas fa-code"
                            title={titles.languages}
                            index={0}
                            category="languages"
                        />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.languages.map((skill, index) => (
                                <SkillPill
                                    key={skill.id}
                                    name={skill.name}
                                    icon={skill.icon}
                                    index={index}
                                    category="languages"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Libraries & Frameworks */}
                    <div className="space-y-4 pt-2">
                        <SectionHeader
                            icon="fas fa-puzzle-piece"
                            title={titles.libraries}
                            index={1}
                            category="libraries"
                        />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.libraries.map((lib, index) => (
                                <SkillPill
                                    key={lib.id}
                                    name={lib.name}
                                    icon={lib.icon}
                                    index={index}
                                    category="libraries"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Technologies & Databases */}
                    <div className="space-y-4 pt-2">
                        <SectionHeader
                            icon="fas fa-server"
                            title={titles.technologies}
                            index={2}
                            category="technologies"
                        />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.technologies.map((tech, index) => (
                                <SkillPill
                                    key={tech.id}
                                    name={tech.name}
                                    icon={tech.icon}
                                    index={index}
                                    category="technologies"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Tools & Applications */}
                    <div className="space-y-4 pt-2">
                        <SectionHeader
                            icon="fas fa-tools"
                            title={titles.tools}
                            index={3}
                            category="tools"
                        />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.tools.map((tool, index) => (
                                <SkillPill
                                    key={tool.id}
                                    name={tool.name}
                                    icon={tool.icon}
                                    index={index}
                                    category="tools"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Protocols */}
                    <div className="space-y-4 pt-2">
                        <SectionHeader
                            icon="fas fa-network-wired"
                            title={titles.protocols}
                            index={4}
                            category="protocols"
                        />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.protocols.map((protocol, index) => (
                                <SkillPill
                                    key={protocol.id}
                                    name={protocol.name}
                                    icon={protocol.icon}
                                    index={index}
                                    category="protocols"
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