// scripts/generate-profile-images.js
import fs from "fs/promises";
import sharp from "sharp";
import path from "path";

// Asegúrate de que aquí apuntas a la JPG original real:
const INPUT = path.resolve("public/images/original/oriol_macias.jpg");
const OUTDIR = path.resolve("public/images");
const SIZES = [192, 320, 640, 960, 1280];

async function build() {
  await fs.mkdir(OUTDIR, { recursive: true });
  for (const w of SIZES) {
    await sharp(INPUT)
      .resize(w)
      .avif({ quality: 80 })
      .toFile(path.join(OUTDIR, `oriol_macias-${w}.avif`));
    await sharp(INPUT)
      .resize(w)
      .webp({ quality: 80 })
      .toFile(path.join(OUTDIR, `oriol_macias-${w}.webp`));
    await sharp(INPUT)
      .resize(w)
      .jpeg({ quality: 80 })
      .toFile(path.join(OUTDIR, `oriol_macias-${w}.jpg`));
  }
  // placeholder tiny
  await sharp(INPUT)
    .resize(20)
    .blur()
    .jpeg({ quality: 30 })
    .toFile(path.join(OUTDIR, `oriol_macias-tiny.jpg`));
  console.log("✅ Profile images generated");
}

build().catch((err) => {
  console.error("❌ Error generating images:", err);
  process.exit(1);
});
