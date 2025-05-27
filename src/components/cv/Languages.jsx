/**
 * Languages component with animations and multilingual support
 * File: src/components/cv/Languages.jsx
 */
import React, { useEffect, useState } from "react";
import { getCurrentLanguageLanguages } from "../../data/languages";

const Languages = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [progressAnimation, setProgressAnimation] = useState({});
  const [languagesData, setLanguagesData] = useState([]);
  const [title, setTitle] = useState("Languages");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Get languages in current UI language
          const languages = getCurrentLanguageLanguages();
          setLanguagesData(languages);

          // Start progress bar animations with natural staggering
          languages.forEach((lang, index) => {
            setTimeout(
              () => {
                setProgressAnimation((prev) => ({
                  ...prev,
                  [lang.language]: true,
                }));
              },
              500 + index * 250,
            ); // Slower, similar to Experience
          });

          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById("languages");
    if (element) {
      observer.observe(element);
    }

    // Initial load of languages data
    setLanguagesData(getCurrentLanguageLanguages());

    // Update title based on current language
    if (typeof window !== "undefined" && typeof window.t === "function") {
      setTitle(window.t("languages.title") || "Languages");
    }

    // Listen for language changes
    const handleLanguageChanged = () => {
      const newLanguages = getCurrentLanguageLanguages();
      setLanguagesData(newLanguages);

      // Reset and restart progress animations
      setProgressAnimation({});
      newLanguages.forEach((lang, index) => {
        setTimeout(
          () => {
            setProgressAnimation((prev) => ({
              ...prev,
              [lang.language]: true,
            }));
          },
          300 + index * 150,
        );
      });

      // Update title
      if (typeof window !== "undefined" && typeof window.t === "function") {
        setTitle(window.t("languages.title") || "Languages");
      }
    };

    document.addEventListener("languageChanged", handleLanguageChanged);
    document.addEventListener("translationsLoaded", handleLanguageChanged);

    return () => {
      observer.disconnect();
      document.removeEventListener("languageChanged", handleLanguageChanged);
      document.removeEventListener("translationsLoaded", handleLanguageChanged);
    };
  }, []);

  return (
    <section id="languages" suppressHydrationWarning className="mb-16">
      <div
        className={`flex items-center mb-6 transition-all duration-700 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <div className="w-10 h-10 flex items-center justify-center bg-brand-red text-white rounded-none">
          <svg className="icon" aria-hidden="true">
            <use href="#icon-language"></use>
          </svg>
        </div>
        <h2 className="text-2xl font-bold ml-3" data-i18n="languages.title">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {languagesData.map((lang, index) => (
          <div
            key={index}
            className={`group bg-light-surface dark:bg-dark-surface rounded-none p-4 border border-light-border dark:border-dark-border transition-all duration-700 transform hover:-translate-y-1 hover:shadow-md ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            style={{ transitionDelay: `${300 * index}ms` }} // Slower, similar to Experience
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-lg">{lang.language}</span>
              <span className="px-2 py-0.5 rounded-none text-xs font-semibold bg-brand-red text-white">
                {lang.badge}
              </span>
            </div>

            <div className="mt-2 space-y-2">
              <div className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-1">
                {lang.level}
              </div>

              {/* Progress bar with slower animation */}
              <div className="h-1.5 bg-light-secondary dark:bg-dark-secondary rounded-none overflow-hidden">
                <div
                  className="h-full bg-brand-red"
                  style={{
                    width: progressAnimation[lang.language]
                      ? `${lang.percent}%`
                      : "0%",
                    transition: "width 1200ms cubic-bezier(0.25, 1, 0.5, 1)", // Slower animation
                    transitionDelay: progressAnimation[lang.language]
                      ? "100ms"
                      : "0ms",
                  }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Languages;
