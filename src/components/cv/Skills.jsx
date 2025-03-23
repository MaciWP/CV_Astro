import React, { useEffect, useState, useRef } from 'react';
import skillsData, { techIcons } from '../../data/skills';

/**
 * Skills component con animaciones fluidas inspiradas en principios de diseño de movimiento
 */
const Skills = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    const [categories, setCategories] = useState({});

    // Retrasos personalizados para cada tipo de elemento
    const getStaggerDelay = (index, type) => {
        const baseDelay = {
            // Delays personalizados por tipo para un efecto más natural
            'header': 30,
            'languages': 10,
            'libraries': 12,
            'technologies': 16,
            'tools': 18,
            'protocols': 20
        };

        // Añadir ligeras variaciones aleatorias para un efecto más orgánico
        const variation = Math.random() * 10 - 5; // Entre -5ms y +5ms
        return (baseDelay[type] || 20) * index + variation;
    };

    useEffect(() => {
        // Configuración de observer con opciones de threshold para detección más precisa
        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;

                if (entry.isIntersecting) {
                    // Animación fluida escalonada para diferentes categorías
                    setIsVisible(true);

                    // Secuencia de activación para categorías con retrasos naturales
                    const sequence = ['languages', 'libraries', 'technologies', 'tools', 'protocols'];

                    // Activar categorías con timing más natural
                    sequence.forEach((category, i) => {
                        setTimeout(() => {
                            setCategories(prev => ({
                                ...prev,
                                [category]: true
                            }));
                        }, 150 + i * 100); // Espaciado natural entre categorías
                    });

                    observer.disconnect();
                }
            },
            {
                threshold: 0.15, // Umbral más bajo para activar antes
                rootMargin: "-50px 0px" // Margen negativo para activar antes de estar completamente visible
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // SkillPill con animaciones más fluidas basadas en principios de física
    const SkillPill = ({ name, icon, index, category }) => {
        // Retrasos y duraciones variables para movimiento más orgánico
        const isActive = categories[category] || false;
        const delay = getStaggerDelay(index, category);

        // Calcular probabilidades para animación personalizada
        const direction = index % 2 === 0 ? -1 : 1; // Alternar dirección
        const hasBounce = index % 3 === 0; // Algunos elementos tendrán rebote

        return (
            <div
                className={`bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border 
                        px-3 py-2 rounded-none inline-flex items-center justify-center text-sm gap-2
                        transition-all hover:border-brand-red hover:translate-x-1
                        hover:shadow-sm dark:hover:bg-gray-800 skill-pill`}
                style={{
                    transform: isActive ? 'translateY(0)' : `translateY(${20 + index % 10}px)`,
                    opacity: isActive ? 1 : 0,
                    transitionProperty: 'transform, opacity, border-color, box-shadow',
                    transitionDuration: `${280 + index % 120}ms`,
                    transitionDelay: `${delay}ms`,
                    transitionTimingFunction: hasBounce
                        ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' // Con rebote
                        : 'cubic-bezier(0.33, 1, 0.68, 1)', // Sin rebote
                    transformOrigin: index % 2 === 0 ? 'left center' : 'right center'
                }}
            >
                <i className={`${icon} text-brand-red`}></i>
                <span>{name}</span>
            </div>
        );
    };

    // Sección header con animación fluida
    const SectionHeader = ({ icon, title, index, category }) => {
        const isActive = categories[category] || false;
        const delay = 50 + index * 80; // Retraso progresivo para headers

        return (
            <div
                className="border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 section-header"
                style={{
                    transform: isActive ? 'translateX(0)' : 'translateX(-30px)',
                    opacity: isActive ? 1 : 0,
                    transitionProperty: 'transform, opacity',
                    transitionDuration: '450ms',
                    transitionDelay: `${delay}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)'
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
        <section id="skills" ref={sectionRef} className="mb-16">
            {/* Section Header con animación optimizada */}
            <div
                className="flex items-center mb-6"
                style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 500ms ease-out'
                }}
            >
                <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
                    <i className="fas fa-code"></i>
                </div>
                <h2 className="text-2xl font-bold ml-3">Technical Skills</h2>
            </div>

            {/* Container principal con efecto de aparición optimizado */}
            <div
                className="bg-white dark:bg-dark-surface p-6 border border-gray-200 dark:border-dark-border rounded-none shadow-sm"
                style={{
                    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'transform 500ms cubic-bezier(0.33, 1, 0.68, 1), opacity 400ms ease-out',
                    transitionDelay: '100ms'
                }}
            >
                {/* Layout con gap natural */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Programming Languages */}
                    <div className="space-y-4">
                        <SectionHeader
                            icon="fas fa-code"
                            title="Programming Languages"
                            index={0}
                            category="languages"
                        />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.languages.map((skill, index) => (
                                <SkillPill
                                    key={skill.name}
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
                            title="Libraries & Frameworks"
                            index={1}
                            category="libraries"
                        />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.libraries.map((lib, index) => (
                                <SkillPill
                                    key={lib.name}
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
                            title="Technologies & Databases"
                            index={2}
                            category="technologies"
                        />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.technologies.map((tech, index) => (
                                <SkillPill
                                    key={tech.name}
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
                            title="Tools & Applications"
                            index={3}
                            category="tools"
                        />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.tools.map((tool, index) => (
                                <SkillPill
                                    key={tool.name}
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
                            title="Protocols"
                            index={4}
                            category="protocols"
                        />
                        <div className="flex flex-wrap gap-3">
                            {skillsData.protocols.map((protocol, index) => (
                                <SkillPill
                                    key={protocol.name}
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