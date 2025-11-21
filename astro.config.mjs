/**
 * Astro Configuration - ARREGLADO y compatible con tu setup actual
 * @file astro.config.mjs
 * @description Configuración arreglada manteniendo tu setup + SEO Suiza/España
 */

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// Configuración compatible con tu setup actual
export default defineConfig({
  // Site configuration (NECESARIO para SEO)
  site: 'https://oriolmacias.dev',
  
  // i18n configuration ARREGLADA
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "fr", "de"],  // Added German for /de/ pages
    routing: {
      prefixDefaultLocale: false,
      // Remover redirectToDefaultLocale que causaba error
    },
  },

  // Integrations (MANTENER tu configuración)
  integrations: [
    tailwind({
      applyBaseStyles: false,
      config: { path: './tailwind.config.js' },
    }),
    react(),
  ],

  // ARREGLAR - Server config simplificada
  server: {
    port: 4321,
    host: '0.0.0.0'
  },

  // ARREGLAR - Vite config simplificada
  vite: {
    server: {
      fs: {
        strict: true,
      },
      middlewareMode: false,
    },
    build: {
      assetsInlineLimit: 4096,
      sourcemap: true,
      cssCodeSplit: true,
    },
    // Variables de entorno para SEO
    define: {
      __SWISS_SEO_ENABLED__: process.env.SWISS_SEO_ENABLED === 'true',
      __SPANISH_SEO_ENABLED__: true,
      __SITE_URL__: JSON.stringify(process.env.SITE_URL || 'https://oriolmacias.dev')
    },
  },

  // Build configuration ARREGLADA
  build: {
    inlineStylesheets: 'always',  // String, no object
    // assets: '_astro'  // Remover si causaba error
  },

  // Output configuration ARREGLADA - solo static por ahora
  output: 'static',

  // Remover configuraciones experimentales problemáticas
  // experimental: {} // Comentar por ahora

  // Trailing slash para URLs limpias
  trailingSlash: 'never',
});

// Debugging en desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log('🇨🇭 Swiss SEO Configuration Loaded');
  console.log('🇪🇸 Spanish Market Support Enabled');
  
  // Check required environment variables
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