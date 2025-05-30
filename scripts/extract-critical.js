/**
 * Extract Critical CSS Script
 * File: scripts/extract-critical-css.js
 */
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CRITICAL_CSS = `
/* Critical CSS for above-the-fold content */
:root {
  --brand-red: #D83333;
  --light-primary: #ffffff;
  --light-text: #1f2937;
  --dark-primary: #121620;
  --dark-text: #f9fafb;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  line-height: 1.5;
  background-color: var(--light-primary);
  color: var(--light-text);
}

.dark body {
  background-color: var(--dark-primary);
  color: var(--dark-text);
}

nav {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 1rem 0;
  background-color: var(--light-primary);
  border-bottom: 1px solid #e5e7eb;
}

.dark nav {
  background-color: var(--dark-primary);
  border-color: #374151;
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  max-width: 1024px;
}

.text-brand-red {
  color: var(--brand-red);
}

.bg-brand-red {
  background-color: var(--brand-red);
}

@media (max-width: 767px) {
  .container {
    padding: 0 0.5rem;
  }
}
`;

async function extractCriticalCSS() {
  try {
    const outputPath = path.join(__dirname, '../public/styles/critical.css');
    await fs.writeFile(outputPath, CRITICAL_CSS);
    console.log('✅ Critical CSS extracted successfully');
  } catch (error) {
    console.error('❌ Error extracting critical CSS:', error);
    process.exit(1);
  }
}

extractCriticalCSS();