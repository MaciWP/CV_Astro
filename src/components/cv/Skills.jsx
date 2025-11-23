/**
 * Skills component with scroll animations
 * Modernized version using ScrollAnimationWrapper
 */
import React, { useEffect, useState } from 'react';
import skillsData, { getCurrentLanguageSkills } from '../../data/skills';
import ScrollAnimationWrapper from '../ScrollAnimationWrapper';

const Skills = () => {
    const [titles, setTitles] = useState({
        main: 'Technical Skills',
        languages: 'Programming Languages',
        libraries: 'Libraries & Frameworks',
        technologies: 'Technologies & Databases',
        tools: 'Tools & Applications',
        protocols: 'Protocols'
    });

    useEffect(() => {
        updateTitles();

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

    const SkillPill = ({ name, icon }) => (
        <div className="bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border px-3 py-2 rounded-none inline-flex items-center justify-center text-sm gap-2 transition-all hover:border-brand-red hover:translate-x-1 hover:shadow-sm dark:hover:bg-gray-800">
            <i className={`${icon} text-brand-red`}></i>
            <span>{name}</span>
        </div>
    );

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
        <section id="skills" className="mb-16">
            {/* Section Header */}
            <ScrollAnimationWrapper className="flex items-center mb-6" animationClass="animate-on-scroll">
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <i className="fas fa-code"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3" data-i18n="skills.title">{titles.main}</h2>
            </ScrollAnimationWrapper>

            {/* Main container */}
            <ScrollAnimationWrapper
                className="bg-white dark:bg-dark-surface p-6 border border-gray-200 dark:border-dark-border rounded-none shadow-sm"
                animationClass="animate-scale"
                delay="100ms"
            >
                <div className="grid grid-cols-1 gap-8">
                    {/* Programming Languages */}
                    <div className="space-y-4">
                        <SectionHeader icon="fas fa-code" title={titles.languages} />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.languages.map((skill, index) => (
                                <ScrollAnimationWrapper
                                    key={skill.id}
                                    animationClass="animate-scale"
                                    delay={`${index * 30}ms`}
                                >
                                    <SkillPill name={skill.name} icon={skill.icon} />
                                </ScrollAnimationWrapper>
                            ))}
                        </div>
                    </div>

                    {/* Libraries & Frameworks */}
                    <div className="space-y-4 pt-2">
                        <SectionHeader icon="fas fa-puzzle-piece" title={titles.libraries} />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.libraries.map((lib, index) => (
                                <ScrollAnimationWrapper
                                    key={lib.id}
                                    animationClass="animate-scale"
                                    delay={`${index * 30}ms`}
                                >
                                    <SkillPill name={lib.name} icon={lib.icon} />
                                </ScrollAnimationWrapper>
                            ))}
                        </div>
                    </div>

                    {/* Technologies & Databases */}
                    <div className="space-y-4 pt-2">
                        <SectionHeader icon="fas fa-server" title={titles.technologies} />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.technologies.map((tech, index) => (
                                <ScrollAnimationWrapper
                                    key={tech.id}
                                    animationClass="animate-scale"
                                    delay={`${index * 30}ms`}
                                >
                                    <SkillPill name={tech.name} icon={tech.icon} />
                                </ScrollAnimationWrapper>
                            ))}
                        </div>
                    </div>

                    {/* Tools & Applications */}
                    <div className="space-y-4 pt-2">
                        <SectionHeader icon="fas fa-tools" title={titles.tools} />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.tools.map((tool, index) => (
                                <ScrollAnimationWrapper
                                    key={tool.id}
                                    animationClass="animate-scale"
                                    delay={`${index * 30}ms`}
                                >
                                    <SkillPill name={tool.name} icon={tool.icon} />
                                </ScrollAnimationWrapper>
                            ))}
                        </div>
                    </div>

                    {/* Protocols */}
                    <div className="space-y-4 pt-2">
                        <SectionHeader icon="fas fa-network-wired" title={titles.protocols} />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.protocols.map((protocol, index) => (
                                <ScrollAnimationWrapper
                                    key={protocol.id}
                                    animationClass="animate-scale"
                                    delay={`${index * 30}ms`}
                                >
                                    <SkillPill name={protocol.name} icon={protocol.icon} />
                                </ScrollAnimationWrapper>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollAnimationWrapper>
        </section>
    );
};

export default Skills;
