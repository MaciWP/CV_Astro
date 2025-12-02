/**
 * Enhanced Development Server Script
 * 
 * This script ensures that all required assets are properly
 * set up before starting the development server.
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Font paths to check
const FONT_PATHS = [
    '../public/styles/fonts/fa-solid-900.woff2',
    '../public/styles/fonts/fa-brands-400.woff2',
    '../public/styles/fonts/fa-regular-400.woff2'
];

/**
 * Check if Font Awesome files are properly set up
 */
async function checkFontAwesome() {
    try {
        let allFilesExist = true;

        // Check each font file
        for (const fontPath of FONT_PATHS) {
            const fullPath = path.join(__dirname, fontPath);
            try {
                await fs.access(fullPath);
                console.log(`✓ Font file exists: ${path.basename(fontPath)}`);
            } catch (error) {
                console.log(`× Missing font file: ${path.basename(fontPath)}`);
                allFilesExist = false;
            }
        }

        // Warn if any files are missing (fonts should already be committed)
        if (!allFilesExist) {
            console.log('\n⚠️ Some Font Awesome font files are missing from public/styles/fonts/');
            console.log('Please ensure the .woff2 files are present in the repository.');
        }

        return true;
    } catch (error) {
        console.error('Error checking Font Awesome files:', error);
        return false;
    }
}

/**
 * Start the development server
 */
async function startDevServer() {
    try {
        // Check Font Awesome fonts are present
        await checkFontAwesome();

        // Start the development server
        // NOTE: CSS files are imported directly by Astro from src/styles/
        console.log('\n🚀 Starting development server...');
        execSync('astro dev', { stdio: 'inherit' });
    } catch (error) {
        console.error('Error starting development server:', error);
        process.exit(1);
    }
}

// Run the main function
startDevServer();