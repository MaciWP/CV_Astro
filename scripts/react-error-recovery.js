// public/scripts/react-error-recovery.js
(function () {
    // Solo ejecutarse una vez
    if (window._reactErrorHandlerApplied) return;
    window._reactErrorHandlerApplied = true;

    // Almacenar el error original
    const originalError = console.error;

    // Interceptar errores de React específicos
    console.error = function (...args) {
        const errorMessage = args.join(' ');

        // Detectar errores específicos de hidratación
        if (errorMessage.includes('Minified React error #423') ||
            errorMessage.includes('Minified React error #425')) {

            // Intentar recuperación de hidratación fallida
            // Esperar al final del ciclo de eventos para no interrumpir React
            setTimeout(() => {
                try {
                    // Buscar y refrescar islas de Astro con problemas
                    document.querySelectorAll('astro-island').forEach(island => {
                        // Solo refrescar si tiene atributo client:visible o client:load
                        if (island.hasAttribute('client:visible') ||
                            island.hasAttribute('client:load')) {

                            // Forzar actualización del componente sin causar cambios visuales
                            const originalDisplay = island.style.display;
                            island.style.display = 'none';

                            // Forzar recálculo de layout
                            void island.offsetHeight;

                            // Restaurar
                            island.style.display = originalDisplay;
                        }
                    });
                } catch (e) {
                    // Ignorar errores en la recuperación
                }
            }, 100);
        }

        // Llamar al error original para mantener la funcionalidad de consola
        originalError.apply(console, args);
    };
})();