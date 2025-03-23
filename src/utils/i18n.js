// Simplified file without real i18n functionality
// Only provides a minimal API to prevent errors

const i18n = {
  // Translation function that simply returns the key
  t: (key) => {
    // Basic translations map for key UI elements
    const translations = {
      'buttons.downloadPDF': 'Download PDF',
      'buttons.switchTheme': 'Change Theme',
      'header.address': 'Address',
      'header.phone': 'Phone',
      'header.email': 'Email',
      'header.nationality': 'Nationality',
    };

    return translations[key] || key;
  },

  // Language change function that does nothing but log
  changeLanguage: (lng) => {
    console.log(`Language would change to: ${lng}`);
    return Promise.resolve();
  },

  // Additional properties and methods for compatibility
  language: 'en',
  options: {
    resources: {},
    lng: 'en'
  }
};

export default i18n;