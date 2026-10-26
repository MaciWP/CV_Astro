/**
 * Astro static config — pure-static output, i18n (en/es/fr/de), sitemap,
 * @playform/compress, and Tailwind 4 via the @tailwindcss/vite plugin.
 * @file astro.config.mjs
 */

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import compress from '@playform/compress';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { CONTENT_REVISED } from './src/utils/seo';
import { lastmodFor, readPostDates } from './src/utils/sitemap-lastmod';
import { SITE_URL } from './src/data/profile';

const POST_DATES = readPostDates(fileURLToPath(new URL('./src/content/blog', import.meta.url)));

export default defineConfig({
  // Site configuration (required for SEO)
  site: SITE_URL,

  // Pure Static Output - No adapter needed for CV/portfolio site
  // This eliminates server overhead and improves performance
  output: 'static',

  // Astro 7 changed the default to 'jsx', which drops whitespace between inline
  // elements ("Experience <span" -> "Experience<span") and can glue words together.
  // Keep the Astro 6 behaviour; @playform/compress minifies the HTML afterwards anyway.
  compressHTML: true,


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
      // Exact-path match: a substring test (includes('/cv')) would also drop
      // unrelated URLs such as a future /cv-guide page or a /blog/cv-* post slug.
      filter: (page) => new URL(page).pathname.replace(/\/$/, '') !== '/cv',
      // lastmod: Google uses it only if verifiably accurate. Posts carry their own date and
      // blog indexes their newest post's; every other page takes CONTENT_REVISED, bumped by
      // hand on real content changes (same source as ProfilePage dateModified).
      // changefreq/priority omitted on purpose — Google (and Astro docs) ignore them.
      serialize(item) {
        item.lastmod = lastmodFor(item.url, POST_DATES, CONTENT_REVISED);
        return item;
      },
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
      // sourcemap left at Vite's default (false): every script ships inline, so the
      // emitted .map files were orphans served from production.
      cssCodeSplit: true,
      // Vite 8 raised its default target to Chrome 111, so Lightning CSS folds Tailwind
      // opacity variants of theme colors (bg-brand-red/10...) into oklab(). Chrome < 111,
      // including Netlify's Lighthouse 9.6.8 (Chromium 107), drops them (a11y 98). Keep
      // Vite 7's CSS targets so they compile to #rrggbbaa. JS keeps the default target.
      cssTarget: ['chrome107', 'edge107', 'firefox104', 'safari16'],
    },
  },

  build: {
    inlineStylesheets: 'always',
    assets: '_astro',
    format: 'file',
  },

  trailingSlash: 'never',
});
