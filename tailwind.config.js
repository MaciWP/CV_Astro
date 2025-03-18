/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          // Basado en el diseño compartido
          'brand-red': '#D33A2C', // Color principal rojo para botones y acentos
          'brand-dark': '#121620', // Color de fondo oscuro
          
          // Light theme
          'light-primary': '#ffffff',
          'light-secondary': '#f3f4f6',
          'light-surface': '#f8f9fa',
          'light-border': '#e5e7eb',
          'light-text': '#1f2937',
          'light-text-secondary': '#6b7280',
          
          // Dark theme
          'dark-primary': '#121620', // Extraído de la imagen
          'dark-secondary': '#1e2433', // Un poco más claro que primary
          'dark-surface': '#262f45', // Para tarjetas y elementos
          'dark-border': '#374151',
          'dark-text': '#f9fafb',
          'dark-text-secondary': '#9ca3af',
        },
        fontFamily: {
          sans: ['Arial', 'Calibri', 'Helvetica', 'sans-serif'],
        },
        boxShadow: {
          'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    plugins: [],
  };