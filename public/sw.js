/**
 * Enhanced Service Worker with optimized caching strategy
 * Improves performance through intelligent resource caching
 * File: public/sw.js
 */

// Cache names for different resource types
const STATIC_CACHE_NAME = "oriol-macias-cv-static-v1";
const IMAGE_CACHE_NAME = "oriol-macias-cv-images-v1";
const FONT_CACHE_NAME = "oriol-macias-cv-fonts-v1";
const DYNAMIC_CACHE_NAME = "oriol-macias-cv-dynamic-v1";

// Resources that will always be cached immediately (core app shell)
const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/favicon.svg",
  "/styles/global.css",
  "/_astro/index.css",
  "/_astro/client.js",
];

// Resources that will be cached during installation if available
const SECONDARY_ASSETS = [
  "/es/",
  "/fr/",
  "/404.html",
  "/styles/animation-system.css",
  "/styles/natural-theme-transitions.css",
  "/styles/theme-toggle.css",
];

// Cache settings for different resource types
const CACHE_SETTINGS = {
  fonts: {
    cacheName: FONT_CACHE_NAME,
    expiration: 30 * 24 * 60 * 60, // 30 days
  },
  images: {
    cacheName: IMAGE_CACHE_NAME,
    expiration: 7 * 24 * 60 * 60, // 7 days
  },
  static: {
    cacheName: STATIC_CACHE_NAME,
    expiration: 24 * 60 * 60, // 1 day
  },
  dynamic: {
    cacheName: DYNAMIC_CACHE_NAME,
    expiration: 24 * 60 * 60, // 1 day
  },
};

/**
 * Helper function to determine resource type based on URL
 * @param {string} url - The resource URL to categorize
 * @returns {string} - Resource category: 'fonts', 'images', 'static', or 'dynamic'
 */
function getResourceType(url) {
  const urlObj = new URL(url);

  // Font files
  if (
    urlObj.pathname.includes("/fonts/") ||
    urlObj.pathname.match(/\.(woff2?|ttf|otf|eot)$/i)
  ) {
    return "fonts";
  }

  // Image files
  if (
    urlObj.pathname.match(/\.(jpe?g|png|gif|svg|webp|avif)$/i) ||
    urlObj.pathname.includes("/images/")
  ) {
    return "images";
  }

  // Static assets (JS, CSS)
  if (
    urlObj.pathname.match(/\.(js|css)$/i) ||
    urlObj.pathname.includes("/_astro/")
  ) {
    return "static";
  }

  // Default: dynamic content
  return "dynamic";
}

/**
 * Opens the appropriate cache based on resource type
 * @param {string} url - The resource URL
 * @returns {Promise<Cache>} - The opened cache object
 */
async function openCacheForUrl(url) {
  const resourceType = getResourceType(url);
  const cacheName = CACHE_SETTINGS[resourceType].cacheName;
  return await caches.open(cacheName);
}

/**
 * Caches a network response with appropriate expiration
 * @param {Request} request - The original request
 * @param {Response} response - The response to cache
 */
async function cacheResponse(request, response) {
  try {
    // Don't cache non-GET requests or failed responses
    if (request.method !== "GET" || !response || response.status !== 200) {
      return;
    }

    // Don't cache responses with no-store cache control
    const cacheControl = response.headers.get("Cache-Control");
    if (cacheControl && cacheControl.includes("no-store")) {
      return;
    }

    // Clone the response as it can only be used once
    const responseToCache = response.clone();

    // Open the appropriate cache and store response
    const cache = await openCacheForUrl(request.url);
    await cache.put(request, responseToCache);

    // Store timestamp for expiration checks
    const resourceType = getResourceType(request.url);
    const expiration = CACHE_SETTINGS[resourceType].expiration;
    const expirationTime = Date.now() + expiration * 1000;

    // Store metadata in a separate cache if needed
    if (expiration) {
      const metadataCache = await caches.open("cache-metadata");
      await metadataCache.put(
        new Request(`metadata:${request.url}`),
        new Response(JSON.stringify({ expirationTime })),
      );
    }
  } catch (error) {
    console.error("Error caching response:", error);
  }
}

