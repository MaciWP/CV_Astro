/**
 * ProfileHeader component with optimized image loading
 * File: src/components/cv/ProfileHeader.jsx
 */
import React, { useState, useEffect } from "react";
import headerData from "../../data/header";
import Icon from "../common/Icon";

const ProfileHeader = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [localData, setLocalData] = useState({
    headerData,
    jobTitle: headerData.jobTitle || "Software Developer",
    summary: headerData.summary || "",
    photoAlt: headerData.photoAlt || "Oriol Macias - Software Developer",
  });

  const getTranslation = (key, defaultValue) => {
    if (typeof window !== "undefined" && typeof window.t === "function") {
      const translated = window.t(key);
      if (translated && translated !== key.split(".").pop()) {
        return translated;
      }
    }
    
    if (key === "header.jobTitle") return headerData.jobTitle;
    if (key === "header.summary") return headerData.summary;
    if (key === "header.photoAlt") return headerData.photoAlt;
    
    return defaultValue || key.split(".").pop();
  };

  const loadTranslations = () => {
    setLocalData({
      headerData,
      jobTitle: getTranslation("header.jobTitle", headerData.jobTitle),
      summary: getTranslation("header.summary", headerData.summary),
      photoAlt: getTranslation("header.photoAlt", headerData.photoAlt),
      email: getTranslation("header.email", "Email"),
      linkedin: getTranslation("header.linkedin", "LinkedIn"),
      github: getTranslation("header.github", "GitHub"),
      downloadCV: getTranslation("buttons.downloadCV", "Download CV"),
      downloadCoverLetter: getTranslation("buttons.downloadCoverLetter", "Download Cover Letter"),
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    loadTranslations();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById("about");
    if (element) {
      observer.observe(element);
    }

    const handleLanguageChange = () => {
      loadTranslations();
    };

    document.addEventListener("languageChanged", handleLanguageChange);
    document.addEventListener("translationsLoaded", handleLanguageChange);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      document.removeEventListener("languageChanged", handleLanguageChange);
      document.removeEventListener("translationsLoaded", handleLanguageChange);
    };
  }, []);

  const handleCVDownload = () => {
    const pdfUrl = "/OriolMacias_CV.pdf";
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "OriolMacias_CV.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCoverLetterDownload = () => {
    const pdfUrl = "/OriolMacias_CoverLetter.pdf";
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "OriolMacias_CoverLetter.pdf";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="about" suppressHydrationWarning className="pt-4 pb-8">
      <section>
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          {/* Personal Information */}
          <div className="md:col-span-8 space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {headerData.fullName}
              </h1>
              <h2
                className="text-xl md:text-2xl text-brand-red dark:text-brand-red font-medium"
                data-i18n="header.jobTitle"
              >
                {localData.jobTitle}
              </h2>
            </div>

            <p
              className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg max-w-2xl"
              data-i18n="header.summary"
            >
              {localData.summary}
            </p>

            {/* Contact Information with Icon component */}
            <div className="flex flex-wrap gap-4 mt-2">
              {headerData.contactInfo.map((contact, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 group hover:translate-x-1 transition-all duration-300"
                >
                  <a
                    href={
                      contact.type === "email"
                        ? `mailto:${contact.value}`
                        : contact.url
                    }
                    target={contact.type !== "email" ? "_blank" : undefined}
                    rel={
                      contact.type !== "email"
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex items-center gap-2 hover:text-brand-red dark:hover:text-brand-red transition-colors"
                    aria-label={localData[contact.type] || contact.label}
                  >
                    <div className="w-10 h-10 flex items-center justify-center text-white bg-brand-red/90 shadow-sm rounded-none mr-2 group-hover:bg-brand-red transition-all duration-300">
                      <Icon name={contact.type} className="w-5 h-5" />
                    </div>
                    <div>
                      <span
                        className="text-xs block text-light-text-secondary dark:text-dark-text-secondary"
                        data-i18n={`header.${contact.type}`}
                      >
                        {localData[contact.type] || contact.label}
                      </span>
                      {contact.value}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Optimized Profile Photo */}
          <div className="md:col-span-4 flex flex-col justify-center md:justify-end">
            <div className="relative w-100 h-100 md:w-100 md:h-100 overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
              <div className="absolute inset-0 border border-gray-200 dark:border-gray-700"></div>
              
              <div className="w-full h-full bg-white dark:bg-gray-800">
                <picture>
                  <source
                    srcSet="/images/oriol_macias-320.avif 320w, /images/oriol_macias-480.avif 480w, /images/oriol_macias-640.avif 640w, /images/oriol_macias-800.avif 800w"
                    sizes="(max-width: 767px) 100vw, 400px"
                    type="image/avif"
                  />
                  <source
                    srcSet="/images/oriol_macias-320.webp 320w, /images/oriol_macias-480.webp 480w, /images/oriol_macias-640.webp 640w, /images/oriol_macias-800.webp 800w"
                    sizes="(max-width: 767px) 100vw, 400px"
                    type="image/webp"
                  />
                  <img
                    src="/images/oriol_macias-640.jpg"
                    srcSet="/images/oriol_macias-320.jpg 320w, /images/oriol_macias-480.jpg 480w, /images/oriol_macias-640.jpg 640w, /images/oriol_macias-800.jpg 800w"
                    sizes="(max-width: 767px) 100vw, 400px"
                    width={400}
                    height={400}
                    alt={localData.photoAlt}
                    loading="eager"
                    fetchpriority="high"
                    className="w-full h-full object-cover transition-opacity duration-500"
                    style={{ transform: "translateZ(0)" }}
                  />
                </picture>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-2 bg-brand-red"></div>
            </div>

            {/* Download buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
              <button
                onClick={handleCVDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 text-sm text-white bg-brand-red rounded-none hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label={localData.downloadCV}
              >
                <Icon name="download" className="w-4 h-4 mr-1.5" />
                <span>{localData.downloadCV}</span>
              </button>

              <button
                onClick={handleCoverLetterDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 text-sm text-white bg-brand-red rounded-none hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label={localData.downloadCoverLetter}
              >
                <Icon name="file-text" className="w-4 h-4 mr-1.5" />
                <span>{localData.downloadCoverLetter}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileHeader;