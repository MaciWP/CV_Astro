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
                // Color principal para acentos (WCAG AA compliant - 4.5:1 ratio)
                'brand-red': '#C41E1E',

                // Light theme - Nueva paleta más clara con recuadros grises
                'light-primary': '#ffffff',       // Fondo principal BLANCO
                'light-secondary': '#f3f4f6',     // Fondo secundario gris muy claro
                'light-surface': '#ffffff',       // Superficie de tarjetas en blanco
                'light-surface-alt': '#f7f8fa',   // Superficie alternativa gris muy suave
                'light-border': '#e5e7eb',        // Borde gris claro
                'light-text': '#1f2937',          // Texto principal casi negro
                'light-text-secondary': '#6b7280', // Texto secundario gris medio
                'light-card-bg': '#f3f4f6',       // Color de fondo para cards, similar a las fechas

                // Dark theme - Optimizado para el CV
                'dark-primary': '#121620',        // Fondo principal azul muy oscuro
                'dark-secondary': '#1e2433',      // Fondo secundario azul oscuro
                'dark-surface': '#262f45',        // Superficie de tarjetas azul medio oscuro
                'dark-border': '#374151',         // Borde azul grisáceo
                'dark-text': '#f9fafb',           // Texto principal blanco suave
                'dark-text-secondary': '#9ca3af', // Texto secundario gris claro
            },
            transitionDuration: {
                '75': '75ms', // Aseguramos que esté disponible
            },
            boxShadow: {
                'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
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
                "pulse-subtle": {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.8 },
                },
                "fill-bar": {
                    '0%': { width: '0%' },
                    '100%': { width: '100%' },
                },
                "slide-in-right": {
                    '0%': { transform: 'translateX(20px)', opacity: 0 },
                    '100%': { transform: 'translateX(0)', opacity: 1 },
                },
                "appear": {
                    '0%': { opacity: 0, transform: 'scale(0.98)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                }
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
                "fill-bar": "fill-bar 1.5s ease-out forwards",
                "slide-in-right": "slide-in-right 0.3s ease-out forwards",
                "appear": "appear 0.4s ease-out forwards",
            },
            transitionProperty: {
                'width': 'width',
                'spacing': 'margin, padding',
            }
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