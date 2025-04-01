// src/components/CriticalCSS.jsx
import React from 'react';

/**
 * CriticalCSS component inlines essential CSS directly in the head
 * to eliminate render-blocking CSS resources
 */
const CriticalCSS = () => {
    // This CSS contains only the styles needed for above-the-fold content
    // The rest of the styles will be loaded asynchronously
    const criticalCSS = `
/* Critical CSS - Inlined to eliminate render-blocking resources */

/* Base styles */
:root {
  --brand-red: #D83333;
  --accessible-brand-red: #C42B2B;
  --light-primary: #ffffff;
  --light-secondary: #f3f4f6;
  --light-surface: #ffffff;
  --light-text: #1f2937;
  --light-text-secondary: #6b7280;
  --dark-primary: #121620;
  --dark-secondary: #1e2433;
  --dark-surface: #262f45;
  --dark-text: #f9fafb;
  --dark-text-secondary: #9ca3af;
}

/* Essential layout */
body {
  margin: 0;
  min-height: 100vh;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.light, html:not(.dark) {
  background-color: var(--light-primary);
  color: var(--light-text);
}

.dark {
  background-color: var(--dark-primary);
  color: var(--dark-text);
}

/* Font faces for icons */
@font-face {
  font-family: 'Font Awesome 5 Free';
  font-style: normal;
  font-weight: 900;
  font-display: swap;
  src: url('/styles/fonts/fa-solid-900.woff2') format('woff2');
}

@font-face {
  font-family: 'Font Awesome 5 Brands';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/styles/fonts/fa-brands-400.woff2') format('woff2');
}

/* Critical icon styles */
.fas, .fa-solid {
  font-family: 'Font Awesome 5 Free';
  font-weight: 900;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
}

.fab, .fa-brands {
  font-family: 'Font Awesome 5 Brands';
  font-weight: 400;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: inline-block;
  font-style: normal;
  font-variant: normal;
  text-rendering: auto;
  line-height: 1;
}

/* Navbar critical styles */
nav {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 1rem 0;
  width: 100%;
  background-color: var(--light-primary);
  border-bottom: 1px solid var(--light-secondary);
  transition: background-color 0.2s, border-color 0.2s;
}

.dark nav {
  background-color: var(--dark-primary);
  border-color: var(--dark-secondary);
}

/* Container critical styles */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

/* Critical flexbox utilities */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-4 {
  gap: 1rem;
}

/* Critical spacing */
.p-4 {
  padding: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

/* Critical brand colors */
.text-brand-red {
  color: var(--brand-red);
}

.bg-brand-red {
  background-color: var(--brand-red);
}

/* Skip link for accessibility */
.skip-to-content {
  position: absolute;
  left: -9999px;
  z-index: 9999;
  padding: 0.5rem 1rem;
  background-color: var(--brand-red);
  color: white;
  transform: translateX(-100%);
}

.skip-to-content:focus {
  left: 1rem;
  transform: translateX(0);
}

/* Loading transitions */
.opacity-0 {
  opacity: 0;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.duration-300 {
  transition-duration: 300ms;
}

/* Responsive - hide on mobile / show on desktop */
.hidden {
  display: none;
}

@media (min-width: 768px) {
  .md\\:block {
    display: block;
  }
  
  .md\\:hidden {
    display: none;
  }
}

/* Prevent flash of unstyled content */
.invisible {
  visibility: hidden;
}

/* Loading placeholder animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
`;

    return <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />;
};

export default CriticalCSS;