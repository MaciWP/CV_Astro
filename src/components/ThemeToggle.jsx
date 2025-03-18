import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');
  
  // Initialize theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Update state
    setTheme(newTheme);
    
    // Update DOM
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    console.log('Theme toggled to:', newTheme);
  };
  
  return (
    <button 
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-2 rounded-none hover:bg-light-secondary dark:hover:bg-dark-secondary focus:outline-none transition-all duration-300 ease-in-out transform hover:scale-110"
    >
      {theme === 'dark' ? (
        <span className="text-xl dark:text-dark-text" aria-hidden="true">☀️</span>
      ) : (
        <span className="text-xl text-light-text" aria-hidden="true">🌙</span>
      )}
      <span className="sr-only">
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </span>
    </button>
  );
};

export default ThemeToggle;