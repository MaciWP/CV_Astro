// scripts/check-translations.js
/**
 * Script to verify translation consistency across languages
 * Identifies missing keys and helps maintain i18n quality
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const LOCALES_DIR = path.join(__dirname, "../public/locales");
const SUPPORTED_LANGUAGES = ["en", "es", "fr"];

// Utility function to flatten object keys with dot notation
function flattenKeys(obj, prefix = "") {
  return Object.keys(obj).reduce((acc, key) => {
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof obj[key] === "object" && obj[key] !== null) {
      const flattenedKeys = flattenKeys(obj[key], prefixedKey);
      return [...acc, ...flattenedKeys];
    }

    return [...acc, prefixedKey];
  }, []);
}

// Main function
async function checkTranslations() {
  console.log("🔍 Checking translation consistency...\n");

  try {
    // Ensure locales directory exists
    try {
      await fs.access(LOCALES_DIR);
    } catch (error) {
      console.error(`❌ Error: Locales directory not found at ${LOCALES_DIR}`);
      return;
    }

    // Load all translation files
    const translations = {};

    for (const lang of SUPPORTED_LANGUAGES) {
      const langDir = path.join(LOCALES_DIR, lang);

      try {
        await fs.access(langDir);

        const filePath = path.join(langDir, "translation.json");
        const content = await fs.readFile(filePath, "utf-8");
        translations[lang] = JSON.parse(content);

        console.log(`✓ Loaded translations for ${lang}`);
      } catch (error) {
        console.error(
          `❌ Error loading translations for ${lang}:`,
          error.message,
        );
      }
    }

    // No translations found
    if (Object.keys(translations).length === 0) {
      console.error(
        "❌ No translation files found. Verify the locales directory structure.",
      );
      return;
    }

    // Use English as the reference language if available, otherwise use the first available
    const referenceLanguage = translations.en
      ? "en"
      : Object.keys(translations)[0];
    console.log(`\nUsing ${referenceLanguage} as reference language\n`);

    // Get all keys from the reference language
    const referenceKeys = flattenKeys(translations[referenceLanguage]);
    console.log(
      `Found ${referenceKeys.length} translation keys in ${referenceLanguage}\n`,
    );

    // Check each language for missing keys
    const missing = {};
    const extra = {};

    for (const lang of Object.keys(translations)) {
      if (lang === referenceLanguage) continue;

      const langKeys = flattenKeys(translations[lang]);

      // Find missing keys
      const missingKeys = referenceKeys.filter(
        (key) => !langKeys.includes(key),
      );
      if (missingKeys.length > 0) {
        missing[lang] = missingKeys;
      }

      // Find extra keys
      const extraKeys = langKeys.filter((key) => !referenceKeys.includes(key));
      if (extraKeys.length > 0) {
        extra[lang] = extraKeys;
      }
    }

    // Report results
    console.log("📊 TRANSLATION CONSISTENCY REPORT:\n");

    // Missing keys
    if (Object.keys(missing).length > 0) {
      console.log("🔴 MISSING KEYS:");

      for (const lang of Object.keys(missing)) {
        console.log(
          `\n  ${lang.toUpperCase()} (${missing[lang].length} keys missing):`,
        );

        missing[lang].forEach((key) => {
          console.log(`    - ${key}`);
        });
      }
    } else {
      console.log("✅ No missing translation keys detected.");
    }

    // Extra keys
    if (Object.keys(extra).length > 0) {
      console.log(
        "\n🟡 EXTRA KEYS (present in translation but not in reference language):",
      );

      for (const lang of Object.keys(extra)) {
        console.log(
          `\n  ${lang.toUpperCase()} (${extra[lang].length} extra keys):`,
        );

        extra[lang].forEach((key) => {
          console.log(`    - ${key}`);
        });
      }
    } else {
      console.log("\n✅ No extra translation keys detected.");
    }

    // Generate report
    const report = {
      referenceLanguage,
      keysCount: referenceKeys.length,
      languages: Object.keys(translations),
      missing,
      extra,
      timestamp: new Date().toISOString(),
    };

    const reportPath = path.join(__dirname, "../translation-report.json");
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n📝 Report saved to: ${reportPath}`);
  } catch (error) {
    console.error("❌ Error checking translations:", error);
  }
}

// Run the function
checkTranslations();
