/**
 * Script unificado para el proceso de compilación
 * Ejecuta todas las tareas necesarias en el orden correcto
 * File: scripts/build.js
 */

import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { generateSW } from "workbox-build";

// Obtener dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Asegurarse de que existan las carpetas necesarias en public/
 */
async function ensurePublicDirectories() {
  console.log("🔍 Verificando directorios...");

  try {
    // Crear directorios si no existen
    await fs.mkdir(path.join(__dirname, "../public/styles"), {
      recursive: true,
    });
    await fs.mkdir(path.join(__dirname, "../public/styles/fonts"), {
      recursive: true,
    });
    await fs.mkdir(path.join(__dirname, "../public/scripts"), {
      recursive: true,
    });
    console.log("✅ Directorios verificados");
  } catch (error) {
    console.error("❌ Error al verificar directorios:", error);
    process.exit(1);
  }
}

/**
 * Copiar archivos CSS de src/styles a public/styles
 */
async function copyStylesToDist() {
  console.log("📝 Copiando estilos...");

  try {
    const srcDir = path.join(__dirname, "../src/styles");
    const destDir = path.join(__dirname, "../public/styles");

    // Leer todos los archivos CSS
    const files = await fs.readdir(srcDir);

    // Copiar cada archivo CSS
    for (const file of files) {
      if (file.endsWith(".css")) {
        await fs.copyFile(path.join(srcDir, file), path.join(destDir, file));
        console.log(`  ✓ Copiado: ${file}`);
      }
    }

    console.log("✅ Estilos copiados correctamente");
  } catch (error) {
    console.error("❌ Error al copiar estilos:", error);
    process.exit(1);
  }
}

/**
 * Configurar Font Awesome para asegurar que las fuentes estén disponibles
 */
async function setupFontAwesome() {
  console.log("🔤 Configurando Font Awesome...");

  try {
    // Ejecutar el script existente para Font Awesome
    execSync("node scripts/font-awesome-setup.js", { stdio: "inherit" });
    console.log("✅ Font Awesome configurado");
  } catch (error) {
    console.error("❌ Error al configurar Font Awesome:", error);
    process.exit(1);
  }
}

/**
 * Ejecutar la compilación de Astro
 */
async function buildAstro() {
  console.log("🚀 Compilando con Astro...");

  try {
    execSync("astro build", { stdio: "inherit" });
    console.log("✅ Compilación completada");
  } catch (error) {
    console.error("❌ Error durante la compilación:", error);
    process.exit(1);
  }
}

/**
 * Copiar scripts necesarios a dist/scripts
 */
async function copyScriptsToDist() {
  console.log("📜 Copiando scripts...");

  try {
    const srcDir = path.join(__dirname, "../public/scripts");
    const destDir = path.join(__dirname, "../dist/scripts");

    await fs.mkdir(destDir, { recursive: true });

    const scripts = [
      "i18n.js",
      "i18n-enhanced-fix.js",
      "react-error-recovery.js",
    ];

    for (const file of scripts) {
      await fs.copyFile(path.join(srcDir, file), path.join(destDir, file));
      console.log(`  ✓ Copiado: ${file}`);
    }

    console.log("✅ Scripts copiados");
  } catch (error) {
    console.error("❌ Error al copiar scripts:", error);
    process.exit(1);
  }
}

async function verifyFontFiles() {
  console.log("🔍 Verificando archivos de fuentes...");

  const fontFiles = [
    "dist/styles/fonts/fa-solid-900.woff2",
    "dist/styles/fonts/fa-brands-400.woff2",
  ];

  for (const fontFile of fontFiles) {
    try {
      await fs.access(path.join(__dirname, "..", fontFile));
      console.log(`  ✓ Archivo presente: ${fontFile}`);
    } catch (error) {
      console.warn(`  ⚠️ Archivo faltante: ${fontFile}`);

      // Copiar desde el directorio public si existe
      try {
        const sourceFile = fontFile.replace("dist/", "public/");
        await fs.copyFile(
          path.join(__dirname, "..", sourceFile),
          path.join(__dirname, "..", fontFile),
        );
        console.log(`  ✓ Copiado desde public: ${fontFile}`);
      } catch (copyError) {
        console.error(`  ❌ No se pudo copiar: ${fontFile}`);
      }
    }
  }
}

async function generateServiceWorker() {
  console.log("🛠️ Generando Service Worker...");
  try {
    await generateSW({
      globDirectory: path.join(__dirname, "../dist"),
      globPatterns: [
        "**/*.{html,js,css,woff2,png,jpg,jpeg,svg,webp,avif,json}",
      ],
      swDest: path.join(__dirname, "../dist/sw.js"),
      clientsClaim: true,
      skipWaiting: true,
      offlineGoogleAnalytics: true,
      runtimeCaching: [
        {
          urlPattern: ({ request }) => request.destination === "image",
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "img",
            expiration: { maxEntries: 60, maxAgeSeconds: 7 * 24 * 60 * 60 },
          },
        },
        {
          urlPattern: /^https:\/\/fonts\.g(?:oogleapis|static)\.com\//,
          handler: "StaleWhileRevalidate",
          options: {
            cacheName: "google-fonts",
            expiration: { maxEntries: 30, maxAgeSeconds: 365 * 24 * 60 * 60 },
          },
        },
        {
          urlPattern: /\/api\//,
          handler: "NetworkFirst",
          options: {
            cacheName: "api",
            networkTimeoutSeconds: 10,
            expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 },
          },
        },
      ],
    });
    console.log("✅ Service Worker generado");
  } catch (error) {
    console.error("❌ Error al generar Service Worker:", error);
    process.exit(1);
  }
}

/**
 * Función principal que ejecuta todo el proceso de compilación
 */
async function build() {
  console.log("🏗️ Iniciando proceso de compilación...");

  const startTime = Date.now();

  try {
    // Ejecutar tareas en secuencia
    await ensurePublicDirectories();
    await setupFontAwesome();
    await copyStylesToDist();
    await buildAstro();
    await copyScriptsToDist();
    await verifyFontFiles();
    await generateServiceWorker();

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✨ Compilación completada en ${duration}s`);
  } catch (error) {
    console.error("❌ Error en el proceso de compilación:", error);
    process.exit(1);
  }
}

// Ejecutar la función principal
build();
