/**
 * Service Worker optimizado con estrategias modernas
 * File: public/sw.js
 */

// Nombre del cache con versión para facilitar actualizaciones
const CACHE_NAME = 'oriol-macias-cv-v3';

// Config específica para estrategias de cache
const CACHE_CONFIG = {
    // Archivos esenciales - cachear inmediatamente, actualizar en segundo plano
    core: {
        name: 'core-v3',
        urls: [
            '/',
            '/index.html',
            '/manifest.json',
            '/favicon.svg',
            '/styles/global.css',
            '/styles/theme-transitions.css',
            '/styles/font-awesome-fallback.css',
            '/styles/fonts/fa-solid-900.woff2',
            '/styles/fonts/fa-brands-400.woff2',
        ],
        // Tiempo de refresco para actualizaciones
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
    },

    // Assets estáticos - larga duración, poco frecuentes de cambiar
    static: {
        name: 'static-assets-v3',
        urlPatterns: [
            /\.(?:js|css)$/,
            /\/images\/.*\.(?:png|jpg|webp|avif|svg)$/,
            /\/icons\/.*\.(?:png|svg)$/,
        ],
        // Mucho más largo para recursos estáticos
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    },

    // Datos dinámicos - Menor duración, actualización frecuente
    dynamic: {
        name: 'dynamic-content-v3',
        urlPatterns: [
            /\/locales\/.*\.json$/,
        ],
        // Tiempo menor para contenido potencialmente cambiante
        maxAge: 60 * 60 * 1000, // 1 hora
    },

    // Estrategia específica para fuentes
    fonts: {
        name: 'fonts-v3',
        urlPatterns: [
            /\/styles\/fonts\/.*$/,
            /\.(?:woff|woff2|ttf|otf)$/,
        ],
        // Las fuentes rara vez cambian
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    }
};

// Instalación - Precacheo de recursos esenciales
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Instalando versión moderna');

    // Activar inmediatamente, sin esperar
    self.skipWaiting();

    // Cachear recursos esenciales
    event.waitUntil(
        caches.open(CACHE_CONFIG.core.name)
            .then(cache => {
                console.log('[ServiceWorker] Precacheando recursos esenciales');
                return cache.addAll(CACHE_CONFIG.core.urls);
            })
            .catch(err => {
                console.error('[ServiceWorker] Error en precacheo:', err);
            })
    );
});

