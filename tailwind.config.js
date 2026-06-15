/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    // Tailwind 4 (via @config): darkMode is declared in global.css as
    // `@custom-variant dark`; `safelist` (auto-detected now) and `future`
    // (hoverOnlyWhenSupported is the v4 default) removed as inert.
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
                heading: ['Outfit', 'Inter', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
            },
            colors: {
                // Brand red — the value actually rendered for backgrounds, borders
                // and /opacity tints (white text on it = 4.7:1, AA). As solid TEXT it
                // is REMAPPED to accessible reds by a load-bearing override (Layout.astro
                // + global.css: #991b1b light / #fca5a5 dark), because bright red as text
                // fails AA on the dark card (#262f45). Guarded by scripts/check-contrast.js.
                // Don't use this token for solid text without that override.
                'brand-red': '#d83333',

                // Light theme - Clean palette with gray cards
                'light-primary': '#ffffff',       // Main background WHITE
                'light-secondary': '#f3f4f6',     // Secondary background light gray
                'light-surface': '#ffffff',       // Card surface white
                'light-surface-alt': '#f7f8fa',   // Alternative surface soft gray
                'light-border': '#e5e7eb',        // Light gray border
                'light-text': '#1f2937',          // Main text near-black
                'light-text-secondary': '#5f6772', // Secondary text medium gray (AA: 5.2:1 on #f3f4f6)
                'light-card-bg': '#f3f4f6',       // Card background, similar to dates

                // Dark theme - Optimized for CV
                'dark-primary': '#121620',        // Main background dark blue
                'dark-secondary': '#1e2433',      // Secondary background dark blue
                'dark-surface': '#262f45',        // Card surface medium dark blue
                'dark-border': '#374151',         // Blue-gray border
                'dark-text': '#f9fafb',           // Main text soft white
                'dark-text-secondary': '#9ca3af', // Secondary text light gray
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

