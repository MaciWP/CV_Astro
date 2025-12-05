/**
 * Extract CSP Hashes from all HTML files
 * Run: node scripts/extract-csp-hashes.js
 */
import fs from 'fs';
import crypto from 'crypto';

const files = [
  'index.html', 'es.html', 'fr.html', 'de.html',
  'spain.html', 'switzerland.html',
  'spain/barcelona.html', 'spain/madrid.html',
  'switzerland/basel.html', 'switzerland/geneva.html',
  'switzerland/lausanne.html', 'switzerland/zurich.html'
];
const allHashes = new Set();
const hashDetails = {};

files.forEach(file => {
  try {
    const html = fs.readFileSync('dist/' + file, 'utf8');
    const scriptRegex = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
    let match;
    let count = 0;

    console.log('\n' + file + ':');
    while ((match = scriptRegex.exec(html)) !== null) {
      const attrs = match[1];
      const content = match[2].trim();
      if (attrs.includes('application/ld+json')) continue;
      if (attrs.includes('src=')) continue;
      if (!content) continue;
      count++;

      const hash = 'sha256-' + crypto.createHash('sha256').update(content).digest('base64');
      allHashes.add(hash);

      // Track which script this hash is for
      const preview = content.substring(0, 50).replace(/\n/g, ' ');
      if (!hashDetails[hash]) {
        hashDetails[hash] = { files: [], preview, count };
      }
      hashDetails[hash].files.push(file);

      console.log('  Script ' + count + ': ' + hash.substring(0, 40) + '...');
    }
  } catch(e) {
    console.log('Error reading ' + file + ': ' + e.message);
  }
});

console.log('\n\n=== ALL UNIQUE HASHES (' + allHashes.size + ') ===\n');
const sortedHashes = Array.from(allHashes);
sortedHashes.forEach(h => {
  const detail = hashDetails[h];
  console.log("'" + h + "'");
  console.log('  Files: ' + detail.files.join(', '));
  console.log('  Preview: ' + detail.preview + '...\n');
});

console.log('\n=== CSP HEADER FORMAT ===\n');
console.log("script-src 'self' " + sortedHashes.map(h => "'" + h + "'").join(' ') + ';');
