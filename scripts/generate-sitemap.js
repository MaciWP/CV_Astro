// scripts/generate-sitemap.js
/**
 * Script mejorado para generar sitemap.xml con más metadatos
 * Mejora la indexación en buscadores
 */
import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// En ES Modules no existe __dirname, así que lo creamos:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración mejorada
const SITE_URL = 'https://oriolmacias.dev';
const OUTPUT_FILE = path.join(__dirname, '../public/sitemap.xml');

// Generar sitemap.xml con metadatos enriquecidos
async function generateSitemap() {
    console.log('Generando sitemap.xml optimizado para SEO...');

    // Obtener la fecha actual para el lastmod
    const today = new Date().toISOString().split('T')[0];

    // Páginas para incluir en el sitemap con metadatos completos
    const pages = [
        {
            url: '', // Página principal
            lastmod: today,
            changefreq: 'weekly',
            priority: '1.0',
            images: [
                {
                    loc: `${SITE_URL}/images/oriol_macias.jpg`,
                    caption: 'Oriol Macias - Software Developer',
                    title: 'Oriol Macias Professional Photo'
                }
            ]
        },
        {
            url: '/es/',
            lastmod: today,
            changefreq: 'weekly',
            priority: '0.8'
        },
        {
            url: '/fr/',
            lastmod: today,
            changefreq: 'weekly',
            priority: '0.8'
        }
    ];

    // Generar el contenido del sitemap mejorado con soporte para imágenes
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
                            http://www.google.com/schemas/sitemap-image/1.1
                            http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">
${pages.map(page => {
        const images = page.images ? page.images.map(img => `
    <image:image>
      <image:loc>${img.loc}</image:loc>
      <image:caption>${img.caption}</image:caption>
      <image:title>${img.title}</image:title>
    </image:image>`).join('') : '';

        return `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${images}
  </url>`;
    }).join('\n')}
</urlset>`;

    // Escribir el archivo
    try {
        await writeFile(OUTPUT_FILE, sitemap);
        console.log(`✓ Sitemap mejorado generado en: ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('Error al generar el sitemap:', error);
    }
}

// Ejecutar la función principal
generateSitemap();