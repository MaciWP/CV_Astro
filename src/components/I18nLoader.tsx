/**
 * I18nLoader Component - Simplified Version
 * Acts as a wrapper that ensures translations are loaded
 * File: src/components/I18nLoader.jsx
 */
import React, { useState, useEffect } from "react";

const I18nLoader = ({ children, fallback = null }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Detect current language
    const currentLang =
      (typeof window !== "undefined" && window.CURRENT_LANGUAGE) || "en";

    // Function to load translations
    const loadTranslations = async () => {
      try {
        // Try to use global i18n.init if available
        if (window.i18n && typeof window.i18n.init === "function") {
          await window.i18n.init(currentLang);
          setIsLoaded(true);
          return;
        }

        // Fallback: directly load the translation file
        const response = await fetch(
          `/locales/${currentLang}/translation.json?v=${Date.now()}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to load translations for ${currentLang}`);
        }

        const translations = await response.json();

        // Store translations in global object
        window.TRANSLATIONS = window.TRANSLATIONS || {};
        window.TRANSLATIONS[currentLang] = translations;

        // Ensure t() function is available
        if (!window.t) {
          window.t = function (key) {
            const keys = key.split(".");
            let result = window.TRANSLATIONS[currentLang] || {};

            for (const k of keys) {
              if (result && typeof result === "object" && k in result) {
                result = result[k];
              } else {
                return key.split(".").pop();
              }
            }

            return result || key.split(".").pop();
          };
        }

        // Signal that translations are available
        setIsLoaded(true);

        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent("translationsLoaded"));
      } catch (error) {
        console.error("Error loading translations:", error);
        setHasError(true);

        // Even if there's an error, we should show the UI
        setIsLoaded(true);
      }
    };

    // Load translations when component mounts
    loadTranslations();
  }, []);

  // Display loading indicator while translations are loading
  if (!isLoaded) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-pulse text-light-text-secondary dark:text-dark-text-secondary">
            Loading...
          </div>
        </div>
      )
    );
  }

  // Display content once translations are loaded (even with errors)
  return <>{children}</>;
};

export default I18nLoader;
