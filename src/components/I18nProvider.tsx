// src/components/I18nProvider.jsx
/**
 * Improved i18n provider component that ensures translations are properly loaded and propagated
 * Resolves issues with missing translations for header and section titles
 */
import React, { createContext, useContext, useState, useEffect } from "react";
import { loadTranslation, detectLanguage } from "../utils/i18n";

// Create context for i18n
const I18nContext = createContext({
  translations: {},
  currentLanguage: "en",
  t: (key) => key,
  changeLanguage: () => {},
  isLoading: true,
});

export const useI18n = () => useContext(I18nContext);

export const I18nProvider = ({ children, initialLanguage = null }) => {
  const [translations, setTranslations] = useState({});
  const [currentLanguage, setCurrentLanguage] = useState(
    initialLanguage || detectLanguage(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);

  // Default translations for critical UI elements to avoid blank text
  const defaultTranslations = {
    en: {
      header: {
        jobTitle: "Software Developer",
        summary:
          "Backend Developer specializing in industrial protocols integration",
      },
      sections: {
        experience: "Work Experience",
        skills: "Technical Skills",
        education: "Education",
        languages: "Languages",
        projects: "Projects",
      },
    },
    es: {
      header: {
        jobTitle: "Desarrollador de Software",
        summary:
          "Desarrollador Backend especializado en integración de protocolos industriales",
      },
      sections: {
        experience: "Experiencia Laboral",
        skills: "Habilidades Técnicas",
        education: "Formación",
        languages: "Idiomas",
        projects: "Proyectos",
      },
    },
    fr: {
      header: {
        jobTitle: "Développeur Logiciel",
        summary:
          "Développeur Backend spécialisé dans l'intégration de protocoles industriels",
      },
      sections: {
        experience: "Expérience Professionnelle",
        skills: "Compétences Techniques",
        education: "Formation",
        languages: "Langues",
        projects: "Projets",
      },
    },
  };

  // Function to translate a key using dotted notation
  const translate = (key, defaultValue = null) => {
    if (!key) return "";

    // Split key into parts
    const parts = key.split(".");

    // Start with full translations
    let result = translations;

    // Try to resolve from loaded translations
    for (const part of parts) {
      if (result && typeof result === "object" && part in result) {
        result = result[part];
      } else {
        result = null;
        break;
      }
    }

    // If found in translations, return it
    if (result !== null && typeof result !== "object") {
      return result;
    }

    // If not found, try fallback to default translations
    if (defaultTranslations[currentLanguage]) {
      result = defaultTranslations[currentLanguage];
      let fallbackFound = true;

      for (const part of parts) {
        if (result && typeof result === "object" && part in result) {
          result = result[part];
        } else {
          fallbackFound = false;
          break;
        }
      }

      if (fallbackFound && typeof result !== "object") {
        return result;
      }
    }

    // If still not found and not English, try English
    if (currentLanguage !== "en" && defaultTranslations.en) {
      result = defaultTranslations.en;
      let fallbackFound = true;

      for (const part of parts) {
        if (result && typeof result === "object" && part in result) {
          result = result[part];
        } else {
          fallbackFound = false;
          break;
        }
      }

      if (fallbackFound && typeof result !== "object") {
        return result;
      }
    }

    // Final fallback: return default value or last part of key
    return defaultValue || parts[parts.length - 1];
  };

  // Load translations for current language
  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        // Load translations from the server
        const loadedTranslations = await loadTranslation(currentLanguage);

        // Merge with default translations to ensure critical UI elements are always translated
        const mergedTranslations = {
          ...(defaultTranslations[currentLanguage] || {}),
          ...(loadedTranslations || {}),
        };

        setTranslations(mergedTranslations);

        // Update global window objects for backward compatibility
        if (typeof window !== "undefined") {
          window.CURRENT_LANGUAGE = currentLanguage;
          window.TRANSLATIONS = window.TRANSLATIONS || {};
          window.TRANSLATIONS[currentLanguage] = mergedTranslations;
          window.t = (key, defaultValue) => translate(key, defaultValue);

          // Dispatch event to notify components
          document.dispatchEvent(new CustomEvent("translationsLoaded"));
        }

        setLoadingError(null);
      } catch (error) {
        console.error(
          `Error loading translations for ${currentLanguage}:`,
          error,
        );
        setLoadingError(error);

        // Use default translations as fallback
        setTranslations(
          defaultTranslations[currentLanguage] || defaultTranslations.en || {},
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [currentLanguage]);

  // Handle language change
  const changeLanguage = (newLanguage) => {
    if (newLanguage && newLanguage !== currentLanguage) {
      setCurrentLanguage(newLanguage);

      // Store preference
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("language", newLanguage);
      }

      // Dispatch event
      document.dispatchEvent(
        new CustomEvent("languageChanged", {
          detail: { language: newLanguage },
        }),
      );
    }
  };

  // Update all DOM elements with data-i18n attribute
  useEffect(() => {
    if (!isLoading) {
      document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (key) {
          element.textContent = translate(key);
        }
      });
    }
  }, [translations, isLoading]);

  return (
    <I18nContext.Provider
      value={{
        translations,
        currentLanguage,
        t: translate,
        changeLanguage,
        isLoading,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export default I18nProvider;
