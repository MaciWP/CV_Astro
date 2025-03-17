/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    darkMode: 'class', // Enable dark mode with class strategy
    theme: {
      extend: {
        colors: {
          // Light theme
          'light-primary': '#ffffff',
          'light-secondary': '#f3f4f6',
          'light-text': '#1f2937',
          'light-accent': '#3b82f6',
          
          // Dark theme
          'dark-primary': '#1f2937',
          'dark-secondary': '#111827',
          'dark-text': '#f9fafb',
          'dark-accent': '#60a5fa',
          
          // High contrast theme
          'hc-primary': '#ffffff',
          'hc-secondary': '#000000',
          'hc-text': '#000000',
          'hc-accent': '#0000ff',
        },
        fontFamily: {
          sans: ['Arial', 'Calibri', 'Helvetica', 'sans-serif'],
        },
      },
    },
    plugins: [],
  };