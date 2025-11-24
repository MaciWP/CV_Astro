import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const report = JSON.parse(fs.readFileSync('lighthouse-report.json', 'utf8'));

const categories = report.categories;
const scores = {
    performance: categories.performance.score * 100,
    accessibility: categories.accessibility.score * 100,
    'best-practices': categories['best-practices'].score * 100,
    seo: categories.seo.score * 100,
};

const output = [];
const log = (msg) => output.push(msg);

log('Lighthouse Scores:');
log(JSON.stringify(scores, null, 2));

if (scores.performance < 100 || scores.accessibility < 100 || scores['best-practices'] < 100 || scores.seo < 100) {
    log('\nFailed Audits:');
    const audits = report.audits;
    for (const [key, audit] of Object.entries(audits)) {
        if (audit.score !== 1 && audit.score !== null && audit.scoreDisplayMode !== 'notApplicable' && audit.scoreDisplayMode !== 'manual') {
            log(`- ${audit.title} (${audit.id}): ${audit.score}`);
        }
    }
}

log('\n--- DIAGNOSTICS ---');
const renderBlocking = report.audits['render-blocking-resources'];
if (renderBlocking?.score !== 1 && renderBlocking?.details?.items) {
    log('\nRender Blocking Resources:');
    renderBlocking.details.items.forEach(item => {
        log(`- ${item.url} (Transfer: ${item.transferSize} bytes, Wasted: ${item.wastedMs} ms)`);
    });
}

const lcpElement = report.audits['largest-contentful-paint-element'];
if (lcpElement?.details?.items?.length > 0) {
    log('\nLCP Element:');
    log(lcpElement.details.items[0].node.snippet);
}

const unoptimizedImages = report.audits['modern-image-formats'];
if (unoptimizedImages?.score !== 1 && unoptimizedImages?.details?.items) {
    log('\nUnoptimized Images:');
    unoptimizedImages.details.items.forEach(item => {
        log(`- ${item.url} (Wasted: ${item.wastedBytes} bytes)`);
    });
}

fs.writeFileSync('lighthouse-summary.txt', output.join('\n'));
console.log('Summary written to lighthouse-summary.txt');
