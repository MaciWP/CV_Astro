// This script copies styles to the public folder
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// In ES Modules __dirname doesn't exist, so we create it:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyStyles() {
    try {
        // Paths
        const srcDir = path.join(__dirname, '../src/styles');
        const destDir = path.join(__dirname, '../public/styles');

        // Create destination directory if it doesn't exist
        await fs.mkdir(destDir, { recursive: true });
        console.log(`✓ Directory created: ${destDir}`);

        // Read all files in source directory
        const files = await fs.readdir(srcDir);

        // Copy each CSS file
        for (const file of files) {
            if (file.endsWith('.css')) {
                const srcFile = path.join(srcDir, file);
                const destFile = path.join(destDir, file);

                await fs.copyFile(srcFile, destFile);
                console.log(`✓ Copied: ${file}`);
            }
        }

        console.log('✓ All styles copied successfully');
    } catch (error) {
        console.error('Error copying styles:', error);
    }
}

// Run the function
copyStyles();