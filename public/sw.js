/**
 * Service Worker — lean caching for a static site.
 * Hashed/static assets (/_astro/*, fonts, images, js, css) are cache-first
 * (content-hashed or rarely change); HTML navigations are network-first so
 * updates show immediately, with a cache fallback for offline.
 * @file public/sw.js
 */

// Bump the version to invalidate old caches on activate.
const STATIC_CACHE = 'oriol-cv-static-v5';
const ASSET_CACHE = 'oriol-cv-assets-v5';
const VALID_CACHES = [STATIC_CACHE, ASSET_CACHE];

// Lifecycle logging is opt-in (keeps the production console clean).
// console.error calls stay as real failure diagnostics.
const DEBUG = false;
const log = (...args) => { if (DEBUG) console.log(...args); };

// App shell precached on install.
const CORE_ASSETS = ['/', '/manifest.json', '/favicon.svg'];
const SECONDARY_ASSETS = ['/es', '/fr', '/de', '/404.html'];

// Cache-first candidates: content-hashed bundles, fonts, images, js/css.
function isAsset(url) {
    const p = new URL(url).pathname;
    return (
        p.includes('/_astro/') ||
        p.includes('/fonts/') ||
        p.includes('/images/') ||
        /\.(woff2?|ttf|otf|eot|jpe?g|png|gif|svg|webp|avif|js|css)$/i.test(p)
    );
}

self.addEventListener('install', (event) => {
    log('[ServiceWorker] Installing...');
    self.skipWaiting();
    event.waitUntil((async () => {
        const cache = await caches.open(STATIC_CACHE);
        await cache.addAll(CORE_ASSETS);
        try {
            await cache.addAll(SECONDARY_ASSETS);
        } catch (error) {
            log('[ServiceWorker] Some secondary assets could not be cached:', error);
        }
    })());
});

self.addEventListener('activate', (event) => {
    log('[ServiceWorker] Activating...');
    event.waitUntil((async () => {
        await self.clients.claim();
        const names = await caches.keys();
        await Promise.all(
            names.filter((n) => !VALID_CACHES.includes(n)).map((n) => caches.delete(n))
        );
    })());
});

self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Only handle same-origin GET requests.
    if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
        return;
    }

    // Cache-first for hashed/static assets.
    if (isAsset(request.url)) {
        event.respondWith((async () => {
            const cache = await caches.open(ASSET_CACHE);
            const cached = await cache.match(request);
            if (cached) return cached;
            try {
                const response = await fetch(request);
                if (response.ok) cache.put(request, response.clone());
                return response;
            } catch (error) {
                if (request.destination === 'image') {
                    const fallback = await caches.match('/favicon.svg');
                    if (fallback) return fallback;
                }
                console.error(`[ServiceWorker] Asset fetch failed: ${request.url}`, error);
                throw error;
            }
        })());
        return;
    }

    // Network-first for HTML navigations (fresh content), cache fallback offline.
    if (request.mode === 'navigate' || request.destination === 'document') {
        event.respondWith((async () => {
            try {
                const response = await fetch(request);
                if (response.ok) {
                    const cache = await caches.open(STATIC_CACHE);
                    cache.put(request, response.clone());
                }
                return response;
            } catch (error) {
                const cached = await caches.match(request);
                if (cached) return cached;
                const index = await caches.match('/');
                if (index) return index;
                console.error(`[ServiceWorker] Navigation fetch failed: ${request.url}`, error);
                return new Response(
                    '<!doctype html><meta charset="utf-8"><title>Offline</title><h1>Offline</h1><p>This page is not available offline.</p>',
                    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
                );
            }
        })());
    }
});
