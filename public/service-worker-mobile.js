// public/service-worker-mobile.js
// Service Worker optimizado para dispositivos móviles

const CACHE_NAME = "oriolmacias-cv-mobile-v1";

// Recursos críticos para precarga en móvil
const CRITICAL_RESOURCES = [
  "/",
  "/index.html",
  "/styles/critical-mobile.css",
  "/images/oriol_macias-sm.avif",
  "/images/oriol_macias-sm.webp",
  "/images/oriol_macias-sm.jpg",
  "/styles/fonts/fa-solid-900.woff2",
  "/styles/fonts/fa-brands-400.woff2",
  "/styles/font-awesome-optimized.css",
];

// Instalación - precargar recursos críticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CRITICAL_RESOURCES);
    }),
  );

  // Activar inmediatamente
  self.skipWaiting();
});

// Activación - limpiar cachés antiguos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
    }),
  );

  // Reclamar clientes
  self.clients.claim();
});

// Estrategia: Cache First con Network Fallback para recursos críticos
// y Network First con Cache Fallback para el resto
self.addEventListener("fetch", (event) => {
  // Solo manejar solicitudes GET
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Solo manejar solicitudes de nuestro dominio
  if (url.origin !== self.location.origin) return;

  // Estrategia para recursos críticos
  if (CRITICAL_RESOURCES.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).then((fetchResponse) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
        );
      }),
    );
    return;
  }

  // Estrategia para el resto de recursos
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, almacenarla en caché
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si la red falla, intentar servir desde caché
        return caches.match(event.request);
      }),
  );
});
