/**
 * Script mejorado para optimizar imágenes
 * File: scripts/optimize-images.js
 * 
 * CORRECCIÓN: Ahora copia además la imagen original al directorio principal
 */
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// En ES Modules __dirname no existe, así que lo creamos:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const SOURCE_DIR = path.join(__dirname, '../public/images/original');
const OUTPUT_DIR = path.join(__dirname, '../public/images');
const FORMATS = ['webp', 'avif', 'jpg']; // Añadido jpg para asegurar copia del original
const QUALITY = 80;
const SIZES = [
    { width: 1200, suffix: 'lg' },
    { width: 800, suffix: 'md' },
    { width: 400, suffix: 'sm' }
];

/**
 * Optimiza una imagen para varios formatos y tamaños
 * @param {string} filePath - Ruta a la imagen original
 */
async function optimizeImage(filePath) {
    const fileName = path.basename(filePath);
    const fileExt = path.extname(fileName);
    const baseName = path.basename(fileName, fileExt);

    try {
        // Cargar imagen con sharp
        const image = sharp(filePath);
        const metadata = await image.metadata();

        console.log(`\nOptimizando ${fileName} (${metadata.width}x${metadata.height}):`);

        // IMPORTANTE: COPIAR LA IMAGEN ORIGINAL AL DIRECTORIO PRINCIPAL
        // Esto resuelve el problema de 404 para la imagen principal
        await fs.copyFile(
            filePath,
            path.join(OUTPUT_DIR, fileName)
        );
        console.log(`  ✓ Copiada imagen original a ${OUTPUT_DIR}/${fileName}`);

        // Crear versiones en múltiples formatos y tamaños
        for (const format of FORMATS) {
            for (const size of SIZES) {
                // Solo redimensionar si la imagen original es más grande
                if (metadata.width <= size.width) continue;

                const outputPath = path.join(OUTPUT_DIR, `${baseName}-${size.suffix}.${format}`);

                if (format === 'jpg') {
                    // Para JPG usamos el formato original guardado como JPEG
                    await image
                        .resize({ width: size.width })
                        .jpeg({ quality: QUALITY, mozjpeg: true })
                        .toFile(outputPath);
                } else {
                    // Para otros formatos
                    await image
                        .resize({ width: size.width })
                    [format]({ quality: QUALITY })
                        .toFile(outputPath);
                }

                console.log(`  ✓ Generada ${baseName}-${size.suffix}.${format} (${size.width}px)`);
            }
        }
    } catch (error) {
        console.error(`  ✗ Error optimizando ${fileName}: ${error.message}`);
    }
}

/**
 * Crea directorios necesarios
 */
async function createDirectories() {
    try {
        await fs.mkdir(SOURCE_DIR, { recursive: true });
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        console.log('✓ Directorios creados correctamente');
    } catch (error) {
        console.error(`Error creando directorios: ${error.message}`);
        throw error;
    }
}

/**
 * Procesa todas las imágenes en el directorio
 */
async function processImages() {
    try {
        console.log('🖼️  Iniciando optimización de imágenes...');

        // Crear directorios
        await createDirectories();

        // Verificar imágenes originales
        let files;
        try {
            files = await fs.readdir(SOURCE_DIR);
        } catch (error) {
            console.log('⚠️  El directorio de imágenes originales está vacío o no existe.');
            console.log(`Coloque sus imágenes originales en: ${SOURCE_DIR}`);
            return;
        }

        // Filtrar solo archivos de imagen
        const imageFiles = files.filter(file =>
            /\.(jpe?g|png|gif|webp)$/i.test(file)
        );

        if (imageFiles.length === 0) {
            console.log('⚠️  No se encontraron imágenes para optimizar.');
            return;
        }

        console.log(`Encontradas ${imageFiles.length} imágenes para optimizar.`);

        // Procesar cada imagen
        for (const file of imageFiles) {
            await optimizeImage(path.join(SOURCE_DIR, file));
        }

        console.log('\n✅ Optimización de imágenes completada!');
        console.log(`Imágenes optimizadas guardadas en: ${OUTPUT_DIR}`);

    } catch (error) {
        console.error(`\n❌ Error en el proceso de optimización: ${error.message}`);
        process.exit(1);
    }
}

// Ejecutar la función principal
processImages();

// Exportar funciones para uso en otros scripts
export {
    processImages,
    optimizeImage
};