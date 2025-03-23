import React from 'react';
import { useLanguage, languages } from '../contexts/LanguageContext';

/**
 * Language Selector component that allows switching between available languages
 * Uses the LanguageContext to manage language state
 */
const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  // Language options with flags and names
  const languageOptions = [
    { code: languages.EN, name: 'English', flag: '🇬🇧' },
    { code: languages.ES, name: 'Español', flag: '🇪🇸' },
    { code: languages.FR, name: 'Français', flag: '🇨🇭' }
  ];

  /**
   * Handle language change and update the language context
   * @param {Event} e - The select change event
   */
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
  };

  return (
    <div className="relative">
      <label htmlFor="language-select" className="sr-only">Select language</label>
      <select
        id="language-select"
        className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-none px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={language}
        onChange={handleLanguageChange}
        aria-label="Select language"
      >
        {languageOptions.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;