import React, { createContext, useContext } from 'react';

// Opciones de idioma disponibles (aunque no se usen activamente)
export const languages = {
  EN: 'en',
  ES: 'es',
  FR: 'fr'
};

// Crear contexto con valores por defecto simplificados
const defaultContextValue = {
  language: languages.EN,
  setLanguage: () => {}, // Función vacía
  t: (key) => key // Función de traducción simplificada que devuelve la clave
};

const LanguageContext = createContext(defaultContextValue);

// Hook personalizado para usar el contexto
export const useLanguage = () => {
  return useContext(LanguageContext);
};

// Proveedor de idioma simplificado
export function LanguageProvider({ children }) {
  // Simplemente devolvemos el valor por defecto (sin estado)
  // Esto evita llamadas a i18n pero mantiene la estructura del código
  const value = {
    language: languages.EN,
    setLanguage: (newLang) => {
      console.log(`Would change language to: ${newLang}`);
    },
    t: (key) => {
      // Algunas traducciones básicas para UI
      const translations = {
        'buttons.downloadPDF': 'Download PDF',
        'buttons.switchTheme': 'Change Theme',
        'header.address': 'Address',
        'header.phone': 'Phone',
        'header.email': 'Email',
        'header.nationality': 'Nationality',
      };
      
      return translations[key] || key;
    }
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageContext;