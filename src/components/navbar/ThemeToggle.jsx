/**
 * ThemeToggle component - Toggle between light and dark theme
 * File: src/components/navbar/ThemeToggle.jsx
 */
import React, { useState } from 'react';

const ThemeToggle = ({ theme, toggleTheme }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const isDark = theme === 'dark';

    const handleToggle = () => {
        // Start animation
        setIsAnimating(true);

        // Toggle theme
        toggleTheme();

        // Announce to screen readers
        if (window.announceToScreenReader) {
            window.announceToScreenReader(`Theme changed to ${isDark ? 'light' : 'dark'} mode`);
        }

        // Reset animation after animation completes
        setTimeout(() => {
            setIsAnimating(false);
        }, 600);
    };

    return (
        <button
            onClick={handleToggle}
            className={`
        p-2 rounded-none text-gray-600 dark:text-gray-400 
        hover:text-gray-900 dark:hover:text-gray-200 
        transition-colors focus:outline-none focus:ring-2 
        focus:ring-brand-red focus:ring-offset-2 
        dark:focus:ring-offset-gray-900
        ${isAnimating ? 'theme-toggle-btn animate-pulse-glow' : 'theme-toggle-btn'}
      `}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            aria-pressed={isDark}
            type="button"
        >
            <div className={`${isAnimating ? 'animate-spin-once' : ''}`}>
                {isDark ? (
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                )}
            </div>
            <span className="sr-only">{isDark ? "Switch to light mode" : "Switch to dark mode"}</span>
        </button>
    );
};

export default React.memo(ThemeToggle);