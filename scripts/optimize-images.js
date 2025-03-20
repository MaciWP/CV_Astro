/**
 * Script para optimizar imágenes
 * Versión corregida para ES Modules
 */

// Usar console.log para mostrar información mientras se desarrolla el script
console.log('Este script optimizaría automáticamente las imágenes para tu sitio web.');
console.log('Para utilizarlo, es necesario instalar las dependencias:');
console.log('npm install sharp fs-extra glob');

// Importaciones ES Modules (en lugar de require)
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// En ES Modules no existe __dirname, así que lo creamos:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear directorios necesarios para imágenes
async function createImageDirectories() {
    try {
        // Definir rutas
        const imagesDir = path.join(__dirname, '../public/images');
        const optimizedDir = path.join(imagesDir, 'optimized');

        // Verificar y crear directorios
        await fs.mkdir(imagesDir, { recursive: true });
        await fs.mkdir(optimizedDir, { recursive: true });

        console.log(`✓ Directorios de imágenes creados:`);
        console.log(`  - ${imagesDir}`);
        console.log(`  - ${optimizedDir}`);

        // Verificar si hay imágenes en el directorio
        try {
            const files = await fs.readdir(imagesDir);
            const imageFiles = files.filter(file =>
                !file.startsWith('.') &&
                !file.includes('optimized') &&
                /\.(jpg|jpeg|png|gif)$/i.test(file)
            );

            if (imageFiles.length > 0) {
                console.log(`\n✓ Encontradas ${imageFiles.length} imágenes para optimizar:`);
                imageFiles.forEach(file => console.log(`  - ${file}`));
            } else {
                console.log('\n⚠️ No se encontraron imágenes para optimizar.');
                console.log('  Coloca tus imágenes en /public/images/');
            }
        } catch (error) {
            console.error('Error al buscar imágenes:', error);
        }

        console.log('\n✓ Preparación para optimización de imágenes completada');
        console.log('\nPara optimizar todas las imágenes, necesitarás:');
        console.log('1. Instalar sharp: npm install sharp');
        console.log('2. Colocar tus imágenes en /public/images/');
        console.log('3. Ejecutar un script más complejo que procese cada imagen');
    } catch (error) {
        console.error('Error al crear directorios de imágenes:', error);
    }
}

// Ejecutar la función principal
createImageDirectories();