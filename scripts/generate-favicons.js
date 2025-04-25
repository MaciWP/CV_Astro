// scripts/generate-favicons.js - Versión mejorada
/**
 * Script para generar todos los favicons necesarios
 * Resuelve el problema del favicon que no se muestra en producción
 */
import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas
const SOURCE_ICON = path.join(__dirname, '../src/assets/favicon.svg');
const PUBLIC_DIR = path.join(__dirname, '../public');
const ICONS_DIR = path.join(PUBLIC_DIR, 'icons');

// Tamaños para favicon
const SIZES = [16, 32, 48, 64, 96, 128, 192, 256, 512];

async function generateFavicons() {
    try {
        // Crear directorio de iconos
        await fs.mkdir(ICONS_DIR, { recursive: true });

        // Leer el SVG fuente
        const svgBuffer = await fs.readFile(SOURCE_ICON);

        // Generar favicon.ico (múltiples tamaños en un solo archivo)
        // Nota: Usamos PNG y los convertimos a ICO
        const smallSizes = [16, 32, 48];
        const smallPngs = await Promise.all(
            smallSizes.map(size =>
                sharp(svgBuffer)
                    .resize(size, size)
                    .png()
                    .toBuffer()
            )
        );

        // Generar PNG para cada tamaño
        await Promise.all(
            SIZES.map(async (size) => {
                await sharp(svgBuffer)
                    .resize(size, size)
                    .png()
                    .toFile(path.join(ICONS_DIR, `favicon-${size}.png`));

                console.log(`✓ Generado favicon-${size}.png`);
            })
        );

        // Copiar SVG original
        await fs.copyFile(SOURCE_ICON, path.join(ICONS_DIR, 'favicon.svg'));
        await fs.copyFile(SOURCE_ICON, path.join(PUBLIC_DIR, 'favicon.svg'));

        // Crear favicon.ico en la raíz (importante)
        await sharp(svgBuffer)
            .resize(32, 32)
            .png()
            .toFile(path.join(PUBLIC_DIR, 'favicon.png'));

        console.log(`✓ Favicons generados correctamente`);

    } catch (error) {
        console.error('Error generando favicons:', error);
    }
}

// Ejecutar la función
generateFavicons();