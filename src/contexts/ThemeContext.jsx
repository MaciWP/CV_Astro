// src/contexts/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export const themes = {
    LIGHT: 'light',
    DARK: 'dark'
};

const ThemeContext = createContext(null);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        // This error should not be hit if ThemeProvider wraps correctly
        // and provides a value even during SSR.
        throw new Error('useTheme debe usarse dentro de un ThemeProvider');
    }
    return context;
};

export function ThemeProvider({ children }) {
    // Provide a default theme for SSR.
    // The inline script in Layout.astro sets the initial class on <html>.
    // This state will be updated on the client.
    const [theme, setTheme] = useState(themes.DARK); // Default theme for SSR
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        // Determine actual theme on client
        const clientTheme = storedTheme || (systemPrefersDark ? themes.DARK : themes.LIGHT);
        
        setTheme(clientTheme);
        
        // Ensure html class matches the clientTheme,
        // useful if inline script somehow missed or if clientTheme is different.
        if (document.documentElement.classList.contains(themes.LIGHT) && clientTheme === themes.DARK) {
             document.documentElement.classList.remove(themes.LIGHT);
             document.documentElement.classList.add(themes.DARK);
        } else if (document.documentElement.classList.contains(themes.DARK) && clientTheme === themes.LIGHT) {
             document.documentElement.classList.remove(themes.DARK);
             document.documentElement.classList.add(themes.LIGHT);
        } // else, class is already correct

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
            if (!localStorage.getItem('theme')) { // Only change if no manual override by user
                const newSystemTheme = e.matches ? themes.DARK : themes.LIGHT;
                setTheme(newSystemTheme);
                document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
                document.documentElement.classList.add(newSystemTheme);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []); // Empty dependency array, runs once on mount

    const toggleTheme = () => {
        const newTheme = theme === themes.LIGHT ? themes.DARK : themes.LIGHT;
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
        document.documentElement.classList.add(newTheme);
        // Optional: Add/remove theme-transitioning class for animations
        // document.documentElement.classList.add('theme-transitioning');
        // setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 300);
    };

    // Memoize context value
    // During SSR (isMounted=false), components get the default 'dark' theme from useState.
    // Client-side, useEffect runs, isMounted becomes true, theme state updates, and components re-render with actual theme.
    const contextValue = useMemo(() => ({
        theme: isMounted ? theme : themes.DARK, // Use actual theme if mounted, else default for SSR consumers
        toggleTheme
    }), [theme, isMounted]); // toggleTheme is stable due to no dependencies from component scope

    return (
        <ThemeContext.Provider value={contextValue}>
            {children}
        </ThemeContext.Provider>
    );
}