/**
 * Checks if a cached response has expired
 * @param {string} url - The cached resource URL
 * @returns {Promise<boolean>} - Whether the resource has expired
 */
async function hasExpired(url) {
  try {
    const metadataCache = await caches.open("cache-metadata");
    const metadataResponse = await metadataCache.match(
      new Request(`metadata:${url}`),
    );

    if (!metadataResponse) {
      return false; // No metadata, assume not expired
    }

    const metadata = await metadataResponse.json();
    return Date.now() > metadata.expirationTime;
  } catch (error) {
    console.error("Error checking expiration:", error);
    return false;
  }
}

/**
 * Clean expired items from all caches
 */
async function cleanExpiredCache() {
  try {
    const metadataCache = await caches.open("cache-metadata");
    const metadataRequests = await metadataCache.keys();

    for (const request of metadataRequests) {
      // Extract URL from metadata key
      const url = request.url.replace("metadata:", "");

      if (await hasExpired(url)) {
        // Find and delete from the appropriate cache
        const resourceType = getResourceType(url);
        const cacheName = CACHE_SETTINGS[resourceType].cacheName;
        const cache = await caches.open(cacheName);
        await cache.delete(new Request(url));
        await metadataCache.delete(request);
      }
    }
  } catch (error) {
    console.error("Error cleaning expired cache:", error);
  }
}

// SW Install Event - Cache core assets
self.addEventListener("install", (event) => {
  console.log("[ServiceWorker] Installing...");

  // Skip waiting to activate immediately
  self.skipWaiting();

  event.waitUntil(
    (async () => {
      // Cache core assets
      const staticCache = await caches.open(STATIC_CACHE_NAME);
      await staticCache.addAll(CORE_ASSETS);
      console.log("[ServiceWorker] Core assets cached");

      // Try to cache secondary assets, but don't fail if some are missing
      try {
        await staticCache.addAll(SECONDARY_ASSETS);
        console.log("[ServiceWorker] Secondary assets cached");
      } catch (error) {
        console.log(
          "[ServiceWorker] Some secondary assets could not be cached:",
          error,
        );
      }
    })(),
  );
});

// SW Activate Event - Clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[ServiceWorker] Activating...");

  // Claim clients immediately
  event.waitUntil(self.clients.claim());

  // Clean up old caches
  event.waitUntil(
    (async () => {
      // Get all existing cache names
      const cacheNames = await caches.keys();

      // Current valid cache names
      const validCacheNames = [
        STATIC_CACHE_NAME,
        IMAGE_CACHE_NAME,
        FONT_CACHE_NAME,
        DYNAMIC_CACHE_NAME,
        "cache-metadata",
      ];

      // Delete old caches
      const deletionPromises = cacheNames
        .filter((cacheName) => !validCacheNames.includes(cacheName))
        .map((cacheName) => {
          console.log(`[ServiceWorker] Deleting old cache: ${cacheName}`);
          return caches.delete(cacheName);
        });

      await Promise.all(deletionPromises);

      // Clean expired items from all caches
      await cleanExpiredCache();
    })(),
  );
});

