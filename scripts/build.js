/**
 * Script unificado para el proceso de compilación
 * Ejecuta todas las tareas necesarias en el orden correcto
 * File: scripts/build.js
 */

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Asegurarse de que existan las carpetas necesarias en public/
 * NOTE: Solo public/styles/fonts/ para Font Awesome (los CSS los maneja Astro directamente)
 */
async function ensurePublicDirectories() {
    console.log('🔍 Verificando directorios...');

    try {
        // Solo necesitamos el directorio de fuentes (Font Awesome)
        // Los CSS de src/styles/ los importa Astro directamente
        await fs.mkdir(path.join(__dirname, '../public/styles/fonts'), { recursive: true });
        console.log('✅ Directorios verificados');
    } catch (error) {
        console.error('❌ Error al verificar directorios:', error);
        process.exit(1);
    }
}

/**
 * Generar sitemap
 */
async function generateSitemap() {
    console.log('🗺️ Generando sitemap...');

    try {
        execSync('node scripts/generate-sitemap.js', { stdio: 'inherit' });
        console.log('✅ Sitemap generado');
    } catch (error) {
        console.error('❌ Error al generar sitemap:', error);
        // No salir en este caso, no es crítico
    }
}

/**
 * Ejecutar la compilación de Astro
 */
async function buildAstro() {
    console.log('🚀 Compilando con Astro...');

    try {
        execSync('astro build', { stdio: 'inherit' });
        console.log('✅ Compilación completada');
    } catch (error) {
        console.error('❌ Error durante la compilación:', error);
        process.exit(1);
    }
}

async function verifyFontFiles() {
    console.log('🔍 Verificando archivos de fuentes...');

    const fontFiles = [
        'dist/styles/fonts/fa-solid-900.woff2',
        'dist/styles/fonts/fa-brands-400.woff2'
    ];

    for (const fontFile of fontFiles) {
        try {
            await fs.access(path.join(__dirname, '..', fontFile));
            console.log(`  ✓ Archivo presente: ${fontFile}`);
        } catch (error) {
            console.warn(`  ⚠️ Archivo faltante: ${fontFile}`);

            // Copiar desde el directorio public si existe
            try {
                const sourceFile = fontFile.replace('dist/', 'public/');
                await fs.copyFile(
                    path.join(__dirname, '..', sourceFile),
                    path.join(__dirname, '..', fontFile)
                );
                console.log(`  ✓ Copiado desde public: ${fontFile}`);
            } catch (copyError) {
                console.error(`  ❌ No se pudo copiar: ${fontFile}`);
            }
        }
    }
}

/**
 * Función principal que ejecuta todo el proceso de compilación
 */
async function build() {
    console.log('🏗️ Iniciando proceso de compilación...');

    const startTime = Date.now();

    try {
        // Ejecutar tareas en secuencia
        await ensurePublicDirectories();
        await generateSitemap();
        await buildAstro();
        await verifyFontFiles();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✨ Compilación completada en ${duration}s`);
    } catch (error) {
        console.error('❌ Error en el proceso de compilación:', error);
        process.exit(1);
    }
}

// Ejecutar la función principal
build();