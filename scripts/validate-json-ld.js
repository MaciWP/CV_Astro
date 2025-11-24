
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Validates JSON-LD in built HTML files
 */
async function validateJsonLd() {
    console.log('🔍 Starting JSON-LD validation...');

    const distDir = path.resolve(__dirname, '../dist');

    // Check if dist directory exists
    if (!fs.existsSync(distDir)) {
        console.error('❌ dist directory not found. Please run "npm run build" first.');
        process.exit(1);
    }

    // Find all HTML files
    const htmlFiles = glob.sync(`${distDir}/**/*.html`);
    console.log(`found ${htmlFiles.length} HTML files to check.`);

    let errorCount = 0;

    for (const file of htmlFiles) {
        const content = fs.readFileSync(file, 'utf-8');
        const relativePath = path.relative(distDir, file);

        // Regex to find JSON-LD scripts
        const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
        let match;

        while ((match = jsonLdRegex.exec(content)) !== null) {
            const jsonContent = match[1];

            try {
                JSON.parse(jsonContent);
                // console.log(`✅ Valid JSON-LD in ${relativePath}`);
            } catch (error) {
                console.error(`❌ Invalid JSON-LD in ${relativePath}:`);
                console.error(error.message);

                // Show context around the error
                const errorIndex = parseInt(error.message.match(/position (\d+)/)?.[1] || 0);
                const start = Math.max(0, errorIndex - 50);
                const end = Math.min(jsonContent.length, errorIndex + 50);
                console.error('Context:', jsonContent.substring(start, end));

                errorCount++;
            }
        }
    }

    if (errorCount === 0) {
        console.log('✅ All JSON-LD data is valid!');
        process.exit(0);
    } else {
        console.error(`❌ Found ${errorCount} JSON-LD errors.`);
        process.exit(1);
    }
}

validateJsonLd();
