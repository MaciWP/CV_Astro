import React, { useState, useEffect, useRef } from 'react';

/**
 * ThemeToggle con transiciones naturales y fluidas entre temas
 */
const ThemeToggle = () => {
    const [theme, setTheme] = useState('light');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const buttonRef = useRef(null);
    const iconRef = useRef(null);

    useEffect(() => {
        // Inicializar tema desde localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        document.documentElement.classList.add(savedTheme);

        // Preparar elementos para efectos de transición
        if (!document.querySelector('.theme-wave')) {
            const waveElement = document.createElement('div');
            waveElement.className = 'theme-wave';
            document.body.appendChild(waveElement);
        }

        return () => {
            const waveElement = document.querySelector('.theme-wave');
            if (waveElement) document.body.removeChild(waveElement);
        };
    }, []);

    // Función mejorada para toggle de tema con animaciones naturales
    const toggleTheme = () => {
        if (isTransitioning) return;

        const newTheme = theme === 'light' ? 'dark' : 'light';
        setIsTransitioning(true);

        // Animar el icono del botón
        if (iconRef.current) {
            iconRef.current.classList.add('animate-spin-once');
            setTimeout(() => {
                iconRef.current?.classList.remove('animate-spin-once');
            }, 300);
        }

        // Crear blocker de eventos temporalmente
        const blocker = document.createElement('div');
        blocker.className = 'theme-transition-blocker';
        document.body.appendChild(blocker);

        // Aplicar clase para transición
        document.documentElement.classList.add('theme-transitioning');

        // Iniciar secuencia de cambio con microtareas para suavidad
        requestAnimationFrame(() => {
            // Actualizar estado
            setTheme(newTheme);

            // Pequeño retraso para sincronizar con efectos visuales
            setTimeout(() => {
                // Actualizar DOM
                document.documentElement.classList.remove('light', 'dark');
                document.documentElement.classList.add(newTheme);

                // Guardar en localStorage
                localStorage.setItem('theme', newTheme);

                // Eliminar clase de transición después de completar
                setTimeout(() => {
                    document.documentElement.classList.remove('theme-transitioning');

                    // Limpiar blocker
                    document.body.removeChild(blocker);

                    // Completar transición
                    setIsTransitioning(false);
                }, 220); // Ligeramente más que la duración base para asegurar que termine
            }, 10);
        });
    };

    return (
        <button
            ref={buttonRef}
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            disabled={isTransitioning}
            className={`group p-2 rounded-none hover:bg-light-secondary dark:hover:bg-dark-secondary 
                      focus:outline-none transition-all duration-300 ease-out transform 
                      ${isTransitioning ? 'cursor-wait' : 'hover:scale-110'} 
                      focus:ring-2 focus:ring-brand-red focus:ring-offset-2 dark:focus:ring-offset-gray-900`}
        >
            <span
                ref={iconRef}
                className={`text-xl theme-transition-text relative overflow-hidden
                           ${theme === 'dark' ? 'dark:text-dark-text' : 'text-light-text'}`}
                aria-hidden="true"
            >
                {theme === 'dark' ? (
                    <i className="fas fa-sun transform transition-transform duration-300 group-hover:scale-110"></i>
                ) : (
                    <i className="fas fa-moon transform transition-transform duration-300 group-hover:scale-110"></i>
                )}
            </span>
            <span className="sr-only">
                Cambiar a modo {theme === 'light' ? 'oscuro' : 'claro'}
            </span>
        </button>
    );
};

export default ThemeToggle;