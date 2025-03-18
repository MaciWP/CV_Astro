/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        },
        colors: {
          // Basado en el diseño de referencia
          'brand-red': '#D83333', // Color principal rojo para botones y acentos
          
          // Light theme
          'light-primary': '#ffffff',
          'light-secondary': '#f3f4f6',
          'light-surface': '#f8f9fa',
          'light-border': '#e5e7eb',
          'light-text': '#1f2937',
          'light-text-secondary': '#6b7280',
          
          // Dark theme
          'dark-primary': '#121620',
          'dark-secondary': '#1e2433',
          'dark-surface': '#262f45',
          'dark-border': '#374151',
          'dark-text': '#f9fafb',
          'dark-text-secondary': '#9ca3af',
        },
        boxShadow: {
          'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          'card-dark': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
          'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        borderRadius: {
          'none': '0',
        },
        keyframes: {
          "accordion-down": {
            from: { height: 0 },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: 0 },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },
      },
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
    },
    plugins: [],
  };