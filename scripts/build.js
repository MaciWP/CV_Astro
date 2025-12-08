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

/**
 * Main function that executes the entire build process
 */
async function build() {
    console.log('🏗️ Starting build process...');

    const startTime = Date.now();

    try {
        // Execute tasks in sequence
        await generateSitemap();
        await buildAstro();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✨ Build completed in ${duration}s`);
    } catch (error) {
        console.error('❌ Error in build process:', error);
        process.exit(1);
    }
}

// Execute main function
build();
