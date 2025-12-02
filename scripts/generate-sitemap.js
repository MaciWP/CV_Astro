// path: scripts/generate-sitemap.js
/**
 * Generate sitemap.xml (extended) for all public routes.
 * Includes language routes and Switzerland pages.
 */
import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://oriolmacias.dev';
const OUTPUT_FILE = path.join(__dirname, '../public/sitemap.xml');

function isoDate(date = new Date()) {
  return date.toISOString().split('T')[0];
}

async function generateSitemap() {
  console.log('Generating sitemap.xml ...');

  const today = isoDate();

  // Explicit list based on current structure
  const pages = [
    { url: '/', priority: '1.0' },
    { url: '/es/', priority: '0.8' },
    { url: '/fr/', priority: '0.8' },
    { url: '/de/', priority: '0.8' },
    { url: '/switzerland/', priority: '0.6' },
    { url: '/switzerland/basel', priority: '0.6' },
    { url: '/switzerland/geneva', priority: '0.6' },
    { url: '/switzerland/zurich', priority: '0.6' },
  ].map((p) => ({
    ...p,
    lastmod: today,
    changefreq: 'weekly',
  }));

  const homepageImage = {
    loc: `${SITE_URL}/images/oriol_macias.jpg`,
    caption: 'Oriol Macias – Backend Developer',
    title: 'Oriol Macias Professional Photo',
  };

  const body = pages
    .map((page) => {
      const imagesXml =
        page.url === '/'
          ? `
    <image:image>
      <image:loc>${homepageImage.loc}</image:loc>
      <image:caption>${homepageImage.caption}</image:caption>
      <image:title>${homepageImage.title}</image:title>
    </image:image>`
          : '';
      return `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${imagesXml}
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
                            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
                            http://www.google.com/schemas/sitemap-image/1.1
                            http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">
${body}
</urlset>
`;

  await writeFile(OUTPUT_FILE, xml);
  console.log(`✓ Sitemap written to: ${OUTPUT_FILE}`);
}

generateSitemap().catch((err) => {
  console.error('Error generating sitemap:', err);
  process.exitCode = 1;
});
