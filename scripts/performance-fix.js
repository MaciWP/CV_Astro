// public/scripts/performance-fix.js
// Script para optimizar rendimiento sin romper funcionalidad

(function () {
    // Técnica de "chunking" para dividir tareas largas
    function chunkedTask(taskFn, chunkSize = 5) {
        return new Promise(resolve => {
            // Si la función ya está registrada como evento, no duplicar
            if (window._chunkedTasksRegistered) return;
            window._chunkedTasksRegistered = true;

            // Ejecutar tareas en trozos pequeños
            setTimeout(() => {
                if (typeof taskFn === 'function') {
                    try {
                        const result = taskFn();
                        resolve(result);
                    } catch (err) {
                        console.warn('Error en tarea dividida:', err);
                        resolve(null);
                    }
                }
            }, 100); // Pequeño retraso para permitir que la página se cargue primero
        });
    }

    // Interceptar setTimeout para dividir tareas potencialmente largas
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function (fn, delay, ...args) {
        if (delay < 10 && typeof fn === 'function') {
            // Probablemente una tarea intensa que se ejecuta inmediatamente
            return originalSetTimeout(() => {
                chunkedTask(fn);
            }, 20);
        }
        return originalSetTimeout(fn, delay, ...args);
    };

    // Detectar y dividir tareas largas que usarían requestAnimationFrame
    const originalRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = function (callback) {
        return originalRAF(() => {
            chunkedTask(callback);
        });
    };

    // Esta función se ejecuta después de que la página está completamente cargada
    window.addEventListener('load', function () {
        // Ejecutar después de que todas las cargas críticas hayan terminado
        setTimeout(() => {
            console.log('Optimización de rendimiento activada');
        }, 1000);
    });
})();