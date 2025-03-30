/**
 * I18nLoader.jsx - Componente para precargar traducciones
 * 
 * Este componente soluciona el problema de carga de traducciones garantizando
 * que todas las traducciones estén disponibles antes de mostrar la interfaz
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

                // Cargar el archivo de traducciones con parámetro de tiempo para evitar caché
                const response = await fetch(`/locales/${currentLang}/translation.json?v=${Date.now()}`);

                if (!response.ok) {
                    throw new Error(`Failed to load translations for ${currentLang}, status: ${response.status}`);
                }

                const translations = await response.json();

                // Almacenar traducciones
                window.TRANSLATIONS = window.TRANSLATIONS || {};
                window.TRANSLATIONS[currentLang] = translations;

                // Reimplementar la función t() para garantizar que use las traducciones correctas
                window.t = function (key) {
                    const translations = window.TRANSLATIONS[currentLang] || {};
                    const keys = key.split('.');
                    let result = translations;

                    for (const k of keys) {
                        if (result && typeof result === 'object' && k in result) {
                            result = result[k];
                        } else {
                            // Intentar con inglés como fallback
                            if (currentLang !== 'en' && window.TRANSLATIONS['en']) {
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

                            // Si no se encuentra, devolver la última parte de la clave
                            return key.split('.').pop();
                        }
                    }

                    return result || key.split('.').pop();
                };

                // Disparar evento para que los componentes sepan que las traducciones están disponibles
                document.dispatchEvent(new CustomEvent('translationsLoaded'));

                // Indicar que las traducciones están cargadas
                setLoaded(true);

                // También cargar inglés como fallback si no es el idioma actual
                if (currentLang !== 'en') {
                    fetch(`/locales/en/translation.json?v=${Date.now()}`)
                        .then(res => res.json())
                        .then(enTranslations => {
                            window.TRANSLATIONS['en'] = enTranslations;
                        })
                        .catch(err => console.warn('Failed to load English fallback translations:', err));
                }
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