// public/scripts/i18n-init.js
(function () {
    // Inicializar objetos globales para traducciones
    window.CURRENT_LANGUAGE = window.CURRENT_LANGUAGE || "en";
    window.TRANSLATIONS = window.TRANSLATIONS || {};

    // Función de traducción simple pero efectiva
    window.t = function (key, params) {
        const currentLang = window.CURRENT_LANGUAGE || "en";
        const translations = window.TRANSLATIONS[currentLang] || {};

        const keys = key.split('.');
        let result = translations;

        // Navegar por el objeto de traducciones
        for (const k of keys) {
            if (result && typeof result === 'object' && k in result) {
                result = result[k];
            } else {
                // Fallback a la última parte de la clave
                return keys[keys.length - 1];
            }
        }

        return typeof result === 'string' ? result : keys[keys.length - 1];
    };

    // Función para cambiar el idioma
    window.changeLanguage = function (langCode) {
        if (langCode && ["en", "es", "fr"].includes(langCode)) {
            window.CURRENT_LANGUAGE = langCode;
            localStorage.setItem("preferred_language", langCode);

            // Cargar traducciones si no están cargadas
            if (!window.TRANSLATIONS[langCode]) {
                fetch(`/locales/${langCode}/translation.json?v=${Date.now()}`)
                    .then(response => response.json())
                    .then(data => {
                        window.TRANSLATIONS[langCode] = data;
                        document.dispatchEvent(new CustomEvent("languageChanged"));
                        updateTranslatedElements();
                    })
                    .catch(error => {
                        console.error(`Error loading translations for ${langCode}:`, error);
                    });
            } else {
                document.dispatchEvent(new CustomEvent("languageChanged"));
                updateTranslatedElements();
            }
        }
    };

    // Actualizar elementos con data-i18n
    function updateTranslatedElements() {
        document.querySelectorAll("[data-i18n]").forEach(function (element) {
            const key = element.getAttribute("data-i18n");
            if (key && window.t) {
                element.textContent = window.t(key);
            }
        });
    }
})();