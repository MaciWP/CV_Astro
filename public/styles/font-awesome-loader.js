/**
 * Font Awesome Loader
 * Estrategia de carga optimizada con fallbacks
 */
(function() {
    // Configuración
    const FA_VERSION = '6.4.0';
    const CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/' + FA_VERSION + '/css/all.min.css';
    const LOCAL_URL = '/styles/font-awesome-minimal.css';
    const FALLBACK_URL = '/styles/font-awesome-fallback.css';
    const INTEGRITY = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';

    // Función para cargar CSS con manejo de errores
    function loadCSS(url, integrity, crossorigin) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;

            if (integrity) {
                link.integrity = integrity;
                link.crossOrigin = crossorigin || 'anonymous';
            }

            link.onload = () => resolve(link);
            link.onerror = () => reject(new Error('Failed to load ' + url));

            document.head.appendChild(link);
        });
    }

    // Cargar fallback primero (garantiza iconos básicos)
    loadCSS(FALLBACK_URL)
        .then(() => {
            // Luego cargar versión mínima local
            return loadCSS(LOCAL_URL);
        })
        .then(() => {
            // Finalmente intentar cargar versión completa desde CDN
            return loadCSS(CDN_URL, INTEGRITY, 'anonymous')
                .then(() => {
                    document.documentElement.classList.add('fa-loaded');
                })
                .catch(() => {
                    // Si falla CDN, ya tenemos las versiones mínimas
                    document.documentElement.classList.add('fa-minimal');
                });
        })
        .catch(error => {
            console.error('Font Awesome error:', error);
            
            // Intentar directamente CDN como último recurso
            loadCSS(CDN_URL, INTEGRITY, 'anonymous')
                .catch(() => {
                    // Si todo falla, inyectar estilos con emojis
                    injectFallbackIcons();
                });
        });

    // Último recurso: emojis unicode
    function injectFallbackIcons() {
        const style = document.createElement('style');
        style.textContent = `
            .fas, .fab { display: inline-block; width: 1em; height: 1em; }
            .fa-user:before { content: "👤"; }
            .fa-envelope:before { content: "✉️"; }
            .fa-linkedin:before { content: "📎"; }
            .fa-github:before { content: "🔄"; }
            .fa-download:before { content: "⬇️"; }
            .fa-code:before { content: "🧩"; }
            .fa-graduation-cap:before { content: "🎓"; }
            .fa-language:before { content: "🌐"; }
        `;
        document.head.appendChild(style);
        document.documentElement.classList.add('fa-fallback');
    }
})();