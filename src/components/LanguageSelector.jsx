import React from 'react';

const LanguageSelector = () => {
  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇨🇭' },
    { code: 'fr', name: 'Français', flag: '🇨🇭' },
    { code: 'it', name: 'Italiano', flag: '🇨🇭' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const changeLanguage = (lng) => {
    console.log(`Changed language to: ${lng}`);
    document.documentElement.setAttribute('lang', lng);
  };

  return (
    <div className="relative">
      <select
        className="appearance-none bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
        defaultValue="en"
        onChange={(e) => changeLanguage(e.target.value)}
        aria-label="Select language"
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.name}
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