/**
 * Script para generar sitemap.xml
 * Versión corregida para ES Modules
 */

// Importaciones ES Modules
import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// En ES Modules no existe __dirname, así que lo creamos:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración básica
const SITE_URL = 'https://oriolmacias.dev';
const OUTPUT_FILE = path.join(__dirname, '../public/sitemap.xml');

// Generar sitemap.xml
async function generateSitemap() {
    console.log('Generando sitemap.xml...');

    // Obtener la fecha actual para el lastmod
    const today = new Date().toISOString().split('T')[0];

    // Páginas para incluir en el sitemap
    const pages = [
        '', // Página principal
        '/es/', // Versión en español
        '/fr/' // Versión en francés
    ];

    // Generar el contenido del sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${SITE_URL}${page}</loc>
    <lastmod>${today}</lastmod>
  </url>`).join('\n')}
</urlset>`;

    // Escribir el archivo
    try {
        await writeFile(OUTPUT_FILE, sitemap);
        console.log(`✓ Sitemap generado en: ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('Error al generar el sitemap:', error);
    }
}

// Ejecutar la función principal
generateSitemap();