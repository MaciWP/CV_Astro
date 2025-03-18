/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          'brand-red': '#D33A2C', // Color principal rojo
          
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
        fontFamily: {
          sans: ['Arial', 'Calibri', 'Helvetica', 'sans-serif'],
        },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-out',
          'slide-up': 'slideUp 0.5s ease-out',
          'scale-in': 'scaleIn 0.3s ease-out',
          'bounce-in': 'bounceIn 0.6s ease-out',
          'spin-slow': 'spin 3s linear infinite',
        },
        keyframes: {
          fadeIn: {
            '0%': { opacity: '0' },
            '100%': { opacity: '1' },
          },
          slideUp: {
            '0%': { transform: 'translateY(20px)', opacity: '0' },
            '100%': { transform: 'translateY(0)', opacity: '1' },
          },
          scaleIn: {
            '0%': { transform: 'scale(0.9)', opacity: '0' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          },
          bounceIn: {
            '0%': { transform: 'scale(0.8)', opacity: '0' },
            '70%': { transform: 'scale(1.05)', opacity: '1' },
            '100%': { transform: 'scale(1)', opacity: '1' },
          },
        },
      },
    },
    plugins: [],
  };