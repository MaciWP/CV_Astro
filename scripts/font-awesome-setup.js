// scripts/font-awesome-setup.js
/**
 * Script unificado para la configuración de Font Awesome
 * Combina las funcionalidades de:
 * - setup-font-awesome.js (descarga FA)
 * - optimize-font-awesome.js (crea CSS minimal)
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { createWriteStream } from 'fs';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const PUBLIC_STYLES_DIR = path.join(__dirname, '../public/styles');
const PUBLIC_FONTS_DIR = path.join(__dirname, '../public/styles/fonts');
const PUBLIC_SCRIPTS_DIR = path.join(__dirname, '../public/scripts');
const OUTPUT_MIN_CSS_FILE = path.join(PUBLIC_STYLES_DIR, 'font-awesome-minimal.css');
const OUTPUT_FALLBACK_CSS_FILE = path.join(PUBLIC_STYLES_DIR, 'font-awesome-fallback.css');
const LOADER_SCRIPT_FILE = path.join(PUBLIC_SCRIPTS_DIR, 'font-awesome-loader.js');

// CDN URLs
const FA_VERSION = '6.4.0';
const FA_CSS_URL = `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${FA_VERSION}/css/all.min.css`;
const FONT_FILES = [
    {
        name: 'fa-brands-400.woff2',
        url: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${FA_VERSION}/webfonts/fa-brands-400.woff2`
    },
    {
        name: 'fa-regular-400.woff2',
        url: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${FA_VERSION}/webfonts/fa-regular-400.woff2`
    },
    {
        name: 'fa-solid-900.woff2',
        url: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${FA_VERSION}/webfonts/fa-solid-900.woff2`
    }
];

// Iconos utilizados realmente en el proyecto
const USED_ICONS = [
    // Solid icons
    'fa-user', 'fa-envelope', 'fa-download', 'fa-arrow-up', 'fa-briefcase',
    'fa-graduation-cap', 'fa-code', 'fa-language', 'fa-project-diagram',
    'fa-home', 'fa-arrow-down', 'fa-times', 'fa-bars', 'fa-chevron-up',
    'fa-chevron-down', 'fa-sun', 'fa-moon', 'fa-calendar-alt',
    'fa-network-wired', 'fa-server', 'fa-database', 'fa-plug',
    'fa-building', 'fa-search', 'fa-check', 'fa-trophy',
    'fa-external-link-alt', 'fa-exclamation-circle',

    // Brand icons
    'fa-github', 'fa-linkedin', 'fa-react', 'fa-js', 'fa-html5',
    'fa-css3-alt', 'fa-python', 'fa-java', 'fa-microsoft',
    'fa-windows', 'fa-docker', 'fa-aws', 'fa-git-alt', 'fa-vmware'
];

// Unicodes para iconos
const ICON_UNICODES = {
    'fa-user': '\\f007',
    'fa-envelope': '\\f0e0',
    'fa-linkedin': '\\f08c',
    'fa-github': '\\f09b',
    'fa-download': '\\f019',
    'fa-arrow-up': '\\f062',
    'fa-briefcase': '\\f0b1',
    'fa-graduation-cap': '\\f19d',
    'fa-code': '\\f121',
    'fa-language': '\\f1ab',
    'fa-project-diagram': '\\f542',
    'fa-home': '\\f015',
    'fa-arrow-down': '\\f063',
    'fa-times': '\\f00d',
    'fa-bars': '\\f0c9',
    'fa-chevron-up': '\\f077',
    'fa-chevron-down': '\\f078',
    'fa-sun': '\\f185',
    'fa-moon': '\\f186',
    'fa-calendar-alt': '\\f073',
    'fa-network-wired': '\\f6ff',
    'fa-server': '\\f233',
    'fa-database': '\\f1c0',
    'fa-plug': '\\f1e6',
    'fa-building': '\\f1ad',
    'fa-search': '\\f002',
    'fa-check': '\\f00c',
    'fa-trophy': '\\f091',
    'fa-external-link-alt': '\\f35d',
    'fa-exclamation-circle': '\\f06a',
    'fa-react': '\\f41b',
    'fa-js': '\\f3b8',
    'fa-html5': '\\f13b',
    'fa-css3-alt': '\\f38b',
    'fa-python': '\\f3e2',
    'fa-java': '\\f4e4',
    'fa-microsoft': '\\f3ca',
    'fa-windows': '\\f17a',
    'fa-docker': '\\f395',
    'fa-aws': '\\f375',
    'fa-git-alt': '\\f841',
    'fa-vmware': '\\f3c4'
};

/**
 * Descargar un archivo desde una URL a un destino especificado
 */
function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = createWriteStream(destPath);

        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${url}, status code: ${response.statusCode}`));
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(destPath).catch(() => { });
            reject(err);
        });

        file.on('error', (err) => {
            fs.unlink(destPath).catch(() => { });
            reject(err);
        });
    });
}

/**
 * Corregir rutas CSS para apuntar a archivos locales
 */
async function fixCssPaths(cssPath) {
    let cssContent = await fs.readFile(cssPath, 'utf-8');
    cssContent = cssContent.replace(
        /url\(['"]?\.\.\/webfonts\//g,
        'url(\'./fonts/'
    );
    await fs.writeFile(cssPath, cssContent, 'utf-8');
    console.log('✓ Rutas actualizadas en archivo CSS');
}

/**
 * Generar CSS minimal con solo los iconos utilizados
 */
async function generateMinimalCSS() {
    console.log('Generando CSS minimal con iconos optimizados...');

    let css = `/* 
 * Font Awesome Minimal CSS - Solo iconos utilizados 
 */
