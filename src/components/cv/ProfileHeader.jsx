/**
 * Componente ProfileHeader con fix para ruta de imagen
 * File: src/components/cv/ProfileHeader.jsx
 */
import React, { useState, useEffect } from "react";
import ResponsiveImage from "../ResponsiveImage";
import headerData from "../../data/header";

const ProfileHeader = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const [localData, setLocalData] = useState({
    ...headerData,
    jobTitle: headerData.jobTitle || "Software Developer",
    summary: headerData.summary || "",
    photoAlt: headerData.photoAlt || "Oriol Macias - Software Developer",
  });

  // Función segura para obtener traducciones con fallbacks robustos
  const getTranslation = (key, defaultValue) => {
    // Verificar si la API de traducción está disponible
    if (typeof window !== "undefined" && typeof window.t === "function") {
      const translated = window.t(key);

      // Comprobar si la traducción es válida (no es solo la clave)
      if (translated && translated !== key.split(".").pop()) {
        return translated;
      }
    }

    // Fallback 1: Buscar en TRANSLATIONS si está disponible
    if (typeof window !== "undefined" && window.TRANSLATIONS) {
      const currentLang = window.CURRENT_LANGUAGE || "en";
      const translations = window.TRANSLATIONS[currentLang];

      if (translations) {
        const keys = key.split(".");
        let result = translations;

        for (const k of keys) {
          if (result && typeof result === "object" && k in result) {
            result = result[k];
          } else {
            result = null;
            break;
          }
        }

        if (result) return result;
      }
    }

    // Fallback 2: Devolver el valor de headerData si coincide con la clave
    if (key === "header.jobTitle") return headerData.jobTitle;
    if (key === "header.summary") return headerData.summary;
    if (key === "header.photoAlt") return headerData.photoAlt;

    // Fallback 3: Usar el valor predeterminado proporcionado
    return defaultValue || key.split(".").pop();
  };

  // Cargar traducciones
  const loadTranslations = () => {
    setLocalData({
      ...headerData,
      jobTitle: getTranslation("header.jobTitle", headerData.jobTitle),
      summary: getTranslation("header.summary", headerData.summary),
      photoAlt: getTranslation("header.photoAlt", headerData.photoAlt),
      email: getTranslation("header.email", "Email"),
      linkedin: getTranslation("header.linkedin", "LinkedIn"),
      github: getTranslation("header.github", "GitHub"),
      downloadCV: getTranslation("buttons.downloadCV", "Download CV"),
      downloadCoverLetter: getTranslation(
        "buttons.downloadCoverLetter",
        "Download Cover Letter",
      ),
    });
  };

  useEffect(() => {
    // Iniciar animación
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Cargar traducciones iniciales
    loadTranslations();

    // Observer para detección de visibilidad
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

    // Escuchar cambios de idioma
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

  // Función para manejar carga de imagen
  const handleImageLoaded = () => {
    setPhotoLoaded(true);
  };

  // Función para descargar el CV
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

  // Función para descargar la carta de presentación
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
    <div id="about" className="pt-4 pb-8">
      {/* Header / Información Personal */}
      <section>
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center transition-opacity duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          {/* Información personal */}
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

            {/* Información de contacto */}
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
                      <i className={contact.icon}></i>
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

          {/* Foto profesional con botones de descarga debajo */}
          <div className="md:col-span-4 flex flex-col justify-center md:justify-end">
            <div
              className={`relative w-100 h-100 md:w-100 md:h-100 overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg transition-all duration-700 ${photoLoaded ? "opacity-100" : "opacity-80"}`}
            >
              {/* Borde para estructura */}
              <div className="absolute inset-0 border border-gray-200 dark:border-gray-700"></div>

              {/* Foto - ARREGLO: Usamos directamente la imagen de los formatos modernos */}
              <div className="w-full h-full bg-white dark:bg-gray-800">
                {/* Usar picture para formatos modernos y fallback a placeholder si fallan */}
                <picture>
                  {/* Formato AVIF - más eficiente */}
                  <source
                    srcSet="/images/oriol_macias-sm.avif"
                    type="image/avif"
                  />
                  {/* Formato WebP - amplio soporte */}
                  <source
                    srcSet="/images/oriol_macias-sm.webp"
                    type="image/webp"
                  />
                  {/* Fallback a placeholder */}
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='42' text-anchor='middle' fill='%239ca3af' dominant-baseline='middle'%3EOM%3C/text%3E%3C/svg%3E"
                    alt={localData.photoAlt}
                    width={400}
                    height={400}
                    loading="eager"
                    fetchpriority="high"
                    className="w-full h-full object-cover transition-opacity duration-500"
                    onLoad={handleImageLoaded}
                  />
                </picture>
              </div>

              {/* Acento rojo */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-brand-red"></div>
            </div>

            {/* Botones de descarga con estilo consistente */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 justify-center">
              <button
                onClick={handleCVDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 text-sm text-white bg-brand-red rounded-none hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label={localData.downloadCV}
              >
                <i className="fas fa-download mr-1.5"></i>
                <span>{localData.downloadCV}</span>
              </button>

              <button
                onClick={handleCoverLetterDownload}
                className="w-full sm:w-auto inline-flex items-center justify-center px-3 py-2 text-sm text-white bg-brand-red rounded-none hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                aria-label={localData.downloadCoverLetter}
              >
                <i className="fas fa-file-alt mr-1.5"></i>
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
