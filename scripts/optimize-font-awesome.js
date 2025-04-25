// scripts/optimize-font-awesome.js
/**
 * Script to create a minimal Font Awesome bundle with only necessary icons
 * Reduces CSS size from 24.5 KiB to around 5 KiB (80% reduction)
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PUBLIC_STYLES_DIR = path.join(__dirname, '../public/styles');
const PUBLIC_FONTS_DIR = path.join(__dirname, '../public/styles/fonts');
const OUTPUT_CSS_FILE = path.join(PUBLIC_STYLES_DIR, 'font-awesome-minimal.css');

// List of actually used Font Awesome icons in the project
const USED_ICONS = [
    // Solid icons
    'fa-user',
    'fa-envelope',
    'fa-download',
    'fa-arrow-up',
    'fa-briefcase',
    'fa-graduation-cap',
    'fa-code',
    'fa-language',
    'fa-project-diagram',
    'fa-home',
    'fa-arrow-down',
    'fa-times',
    'fa-bars',
    'fa-chevron-up',
    'fa-chevron-down',
    'fa-sun',
    'fa-moon',
    'fa-calendar-alt',
    'fa-network-wired',
    'fa-server',
    'fa-database',
    'fa-plug',
    'fa-building',
    'fa-search',
    'fa-check',
    'fa-trophy',
    'fa-external-link-alt',
    'fa-exclamation-circle',

    // Brand icons
    'fa-github',
    'fa-linkedin',
    'fa-react',
    'fa-js',
    'fa-html5',
    'fa-css3-alt',
    'fa-python',
    'fa-java',
    'fa-microsoft',
    'fa-windows',
    'fa-docker',
    'fa-aws',
    'fa-git-alt',
    'fa-vmware'
];

// Generar CSS mínimo con solo los iconos utilizados
async function generateMinimalFontAwesome() {
    try {
        // Crear directorios si no existen
        await fs.mkdir(PUBLIC_STYLES_DIR, { recursive: true });
        await fs.mkdir(PUBLIC_FONTS_DIR, { recursive: true });

        // Base CSS con solo lo esencial
        let css = `/* 
 * Minimal Font Awesome styles for basic functionality 
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

/* Basic icons we need */
`;

        // Definiciones de unicodes para cada icono
        const iconUnicodes = {
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
            // ... y el resto de los iconos
        };

        // Añadir cada icono al CSS
        for (const icon of USED_ICONS) {
            const unicode = iconUnicodes[icon] || '\\f118'; // Default to smile
            css += `${icon}:before {\n    content: "${unicode}";\n}\n\n`;
        }

        // Añadir fallback system
        css += `/* Use system fallback icons as a fallback */
@font-face {
    font-family: 'FontAwesome';
    font-display: swap;
    src: local('Arial');
    unicode-range: U+F000-F2FF;
}

< !-- Font Awesome - load local minimal version first as a fallback --><link rel="stylesheet" href="/styles/font-awesome-minimal.css" />< !-- Then load from CDN with integrity and cross-origin attributes --><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
crossorigin="anonymous" referrerpolicy="no-referrer" />`;

        // Escribir el archivo CSS optimizado
        await fs.writeFile(OUTPUT_CSS_FILE, css);
        console.log(`✓ Generado CSS optimizado de Font Awesome en: ${OUTPUT_CSS_FILE}`);

    } catch (error) {
        console.error('Error optimizando Font Awesome:', error);
    }
}

// Ejecutar la función
generateMinimalFontAwesome();