/**
 * Sistema de internacionalización que carga traducciones dinámicamente
 * Evita importar archivos de la carpeta public directamente
 *
 * src/utils/i18n.js
 */

// Cache para almacenar traducciones cargadas
const translationsCache = {
  en: null,
  es: null,
  fr: null,
};

/**
 * Detecta el idioma actual basado en la URL o el valor almacenado
 * @returns {string} Código del idioma (en, es, fr)
 */
export const detectLanguage = () => {
  // Primero intentamos usar la variable global establecida en el layout
  if (typeof window !== "undefined" && window.CURRENT_LANGUAGE) {
    return window.CURRENT_LANGUAGE;
  }

  // Si no está disponible, detectamos por URL
  if (typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path.startsWith("/es/")) return "es";
    if (path.startsWith("/fr/")) return "fr";
  }

  // Valor por defecto
  return "en";
};

/**
 * Carga un archivo de traducción
 * @param {string} lang - Código de idioma
 * @returns {Promise<Object>} - Promesa que resuelve al objeto de traducción
 */
export const loadTranslation = async (lang) => {
  // Si ya tenemos la traducción en cache, la usamos
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }

  try {
    // Usar URL relativa para que funcione en desarrollo y producción
    const response = await fetch(
      `/locales/${lang}/translation.json?v=${new Date().getTime()}`,
    );

    if (!response.ok) {
      console.warn(
        `Failed to load ${lang} translations, status: ${response.status}`,
      );
      // Si falla, intentamos con inglés como fallback
      if (lang !== "en") {
        return loadTranslation("en");
      }
      return {};
    }

    const translations = await response.json();
    // Guardar en cache
    translationsCache[lang] = translations;
    return translations;
  } catch (error) {
    console.error(`Error loading ${lang} translations:`, error);
    // Si hay error y no es inglés, intentar con inglés
    if (lang !== "en") {
      return loadTranslation("en");
    }
    return {};
  }
};

/**
 * Obtiene el valor de traducción de un objeto anidado usando una ruta de punto
 * @param {Object} obj - Objeto de traducciones
 * @param {string} path - Ruta de acceso con puntos (por ej. 'header.title')
 * @returns {*} Valor encontrado o undefined
 */
const getValueByPath = (obj, path) => {
  if (!obj || !path) return undefined;

  const keys = path.split(".");
  let result = obj;

  for (const key of keys) {
    if (result && typeof result === "object" && key in result) {
      result = result[key];
    } else {
      return undefined;
    }
  }

  return result;
};

// Datos de traducción en memoria para uso inmediato (fallbacks básicos)
const fallbackTranslations = {
  en: {
    header: {
      jobTitle: "Software Developer",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      photoAlt: "Oriol Macias - Software Developer",
    },
    sections: {
      summary: "Professional Summary",
      experience: "Work Experience",
      education: "Education",
      skills: "Skills",
      languages: "Languages",
      projects: "Projects",
    },
  },
  es: {
    header: {
      jobTitle: "Desarrollador de Software",
      email: "Correo",
      linkedin: "LinkedIn",
      github: "GitHub",
      photoAlt: "Oriol Macias - Desarrollador de Software",
    },
    sections: {
      summary: "Resumen Profesional",
      experience: "Experiencia Laboral",
      education: "Formación",
      skills: "Habilidades",
      languages: "Idiomas",
      projects: "Proyectos",
    },
  },
  fr: {
    header: {
      jobTitle: "Développeur Logiciel",
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      photoAlt: "Oriol Macias - Développeur Logiciel",
    },
    sections: {
      summary: "Résumé Professionnel",
      experience: "Expérience Professionnelle",
      education: "Formation",
      skills: "Compétences",
      languages: "Langues",
      projects: "Projets",
    },
  },
};

/**
 * Función de traducción principal - versión síncrona con fallbacks
 * @param {string} key - Clave de traducción (con notación de puntos)
 * @param {string} lang - Código de idioma (opcional, detecta automáticamente si no se proporciona)
 * @returns {string} Texto traducido o clave original como fallback
 */
export const translate = (key, lang = null) => {
  // Determinar idioma a usar
  const langToUse = lang || detectLanguage();

  // Primero buscar en las traducciones cargadas
  const cached = translationsCache[langToUse];
  if (cached) {
    const translated = getValueByPath(cached, key);
    if (translated !== undefined) return translated;
  }

  // Luego buscar en los fallbacks
  const fallback = getValueByPath(fallbackTranslations[langToUse], key);
  if (fallback !== undefined) return fallback;

  // Si aún no hay traducción, intentar con el idioma inglés
  if (langToUse !== "en") {
    const enFallback = getValueByPath(fallbackTranslations.en, key);
    if (enFallback !== undefined) return enFallback;
  }

  // Último recurso: devolver la última parte de la clave
  const parts = key.split(".");
  return parts[parts.length - 1];
};

/**
 * Función para precargar todas las traducciones
 * @returns {Promise<void>}
 */
export const preloadTranslations = async () => {
  try {
    await Promise.all([
      loadTranslation("en"),
      loadTranslation("es"),
      loadTranslation("fr"),
    ]);
    console.log("All translations preloaded successfully");
  } catch (error) {
    console.error("Error preloading translations:", error);
  }
};

/**
 * Hook para usar en componentes React
 * @returns {Object} Objeto con funciones útiles
 */
export const useI18n = () => {
  const lang = detectLanguage();

  // Cargar las traducciones si aún no están cargadas
  if (!translationsCache[lang]) {
    loadTranslation(lang).catch((e) =>
      console.error(`Failed to load translations for ${lang}:`, e),
    );
  }

  return {
    t: (key) => translate(key, lang),
    lang,
    // Función para crear URLs localizadas
    localizeUrl: (path) => {
      if (lang === "en") return path.startsWith("/") ? path : `/${path}`;
      return `/${lang}${path.startsWith("/") ? path : `/${path}`}`;
    },
    // Obtener nombre nativo del idioma actual
    languageName:
      {
        en: "English",
        es: "Español",
        fr: "Français",
      }[lang] || "English",
  };
};

// Intentar precargar traducciones si estamos en el navegador
if (typeof window !== "undefined") {
  preloadTranslations();
}

export default {
  translate,
  detectLanguage,
  useI18n,
  preloadTranslations,
};
