/**
 * Astro static config — pure-static output, i18n (en/es/fr/de), sitemap,
 * @playform/compress, and Tailwind 4 via the @tailwindcss/vite plugin.
 * @file astro.config.mjs
 */

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import compress from '@playform/compress';
import tailwindcss from '@tailwindcss/vite';
import { CONTENT_REVISED } from './src/utils/seo';
// React removed - all components are now pure Astro + vanilla JS
// Netlify adapter removed - pure static site doesn't need it
// Tailwind 4: @astrojs/tailwind dropped (no Astro 6 support) -> @tailwindcss/vite plugin
// astro-compress deprecated -> @playform/compress (maintained successor)

export default defineConfig({
  // Site configuration (required for SEO)
  site: 'https://oriolmacias.dev',

  // Pure Static Output - No adapter needed for CV/portfolio site
  // This eliminates server overhead and improves performance
  output: 'static',


  // i18n configuration
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "fr", "de"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  // Integrations (Tailwind is now a Vite plugin, see vite.plugins below)
  integrations: [
    sitemap({
      // /cv is the print source for the PDF (noindex) — keep it out of the sitemap.
      filter: (page) => !page.includes('/cv'),
      // lastmod: Google uses it only if verifiably accurate. CONTENT_REVISED is bumped by
      // hand on real content changes (same source as ProfilePage dateModified), so it
      // qualifies. changefreq/priority omitted on purpose — Google (and Astro docs) ignore them.
      lastmod: new Date(CONTENT_REVISED),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en', es: 'es', fr: 'fr', de: 'de',
        },
      },
    }),
    // @playform/compress: HTML options nest under 'html-minifier-terser'
    // (differs from astro-compress, which took the options flat). Compress last.
    compress({
      CSS: true,
      HTML: { 'html-minifier-terser': { removeAttributeQuotes: false } },
      Image: false, // Sharp handles images
      JavaScript: true,
      SVG: true,
    }),
  ],

  server: {
    port: 4321,
    host: '0.0.0.0'
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      // (assetsInlineLimit 4096, server.fs.strict, server.middlewareMode removed —
      //  all were Vite defaults, so explicit copies added no behavior.)
      sourcemap: true,
      cssCodeSplit: true,
    },
  },

  build: {
    inlineStylesheets: 'always',
    assets: '_astro',
    format: 'file',
  },

  trailingSlash: 'never',
});
