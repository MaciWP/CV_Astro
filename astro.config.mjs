/**
 * Astro Configuration - ARREGLADO y compatible con tu setup actual
 * @file astro.config.mjs
 * @description Configuración arreglada manteniendo tu setup + SEO Suiza/España
 */

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import netlify from '@astrojs/netlify';

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
  // Site configuration (NECESARIO para SEO)
  site: 'https://oriolmacias.dev',

  // Hybrid Rendering (Static + Server Islands)
  // In Astro v5, 'static' output with an adapter enables hybrid features automatically.
  // Adapter conditional: Only use Netlify adapter in production/Netlify environment
  adapter: process.env.NETLIFY ? netlify() : undefined,

  // i18n configuration ARREGLADA
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "fr", "de"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  // Integrations
  integrations: [
    tailwind({
      applyBaseStyles: false,
      config: { path: './tailwind.config.js' },
    }),
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en', es: 'es', fr: 'fr', de: 'de',
        },
      },
    }),
    compress({
      CSS: true,
      HTML: { removeAttributeQuotes: false },
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
    server: {
      fs: { strict: true },
      middlewareMode: false,
    },
    build: {
      assetsInlineLimit: 4096,
      sourcemap: true,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-i18n': ['i18next', 'react-i18next'],
          },
        },
      },
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