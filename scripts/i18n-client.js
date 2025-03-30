/**
 * Script para inicializar el sistema de internacionalización en el cliente
 * Se puede incluir como una etiqueta de script en el Layout principal
 * 
 * src/scripts/i18n-client.js
 */

// Detecta el idioma actual basado en la URL o el valor almacenado
const detectLanguageFromURL = () => {
    // Primero intentamos usar la variable global ya establecida
    if (window.CURRENT_LANGUAGE) {
        return window.CURRENT_LANGUAGE;
    }

    // Detectar por URL
    const path = window.location.pathname;
    if (path.startsWith('/es/')) return 'es';
    if (path.startsWith('/fr/')) return 'fr';

    // Valor por defecto
    return 'en';
};

// Guarda el idioma en una variable global
window.CURRENT_LANGUAGE = detectLanguageFromURL();

// Carga las traducciones apenas se carga la página
const preloadTranslations = async () => {
    const lang = window.CURRENT_LANGUAGE;

    try {
        // Cargar traducción del idioma actual
        const response = await fetch(`/locales/${lang}/translation.json?v=${new Date().getTime()}`);
        if (response.ok) {
            const translations = await response.json();
            // Guardar en una variable global para acceso rápido
            window.TRANSLATIONS = window.TRANSLATIONS || {};
            window.TRANSLATIONS[lang] = translations;
            console.log(`Translations for ${lang} loaded successfully`);
        } else {
            console.warn(`Failed to load ${lang} translations, status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error loading ${lang} translations:`, error);
    }
};

// Función helper para traducir desde cualquier script
window.t = (key) => {
    const lang = window.CURRENT_LANGUAGE || 'en';
    const translations = window.TRANSLATIONS?.[lang] || {};

    // Buscar la traducción por la ruta de puntos
    const keys = key.split('.');
    let result = translations;

    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = result[k];
        } else {
            // Si no se encuentra, devolver la clave original
            return keys[keys.length - 1];
        }
    }

    return result;
};

// Iniciar la carga de traducciones después de que se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    preloadTranslations();
});