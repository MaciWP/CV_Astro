// Service Worker for Oriol Macias CV Portfolio
const CACHE_NAME = 'oriol-macias-cv-v2'; // Incremented version
const FONT_AWESOME_URL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';

// Core assets that must be cached for offline functionality
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.svg',
    '/styles/font-awesome.min.css',
    '/styles/global.css',
    '/images/oriol_macias.jpg',
    '/styles/fonts/fa-solid-900.woff2',
    '/styles/fonts/fa-brands-400.woff2'
];

// Assets that should be cached but aren't critical
const SECONDARY_ASSETS = [
    FONT_AWESOME_URL,
    '/404.html'
];

// Installation event - cache crucial assets
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');

    // Skip waiting forces the waiting service worker to become the active service worker
    self.skipWaiting();

    event.waitUntil(
        Promise.all([
            // Cache core assets first
            caches.open(CACHE_NAME).then((cache) => {
                console.log('[ServiceWorker] Caching core assets');
                return cache.addAll(CORE_ASSETS);
            }),

            // Then cache secondary assets
            caches.open(CACHE_NAME).then((cache) => {
                console.log('[ServiceWorker] Caching secondary assets');
                // Use Promise.allSettled to continue even if some assets fail to cache
                return Promise.allSettled(
                    SECONDARY_ASSETS.map(url =>
                        fetch(url, { mode: 'no-cors' })
                            .then(response => cache.put(url, response))
                            .catch(error => console.log(`Failed to cache: ${url}`, error))
                    )
                );
            })
        ])
    );
});

// Activation event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');

    // Claim control instantly, rather than waiting for reload
    event.waitUntil(self.clients.claim());

    // Clean up old caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[ServiceWorker] Removing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - respond with cached content when offline
self.addEventListener('fetch', (event) => {
    // Parse the URL
    const requestURL = new URL(event.request.url);

    // Special handling for Font Awesome
    if (event.request.url.includes('font-awesome') ||
        event.request.url.includes('cdnjs.cloudflare.com')) {
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        // Return the cached version
                        return cachedResponse;
                    }

                    // If not in cache, try to fetch and cache it
                    return fetch(event.request, { mode: 'no-cors' })
                        .then((response) => {
                            // Cache the fetched response
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                            return response;
                        })
                        .catch(() => {
                            // If specific Font Awesome CDN fails, try local version
                            if (event.request.url.includes('cdnjs.cloudflare.com')) {
                                return caches.match('/styles/font-awesome.min.css');
                            }
                            return new Response('Font could not be fetched', { status: 503 });
                        });
                })
        );
        return;
    }

    // For all other requests, use a "stale-while-revalidate" strategy
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                // Even if we found a match in the cache, we fetch to update the cache for next time
                const fetchPromise = fetch(event.request)
                    .then((networkResponse) => {
                        // Don't cache responses from external domains
                        if (requestURL.origin === location.origin) {
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, networkResponse.clone());
                                });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        // If fetch fails (offline) and we're trying to navigate to a page
                        if (event.request.mode === 'navigate') {
                            return caches.match('/');
                        }

                        // Return nothing (will trigger appropriate error handling in the app)
                        return null;
                    });

                // Return the cached response immediately, or wait for network if nothing cached
                return cachedResponse || fetchPromise;
            })
    );
});