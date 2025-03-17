import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme options
export const themes = {
  LIGHT: 'light',
  DARK: 'dark',
  HIGH_CONTRAST: 'high-contrast'
};

// Create the theme context
const ThemeContext = createContext();

// Custom hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Get initial theme from localStorage or use system preference or default to light
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme) {
        return storedTheme;
      }

      // Check system preference
      const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
      if (userMedia.matches) {
        return themes.DARK;
      }
    }
    return themes.LIGHT; // Default theme
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark', 'high-contrast');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Store in localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between themes
  const toggleTheme = () => {
    setTheme(prevTheme => {
      switch (prevTheme) {
        case themes.LIGHT:
          return themes.DARK;
        case themes.DARK:
          return themes.HIGH_CONTRAST;
        default:
          return themes.LIGHT;
      }
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;