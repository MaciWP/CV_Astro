import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme options
export const themes = {
    LIGHT: 'light',
    DARK: 'dark'
};

// Create the context
const ThemeContext = createContext(null);

// Custom hook for using the theme context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Theme provider component with improved transitions
export function ThemeProvider({ children }) {
    // Initialize with null to avoid hydration mismatch
    const [theme, setTheme] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Once mounted, set the theme from localStorage or default to light
    useEffect(() => {
        // Get initial theme from localStorage or default to light
        const initialTheme = localStorage.getItem('theme') || themes.LIGHT;
        setTheme(initialTheme);
        setIsMounted(true);

        // Also ensure the class is applied to html element
        document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
        document.documentElement.classList.add(initialTheme);

        // Crear elemento flash para transición visual
        if (!document.getElementById('theme-flash')) {
            const flashElement = document.createElement('div');
            flashElement.id = 'theme-flash';
            document.body.appendChild(flashElement);
        }

        // Listen for storage events (in case theme is changed in another tab)
        const handleStorageChange = (e) => {
            if (e.key === 'theme') {
                const newTheme = e.newValue || themes.LIGHT;
                setTheme(newTheme);
                document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
                document.documentElement.classList.add(newTheme);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            // Limpiar elemento flash al desmontar
            if (document.getElementById('theme-flash')) {
                document.body.removeChild(document.getElementById('theme-flash'));
            }
        };
    }, []);

    // Toggle between themes con mejores efectos visuales
    const toggleTheme = () => {
        if (!isMounted || isTransitioning) return;

        setIsTransitioning(true);
        const newTheme = theme === themes.LIGHT ? themes.DARK : themes.LIGHT;

        // Crear efecto de flash sutil
        const flashElement = document.getElementById('theme-flash');
        if (flashElement) {
            flashElement.classList.add('flash');
            setTimeout(() => {
                flashElement.classList.remove('flash');
            }, 300);
        }

        // Add transitioning class for smoother transitions
        document.documentElement.classList.add('theme-transitioning');

        // Crear overlay para bloquear interacciones durante la transición
        let overlay = document.querySelector('.theme-transition-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'theme-transition-overlay';
            document.body.appendChild(overlay);
        }
        overlay.classList.add('active');

        // Update state con pequeño delay para sincronizar efectos
        setTimeout(() => {
            setTheme(newTheme);

            // Update the document classes
            document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
            document.documentElement.classList.add(newTheme);

            // Store the theme preference
            localStorage.setItem('theme', newTheme);
        }, 50);

        // Remove transitioning class after animation completes
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
            setIsTransitioning(false);

            // Quitar overlay
            if (overlay) {
                overlay.classList.remove('active');
            }
        }, 350);
    };

    // Simple loading state to avoid hydration issues
    if (!isMounted) {
        return <div className="invisible">{children}</div>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isTransitioning }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeContext;