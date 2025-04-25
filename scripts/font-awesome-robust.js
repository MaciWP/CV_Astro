// scripts/font-awesome-robust.js
/**
 * Sistema robusto para la carga de Font Awesome con fallbacks
 * Soluciona problemas de carga en Netlify
 */

(function () {
    // Configuración
    const FA_VERSION = '6.4.0';
    const CDN_URL = `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${FA_VERSION}/css/all.min.css`;
    const LOCAL_URL = '/styles/font-awesome-minimal.css';
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

            link.onload = () => resolve(link);
            link.onerror = () => reject(new Error(`Failed to load ${url}`));

            document.head.appendChild(link);
        });
    }

    // Intentar cargar la versión local primero (más rápido)
    loadCSS(LOCAL_URL)
        .then(() => {
            console.log('Font Awesome local cargado correctamente');
            // Luego intentar cargar la versión completa desde CDN
            return loadCSS(CDN_URL, INTEGRITY, 'anonymous')
                .then(() => {
                    console.log('Font Awesome CDN cargado correctamente');
                    document.documentElement.classList.add('fa-loaded');
                })
                .catch(error => {
                    // Si el CDN falla, ya tenemos la versión local
                    console.log('Usando solo versión local de Font Awesome');
                    document.documentElement.classList.add('fa-minimal');
                });
        })
        .catch(error => {
            console.error('Error cargando Font Awesome local, intentando CDN');
            // Intentar CDN como último recurso
            loadCSS(CDN_URL, INTEGRITY, 'anonymous')
                .then(() => {
                    console.log('Font Awesome CDN cargado como fallback');
                    document.documentElement.classList.add('fa-loaded');
                })
                .catch(error => {
                    console.error('Fallo completo al cargar Font Awesome');
                    // Agregar ícones críticos inline como último recurso
                    injectCriticalIcons();
                });
        });

    // Función para inyectar SVGs de íconos críticos como último recurso
    function injectCriticalIcons() {
        const iconStyles = document.createElement('style');
        iconStyles.textContent = `
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
        document.head.appendChild(iconStyles);
        document.documentElement.classList.add('fa-fallback');
    }
})();