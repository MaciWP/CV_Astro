/**
 * Experience component with internationalization support
 * File: src/components/cv/Experience.jsx
 */
import React, { useEffect, useState, useCallback } from "react";
import { getCurrentLanguageExperiences } from "../../data/experiences";
import ExperienceCard from "./ExperienceCard.astro";

/**
 * Experience component displays work history in a timeline format
 * Uses multilingual data and supports language switching
 */
const Experience = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [translations, setTranslations] = useState({
    title: "Work Experience",
    responsibilities: "Responsibilities",
    keyAchievements: "Key Achievements",
    showMore: "Show more",
    showLess: "Show less",
  });

  // Load translations and experiences data safely
  const loadTranslations = useCallback(() => {
    // Get current language experiences data
    setExperiences(getCurrentLanguageExperiences());

    // Get UI translations safely
    if (typeof window !== "undefined" && typeof window.t === "function") {
      setTranslations({
        title: window.t("experience.title") || "Work Experience",
        responsibilities:
          window.t("experience.responsibilities") || "Responsibilities",
        keyAchievements:
          window.t("experience.keyAchievements") || "Key Achievements",
        showMore: window.t("experience.showMore") || "Show more",
        showLess: window.t("experience.showLess") || "Show less",
      });
    }
  }, []);

  useEffect(() => {
    // Set up intersection observer for animation
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById("experience");
    if (element) {
      observer.observe(element);
    }

    // Load initial translations and data
    loadTranslations();

    // Listen for language changes
    const handleLanguageChange = () => {
      loadTranslations();
    };

    document.addEventListener("languageChanged", handleLanguageChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("languageChanged", handleLanguageChange);
    };
  }, [loadTranslations]);

  return (
    <section
      id="experience"
      suppressHydrationWarning
      className="scroll-mt-20 mb-16"
    >
      <div
        className={`flex items-center gap-4 mb-10 transition-all duration-700 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <div className="h-10 w-10 bg-brand-red dark:bg-brand-red rounded-none flex items-center justify-center flex-shrink-0 transition-colors duration-150">
          <i className="fas fa-briefcase text-white"></i>
        </div>
        <h2
          className="text-3xl font-bold tracking-tight"
          data-i18n="experience.title"
        >
          {translations.title}
        </h2>
      </div>

      <div className="relative pl-5 md:pl-8">
        {/* Timeline line with gradient */}
        <div className="absolute left-2 top-4 bottom-0 w-0.5 bg-gradient-to-b from-brand-red via-brand-red/70 to-gray-300 dark:from-brand-red dark:via-brand-red/50 dark:to-gray-700"></div>
        {experiences.map((job, index) => (
          <ExperienceCard
            key={job.id}
            job={job}
            index={index}
            translations={translations}
            visible={isVisible}
          />
        ))}
      </div>
    </section>
  );
};

export default Experience;
