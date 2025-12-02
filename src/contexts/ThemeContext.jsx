/**
 * Optimized and simplified theme context
 * File: src/contexts/ThemeContext.jsx
 *
 * Simplified version that maintains key functionality
 * and removes unnecessary code.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme options
export const themes = {
    LIGHT: 'light',
    DARK: 'dark'
};

// Create the context
const ThemeContext = createContext(null);

// Custom hook to use the context
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Theme provider component
export function ThemeProvider({ children }) {
    // Initialize with null to avoid hydration issues
    const [theme, setTheme] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    // Once mounted, set theme from localStorage or system preference
    useEffect(() => {
        // Get initial theme from localStorage or system preference
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (systemPrefersDark ? themes.DARK : themes.LIGHT);

        setTheme(initialTheme);
        setIsMounted(true);

        // Ensure the class is applied to the html element
        document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
        document.documentElement.classList.add(initialTheme);

        // Listen for system preference changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            // Only update if user hasn't set a preference
            if (!localStorage.getItem('theme')) {
                const newTheme = e.matches ? themes.DARK : themes.LIGHT;
                setTheme(newTheme);
                document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
                document.documentElement.classList.add(newTheme);
            }
        };

        // Use modern API if available
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else {
            mediaQuery.addListener(handleChange); // Fallback for older browsers
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, []);

    // Toggle between themes - INSTANT without transitions
    const toggleTheme = () => {
        if (!isMounted) return;

        const newTheme = theme === themes.LIGHT ? themes.DARK : themes.LIGHT;

        // Update state and DOM immediately
        setTheme(newTheme);
        document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
        document.documentElement.classList.add(newTheme);

        // Save theme preference
        localStorage.setItem('theme', newTheme);
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