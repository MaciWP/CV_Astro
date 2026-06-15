// scripts/check-contrast.js
/**
 * Script to verify color contrast issues
 * Uses wcag-contrast to evaluate WCAG 2.1 compliance
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { hex } from 'wcag-contrast';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors as ACTUALLY RENDERED in the browser (not the raw Tailwind token).
// The brand-red token is #c41e1e, but Layout.astro remaps solid red TEXT to the
// accessible values below and red BACKGROUNDS to #d83333. This checker tests the
// rendered reality, so it guards the contrast a user actually sees — including the
// dark-card case that the raw token would fail.
const colors = {
    // Red as BACKGROUND (.bg-brand-red -> :root --brand-red); paired with white text
    'brand-red-bg': '#d83333',
    // Red as solid TEXT (Layout override), per theme
    'brand-red-text-light': '#991b1b',
    'brand-red-text-dark': '#fca5a5',

    // Light theme
    'light-primary': '#ffffff',
    'light-secondary': '#f3f4f6',
    'light-surface': '#ffffff',
    'light-surface-alt': '#f7f8fa',
    'light-border': '#e5e7eb',
    'light-text': '#1f2937',
    'light-text-secondary': '#6b7280',
    'light-card-bg': '#f3f4f6',

    // Dark theme
    'dark-primary': '#121620',
    'dark-secondary': '#1e2433',
    'dark-surface': '#262f45',
    'dark-border': '#374151',
    'dark-text': '#f9fafb',
    'dark-text-secondary': '#9ca3af',
};

function checkContrast(colorName1, colorName2) {
    const color1 = colors[colorName1];
    const color2 = colors[colorName2];

    if (!color1 || !color2) {
        console.error(`Error: Color not found - ${!color1 ? colorName1 : colorName2}`);
        return null;
    }

    // wcag-contrast v3 API: hex(foreground, background) returns contrast ratio
    const ratio = hex(color1, color2);

    // WCAG 2.1 thresholds:
    // AA Large text: 3:1, AA Normal text: 4.5:1
    // AAA Large text: 4.5:1, AAA Normal text: 7:1
    const passes = {
        'AA-large': ratio >= 3,
        'AA-normal': ratio >= 4.5,
        'AAA-large': ratio >= 4.5,
        'AAA-normal': ratio >= 7
    };

    return {
        color1: `${colorName1} (${color1})`,
        color2: `${colorName2} (${color2})`,
        ratio: ratio.toFixed(2),
        passes
    };
}

// Critical combinations to verify (foreground, background) — RENDERED colors
const combinations = [
    // Light theme - text on backgrounds
    ['light-text', 'light-primary'],
    ['light-text', 'light-secondary'],
    ['light-text', 'light-surface'],
    ['light-text-secondary', 'light-primary'],
    ['light-text-secondary', 'light-secondary'],
    // Red TEXT (rendered) on light surfaces
    ['brand-red-text-light', 'light-primary'],
    ['brand-red-text-light', 'light-secondary'],
    ['brand-red-text-light', 'light-surface'],

    // Dark theme - text on backgrounds
    ['dark-text', 'dark-primary'],
    ['dark-text', 'dark-secondary'],
    ['dark-text', 'dark-surface'],
    ['dark-text-secondary', 'dark-primary'],
    ['dark-text-secondary', 'dark-secondary'],
    // Red TEXT (rendered) on dark surfaces — incl. the dark CARD that the raw
    // token would fail at 2.26:1; the override makes it pass.
    ['brand-red-text-dark', 'dark-primary'],
    ['brand-red-text-dark', 'dark-secondary'],
    ['brand-red-text-dark', 'dark-surface'],

    // White text on the red BACKGROUND (.bg-brand-red)
    ['light-primary', 'brand-red-bg'],
];

console.log('🔍 Analyzing color contrasts for WCAG compliance...\n');

// Check each combination
const results = [];
for (const [color1, color2] of combinations) {
    const result = checkContrast(color1, color2);
    if (result) {
        results.push(result);
    }
}

// Display results
console.log('📊 CONTRAST ANALYSIS RESULTS:\n');
results.forEach(result => {
    console.log(`${result.color1} on ${result.color2}:`);
    console.log(`  Ratio: ${result.ratio}:1`);
    console.log(`  AA-large: ${result.passes['AA-large'] ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  AA-normal: ${result.passes['AA-normal'] ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  AAA-large: ${result.passes['AAA-large'] ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  AAA-normal: ${result.passes['AAA-normal'] ? '✅ PASS' : '❌ FAIL'}\n`);
});

// Identify issues
const issues = results.filter(r => !r.passes['AA-normal']);
if (issues.length > 0) {
    console.log('⚠️ CONTRAST ISSUES DETECTED:');
    issues.forEach(issue => {
        console.log(`- ${issue.color1} on ${issue.color2} (${issue.ratio}:1) does not meet AA for normal text`);
    });
} else {
    console.log('✅ All combinations meet AA requirements for normal text.');
}

// Save report to file
const reportPath = path.join(__dirname, '../contrast-report.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n📝 Report saved to: ${reportPath}`);
