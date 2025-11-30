/**
 * Generate PNG favicon files from SVG
 *
 * This script generates the required PNG favicon files for Google Search compatibility.
 * Google Search requires minimum 48x48 PNG or ICO format.
 *
 * REQUIREMENTS:
 * - Install sharp: npm install --save-dev sharp
 *
 * RUN:
 * - node scripts/generate-favicon-pngs.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const SVG_PATH = path.join(PUBLIC_DIR, 'favicon.svg');

// Sizes to generate
const SIZES = [
  { size: 16, name: 'favicon-16.png' },
  { size: 32, name: 'favicon-32.png' },
  { size: 48, name: 'favicon-48.png' },    // Google Search minimum
  { size: 180, name: 'apple-touch-icon.png' }, // Apple touch icon
  { size: 192, name: 'favicon-192.png' },  // PWA standard
  { size: 512, name: 'favicon-512.png' }   // PWA standard
];

async function generateFavicons() {
  console.log('\n🎨 Generating PNG favicon files from SVG...\n');

  if (!fs.existsSync(SVG_PATH)) {
    console.error(`❌ ERROR: SVG file not found at ${SVG_PATH}`);
    process.exit(1);
  }

  try {
    for (const { size, name } of SIZES) {
      const outputPath = path.join(PUBLIC_DIR, name);

      await sharp(SVG_PATH)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`✅ Generated ${name} (${size}x${size})`);
    }

    console.log('\n✨ All favicon PNG files generated successfully!');
    console.log('\nGenerated files:');
    SIZES.forEach(({ name }) => console.log(`  - public/${name}`));
    console.log('\n📝 Next steps:');
    console.log('  1. Verify the generated PNG files look correct');
    console.log('  2. Build your project: npm run build');
    console.log('  3. Deploy to production');
    console.log('  4. Wait for Google to re-crawl your site (can take days/weeks)');
    console.log('\n');

  } catch (err) {
    console.error('❌ ERROR generating favicons:', err.message);
    process.exit(1);
  }
}

generateFavicons();