// Activación - Limpiar caches antiguos
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activando nueva versión');

    // Tomar control inmediatamente de todos los clientes
    event.waitUntil(self.clients.claim());

    // Limpiar caches antiguos
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            const validCacheNames = Object.values(CACHE_CONFIG).map(config => config.name);

            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Si el cache no está en la lista actual, eliminarlo
                    if (!validCacheNames.includes(cacheName)) {
                        console.log('[ServiceWorker] Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

/**
 * Determina a qué categoría pertenece una URL
 * @param {string} url - URL de la solicitud
 * @returns {string|null} Categoría o null si no coincide
 */
function getCacheCategory(url) {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;

    // Verificar por patrón exacto primero (recursos core)
    if (CACHE_CONFIG.core.urls.includes(pathname) ||
        CACHE_CONFIG.core.urls.includes(url)) {
        return 'core';
    }

    // Luego verificar por patrones de regex
    for (const category of ['fonts', 'static', 'dynamic']) {
        const patterns = CACHE_CONFIG[category].urlPatterns;
        if (patterns && patterns.some(pattern => pattern.test(pathname))) {
            return category;
        }
    }

    return null;
}

/**
 * Implementa una estrategia stale-while-revalidate
 * Devuelve contenido de cache mientras actualiza en segundo plano
 */
async function staleWhileRevalidate(request, cacheKey) {
    const cache = await caches.open(cacheKey);

    // Intentar primero desde cache
    const cachedResponse = await cache.match(request);

    // Iniciar actualización en segundo plano
    const fetchPromise = fetch(request)
        .then(networkResponse => {
            // Solo cachear respuestas exitosas
            if (networkResponse && networkResponse.status === 200) {
                // Clonar la respuesta antes de usarla
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(error => {
            console.error('[ServiceWorker] Error en fetch:', error);
            // Si hay un error de red, todavía podemos devolver la respuesta cacheada
            return cachedResponse || new Response('Network error', { status: 503 });
        });

    // Devolver respuesta cacheada si existe, sino esperar la red
    return cachedResponse || fetchPromise;
}

/**
 * Implementa una estrategia cache-first
 * Prioriza contenido de cache, solo va a la red si es necesario
 */
async function cacheFirst(request, cacheKey, maxAge) {
    const cache = await caches.open(cacheKey);

    // Intentar primero desde cache
    const cachedResponse = await cache.match(request);

    // Si hay respuesta en cache y no está expirada, usarla
    if (cachedResponse) {
        // Verificar si la respuesta está expirada
        const cacheDate = new Date(cachedResponse.headers.get('date') || 0);
        const ageInMs = Date.now() - cacheDate.getTime();

        if (ageInMs < maxAge) {
            // La respuesta de cache todavía es fresca
            return cachedResponse;
        }

        // Si expiró, intentar refrescarla en segundo plano
        fetch(request)
            .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                    cache.put(request, networkResponse);
                }
            })
            .catch(() => { /* Ignorar errores en actualizaciones en segundo plano */ });

        // Mientras tanto, devolver la respuesta existente aunque esté expirada
        return cachedResponse;
    }

    // Si no hay respuesta en cache, ir a la red
    try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200) {
            // Cachear la respuesta para uso futuro
            await cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('[ServiceWorker] Error en fetch:', error);
        // Sin respuesta en cache ni red
        return new Response('Offline and resource not cached', { status: 503 });
    }
}

/**
 * Implementa una estrategia network-first
 * Intenta primero desde la red, usa cache como fallback
 */
async function networkFirst(request, cacheKey) {
    const cache = await caches.open(cacheKey);

    try {
        // Intentar primero desde la red
        const networkResponse = await fetch(request);

        if (networkResponse && networkResponse.status === 200) {
            // Actualizar la cache con la respuesta más reciente
            await cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log('[ServiceWorker] Error en red, usando cache para:', request.url);

        // Si hay error de red, intentar desde cache
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Si tampoco hay en cache y es una navegación, mostrar offline fallback
        if (request.mode === 'navigate') {
            return cache.match('/offline.html') || caches.match('/index.html');
        }

        // Sin respuesta en red ni cache
        return new Response('Resource unavailable offline', { status: 503 });
    }
}

// Fetch - Estrategias de caché inteligentes
self.addEventListener('fetch', (event) => {
    // Solo interceptar peticiones GET
    if (event.request.method !== 'GET') return;

    // Ignorar solicitudes a otras URL que estén fuera de nuestro control
    const url = new URL(event.request.url);
    if (url.origin !== self.location.origin &&
        !url.hostname.includes('cdnjs.cloudflare.com')) {
        return;
    }

    // Determinar la categoría de la solicitud
    const category = getCacheCategory(event.request.url);

    if (category) {
        const config = CACHE_CONFIG[category];

        // Aplicar estrategia según categoría
        if (category === 'fonts') {
            // Cache-first para fuentes (alta prioridad, raramente cambian)
            event.respondWith(cacheFirst(event.request, config.name, config.maxAge));
        }
        else if (category === 'core' || category === 'static') {
            // Stale-while-revalidate para recursos core y estáticos
            event.respondWith(staleWhileRevalidate(event.request, config.name));
        }
        else if (category === 'dynamic') {
            // Network-first para contenido dinámico
            event.respondWith(networkFirst(event.request, config.name));
        }
    } else {
        // Para todo lo demás, usar network-first como estrategia segura
        event.respondWith(networkFirst(
            event.request,
            'dynamic-fallback-v3'
        ));
    }
});

// Mensaje - Para comunicación con la página
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }

    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => caches.delete(cacheName))
                );
            })
        );
    }
});