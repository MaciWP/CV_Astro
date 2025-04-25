/**
 * Font Awesome Loader - Script unificado
 * Maneja la carga de Font Awesome con fallbacks robustos
 */
(function() {
    // Configuración
    const FA_VERSION = '6.4.0';
    const CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/' + FA_VERSION + '/css/all.min.css';
    const LOCAL_URL = '/styles/font-awesome-minimal.css';
    const FALLBACK_URL = '/styles/font-awesome-fallback.css';
    const INTEGRITY = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';

    // Función para cargar CSS con manejo de errores
    function loadCSS(url, integrity = null, crossorigin = null) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;

            if (integrity) {
                link.integrity = integrity;
                link.crossOrigin = crossorigin || 'anonymous';
            }

            link.onload = () => {
                console.log('[Font Awesome] Cargado: ' + url);
                resolve(link);
            };

            link.onerror = () => {
                console.warn('[Font Awesome] Error cargando: ' + url);
                reject(new Error('Failed to load ' + url));
            };

            document.head.appendChild(link);
        });
    }

    // Estrategia de carga: fallback → minimal → CDN
    loadCSS(FALLBACK_URL)
        .then(() => {
            // Luego carga minimal (optimizado)
            return loadCSS(LOCAL_URL);
        })
        .then(() => {
            // Finalmente intenta cargar CDN completo
            return loadCSS(CDN_URL, INTEGRITY, 'anonymous')
                .then(() => {
                    document.documentElement.classList.add('fa-loaded');
                })
                .catch(error => {
                    console.warn('[Font Awesome] Usando solo versión local');
                    document.documentElement.classList.add('fa-minimal');
                });
        })
        .catch(error => {
            console.error('[Font Awesome] Error en carga principal, intentando CDN:', error);
            
            // Intento directo desde CDN como fallback
            loadCSS(CDN_URL, INTEGRITY, 'anonymous')
                .then(() => {
                    document.documentElement.classList.add('fa-loaded');
                })
                .catch(error => {
                    console.error('[Font Awesome] Fallo completo. Usando emojis fallback:', error);
                    injectFallbackIcons();
                });
        });

    // Verificar que las fuentes existan localmente
    const REQUIRED_FONTS = [
        '/styles/fonts/fa-solid-900.woff2',
        '/styles/fonts/fa-brands-400.woff2'
    ];

    Promise.all(
        REQUIRED_FONTS.map(fontUrl =>
            fetch(fontUrl, { method: 'HEAD' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Font file ' + fontUrl + ' not available');
                    }
                    return true;
                })
                .catch(error => {
                    console.warn('[Font Awesome] ' + error.message);
                    return false;
                })
        )
    ).then(results => {
        if (!results.every(result => result === true)) {
            console.warn('[Font Awesome] Algunas fuentes faltan, usando fuentes CDN');
            
            // Fuentes CDN como fallback
            const style = document.createElement('style');
            style.textContent = `
                @font-face {
                    font-family: 'Font Awesome 5 Free';
                    font-style: normal;
                    font-weight: 900;
                    font-display: swap;
                    src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2') format('woff2');
                }
                
                @font-face {
                    font-family: 'Font Awesome 5 Brands';
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2') format('woff2');
                }
            `;
            document.head.appendChild(style);
        }
    });

    // Último recurso: emojis unicode como fallback
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