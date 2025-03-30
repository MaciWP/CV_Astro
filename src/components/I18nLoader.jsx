/**
 * I18nLoader.jsx - Componente optimizado para precargar traducciones
 * Simplificado para aprovechar las funciones del nuevo sistema i18n unificado
 * 
 * File: src/components/I18nLoader.jsx
 */
import React, { useState, useEffect } from 'react';

const I18nLoader = ({ children, fallback = null }) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Determinar el idioma actual
        const currentLang = (typeof window !== 'undefined' && window.CURRENT_LANGUAGE) || 'en';

        // Función para cargar las traducciones
        const loadTranslations = async () => {
            try {
                // Verificar si ya están cargadas las traducciones
                if (window.TRANSLATIONS && window.TRANSLATIONS[currentLang]) {
                    setLoaded(true);
                    return;
                }

                // Utilizar la API global de i18n si está disponible
                if (window.i18n && typeof window.i18n.init === 'function') {
                    await window.i18n.init(currentLang);
                    setLoaded(true);
                    return;
                }

                // Fallback: cargar traducciones directamente
                const response = await fetch(`/locales/${currentLang}/translation.json?v=${Date.now()}`);

                if (!response.ok) {
                    throw new Error(`Failed to load translations for ${currentLang}, status: ${response.status}`);
                }

                const translations = await response.json();

                // Almacenar traducciones
                window.TRANSLATIONS = window.TRANSLATIONS || {};
                window.TRANSLATIONS[currentLang] = translations;

                // Asegurar que la función t() está disponible
                if (!window.t) {
                    window.t = function (key) {
                        const translations = window.TRANSLATIONS[currentLang] || {};
                        const keys = key.split('.');
                        let result = translations;

                        for (const k of keys) {
                            if (result && typeof result === 'object' && k in result) {
                                result = result[k];
                            } else {
                                return key.split('.').pop();
                            }
                        }

                        return result || key.split('.').pop();
                    };
                }

                // Disparar evento para que los componentes sepan que las traducciones están disponibles
                document.dispatchEvent(new CustomEvent('translationsLoaded'));

                // Indicar que las traducciones están cargadas
                setLoaded(true);
            } catch (error) {
                console.error('Error loading translations:', error);
                setError(error);

                // Intentar continuar con las traducciones que tengamos
                setLoaded(true);
            }
        };

        loadTranslations();
    }, []);

    if (!loaded) {
        // Mostrar un indicador de carga mientras se cargan las traducciones
        return fallback || (
            <div className="flex items-center justify-center min-h-screen bg-light-primary dark:bg-dark-primary">
                <div className="p-4 text-center">
                    <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">Loading translations...</p>
                </div>
            </div>
        );
    }

    if (error) {
        console.warn('Continuing with partial translations due to error');
    }

    return <>{children}</>;
};

export default I18nLoader;