.fas,
.far,
.fab {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    line-height: 1;
}

/* Definiciones de iconos */
`;

    // Añadir cada icono
    for (const icon of USED_ICONS) {
        const unicode = ICON_UNICODES[icon] || '\\f118'; // Default a emoji sonriente
        css += `.${icon}:before {
    content: "${unicode}";
}

`;
    }

    // Añadir fallback
    css += `/* Fallback con fuentes del sistema */
@font-face {
    font-family: 'FontAwesome';
    font-display: swap;
    src: local('Arial');
    unicode-range: U+F000-F2FF;
}`;

    await fs.writeFile(OUTPUT_MIN_CSS_FILE, css);
    console.log(`✓ CSS minimal generado en: ${OUTPUT_MIN_CSS_FILE}`);
}

/**
 * Crear CSS de fallback con definiciones básicas de fuentes
 */
async function createFallbackCSS() {
    console.log('Generando CSS de fallback...');

    const fallbackCss = `
/* Font Awesome Font Face Declarations */
@font-face {
  font-family: 'Font Awesome 5 Free';
  font-style: normal;
  font-weight: 900;
  font-display: block;
  src: url('./fonts/fa-solid-900.woff2') format('woff2');
}

@font-face {
  font-family: 'Font Awesome 5 Brands';
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url('./fonts/fa-brands-400.woff2') format('woff2');
}

.fas,
.fa-solid {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
}

.fab,
.fa-brands {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
}
`;

    await fs.writeFile(OUTPUT_FALLBACK_CSS_FILE, fallbackCss, 'utf-8');
    console.log(`✓ CSS de fallback generado en: ${OUTPUT_FALLBACK_CSS_FILE}`);
}

/**
 * Generar script de carga para el cliente
 */
async function generateLoaderScript() {
    console.log('Generando script de carga para el cliente...');

    const loaderScript = `/**
 * Font Awesome Loader - Script unificado
 * Maneja la carga de Font Awesome con fallbacks robustos
 */
(function() {
    // Configuración
    const FA_VERSION = '${FA_VERSION}';
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
            style.textContent = \`
                @font-face {
                    font-family: 'Font Awesome 5 Free';
                    font-style: normal;
                    font-weight: 900;
                    font-display: swap;
                    src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${FA_VERSION}/webfonts/fa-solid-900.woff2') format('woff2');
                }
                
                @font-face {
                    font-family: 'Font Awesome 5 Brands';
                    font-style: normal;
                    font-weight: 400;
                    font-display: swap;
                    src: url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${FA_VERSION}/webfonts/fa-brands-400.woff2') format('woff2');
                }
            \`;
            document.head.appendChild(style);
        }
    });

    // Último recurso: emojis unicode como fallback
    function injectFallbackIcons() {
        const style = document.createElement('style');
        style.textContent = \`
            .fas, .fab { display: inline-block; width: 1em; height: 1em; }
            .fa-user:before { content: "👤"; }
            .fa-envelope:before { content: "✉️"; }
            .fa-linkedin:before { content: "📎"; }
            .fa-github:before { content: "🔄"; }
            .fa-download:before { content: "⬇️"; }
            .fa-code:before { content: "🧩"; }
            .fa-graduation-cap:before { content: "🎓"; }
            .fa-language:before { content: "🌐"; }
        \`;
        document.head.appendChild(style);
        document.documentElement.classList.add('fa-fallback');
    }
})();`;

    // Crear directorio si no existe
    await fs.mkdir(PUBLIC_SCRIPTS_DIR, { recursive: true });
    await fs.writeFile(LOADER_SCRIPT_FILE, loaderScript);
    console.log(`✓ Script de carga generado en: ${LOADER_SCRIPT_FILE}`);
}

/**
 * Función principal para configurar Font Awesome
 */
async function setupFontAwesome() {
    try {
        console.log('🚀 Iniciando configuración unificada de Font Awesome...');

        // Crear directorios necesarios
        await fs.mkdir(PUBLIC_STYLES_DIR, { recursive: true });
        await fs.mkdir(PUBLIC_FONTS_DIR, { recursive: true });
        await fs.mkdir(PUBLIC_SCRIPTS_DIR, { recursive: true });
        console.log('✓ Directorios creados');

        // Descargar CSS completo
        const cssPath = path.join(PUBLIC_STYLES_DIR, 'font-awesome.min.css');
        console.log(`Descargando Font Awesome CSS desde ${FA_CSS_URL}`);
        await downloadFile(FA_CSS_URL, cssPath);
        console.log('✓ CSS descargado');

        // Descargar archivos de fuentes
        for (const font of FONT_FILES) {
            const fontPath = path.join(PUBLIC_FONTS_DIR, font.name);
            console.log(`Descargando ${font.name}`);
            await downloadFile(font.url, fontPath);
            console.log(`✓ Descargado ${font.name}`);

            // Configurar permisos apropiados
            try {
                await fs.chmod(fontPath, 0o644);
            } catch (err) {
                console.warn(`⚠️ No se pudieron configurar permisos para ${font.name}: ${err.message}`);
            }
        }

        // Corregir rutas en el CSS
        await fixCssPaths(cssPath);

        // Generar archivos optimizados
        await generateMinimalCSS();
        await createFallbackCSS();
        await generateLoaderScript();

        console.log('\n✅ Configuración de Font Awesome completada con éxito!');
    } catch (error) {
        console.error('❌ Error en la configuración de Font Awesome:', error);
        process.exit(1);
    }
}

// Ejecutar función principal
setupFontAwesome();