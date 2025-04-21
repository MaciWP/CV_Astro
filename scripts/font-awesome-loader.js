/**
 * Optimized Font Awesome loader script
 * Ensures icons are properly loaded in both development and production
 * File: scripts/font-awesome-loader.js
 */

(function () {
    // Configuration
    const FONT_AWESOME_VERSION = '6.4.0';
    const CDN_BASE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome';
    const FALLBACK_CSS_URL = '/styles/font-awesome-fallback.css';
    const MINIMAL_CSS_URL = '/styles/font-awesome-minimal.css';

    // Helper function to load CSS with error handling
    function loadCSS(url, integrity = null, crossorigin = null) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;

            if (integrity) {
                link.integrity = integrity;
            }

            if (crossorigin) {
                link.crossOrigin = crossorigin;
            }

            link.onload = () => {
                console.log(`[Font Awesome] Loaded: ${url}`);
                resolve(link);
            };

            link.onerror = () => {
                console.warn(`[Font Awesome] Failed to load: ${url}`);
                reject(new Error(`Failed to load ${url}`));
            };

            document.head.appendChild(link);
        });
    }

    // Load fallback CSS first to ensure basic icon functionality
    loadCSS(FALLBACK_CSS_URL)
        .then(() => {
            console.log('[Font Awesome] Fallback CSS loaded successfully');

            // Then load minimal custom build with only necessary icons
            return loadCSS(MINIMAL_CSS_URL);
        })
        .then(() => {
            console.log('[Font Awesome] Minimal CSS loaded successfully');

            // Finally try to load from CDN for complete icon set
            // Use integrity hash for security
            return loadCSS(
                `${CDN_BASE_URL}/${FONT_AWESOME_VERSION}/css/all.min.css`,
                'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==',
                'anonymous'
            );
        })
        .then(() => {
            console.log('[Font Awesome] CDN version loaded successfully');
            document.documentElement.classList.add('fa-loaded');
        })
        .catch(error => {
            // If CDN fails, we still have the minimal version
            console.warn('[Font Awesome] Could not load complete icon set from CDN:', error);
            console.info('[Font Awesome] Using minimal icon set only');
            document.documentElement.classList.add('fa-minimal');
        });

    // Check if font files are loaded correctly
    const REQUIRED_FONTS = [
        '/styles/fonts/fa-solid-900.woff2',
        '/styles/fonts/fa-brands-400.woff2'
    ];

    // Verify font files are available
    Promise.all(
        REQUIRED_FONTS.map(fontUrl =>
            fetch(fontUrl, { method: 'HEAD' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Font file ${fontUrl} not available`);
                    }
                    return true;
                })
                .catch(error => {
                    console.warn(`[Font Awesome] ${error.message}`);
                    return false;
                })
        )
    ).then(results => {
        const allFontsAvailable = results.every(result => result === true);
        if (!allFontsAvailable) {
            console.warn('[Font Awesome] Some font files are missing, using CDN fallback');
            // Add CSS to use CDN fonts as fallback
            const style = document.createElement('style');
            style.textContent = `
                @font-face {
                    font-family: 'Font Awesome 5 Free';
                    font-style: normal;
                    font-weight: 900;
                    font-display: swap;
                    src: url('${CDN_BASE_URL}/${FONT_AWESOME_VERSION}/webfonts/fa-solid-900.woff2') format('woff2');
                }
                
                @font-face {
                    font-family: 'Font Awesome 5 Brands';
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url('${CDN_BASE_URL}/${FONT_AWESOME_VERSION}/webfonts/fa-brands-400.woff2') format('woff2');
                }
            `;
            document.head.appendChild(style);
        }
    });
})();