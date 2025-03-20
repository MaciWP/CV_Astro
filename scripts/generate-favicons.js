/**
 * Script para generar favicons
 * Versión corregida para ES Modules
 */

// Usar console.log para mostrar información mientras se desarrolla el script
console.log('Este script generaría automáticamente favicons para tu sitio web.');
console.log('Para utilizarlo, es necesario instalar las dependencias:');
console.log('npm install sharp fs-extra');

// Importaciones ES Modules (en lugar de require)
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// En ES Modules no existe __dirname, así que lo creamos:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear directorios necesarios
async function createDirectories() {
    try {
        // Definir rutas
        const iconsDir = path.join(__dirname, '../public/icons');

        // Verificar y crear directorio de iconos
        await fs.mkdir(iconsDir, { recursive: true });
        console.log(`✓ Directorio de iconos creado: ${iconsDir}`);

        // Copiar favicon.svg si existe
        try {
            const sourceFavicon = path.join(__dirname, '../public/favicon.svg');
            const destFavicon = path.join(iconsDir, 'favicon.svg');

            await fs.copyFile(sourceFavicon, destFavicon);
            console.log('✓ favicon.svg copiado a /public/icons/');
        } catch (error) {
            console.log('⚠️ No se encontró favicon.svg. Por favor, crea uno o cópialo manualmente.');
        }

        console.log('\n✓ Preparación para favicons completada');
        console.log('\nPara generar todos los favicons, necesitarás:');
        console.log('1. Instalar sharp: npm install sharp');
        console.log('2. Crear un script más complejo que genere todas las variantes de favicon');
    } catch (error) {
        console.error('Error al crear directorios:', error);
    }
}

// Ejecutar la función principal
createDirectories();