// SW Fetch Event - Network-first strategy with cache fallback
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Skip non-GET requests and third-party URLs
  if (
    request.method !== "GET" ||
    !request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  // Parse URL
  const url = new URL(request.url);
  const resourceType = getResourceType(request.url);

  // Apply different strategies based on resource type
  if (resourceType === "fonts") {
    // Cache-first strategy for fonts (rarely change)
    event.respondWith(
      (async () => {
        const cache = await openCacheForUrl(request.url);
        const cachedResponse = await cache.match(request);

        if (cachedResponse && !(await hasExpired(request.url))) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          await cacheResponse(request, networkResponse);
          return networkResponse;
        } catch (error) {
          // Return cached response even if expired if network fails
          if (cachedResponse) {
            return cachedResponse;
          }

          // Return fallback font or error
          console.error(
            `[ServiceWorker] Font fetch failed: ${request.url}`,
            error,
          );
          throw error;
        }
      })(),
    );
  } else if (resourceType === "images") {
    // Cache-first strategy for images with background refresh
    event.respondWith(
      (async () => {
        const cache = await openCacheForUrl(request.url);
        const cachedResponse = await cache.match(request);

        // If found in cache and not expired, use cache
        if (cachedResponse && !(await hasExpired(request.url))) {
          // In background, check for updated version
          event.waitUntil(
            (async () => {
              try {
                const networkResponse = await fetch(request);
                await cacheResponse(request, networkResponse);
              } catch (error) {
                // Ignore network errors for background refresh
              }
            })(),
          );

          return cachedResponse;
        }

        // If not in cache or expired, fetch from network
        try {
          const networkResponse = await fetch(request);
          await cacheResponse(request, networkResponse);
          return networkResponse;
        } catch (error) {
          // Return cached response even if expired if network fails
          if (cachedResponse) {
            return cachedResponse;
          }

          // Return placeholder image for missing images
          if (request.destination === "image") {
            return caches.match("/images/placeholder.svg");
          }

          console.error(
            `[ServiceWorker] Image fetch failed: ${request.url}`,
            error,
          );
          throw error;
        }
      })(),
    );
  } else if (
    // HTML navigation requests should be network-first
    request.mode === "navigate" ||
    request.destination === "document"
  ) {
    event.respondWith(
      (async () => {
        try {
          // Try network first for latest content
          const networkResponse = await fetch(request);
          await cacheResponse(request, networkResponse);
          return networkResponse;
        } catch (error) {
          // If network fails, try cache
          const cache = await openCacheForUrl(request.url);
          const cachedResponse = await cache.match(request);

          if (cachedResponse) {
            return cachedResponse;
          }

          // If cache fails, try to return the index page
          if (request.mode === "navigate") {
            const indexCache = await caches.open(STATIC_CACHE_NAME);
            const indexResponse = await indexCache.match("/");

            if (indexResponse) {
              return indexResponse;
            }
          }

          // If all else fails, show an offline page
          console.error(
            `[ServiceWorker] Navigation fetch failed: ${request.url}`,
            error,
          );

          // Return an offline page if available
          const offlineCache = await caches.open(STATIC_CACHE_NAME);
          const offlineResponse = await offlineCache.match("/offline.html");

          if (offlineResponse) {
            return offlineResponse;
          }

          // Last resort: generate a simple offline message
          return new Response(
            "<html><body><h1>Offline</h1><p>You are currently offline and this page is not available cached.</p></body></html>",
            {
              status: 503,
              statusText: "Service Unavailable",
              headers: new Headers({
                "Content-Type": "text/html",
              }),
            },
          );
        }
      })(),
    );
  } else {
    // For other resources (JS, CSS, etc), use stale-while-revalidate
    event.respondWith(
      (async () => {
        const cache = await openCacheForUrl(request.url);
        const cachedResponse = await cache.match(request);

        // Start fetching from network in background
        const networkPromise = fetch(request)
          .then((networkResponse) => {
            cacheResponse(request, networkResponse);
            return networkResponse.clone();
          })
          .catch((error) => {
            console.error(
              `[ServiceWorker] Resource fetch failed: ${request.url}`,
              error,
            );
            throw error;
          });

        // Return cached response immediately if available
        if (cachedResponse) {
          event.waitUntil(networkPromise); // Update cache in background
          return cachedResponse;
        }

        // Otherwise wait for network response
        return await networkPromise;
      })(),
    );
  }
});

// Clean expired cache every day
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }

  if (event.data === "cleanExpiredCache") {
    event.waitUntil(cleanExpiredCache());
  }
});

// Periodic cache cleanup
setInterval(
  () => {
    cleanExpiredCache();
  },
  24 * 60 * 60 * 1000,
); // Once per day
