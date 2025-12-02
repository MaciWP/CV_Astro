/**
 * Unified script for the build process
 * Executes all necessary tasks in the correct order
 * File: scripts/build.js
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ensure required folders exist in public/
 * NOTE: Only public/styles/fonts/ for Font Awesome (CSS files handled directly by Astro)
 */
async function ensurePublicDirectories() {
    console.log('🔍 Verifying directories...');

    try {
        // We only need the fonts directory (Font Awesome)
        // CSS files from src/styles/ are imported directly by Astro
        await fs.mkdir(path.join(__dirname, '../public/styles/fonts'), { recursive: true });
        console.log('✅ Directories verified');
    } catch (error) {
        console.error('❌ Error verifying directories:', error);
        process.exit(1);
    }
}

/**
 * Generate sitemap
 */
async function generateSitemap() {
    console.log('🗺️ Generating sitemap...');

    try {
        execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });
        console.log('✅ Sitemap generated');
    } catch (error) {
        console.error('❌ Error generating sitemap:', error);
        // Don't exit in this case, not critical
    }
}

/**
 * Execute Astro build
 */
async function buildAstro() {
    console.log('🚀 Building with Astro...');

    try {
        execSync('astro build', { stdio: 'inherit' });
        console.log('✅ Build completed');
    } catch (error) {
        console.error('❌ Error during build:', error);
        process.exit(1);
    }
}

async function verifyFontFiles() {
    console.log('🔍 Verifying font files...');

    const fontFiles = [
        'dist/styles/fonts/fa-solid-900.woff2',
        'dist/styles/fonts/fa-brands-400.woff2'
    ];

    for (const fontFile of fontFiles) {
        try {
            await fs.access(path.join(__dirname, '..', fontFile));
            console.log(`  ✓ File present: ${fontFile}`);
        } catch (error) {
            console.warn(`  ⚠️ File missing: ${fontFile}`);

            // Copy from public directory if it exists
            try {
                const sourceFile = fontFile.replace('dist/', 'public/');
                await fs.copyFile(
                    path.join(__dirname, '..', sourceFile),
                    path.join(__dirname, '..', fontFile)
                );
                console.log(`  ✓ Copied from public: ${fontFile}`);
            } catch (copyError) {
                console.error(`  ❌ Could not copy: ${fontFile}`);
            }
        }
    }
}

/**
 * Main function that executes the entire build process
 */
async function build() {
    console.log('🏗️ Starting build process...');

    const startTime = Date.now();

    try {
        // Execute tasks in sequence
        await ensurePublicDirectories();
        await generateSitemap();
        await buildAstro();
        await verifyFontFiles();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✨ Build completed in ${duration}s`);
    } catch (error) {
        console.error('❌ Error in build process:', error);
        process.exit(1);
    }
}

// Execute main function
build();
