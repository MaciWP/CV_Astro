// Service Worker for Oriol Macias CV Portfolio
const CACHE_NAME = 'oriol-macias-cv-v2';

// Core assets that must be cached for offline functionality
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.svg',
    '/styles/font-awesome.min.css',
    '/styles/font-awesome-fallback.css',
    '/styles/global.css',
    '/styles/fonts/fa-solid-900.woff2',
    '/styles/fonts/fa-brands-400.woff2',
    '/styles/fonts/fa-regular-400.woff2',
    '/images/oriol_macias.jpg'
];

// Additional assets to cache if available
const ADDITIONAL_ASSETS = [
    '/404.html'
];

// Installation event - cache crucial assets
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');

    // Skip waiting forces the waiting service worker to become the active service worker
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Caching core assets');
                return cache.addAll(CORE_ASSETS)
                    .then(() => {
                        // Try to cache additional assets, but don't fail if some are missing
                        return cache.addAll(ADDITIONAL_ASSETS)
                            .catch(err => console.log('[ServiceWorker] Some additional assets failed to cache:', err));
                    });
            })
    );
});

// Activation event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');

    // Claim control immediately
    event.waitUntil(self.clients.claim());

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

    // Special handling for font files - top priority
    if (requestURL.pathname.includes('/fonts/') ||
        requestURL.pathname.includes('font-awesome')) {

        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    // If we have it in cache, return it immediately
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // Otherwise fetch from network and cache
                    return fetch(event.request)
                        .then((networkResponse) => {
                            // Clone the response to cache it
                            const responseToCache = networkResponse.clone();

                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, responseToCache);
                                });

                            return networkResponse;
                        })
                        .catch(() => {
                            // If specific font file fails, try to return a fallback
                            if (requestURL.pathname.includes('fa-solid-900.woff2')) {
                                return caches.match('/styles/fonts/fa-solid-900.woff2');
                            }
                            if (requestURL.pathname.includes('fa-brands-400.woff2')) {
                                return caches.match('/styles/fonts/fa-brands-400.woff2');
                            }
                            return new Response('Font resource not found', { status: 404 });
                        });
                })
        );
        return;
    }

    // For all other requests, use a "network first, falling back to cache" strategy
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // If we get a valid response, clone it and update the cache
                if (networkResponse && networkResponse.status === 200 &&
                    (requestURL.origin === location.origin || requestURL.hostname.includes('cdnjs.cloudflare.com'))) {

                    const clonedResponse = networkResponse.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clonedResponse);
                    });
                }

                return networkResponse;
            })
            .catch(() => {
                // Network failed, try the cache
                return caches.match(event.request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }

                        // If it's a navigation request and no cached version exists, return the homepage
                        if (event.request.mode === 'navigate') {
                            return caches.match('/');
                        }

                        // Otherwise, just fail
                        return new Response('Network error and no cached version available', { status: 503 });
                    });
            })
    );
});