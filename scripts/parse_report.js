import { readFileSync } from 'fs';
const path = 'd:\\PYTHON\\CV_Astro\\informes\\69225d69970cfb0008c8202d--oriolmacias.netlify.app_2025-11-23_02-04-11.json';

try {
    const report = JSON.parse(readFileSync(path, 'utf8'));

    console.log('--- Scores ---');
    if (report.categories) {
        const targetCategories = ['accessibility', 'best-practices'];
        for (const [id, category] of Object.entries(report.categories)) {
            if (!targetCategories.includes(id)) continue;

            console.log(`${category.title} (${id}): ${category.score * 100}`);

            // Find audits belonging to this category that failed
            const categoryAudits = category.auditRefs;
            if (categoryAudits) {
                categoryAudits.forEach(ref => {
                    const audit = report.audits[ref.id];
                    if (audit && audit.score !== null && audit.score < 1) {
                        console.log(`  - [${ref.id}] ${audit.title} (Score: ${audit.score})`);
                        if (ref.id === 'color-contrast' && audit.details && audit.details.items) {
                            audit.details.items.forEach(item => {
                                console.log(`    - Node: ${item.node ? item.node.nodeLabel : 'N/A'}`);
                                console.log(`    - Selector: ${item.node ? item.node.selector : 'N/A'}`);
                            });
                        }
                    }
                });
            }
        }
    } else {
        console.log('No categories found.');
    }

} catch (err) {
    console.error('Error reading/parsing report:', err);
}
