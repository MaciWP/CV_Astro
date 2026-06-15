/**
 * Astro static config — pure-static output, i18n (en/es/fr/de), sitemap,
 * @playform/compress, and Tailwind 4 via the @tailwindcss/vite plugin.
 * @file astro.config.mjs
 */

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import compress from '@playform/compress';
import tailwindcss from '@tailwindcss/vite';
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
    server: {
      fs: { strict: true },
      middlewareMode: false,
    },
    build: {
      assetsInlineLimit: 4096,
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
