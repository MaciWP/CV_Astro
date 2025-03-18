// Archivo simplificado sin funcionalidad de i18n real
// Solo proporciona una API mínima para evitar errores

const i18n = {
    // Función de traducción que simplemente devuelve la clave
    t: (key) => {
      // Mapa de traducciones básicas para elementos clave de la UI
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
    
    // Función de cambio de idioma que no hace nada
    changeLanguage: (lng) => {
      console.log(`Language would change to: ${lng}`);
      return Promise.resolve();
    },
  
    // Propiedades y métodos adicionales para mantener la compatibilidad
    language: 'en',
    options: {
      resources: {},
      lng: 'en'
    }
  };
  
  export default i18n;