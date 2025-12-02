/**
 * Improved language selector
 * Displays and allows switching between available languages
 *
 * File: src/components/LanguageSelector.jsx
 */
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../utils/i18n';

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Use the improved i18n hook
  const { lang } = useI18n();

  // Language options with flags and names
  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇨🇭' },
    { code: 'de', name: 'Deutsch', flag: '🇨🇭' }
  ];

  // Find the current language
  const currentLanguage = languageOptions.find(option => option.code === lang) || languageOptions[0];

  // Close when clicking outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Change language and navigate to corresponding URL
  const handleLanguageChange = (langCode) => {
    if (langCode === lang) {
      setIsOpen(false);
      return;
    }

    // Build the URL for the selected language
    let path = window.location.pathname;

    // Remove existing language prefixes
    const langPrefixes = ['/es/', '/fr/', '/de/'];
    for (const prefix of langPrefixes) {
      if (path.startsWith(prefix)) {
        path = path.substring(prefix.length - 1); // Keep the initial slash
        break;
      }
    }
    if (path === '/es' || path === '/fr' || path === '/de') {
      path = '/';
    }

    // Normalize path
    if (!path || path === '') path = '/';

    // Build new URL
    let newUrl;
    if (langCode === 'en') {
      // For English (default language) use path without prefix
      newUrl = path;
    } else {
      // For other languages, add language prefix
      newUrl = `/${langCode}${path === '/' ? '' : path}`;
    }

    // Navigate to the new URL
    window.location.href = newUrl;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main dropdown button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-none border border-gray-300 dark:border-gray-600
                 hover:border-brand-red focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red
                 bg-light-surface dark:bg-dark-surface transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Language options */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-36 bg-white dark:bg-dark-surface border border-gray-200 dark:border-dark-border 
                   rounded-none shadow-lg z-50 overflow-hidden transition-all"
          role="listbox"
        >
          <div className="py-1">
            {languageOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => handleLanguageChange(option.code)}
                className={`w-full text-left px-4 py-2 text-sm
                         ${lang === option.code ? 'bg-brand-red/10 text-brand-red' : 'text-gray-700 dark:text-gray-200'}
                         hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                role="option"
                aria-selected={lang === option.code}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;