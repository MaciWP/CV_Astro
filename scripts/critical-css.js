import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { generate } from "critical";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pages to process
const pages = [
  "index.html",
  path.join("es", "index.html"),
  path.join("fr", "index.html"),
];

/**
 * Generate critical CSS for built pages.
 * @param {string} outDir - Astro build output directory
 */
export async function runCritical(outDir = path.join(__dirname, "../dist")) {
  for (const page of pages) {
    const filePath = path.join(outDir, page);
    try {
      const html = await readFile(filePath, "utf8");
      const { css } = await generate({
        base: outDir,
        html,
        inline: false,
        dimensions: [
          { width: 360, height: 640 },
          { width: 1280, height: 800 },
        ],
      });

      // Inject critical CSS and defer existing stylesheets
      let transformed = html.replace(
        /<link rel="stylesheet"/g,
        '<link rel="stylesheet" media="print" onload="this.media=\'all\'"',
      );
      transformed = transformed.replace(
        "</head>",
        `<style data-critical>${css}</style>\n</head>`,
      );
      await writeFile(filePath, transformed);
      console.log(`\u2713 Critical CSS generated for ${page}`);
    } catch (err) {
      console.error("Failed to process", page, err);
    }
  }
}

// Allow running via node scripts/critical-css.js [dir]
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runCritical(process.argv[2]).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
