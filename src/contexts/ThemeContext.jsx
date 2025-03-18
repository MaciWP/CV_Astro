import React, { createContext, useContext, useState, useEffect } from 'react';

// Define theme options
export const themes = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Create the theme context with default values to prevent SSR issues
const defaultContextValue = {
  theme: themes.LIGHT,
  setTheme: () => {},
  toggleTheme: () => {}
};

const ThemeContext = createContext(defaultContextValue);

// Custom hook for using the theme context
export const useTheme = () => {
  return useContext(ThemeContext);
};

// Theme provider component
export function ThemeProvider({ children }) {
  // Use state for client-side rendering
  const [theme, setTheme] = useState(themes.LIGHT);
  const [isClient, setIsClient] = useState(false);
  
  // After component mounts, set isClient to true and get initial theme
  useEffect(() => {
    setIsClient(true);
    
    // Get initial theme from localStorage or default to light
    const getInitialTheme = () => {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedTheme = window.localStorage.getItem('theme');
        if (storedTheme) {
          return storedTheme;
        }
      }
      return themes.LIGHT; // Default to light theme
    };
    
    setTheme(getInitialTheme());
  }, []);

  // Apply theme to document - only run on client and when theme changes
  useEffect(() => {
    if (!isClient) return;
    
    const root = window.document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove(themes.LIGHT, themes.DARK);
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Store in localStorage
    localStorage.setItem('theme', theme);
  }, [theme, isClient]);

  // Toggle between themes
  const toggleTheme = () => {
    setTheme(prevTheme => {
      return prevTheme === themes.LIGHT ? themes.DARK : themes.LIGHT;
    });
  };

  // Only provide the actual value on the client side
  const value = {
    theme,
    setTheme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;