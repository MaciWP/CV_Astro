import React, { useState, useEffect } from 'react';
import { useTheme, themes } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  // Use useState to prevent SSR issues
  const [mounted, setMounted] = useState(false);
  
  // Wait until component is mounted to access the theme context
  useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted yet, render a placeholder button
  if (!mounted) {
    return (
      <button 
        aria-label="Toggle theme"
        className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-xl" aria-hidden="true">🌞</span>
      </button>
    );
  }
  
  // Now we can safely use the theme context
  const { theme, toggleTheme } = useTheme();
  
  // Determine the icon to use based on the current theme
  const getIcon = () => {
    switch (theme) {
      case themes.LIGHT:
        return '🌞'; // Sun icon for light theme
      case themes.DARK:
        return '🌙'; // Moon icon for dark theme
      case themes.HIGH_CONTRAST:
        return '🔍'; // Magnifying glass for high contrast
      default:
        return '🌞';
    }
  };

  return (
    <button 
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <span className="text-xl" aria-hidden="true">{getIcon()}</span>
      <span className="sr-only">
        {theme === themes.LIGHT 
          ? 'Switch to dark mode' 
          : theme === themes.DARK 
            ? 'Switch to high contrast mode' 
            : 'Switch to light mode'}
      </span>
    </button>
  );
};

export default ThemeToggle;