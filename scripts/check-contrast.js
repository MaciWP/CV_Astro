// scripts/check-contrast.js
/**
 * Script to verify color contrast issues
 * Uses wcag-contrast to evaluate WCAG 2.1 compliance
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { hex, score } from 'wcag-contrast';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors extracted from tailwind.config.js file
const colors = {
    'brand-red': '#D83333',

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

// Critical combinations to verify
const combinations = [
    // Light theme - text on backgrounds
    ['light-text', 'light-primary'],
    ['light-text', 'light-secondary'],
    ['light-text', 'light-surface'],
    ['light-text-secondary', 'light-primary'],
    ['light-text-secondary', 'light-secondary'],
    ['brand-red', 'light-primary'],
    ['brand-red', 'light-secondary'],

    // Dark theme - text on backgrounds
    ['dark-text', 'dark-primary'],
    ['dark-text', 'dark-secondary'],
    ['dark-text', 'dark-surface'],
    ['dark-text-secondary', 'dark-primary'],
    ['dark-text-secondary', 'dark-secondary'],
    ['brand-red', 'dark-primary'],
    ['brand-red', 'dark-secondary'],

    // Specific component combinations
    ['light-primary', 'brand-red'], // Light text on red
    ['dark-primary', 'brand-red'], // Dark text on red
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
