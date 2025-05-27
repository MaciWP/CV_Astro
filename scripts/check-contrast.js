// scripts/check-contrast.js
/**
 * Script para verificar problemas de contraste de color
 * Utiliza wcag-contrast para evaluar el cumplimiento de WCAG 2.1
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import contrast from "wcag-contrast";

// Obtener dirname en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colores extraídos del archivo tailwind.config.js
const colors = {
  "brand-red": "#D83333",

  // Light theme
  "light-primary": "#ffffff",
  "light-secondary": "#f3f4f6",
  "light-surface": "#ffffff",
  "light-surface-alt": "#f7f8fa",
  "light-border": "#e5e7eb",
  "light-text": "#1f2937",
  "light-text-secondary": "#6b7280",
  "light-card-bg": "#f3f4f6",

  // Dark theme
  "dark-primary": "#121620",
  "dark-secondary": "#1e2433",
  "dark-surface": "#262f45",
  "dark-border": "#374151",
  "dark-text": "#f9fafb",
  "dark-text-secondary": "#9ca3af",
};

function checkContrast(colorName1, colorName2) {
  const color1 = colors[colorName1];
  const color2 = colors[colorName2];

  if (!color1 || !color2) {
    console.error(
      `Error: Color not found - ${!color1 ? colorName1 : colorName2}`,
    );
    return null;
  }

  const ratio = contrast.ratio(color1, color2);
  const passes = {
    "AA-large": contrast.passes.AA.large(ratio),
    "AA-normal": contrast.passes.AA.normal(ratio),
    "AAA-large": contrast.passes.AAA.large(ratio),
    "AAA-normal": contrast.passes.AAA.normal(ratio),
  };

  return {
    color1: `${colorName1} (${color1})`,
    color2: `${colorName2} (${color2})`,
    ratio: ratio.toFixed(2),
    passes,
  };
}

// Combinaciones críticas a verificar
const combinations = [
  // Tema claro - texto sobre fondos
  ["light-text", "light-primary"],
  ["light-text", "light-secondary"],
  ["light-text", "light-surface"],
  ["light-text-secondary", "light-primary"],
  ["light-text-secondary", "light-secondary"],
  ["brand-red", "light-primary"],
  ["brand-red", "light-secondary"],

  // Tema oscuro - texto sobre fondos
  ["dark-text", "dark-primary"],
  ["dark-text", "dark-secondary"],
  ["dark-text", "dark-surface"],
  ["dark-text-secondary", "dark-primary"],
  ["dark-text-secondary", "dark-secondary"],
  ["brand-red", "dark-primary"],
  ["brand-red", "dark-secondary"],

  // Combinaciones específicas de componentes
  ["light-primary", "brand-red"], // Texto claro sobre rojo
  ["dark-primary", "brand-red"], // Texto oscuro sobre rojo
];

console.log("🔍 Analizando contrastes de color para cumplimiento WCAG...\n");

// Verificar cada combinación
const results = [];
for (const [color1, color2] of combinations) {
  const result = checkContrast(color1, color2);
  if (result) {
    results.push(result);
  }
}

// Mostrar resultados
console.log("📊 RESULTADOS DEL ANÁLISIS DE CONTRASTE:\n");
results.forEach((result) => {
  console.log(`${result.color1} sobre ${result.color2}:`);
  console.log(`  Ratio: ${result.ratio}:1`);
  console.log(
    `  AA-large: ${result.passes["AA-large"] ? "✅ PASA" : "❌ FALLA"}`,
  );
  console.log(
    `  AA-normal: ${result.passes["AA-normal"] ? "✅ PASA" : "❌ FALLA"}`,
  );
  console.log(
    `  AAA-large: ${result.passes["AAA-large"] ? "✅ PASA" : "❌ FALLA"}`,
  );
  console.log(
    `  AAA-normal: ${result.passes["AAA-normal"] ? "✅ PASA" : "❌ FALLA"}\n`,
  );
});

// Identificar problemas
const issues = results.filter((r) => !r.passes["AA-normal"]);
if (issues.length > 0) {
  console.log("⚠️ PROBLEMAS DE CONTRASTE DETECTADOS:");
  issues.forEach((issue) => {
    console.log(
      `- ${issue.color1} sobre ${issue.color2} (${issue.ratio}:1) no cumple AA para texto normal`,
    );
  });
} else {
  console.log(
    "✅ Todas las combinaciones cumplen con los requisitos AA para texto normal.",
  );
}

// Guardar informe en un archivo
const reportPath = path.join(__dirname, "../contrast-report.json");
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n📝 Informe guardado en: ${reportPath}`);
