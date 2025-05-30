// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import compress from "astro-compress";
import sitemap from "@astrojs/sitemap";
import AstroPWA from "@vite-pwa/astro";

export default defineConfig({
  site: "https://oriolmacias.dev",
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
    compress({ 
      gzip: true, 
      brotli: true,
      css: true,
      html: true,
      img: true,
      js: true,
      svg: true
    }),
    sitemap(),
    AstroPWA({
      registerType: "autoUpdate",
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\.(?:js|css|html|json)$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "assets",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|avif)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
            },
          },
        ],
      },
      manifest: {
        name: "Oriol Macias - Software Developer CV",
        short_name: "Oriol CV",
        description: "Professional CV & Portfolio for Oriol Macias.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#D83333",
        icons: [
          {
            src: "/icons/favicon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/favicon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],

  // Enable image optimization
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp'
    }
  },

  vite: {
    build: {
      assetsInlineLimit: 0,
      sourcemap: true,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name].[hash][extname]',
          chunkFileNames: 'assets/[name].[hash].js',
          entryFileNames: 'assets/[name].[hash].js'
        }
      }
    },
  },
  viewTransitions: true,
});