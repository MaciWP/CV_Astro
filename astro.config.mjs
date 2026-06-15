/**
 * Astro Configuration - 
 * @file astro.config.mjs
 * @description Configuración arreglada manteniendo tu setup + SEO Suiza/España
 */

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import compress from '@playform/compress';
import tailwindcss from '@tailwindcss/vite';
// React removed - all components are now pure Astro + vanilla JS
// Netlify adapter removed - pure static site doesn't need it
// Tailwind 4: @astrojs/tailwind dropped (no Astro 6 support) -> @tailwindcss/vite plugin
// astro-compress deprecated -> @playform/compress (maintained successor)

// Check required environment variables
if (process.env.NODE_ENV === 'development') {
  const requiredVars = ['SITE_URL'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.warn('⚠️  Missing environment variables:', missingVars.join(', '));
    console.warn('   Create .env file with required variables');
  }

  if (process.env.SWISS_SEO_ENABLED === 'true') {
    console.log('✅ Swiss SEO optimization enabled');
  } else {
    console.log('ℹ️  Swiss SEO optimization disabled');
  }
}

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
    define: {
      __SWISS_SEO_ENABLED__: process.env.SWISS_SEO_ENABLED === 'true',
      __SPANISH_SEO_ENABLED__: true,
      __SITE_URL__: JSON.stringify(process.env.SITE_URL || 'https://oriolmacias.dev')
    },
  },

  build: {
    inlineStylesheets: 'always',
    assets: '_astro',
    format: 'file',
  },

  trailingSlash: 'never',
});
