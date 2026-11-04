/**
 * Monthly Search Console report, printed as Markdown (the workflow posts it as
 * an issue). Last 28 days of complete data against the 28 before, top pages and
 * queries, and sitemap status.
 *
 * Auth: a Google service account added as a Restricted user on the property.
 * Its JSON key comes from the GSC_SERVICE_ACCOUNT_JSON env var; the token asks
 * only for the read-only scope. Node built-ins only: no dependency.
 * File: scripts/seo-report.js
 */
import { createSign } from 'node:crypto';

const SITE = process.env.GSC_SITE || 'sc-domain:oriolmacias.dev';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API = 'https://www.googleapis.com/webmasters/v3';
// Search Console data settles in ~2-3 days; stop before the incomplete days.
const LAG_DAYS = 3;
const WINDOW = 28;

const b64url = (input) => Buffer.from(input).toString('base64url');

async function accessToken({ client_email, private_key }) {
    const now = Math.floor(Date.now() / 1000);
    const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
    const claims = b64url(JSON.stringify({
        iss: client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600,
    }));
    const signature = createSign('RSA-SHA256').update(`${header}.${claims}`).sign(private_key, 'base64url');
    const res = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            assertion: `${header}.${claims}.${signature}`,
        }),
    });
    if (!res.ok) throw new Error(`token request failed: ${res.status} ${await res.text()}`);
    return (await res.json()).access_token;
}

async function api(token, path, body) {
    const res = await fetch(`${API}${path}`, {
        method: body ? 'POST' : 'GET',
        headers: { Authorization: `Bearer ${token}`, ...(body && { 'Content-Type': 'application/json' }) },
        body: body && JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`${path} failed: ${res.status} ${await res.text()}`);
    return res.json();
}

const day = (offset) => new Date(Date.now() - offset * 86_400_000).toISOString().slice(0, 10);

function query(token, start, end, dimensions = [], rowLimit = 25_000) {
    const path = `/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`;
    return api(token, path, { startDate: start, endDate: end, dimensions, rowLimit })
        .then((r) => r.rows ?? []);
}

const totals = (rows) => rows[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 };
const pct = (x) => `${(x * 100).toFixed(1)} %`;
const delta = (now, before) => `${now >= before ? '+' : ''}${now - before}`;

function table(title, key, rows) {
    if (rows.length === 0) return `### ${title}\n\nNo rows (Google hides low-volume queries).\n`;
    // The API orders by clicks and breaks ties arbitrarily, so with 0 clicks we
    // fetch every row (rowLimit) and rank by impressions ourselves.
    const top = [...rows].sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions).slice(0, 10);
    const lines = top.map((r) =>
        `| ${r.keys[0]} | ${r.clicks} | ${r.impressions} | ${pct(r.ctr)} | ${r.position.toFixed(1)} |`);
    return [`### ${title}`, '', `| ${key} | Clicks | Impr. | CTR | Pos. |`, '|---|---|---|---|---|', ...lines, ''].join('\n');
}

async function main() {
    const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
    if (!raw) throw new Error('GSC_SERVICE_ACCOUNT_JSON is not set');
    const token = await accessToken(JSON.parse(raw));

    const end = day(LAG_DAYS);
    const start = day(LAG_DAYS + WINDOW - 1);
    const prevEnd = day(LAG_DAYS + WINDOW);
    const prevStart = day(LAG_DAYS + 2 * WINDOW - 1);

    const [now, before, pages, queries, sitemaps] = await Promise.all([
        query(token, start, end).then(totals),
        query(token, prevStart, prevEnd).then(totals),
        query(token, start, end, ['page']),
        query(token, start, end, ['query']),
        api(token, `/sites/${encodeURIComponent(SITE)}/sitemaps`).then((r) => r.sitemap ?? []),
    ]);

    const sitemapLines = sitemaps.map((s) =>
        `- ${s.path}: last downloaded ${s.lastDownloaded?.slice(0, 10) ?? 'never'}, ` +
        `${s.errors ?? 0} errors, ${s.warnings ?? 0} warnings`);

    console.log([
        `## Search Console: ${start} to ${end}`,
        '',
        `Property \`${SITE}\`. Compared with ${prevStart} to ${prevEnd}.`,
        '',
        '| Metric | Last 28 days | Change |',
        '|---|---|---|',
        `| Clicks | ${now.clicks} | ${delta(now.clicks, before.clicks)} |`,
        `| Impressions | ${now.impressions} | ${delta(now.impressions, before.impressions)} |`,
        `| CTR | ${pct(now.ctr)} | was ${pct(before.ctr)} |`,
        `| Avg. position | ${now.position.toFixed(1)} | was ${before.position.toFixed(1)} |`,
        '',
        table('Top pages', 'Page', pages),
        table('Top queries', 'Query', queries),
        '### Sitemaps',
        '',
        ...(sitemapLines.length ? sitemapLines : ['No sitemap submitted.']),
    ].join('\n'));
}

main().catch((err) => {
    console.error(`SEO report failed: ${err.message}`);
    process.exit(1);
});
