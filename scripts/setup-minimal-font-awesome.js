/**
 * Minimal Font Awesome Setup Script
 * 
 * This script downloads just the essential Font Awesome files for the
 * website, without changing any of the existing components.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { createWriteStream } from 'fs';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const PUBLIC_STYLES_DIR = path.join(__dirname, '../public/styles');
const PUBLIC_FONTS_DIR = path.join(__dirname, '../public/styles/fonts');

// Font Awesome CDN URLs - only the essential files
const FA_CSS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
const FONT_FILES = [
    {
        name: 'fa-brands-400.woff2',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2'
    },
    {
        name: 'fa-solid-900.woff2',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2'
    }
];

/**
 * Download a file from a URL to a specified destination
 */
function downloadFile(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = createWriteStream(destPath);

        https.get(url, (response) => {
            // Check if the request was successful
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download: ${url}, status code: ${response.statusCode}`));
                return;
            }

            // Pipe the response to the file
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            // Clean up the file on error
            fs.unlink(destPath).catch(() => { });
            reject(err);
        });

        file.on('error', (err) => {
            fs.unlink(destPath).catch(() => { });
            reject(err);
        });
    });
}

/**
 * Update CSS file paths to point to local files
 */
async function fixCssPaths(cssPath) {
    try {
        let cssContent = await fs.readFile(cssPath, 'utf-8');

        // Update font URLs to point to local files
        cssContent = cssContent.replace(
            /url\(['"]?\.\.\/webfonts\//g,
            'url(\'./fonts/'
        );

        await fs.writeFile(cssPath, cssContent, 'utf-8');
        console.log('✓ Updated font paths in CSS file');
        return true;
    } catch (error) {
        console.error('Error updating CSS file:', error);
        return false;
    }
}

/**
 * Main function to setup Font Awesome
 */
async function setupFontAwesome() {
    try {
        // Create directories
        await fs.mkdir(PUBLIC_STYLES_DIR, { recursive: true });
        await fs.mkdir(PUBLIC_FONTS_DIR, { recursive: true });

        console.log('✓ Created directories for Font Awesome');

        // Download CSS file
        const cssPath = path.join(PUBLIC_STYLES_DIR, 'font-awesome.min.css');
        console.log(`Downloading Font Awesome CSS from ${FA_CSS_URL}`);
        await downloadFile(FA_CSS_URL, cssPath);
        console.log('✓ Downloaded Font Awesome CSS');

        // Download font files
        for (const font of FONT_FILES) {
            const fontPath = path.join(PUBLIC_FONTS_DIR, font.name);
            console.log(`Downloading ${font.name} from ${font.url}`);
            await downloadFile(font.url, fontPath);
            console.log(`✓ Downloaded ${font.name}`);

            // Make sure file has proper permissions
            await fs.chmod(fontPath, 0o644);
        }

        // Fix paths in the CSS file
        const fixedCss = await fixCssPaths(cssPath);
        if (!fixedCss) {
            throw new Error('Failed to update CSS file paths');
        }

        console.log('\n✅ Font Awesome minimal setup completed successfully!');
        console.log('Your site should now work correctly in all environments.');

    } catch (error) {
        console.error('Error setting up Font Awesome:', error);
        process.exit(1);
    }
}

// Run the setup
setupFontAwesome();