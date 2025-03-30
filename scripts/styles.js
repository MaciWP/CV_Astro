/**
 * Sistema unificado para la gestión de estilos
 * Maneja la compilación, optimización y copia de archivos CSS
 * Reemplaza a scripts/copy-styles.js
 * 
 * File: scripts/styles.js
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// En ES Modules __dirname no existe, así que lo creamos:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const SOURCE_DIR = path.join(__dirname, '../src/styles');
const TARGET_DIR = path.join(__dirname, '../public/styles');
const MAIN_CSS_FILES = ['global.css', 'main.css']; // Archivos principales que incluyen imports

/**
 * Procesa un archivo CSS para resolver @import
 * @param {string} filePath - Ruta al archivo CSS
 * @param {Set<string>} processedFiles - Set de archivos ya procesados (para evitar ciclos)
 * @returns {Promise<string>} - Contenido CSS procesado
 */
async function processImports(filePath, processedFiles = new Set()) {
    // Evitar procesar el mismo archivo más de una vez
    if (processedFiles.has(filePath)) {
        return '';
    }
    processedFiles.add(filePath);

    try {
        // Leer contenido del archivo
        const content = await fs.readFile(filePath, 'utf-8');

        // Procesar @import
        const importRegex = /@import\s+['"](.+)['"]\s*;/g;
        let match;
        let processedContent = content;

        // Reemplazar cada @import con el contenido del archivo importado
        while ((match = importRegex.exec(content)) !== null) {
            const importPath = match[1];
            const resolvedPath = path.resolve(path.dirname(filePath), importPath);

            // Procesar el archivo importado (recursivamente)
            const importedContent = await processImports(resolvedPath, processedFiles);

            // Reemplazar la declaración @import con el contenido
            processedContent = processedContent.replace(match[0], importedContent);
        }

        return processedContent;
    } catch (error) {
        console.error(`Error processing imports in ${filePath}:`, error);
        return '/* Error processing imports */';
    }
}

/**
 * Optimiza un string CSS (elimina comentarios, espacios en blanco, etc.)
 * @param {string} css - Contenido CSS a optimizar
 * @returns {string} - CSS optimizado
 */
function optimizeCSS(css) {
    // Eliminar comentarios
    css = css.replace(/\/\*[\s\S]*?\*\//g, '');

    // Eliminar espacios en blanco innecesarios
    css = css.replace(/\s+/g, ' ');
    css = css.replace(/\s*{\s*/g, '{');
    css = css.replace(/\s*}\s*/g, '}');
    css = css.replace(/\s*:\s*/g, ':');
    css = css.replace(/\s*;\s*/g, ';');
    css = css.replace(/\s*,\s*/g, ',');

    // Eliminar punto y coma final en bloques
    css = css.replace(/;\}/g, '}');

    // Compactar valores
    css = css.replace(/0px/g, '0');

    return css.trim();
}

/**
 * Prepara los directorios necesarios
 */
async function prepareDirectories() {
    try {
        // Crear directorio de destino si no existe
        await fs.mkdir(TARGET_DIR, { recursive: true });
        console.log(`✓ Directory created: ${TARGET_DIR}`);
    } catch (error) {
        console.error('Error creating directories:', error);
        throw error;
    }
}

/**
 * Copia un archivo CSS procesando sus imports
 * @param {string} fileName - Nombre del archivo a procesar
 * @param {boolean} optimize - Si se debe optimizar el CSS
 */
async function processAndCopyCSS(fileName, optimize = false) {
    const sourcePath = path.join(SOURCE_DIR, fileName);
    const targetPath = path.join(TARGET_DIR, fileName);

    try {
        // Procesar @imports
        let processedContent = await processImports(sourcePath);

        // Optimizar si es necesario
        if (optimize) {
            processedContent = optimizeCSS(processedContent);
        }

        // Escribir archivo procesado
        await fs.writeFile(targetPath, processedContent);
        console.log(`✓ Processed and copied: ${fileName}${optimize ? ' (optimized)' : ''}`);
    } catch (error) {
        console.error(`Error processing ${fileName}:`, error);
    }
}

/**
 * Copia un archivo CSS sin procesar
 * @param {string} fileName - Nombre del archivo a copiar
 */
async function copyFile(fileName) {
    const sourcePath = path.join(SOURCE_DIR, fileName);
    const targetPath = path.join(TARGET_DIR, fileName);

    try {
        await fs.copyFile(sourcePath, targetPath);
        console.log(`✓ Copied: ${fileName}`);
    } catch (error) {
        console.error(`Error copying ${fileName}:`, error);
    }
}

/**
 * Procesa todos los estilos
 * @param {boolean} optimize - Si se debe optimizar el CSS
 */
async function processStyles(optimize = false) {
    try {
        console.log(`\n🔄 Processing styles ${optimize ? 'with optimization' : ''}...`);

        // Preparar directorios
        await prepareDirectories();

        // Leer todos los archivos CSS del directorio fuente
        const files = await fs.readdir(SOURCE_DIR);
        const cssFiles = files.filter(file => file.endsWith('.css'));

        // Procesar archivos principales (con imports)
        for (const mainFile of MAIN_CSS_FILES) {
            if (cssFiles.includes(mainFile)) {
                await processAndCopyCSS(mainFile, optimize);
            }
        }

        // Copiar el resto de archivos CSS
        for (const file of cssFiles) {
            if (!MAIN_CSS_FILES.includes(file)) {
                // Verificar si tiene imports
                const content = await fs.readFile(path.join(SOURCE_DIR, file), 'utf-8');
                if (content.includes('@import')) {
                    await processAndCopyCSS(file, optimize);
                } else {
                    await copyFile(file);
                }
            }
        }

        console.log('✓ All styles processed successfully');
    } catch (error) {
        console.error('Error processing styles:', error);
    }
}

// Si se ejecuta directamente desde la línea de comandos
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const optimize = process.argv.includes('--optimize');
    processStyles(optimize)
        .catch(error => {
            console.error('Script failed:', error);
            process.exit(1);
        });
}

export {
    processStyles,
    processAndCopyCSS,
    optimizeCSS
};