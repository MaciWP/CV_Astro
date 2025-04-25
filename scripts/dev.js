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

        // If any files are missing, run the setup script
        if (!allFilesExist) {
            console.log('\n⚠️ Some Font Awesome files are missing. Running setup script...');
            execSync('node scripts/font-awesome-setup.js', { stdio: 'inherit' });
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
        // Check and setup Font Awesome if needed
        await checkFontAwesome();

        // Copy styles to public directory (for dev server)
        console.log('\n🔄 Copying styles to public directory...');
        execSync('node scripts/styles.js', { stdio: 'inherit' });

        // Start the development server
        console.log('\n🚀 Starting development server...');
        execSync('astro dev', { stdio: 'inherit' });
    } catch (error) {
        console.error('Error starting development server:', error);
        process.exit(1);
    }
}

// Run the main function
startDevServer();