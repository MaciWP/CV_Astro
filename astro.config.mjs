import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Configuración de i18n nativo de Astro
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "fr"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    tailwind({
      // Configuración personalizada de Tailwind
      applyBaseStyles: false,
      // Opcionalmente especificar la ubicación del archivo config
      config: { path: './tailwind.config.js' },
    }),
    react(),
  ],

  // Agregar configuración para MIME types
  server: {
    headers: {
      // Asegurar que los scripts JS se sirvan con el MIME type correcto
      "*.js": [
        {
          key: "Content-Type",
          value: "application/javascript"
        }
      ]
    }
  },

  // Optimizar para desarrollo
  vite: {
    // Opciones para mejorar el tiempo de compilación
    optimizeDeps: {
      exclude: ['@astrojs/upgrade-help'],
    },
    // Configuración de puerto personalizado
    server: {
      port: 4444, // Un puerto específico alto para evitar colisiones
      strictPort: false, // Permitir usar el siguiente puerto disponible si está ocupado
    },
    // Ajustes de rendimiento
    build: {
      sourcemap: true,
      assets: 'assets'
    },
  },
});