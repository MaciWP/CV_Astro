/**
 * Structured Data Validation Script
 * @file scripts/validate-structured-data.js
 * @description Validates the JSON-LD actually emitted into dist/ (real build
 * output, not a mock). Asserts the post-2026-06 schema set: ProfilePage
 * wrapping a Person mainEntity + WebSite, and ZERO JobPosting nodes
 * (JobPosting is employer-only markup per Google's content guidelines).
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const REPORT_FILE = path.join(__dirname, '../validation-report.json');

// Representative pages: homepage, a language root, and both geo hubs
// (spain.html is the only page that emits a BreadcrumbList).
const PAGES_TO_CHECK = [
    'index.html',
    'es.html',
    'switzerland.html',
    'spain.html',
];

// Pages expected to emit a BreadcrumbList (only the Spain hub uses BreadcrumbSchema).
const BREADCRUMB_PAGES = ['spain.html'];

/**
 * Extract and parse every JSON-LD block from an HTML string.
 * Handles both quoted and minified-unquoted type attributes.
 */
function extractJsonLd(html, errors) {
    const blocks = [];
    const regex = /<script[^>]*type=["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
        try {
            blocks.push(JSON.parse(match[1]));
        } catch (e) {
            errors.push(`Unparseable JSON-LD block: ${e.message}`);
        }
    }
    return blocks;
}

/** Collect every @type present in a JSON-LD node tree (nested included). */
function collectTypes(node, types = []) {
    if (Array.isArray(node)) {
        node.forEach((n) => collectTypes(n, types));
    } else if (node && typeof node === 'object') {
        if (node['@type']) types.push(node['@type']);
        Object.values(node).forEach((v) => collectTypes(v, types));
    }
    return types;
}

/**
 * Validate one page's JSON-LD blocks against the expected schema set.
 */
function validatePage(page, blocks) {
    const errors = [];
    const warnings = [];

    const allTypes = blocks.flatMap((b) => collectTypes(b));

    // 1. JobPosting must NOT exist anywhere (candidate site, not an employer)
    if (allTypes.includes('JobPosting')) {
        errors.push('JobPosting markup found — employer-only schema, must not appear on a CV');
    }

    // 2. Exactly one ProfilePage wrapping a valid Person
    const profilePages = blocks.filter((b) => b['@type'] === 'ProfilePage');
    if (profilePages.length !== 1) {
        errors.push(`Expected exactly 1 ProfilePage, found ${profilePages.length}`);
    } else {
        const person = profilePages[0].mainEntity;
        if (!person || person['@type'] !== 'Person') {
            errors.push('ProfilePage.mainEntity is not a Person');
        } else {
            ['name', 'jobTitle', 'url'].forEach((field) => {
                if (!person[field]) errors.push(`Person missing required field: ${field}`);
            });
            if (!Array.isArray(person.sameAs) || person.sameAs.length < 1) {
                errors.push('Person.sameAs must list at least one external profile');
            }
        }
    }

    // 3. One WebSite node with name + url
    const websites = blocks.filter((b) => b['@type'] === 'WebSite');
    if (websites.length !== 1) {
        errors.push(`Expected exactly 1 WebSite, found ${websites.length}`);
    } else {
        if (!websites[0].name) errors.push('WebSite missing name');
        if (!websites[0].url) errors.push('WebSite missing url');
    }

    // 4. Pages that use BreadcrumbSchema must emit a BreadcrumbList
    if (BREADCRUMB_PAGES.includes(page) && !allTypes.includes('BreadcrumbList')) {
        warnings.push('Expected page to emit a BreadcrumbList, but none found');
    }

    return { errors, warnings, types: [...new Set(allTypes)] };
}

async function main() {
    console.log('🚀 Structured Data Validation (real dist/ output)\n');

    try {
        await fs.access(DIST_DIR);
    } catch {
        console.warn('⚠️  dist/ not found — run `pnpm run build` first for a meaningful check.');
        console.warn('   Skipping (exit 0) so standalone `pnpm run check` keeps working.');
        return;
    }

    const report = { generatedAt: new Date().toISOString(), pages: {} };
    let failed = false;

    for (const page of PAGES_TO_CHECK) {
        const filePath = path.join(DIST_DIR, page);
        console.log(`📋 Checking: ${page}`);

        let html;
        try {
            html = await fs.readFile(filePath, 'utf-8');
        } catch {
            console.error(`   ❌ Missing build output: ${page}`);
            report.pages[page] = { errors: ['file missing from dist/'] };
            failed = true;
            continue;
        }

        const parseErrors = [];
        const blocks = extractJsonLd(html, parseErrors);
        const { errors, warnings, types } = validatePage(page, blocks);
        errors.push(...parseErrors);

        report.pages[page] = { types, errors, warnings };

        if (errors.length) {
            failed = true;
            errors.forEach((e) => console.error(`   ❌ ${e}`));
        } else {
            console.log(`   ✅ Valid (${types.join(', ')})`);
        }
        warnings.forEach((w) => console.warn(`   ⚠️  ${w}`));
    }

    await fs.writeFile(REPORT_FILE, JSON.stringify(report, null, 2));
    console.log(`\n📄 Validation report saved to: ${REPORT_FILE}`);

    if (failed) {
        console.error('\n❌ Structured data validation FAILED');
        process.exit(1);
    }
    console.log('\n✅ All structured data validations passed!');
}

main();
