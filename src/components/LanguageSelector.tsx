/**
 * Selector de idioma mejorado
 * Muestra y permite cambiar entre los idiomas disponibles
 *
 * File: src/components/LanguageSelector.jsx
 */
import React, { useState, useRef, useEffect } from "react";
import { useI18n } from "../utils/i18n";

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Usar el hook mejorado de i18n
  const { lang } = useI18n();

  // Opciones de idioma con banderas y nombres
  const languageOptions = [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ];

  // Encontrar el idioma actual
  const currentLanguage =
    languageOptions.find((option) => option.code === lang) ||
    languageOptions[0];

  // Cerrar al hacer clic fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Cambiar idioma y navegar a la URL correspondiente
  const handleLanguageChange = (langCode) => {
    if (langCode === lang) {
      setIsOpen(false);
      return;
    }

    // Construir la URL para el idioma seleccionado
    let path = window.location.pathname;

    // Quitar prefijos de idioma existentes
    const langPrefixes = ["/es/", "/fr/"];
    for (const prefix of langPrefixes) {
      if (path.startsWith(prefix)) {
        path = path.substring(prefix.length - 1); // Mantener la barra inicial
        break;
      }
    }
    if (path === "/es" || path === "/fr") {
      path = "/";
    }

    // Normalizar path
    if (!path || path === "") path = "/";

    // Construir nueva URL
    let newUrl;
    if (langCode === "en") {
      // Para inglés (idioma por defecto) usamos la ruta sin prefijo
      newUrl = path;
    } else {
      // Para otros idiomas, añadir el prefijo de idioma
      newUrl = `/${langCode}${path === "/" ? "" : path}`;
    }

    // Navegar a la nueva URL
    window.location.href = newUrl;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón principal del dropdown */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 p-2 rounded-none border border-gray-300 dark:border-gray-600 
                 hover:border-brand-red focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red
                 bg-light-surface dark:bg-dark-surface transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-sm mr-1">{currentLanguage.flag}</span>
        <span className="text-sm font-medium">
          {currentLanguage.code.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Opciones de idioma */}
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
                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 
                         ${lang === option.code ? "bg-brand-red/10 text-brand-red" : "text-gray-700 dark:text-gray-200"} 
                         hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                role="option"
                aria-selected={lang === option.code}
              >
                <span>{option.flag}</span>
                <span>{option.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
