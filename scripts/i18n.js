// public/scripts/i18n.js (versión corregida)
/**
 * Sistema unificado de internacionalización
 * Corrige el error de "Unexpected token '<'"
 */

// Definir idiomas soportados
const SUPPORTED_LANGUAGES = ['en', 'es', 'fr'];
const DEFAULT_LANGUAGE = 'en';

// Cache para almacenar traducciones cargadas
const translationsCache = {};

/**
 * Inicializar el sistema de i18n
 * @param {string} initialLang - Idioma inicial (opcional)
 */
function initI18n(initialLang = null) {
    // Configurar variables globales
    if (typeof window !== 'undefined') {
        // Detectar idioma
        const detectedLang = initialLang || detectLanguage();
        window.CURRENT_LANGUAGE = SUPPORTED_LANGUAGES.includes(detectedLang)
            ? detectedLang
            : DEFAULT_LANGUAGE;

        // Inicializar objeto de traducciones
        window.TRANSLATIONS = window.TRANSLATIONS || {};

        // Definir función global de traducción (versión inicial)
        window.t = function (key, defaultValue) {
            return getTranslation(key, defaultValue);
        };

        // Definir función para cambiar de idioma
        window.changeLanguage = function (lang) {
            return changeLanguage(lang);
        };

        // Cargar traducciones para el idioma actual
        loadTranslations(window.CURRENT_LANGUAGE)
            .then(() => {
                console.log(`Translations loaded for: ${window.CURRENT_LANGUAGE}`);
                // Notificar que las traducciones están listas
                document.dispatchEvent(new CustomEvent('translationsLoaded'));
            })
            .catch(error => {
                console.error(`Error loading translations for ${window.CURRENT_LANGUAGE}:`, error);
            });

        // Precargar traducciones en inglés como fallback si no es el idioma actual
        if (window.CURRENT_LANGUAGE !== 'en') {
            loadTranslations('en')
                .catch(error => console.warn('Could not load English fallback translations:', error));
        }
    }
}

/**
 * Detectar el idioma actual basado en la URL, localStorage o el navegador
 * @returns {string} Código de idioma detectado
 */
function detectLanguage() {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

    // 1. Verificar localStorage
    const storedLang = localStorage.getItem('language') || localStorage.getItem('preferred_language');
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
        return storedLang;
    }

    // 2. Verificar URL
    const path = window.location.pathname;
    for (const lang of SUPPORTED_LANGUAGES) {
        if (path.startsWith(`/${lang}/`)) {
            return lang;
        }
    }

    // 3. Verificar preferencia del navegador
    if (navigator.language) {
        const browserLang = navigator.language.split('-')[0];
        if (SUPPORTED_LANGUAGES.includes(browserLang)) {
            return browserLang;
        }
    }

    // 4. Valor predeterminado
    return DEFAULT_LANGUAGE;
}

/**
 * Cargar archivo de traducciones para un idioma específico
 * @param {string} lang - Código de idioma 
 * @returns {Promise} Promesa que se resuelve cuando se cargan las traducciones
 */
async function loadTranslations(lang) {
    if (typeof window === 'undefined') return null;

    // Evitar cargar el mismo idioma varias veces
    if (translationsCache[lang]) {
        window.TRANSLATIONS[lang] = translationsCache[lang];
        return translationsCache[lang];
    }

    try {
        // Usar parámetro de tiempo para evitar caché
        const response = await fetch(`/locales/${lang}/translation.json?v=${Date.now()}`);

        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }

        const translations = await response.json();

        // Almacenar traducciones en caché local y global
        translationsCache[lang] = translations;
        window.TRANSLATIONS[lang] = translations;

        return translations;
    } catch (error) {
        console.error(`Error loading translations for ${lang}:`, error);
        return null;
    }
}

/**
 * Obtener una traducción usando notación de puntos
 * @param {string} key - Clave de traducción (e.g., 'header.title')
 * @param {string} defaultValue - Valor por defecto si no se encuentra la traducción
 * @returns {string} Texto traducido o valor por defecto
 */
function getTranslation(key, defaultValue) {
    if (typeof window === 'undefined') return defaultValue || key.split('.').pop();

    const lang = window.CURRENT_LANGUAGE || DEFAULT_LANGUAGE;
    const translations = window.TRANSLATIONS[lang] || {};

    // Navegar por el objeto usando la notación de puntos
    const keys = key.split('.');
    let result = translations;

    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = result[k];
        } else {
            // Si no se encuentra, buscar en inglés como fallback
            if (lang !== 'en' && window.TRANSLATIONS['en']) {
                let enResult = window.TRANSLATIONS['en'];
                let found = true;

                for (const k2 of keys) {
                    if (enResult && typeof enResult === 'object' && k2 in enResult) {
                        enResult = enResult[k2];
                    } else {
                        found = false;
                        break;
                    }
                }

                if (found) return enResult;
            }

            // Si todavía no hay traducción, retornar el valor por defecto
            return defaultValue || key.split('.').pop();
        }
    }

    return result || defaultValue || key.split('.').pop();
}

/**
 * Cambiar el idioma actual y recargar las traducciones
 * @param {string} newLang - Nuevo código de idioma
 * @returns {Promise} Promesa que se resuelve cuando se completa el cambio
 */
async function changeLanguage(newLang) {
    if (typeof window === 'undefined') return;

    // Validar el idioma
    if (!SUPPORTED_LANGUAGES.includes(newLang)) {
        console.error(`Unsupported language: ${newLang}`);
        return;
    }

    // Evitar cambiar al mismo idioma
    if (newLang === window.CURRENT_LANGUAGE) {
        return;
    }

    // Actualizar el idioma actual
    window.CURRENT_LANGUAGE = newLang;

    // Guardar preferencia en localStorage
    localStorage.setItem('language', newLang);
    localStorage.setItem('preferred_language', newLang);

    // Cargar traducciones si no están cargadas
    if (!window.TRANSLATIONS[newLang]) {
        await loadTranslations(newLang);
    }

    // Actualizar elementos con atributo data-i18n
    updateTranslatedElements();

    // Notificar del cambio de idioma
    document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: newLang }
    }));

    return newLang;
}

/**
 * Actualizar todos los elementos con data-i18n
 * Útil para actualizar la UI después de cambiar el idioma
 */
function updateTranslatedElements() {
    if (typeof document === 'undefined') return;

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
        const key = element.getAttribute("data-i18n");
        if (key && typeof window.t === "function") {
            element.textContent = window.t(key);
        }
    });
}

// Exponer las funciones para uso global
if (typeof window !== 'undefined') {
    window.i18n = {
        init: initI18n,
        t: getTranslation,
        changeLanguage: changeLanguage,
        detectLanguage: detectLanguage,
        updateElements: updateTranslatedElements
    };
}

// Inicializar automáticamente cuando se carga el script
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initI18n();
    });
}