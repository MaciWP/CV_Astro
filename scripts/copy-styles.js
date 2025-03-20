// Este script copia los estilos a la carpeta pública
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// En ES Modules no existe __dirname, así que lo creamos:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function copyStyles() {
    try {
        // Rutas
        const srcDir = path.join(__dirname, '../src/styles');
        const destDir = path.join(__dirname, '../public/styles');

        // Crear directorio de destino si no existe
        await fs.mkdir(destDir, { recursive: true });
        console.log(`✓ Directorio creado: ${destDir}`);

        // Leer todos los archivos en el directorio de origen
        const files = await fs.readdir(srcDir);

        // Copiar cada archivo CSS
        for (const file of files) {
            if (file.endsWith('.css')) {
                const srcFile = path.join(srcDir, file);
                const destFile = path.join(destDir, file);

                await fs.copyFile(srcFile, destFile);
                console.log(`✓ Copiado: ${file}`);
            }
        }

        console.log('✓ Todos los estilos copiados correctamente');
    } catch (error) {
        console.error('Error copiando estilos:', error);
    }
}

// Ejecutar la función
copyStyles();