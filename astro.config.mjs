// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import compress from "astro-compress";

export default defineConfig({
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es", "fr"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  integrations: [
    tailwind({
      applyBaseStyles: false,
      config: { path: "./tailwind.config.js" },
    }),
    react(),
    compress({ gzip: true, brotli: true }),
  ],

  // Configuración explícita de MIME types para corregir errores
  server: {
    headers: {
      // Forzar tipos MIME correctos para archivos críticos
      "*.js": [
        {
          key: "Content-Type",
          value: "application/javascript; charset=utf-8",
        },
      ],
      "*.css": [
        {
          key: "Content-Type",
          value: "text/css; charset=utf-8",
        },
      ],
    },
  },

  vite: {
    // Forzar MIME types correctos durante el desarrollo
    server: {
      fs: {
        strict: true,
      },
      middlewareMode: false,
    },
    // Configuración de construcción para garantizar MIME types
    build: {
      assetsInlineLimit: 0, // Evitar inline de assets pequeños
      sourcemap: true,
    },
  },
});
