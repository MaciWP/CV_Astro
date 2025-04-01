/**
 * Enhanced image optimization script
 * Automatically converts images to WebP, optimizes size, and generates responsive variants
 * File: scripts/optimize-images.js
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import glob from 'glob-promise';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_DIR = path.join(__dirname, '../public/images');
const DEST_DIR = path.join(__dirname, '../public/images/optimized');
const WEBP_QUALITY = 80; // Good quality with significant savings
const JPEG_QUALITY = 85; // Fallback quality
const MAX_WIDTH = 1200; // Maximum width for any image
const SIZES = [400, 800, 1200]; // Different sizes to generate
const PLACEHOLDER_SIZE = 20; // Size for placeholder images

/**
 * Ensure destination directories exist
 */
async function ensureDirectories() {
    try {
        await fs.mkdir(DEST_DIR, { recursive: true });
        console.log('✓ Destination directory created:', DEST_DIR);
    } catch (error) {
        console.error('Error creating directories:', error);
        throw error;
    }
}

/**
 * Generate a tiny blurred placeholder image
 * @param {sharp.Sharp} sharpInstance - Sharp instance for the image
 * @param {string} outputPath - Path to save the placeholder
 */
async function generatePlaceholder(sharpInstance, outputPath) {
    try {
        await sharpInstance
            .clone()
            .resize(PLACEHOLDER_SIZE)
            .blur(5)
            .jpeg({ quality: 40 })
            .toFile(outputPath);

        console.log(`  ✓ Generated placeholder: ${path.basename(outputPath)}`);
        return true;
    } catch (error) {
        console.error(`  ✗ Error generating placeholder: ${error.message}`);
        return false;
    }
}

/**
 * Process a single image file
 * @param {string} filePath - Path to the source image file
 */
async function processImage(filePath) {
    try {
        const filename = path.basename(filePath);
        const filenameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));

        console.log(`\nProcessing: ${filename}`);

        // Load image with sharp
        const image = sharp(filePath);
        const metadata = await image.metadata();

        // Skip already small or optimized images
        if (metadata.width <= MAX_WIDTH && metadata.format === 'webp') {
            console.log(`  ℹ Already optimized or small enough: ${filename}`);
            return;
        }

        // Create sizes array - respect aspect ratio for smaller images
        const imageSizes = SIZES.filter(size => size <= metadata.width);
        if (imageSizes.length === 0) {
            imageSizes.push(metadata.width);
        }

        // Generate placeholder for lazy loading
        const placeholderPath = path.join(DEST_DIR, `${filenameWithoutExt}-placeholder.jpg`);
        await generatePlaceholder(image, placeholderPath);

        // Generate all sizes in WebP format (better compression)
        for (const size of imageSizes) {
            const webpOutput = path.join(DEST_DIR, `${filenameWithoutExt}-${size}.webp`);
            await image
                .clone()
                .resize({ width: size, withoutEnlargement: true })
                .webp({ quality: WEBP_QUALITY })
                .toFile(webpOutput);

            console.log(`  ✓ Generated WebP (${size}px): ${path.basename(webpOutput)}`);
        }

        // Generate fallback JPEG versions for browsers without WebP support
        for (const size of imageSizes) {
            const jpegOutput = path.join(DEST_DIR, `${filenameWithoutExt}-${size}.jpg`);
            await image
                .clone()
                .resize({ width: size, withoutEnlargement: true })
                .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
                .toFile(jpegOutput);

            console.log(`  ✓ Generated JPEG (${size}px): ${path.basename(jpegOutput)}`);
        }

        // Always generate a full-size WebP for the best quality option
        const fullWebpOutput = path.join(DEST_DIR, `${filenameWithoutExt}.webp`);
        await image
            .clone()
            .webp({ quality: WEBP_QUALITY })
            .toFile(fullWebpOutput);

        console.log(`  ✓ Generated full-size WebP: ${path.basename(fullWebpOutput)}`);

        // Calculate size reduction
        const originalSize = (await fs.stat(filePath)).size;
        const webpSize = (await fs.stat(fullWebpOutput)).size;
        const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(2);

        console.log(`  🔍 Size reduction: ${originalSize / 1024} KB → ${webpSize / 1024} KB (${savings}% smaller)`);

        return true;
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
        return false;
    }
}

/**
 * Process all images in the source directory
 */
async function processAllImages() {
    try {
        // Ensure destination directory exists
        await ensureDirectories();

        // Find all image files in source directory
        const imagePatterns = ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.gif'];
        let imagePaths = [];

        for (const pattern of imagePatterns) {
            const matches = await glob(path.join(SOURCE_DIR, pattern));
            imagePaths = [...imagePaths, ...matches];
        }

        if (imagePaths.length === 0) {
            console.log('No images found to optimize.');
            return;
        }

        console.log(`Found ${imagePaths.length} images to process.`);

        // Process each image
        let successCount = 0;
        for (const imagePath of imagePaths) {
            const success = await processImage(imagePath);
            if (success) successCount++;
        }

        console.log(`\n✅ Successfully processed ${successCount} of ${imagePaths.length} images.`);

        // Generate metadata file with information about optimized images
        const metadata = {
            timestamp: new Date().toISOString(),
            totalImages: imagePaths.length,
            successfullyProcessed: successCount,
            parameters: {
                webpQuality: WEBP_QUALITY,
                jpegQuality: JPEG_QUALITY,
                maxWidth: MAX_WIDTH,
                sizes: SIZES
            },
            processedFiles: imagePaths.map(p => path.basename(p))
        };

        await fs.writeFile(
            path.join(DEST_DIR, 'optimization-metadata.json'),
            JSON.stringify(metadata, null, 2)
        );

        console.log('📄 Generated optimization metadata file.');

    } catch (error) {
        console.error('Error processing images:', error);
        process.exit(1);
    }
}

// Execute if this script is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    console.log('🖼️ Starting image optimization process...');
    processAllImages()
        .then(() => console.log('✨ Image optimization completed!'))
        .catch(error => {
            console.error('❌ Error in image optimization process:', error);
            process.exit(1);
        });
}

export { processAllImages, processImage };