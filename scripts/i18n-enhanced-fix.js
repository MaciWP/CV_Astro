// public/scripts/i18n-enhanced-fix.js
(function () {
    // Solo aplicar si el script principal falló
    if (document.querySelector('title').textContent === 'Error') {
        console.warn('Detectado error en i18n.js, aplicando solución...');
    }

    // Traducciones fallback para componentes críticos
    const fallbackTranslations = {
        en: {
            languages: {
                title: "Languages"
            },
            projects: {
                title: "Key Projects",
                personalProjects: "Personal Projects",
                professionalWork: "Professional Work",
                technologies: "Technologies",
                keyFeatures: "Key Features"
            },
            experience: {
                title: "Work Experience",
                keyAchievements: "KEY ACHIEVEMENTS",
                responsibilities: "RESPONSIBILITIES"
            },
            skills: {
                title: "Technical Skills",
                languages: "Programming Languages",
                libraries: "Libraries & Frameworks",
                technologies: "Technologies & Databases",
                tools: "Tools & Applications",
                protocols: "Protocols"
            },
            education: {
                title: "Education & Certifications"
            },
            header: {
                jobTitle: "Software Developer",
                summary: "Solutions-driven Backend Developer specializing in industrial protocol integration"
            }
        },
        es: {
            languages: {
                title: "Idiomas"
            },
            projects: {
                title: "Proyectos Clave",
                personalProjects: "Proyectos Personales",
                professionalWork: "Trabajo Profesional",
                technologies: "Tecnologías",
                keyFeatures: "Características Clave"
            },
            experience: {
                title: "Experiencia Laboral",
                keyAchievements: "LOGROS CLAVE",
                responsibilities: "RESPONSABILIDADES"
            },
            skills: {
                title: "Habilidades Técnicas",
                languages: "Lenguajes de Programación",
                libraries: "Librerías y Frameworks",
                technologies: "Tecnologías y Bases de Datos",
                tools: "Herramientas y Aplicaciones",
                protocols: "Protocolos"
            },
            education: {
                title: "Formación y Certificaciones"
            },
            header: {
                jobTitle: "Desarrollador de Software",
                summary: "Desarrollador Backend orientado a soluciones, especializado en integración de protocolos industriales"
            }
        },
        fr: {
            languages: {
                title: "Langues"
            },
            projects: {
                title: "Projets Clés",
                personalProjects: "Projets Personnels",
                professionalWork: "Travail Professionnel",
                technologies: "Technologies",
                keyFeatures: "Caractéristiques Principales"
            },
            experience: {
                title: "Expérience Professionnelle",
                keyAchievements: "RÉALISATIONS CLÉS",
                responsibilities: "RESPONSABILITÉS"
            },
            skills: {
                title: "Compétences Techniques",
                languages: "Langages de Programmation",
                libraries: "Bibliothèques et Frameworks",
                technologies: "Technologies et Bases de Données",
                tools: "Outils et Applications",
                protocols: "Protocoles"
            },
            education: {
                title: "Formation et Certifications"
            },
            header: {
                jobTitle: "Développeur Logiciel",
                summary: "Développeur Backend axé sur les solutions, spécialisé dans l'intégration de protocoles industriels"
            }
        }
    };

    // Verificar y ajustar la función de traducción
    if (typeof window.t !== 'function' || window.i18nFailed) {
        // Crear una función de traducción que use las traducciones fallback
        window.t = function (key, defaultValue) {
            // Obtener idioma actual
            const lang = window.CURRENT_LANGUAGE || 'en';
            const fallbackLang = 'en'; // Siempre inglés como último recurso

            // Buscar en traducciones existentes si están disponibles
            if (window.TRANSLATIONS && window.TRANSLATIONS[lang]) {
                let result = window.TRANSLATIONS[lang];
                const parts = key.split('.');
                let found = true;

                for (const part of parts) {
                    if (result && typeof result === 'object' && part in result) {
                        result = result[part];
                    } else {
                        found = false;
                        break;
                    }
                }

                if (found && typeof result !== 'object') {
                    return result;
                }
            }

            // Buscar en traducciones fallback
            if (fallbackTranslations[lang]) {
                let result = fallbackTranslations[lang];
                const parts = key.split('.');
                let found = true;

                for (const part of parts) {
                    if (result && typeof result === 'object' && part in result) {
                        result = result[part];
                    } else {
                        found = false;
                        break;
                    }
                }

                if (found && typeof result !== 'object') {
                    return result;
                }
            }

            // Probar en inglés como último recurso
            if (lang !== fallbackLang && fallbackTranslations[fallbackLang]) {
                let result = fallbackTranslations[fallbackLang];
                const parts = key.split('.');
                let found = true;

                for (const part of parts) {
                    if (result && typeof result === 'object' && part in result) {
                        result = result[part];
                    } else {
                        found = false;
                        break;
                    }
                }

                if (found && typeof result !== 'object') {
                    return result;
                }
            }

            // Valor por defecto o última parte de la clave
            return defaultValue || key.split('.').pop();
        };

        // Actualizar el objeto i18n si ya existe
        if (window.i18n) {
            window.i18n.t = window.t;
        } else {
            window.i18n = {
                t: window.t,
                init: function (lang) {
                    window.CURRENT_LANGUAGE = lang || 'en';
                },
                changeLanguage: function (lang) {
                    window.CURRENT_LANGUAGE = lang;
                    this.updateElements();
                    return Promise.resolve(lang);
                },
                updateElements: function () {
                    document.querySelectorAll('[data-i18n]').forEach(function (element) {
                        const key = element.getAttribute('data-i18n');
                        if (key) {
                            element.textContent = window.t(key);
                        }
                    });
                }
            };
        }

        // Aplicar traducciones inmediatamente
        setTimeout(function () {
            if (window.i18n && typeof window.i18n.updateElements === 'function') {
                window.i18n.updateElements();
            } else {
                document.querySelectorAll('[data-i18n]').forEach(function (element) {
                    const key = element.getAttribute('data-i18n');
                    if (key) {
                        element.textContent = window.t(key);
                    }
                });
            }

            // Notificar que se aplicó la solución
            console.log('✅ Traducciones de emergencia aplicadas');
        }, 100);
    }
})();