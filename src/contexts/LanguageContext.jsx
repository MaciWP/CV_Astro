import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import i18next from 'i18next';
import { localizePath } from 'astro-i18next';

// Opciones de idioma disponibles
export const languages = {
  EN: 'en',
  ES: 'es',
  FR: 'fr'
};

// Contexto con valores por defecto mejorados
const defaultContextValue = {
  language: languages.EN,
  setLanguage: () => { },
  t: (key) => key,
  localizePath: (path) => path
};

const LanguageContext = createContext(defaultContextValue);

// Hook personalizado para usar el contexto
export const useLanguage = () => {
  return useContext(LanguageContext);
};

// Proveedor de idioma mejorado que utiliza i18next
export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(languages.EN);
  const { t, i18n } = useTranslation();

  // Al montar el componente, detectar el idioma actual
  useEffect(() => {
    const currentLang = i18n.language || languages.EN;
    setLanguageState(currentLang);
  }, [i18n.language]);

  // Función para cambiar el idioma
  const setLanguage = async (newLang) => {
    if (newLang !== language) {
      await i18n.changeLanguage(newLang);
      setLanguageState(newLang);

      // Almacenar preferencia en cookies
      document.cookie = `i18next=${newLang}; path=/; max-age=31536000; SameSite=Lax`;

      // Determinar si necesitamos redireccionar
      const currentPath = window.location.pathname;
      const targetPath = localizePath(currentPath, newLang);

      if (currentPath !== targetPath) {
        window.location.href = targetPath;
      }
    }
  };

  // Valores del contexto
  const value = {
    language,
    setLanguage,
    t,
    localizePath: (path) => localizePath(path, language)
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export default LanguageContext;