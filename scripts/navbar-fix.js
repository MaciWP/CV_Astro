/**
 * Script para asegurar que el navbar se mantenga sticky
 * Este script se ejecuta al cargar la página
 */

(function () {
    // Función para aplicar forzosamente el comportamiento sticky al navbar
    function enforceNavbarSticky() {
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initNavbar);
        } else {
            initNavbar();
        }

        // También reintentar después de que todos los recursos se hayan cargado
        window.addEventListener('load', initNavbar);
    }

    function initNavbar() {
        // Seleccionar todos los elementos nav que deberían ser sticky
        const navbars = document.querySelectorAll('nav');

        navbars.forEach(navbar => {
            // Asegurarse de que tenga la clase sticky
            if (!navbar.classList.contains('sticky')) {
                navbar.classList.add('sticky');
            }

            // Aplicar estilos inline para garantizar el comportamiento
            navbar.style.position = 'sticky';
            navbar.style.top = '0';
            navbar.style.zIndex = '50';

            // Para problemas en iOS Safari
            if (!!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)) {
                navbar.style.position = 'fixed';
                navbar.style.width = '100%';
                navbar.style.left = '0';

                // Añadir padding al body para compensar el navbar fijo
                if (!document.body.hasAttribute('data-navbar-fixed')) {
                    document.body.style.paddingTop = navbar.offsetHeight + 'px';
                    document.body.setAttribute('data-navbar-fixed', 'true');
                }
            }
        });
    }

    // Ejecutar al cargar
    enforceNavbarSticky();

    // También ejecutar cuando se cambie de tamaño la ventana
    window.addEventListener('resize', function () {
        setTimeout(enforceNavbarSticky, 100);
    });
})();