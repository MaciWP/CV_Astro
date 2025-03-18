import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      // Configuración personalizada de Tailwind
      applyBaseStyles: false,
      // Opcionalmente especificar la ubicación del archivo config
      config: { path: './tailwind.config.js' },
    }),
    react(),
  ],
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
    },
  },
});