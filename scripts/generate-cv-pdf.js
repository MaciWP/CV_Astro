/**
 * Generate public/OriolMacias_CV.pdf from the /cv page (single source of truth =
 * src/data/*). Runs LOCALLY only (not in the Netlify build) using the local Chrome
 * — no chromium npm dependency in production. The resulting PDF is committed.
 *
 * Usage: pnpm run cv:pdf   (override Chrome with CHROME_PATH=/path/to/chrome)
 * File: scripts/generate-cv-pdf.js
 */
import { execSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distCv = path.join(root, 'dist', 'cv.html');
const outPdf = path.join(root, 'public', 'OriolMacias_CV.pdf');

const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

if (!existsSync(CHROME)) {
  console.error(
    `\n❌ Chrome not found at:\n   ${CHROME}\n` +
      `   Set CHROME_PATH to your Chrome/Chromium binary and retry:\n` +
      `   CHROME_PATH="/path/to/chrome" pnpm run cv:pdf\n`,
  );
  process.exit(1);
}

console.log('🏗️  Building site (astro build) to refresh dist/cv.html...');
execSync('astro build', { cwd: root, stdio: 'inherit' });

if (!existsSync(distCv)) {
  console.error(`\n❌ ${distCv} not found after build. Is src/pages/cv.astro present?\n`);
  process.exit(1);
}

console.log('🖨️  Printing /cv to PDF via headless Chrome...');
const res = spawnSync(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=4000',
    `--print-to-pdf=${outPdf}`,
    `file://${distCv}`,
  ],
  { stdio: 'inherit' },
);

if (res.status !== 0 || !existsSync(outPdf)) {
  console.error('\n❌ PDF generation failed.\n');
  process.exit(1);
}

console.log(`\n✅ PDF generated: ${outPdf}`);
console.log('   Review it, then commit public/OriolMacias_CV.pdf.\n');
