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

// Theme provider component
export function ThemeProvider({ children }) {
    // Initialize with null to avoid hydration mismatch
    const [theme, setTheme] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    // Once mounted, set the theme from localStorage or default to light
    useEffect(() => {
        // Get initial theme from localStorage or default to light
        const initialTheme = localStorage.getItem('theme') || themes.LIGHT;
        setTheme(initialTheme);
        setIsMounted(true);

        // Also ensure the class is applied to html element
        document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
        document.documentElement.classList.add(initialTheme);

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
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Toggle between themes
    const toggleTheme = () => {
        if (!isMounted) return;

        const newTheme = theme === themes.LIGHT ? themes.DARK : themes.LIGHT;

        // Add transitioning class
        document.documentElement.classList.add('theme-transitioning');

        // Update state
        setTheme(newTheme);

        // Update the document classes
        document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
        document.documentElement.classList.add(newTheme);

        // Store the theme preference
        localStorage.setItem('theme', newTheme);

        // Remove transitioning class after animation completes
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 300);
    };

    // Simple loading state to avoid hydration issues
    if (!isMounted) {
        return <div className="invisible">{children}</div>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeContext;