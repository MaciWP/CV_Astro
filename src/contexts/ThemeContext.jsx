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
    const initialTheme = localStorage.getItem('theme') || themes.LIGHT;
    setTheme(initialTheme);
    setIsMounted(true);
    
    // Also ensure the class is applied to html element
    document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
    document.documentElement.classList.add(initialTheme);
  }, []);

  // Toggle between themes
  const toggleTheme = () => {
    const newTheme = theme === themes.LIGHT ? themes.DARK : themes.LIGHT;
    setTheme(newTheme);
    
    // Update the document classes
    document.documentElement.classList.remove(themes.LIGHT, themes.DARK);
    document.documentElement.classList.add(newTheme);
    
    // Store the theme preference
    localStorage.setItem('theme', newTheme);
    
    console.log('Theme toggled to:', newTheme); // Debugging
  };

  // Don't render anything until mounting is complete
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;