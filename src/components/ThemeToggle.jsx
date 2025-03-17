import React from 'react';
import { useTheme, themes } from '../contexts/ThemeContext';

const ThemeToggle = () => {
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
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent"
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