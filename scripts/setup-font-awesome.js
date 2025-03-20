/**
 * Font Awesome Setup Script - Improved Version
 * 
 * This script downloads the essential Font Awesome files for both
 * development and production environments, ensuring consistent icon display.
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

// Font Awesome URLs
const FONT_FILES = [
    {
        name: 'fa-brands-400.woff2',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2'
    },
    {
        name: 'fa-solid-900.woff2',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2'
    },
    {
        name: 'fa-regular-400.woff2',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2'
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
 * Main function to setup Font Awesome
 */
async function setupFontAwesome() {
    try {
        // Create directories
        await fs.mkdir(PUBLIC_STYLES_DIR, { recursive: true });
        await fs.mkdir(PUBLIC_FONTS_DIR, { recursive: true });

        console.log('✓ Created directories for Font Awesome');

        // Download font files
        for (const font of FONT_FILES) {
            const fontPath = path.join(PUBLIC_FONTS_DIR, font.name);
            console.log(`Downloading ${font.name} from ${font.url}`);
            await downloadFile(font.url, fontPath);
            console.log(`✓ Downloaded ${font.name}`);
        }

        // Verify font files exist with correct permissions
        for (const font of FONT_FILES) {
            const fontPath = path.join(PUBLIC_FONTS_DIR, font.name);
            try {
                // Check if file exists
                const stats = await fs.stat(fontPath);

                // Ensure proper permissions (read access for everyone)
                await fs.chmod(fontPath, 0o644);

                console.log(`✓ Verified ${font.name} (${stats.size} bytes)`);
            } catch (error) {
                console.error(`× Error verifying ${font.name}: ${error.message}`);
                throw error;
            }
        }

        console.log('\n✅ Font Awesome setup completed successfully!');
        console.log('Font Awesome files are now available locally and will work in both development and production.');

    } catch (error) {
        console.error('Error setting up Font Awesome:', error);
        process.exit(1);
    }
}

// Run the setup
setupFontAwesome();