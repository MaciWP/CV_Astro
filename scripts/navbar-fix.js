/**
 * Enhanced Navbar Fix Script
 * Ensures navbar stays sticky across browsers and viewport sizes
 * File: public/scripts/navbar-fix.js
 */
(function () {
    // Function to apply mandatory sticky behavior to navbar
    function enforceNavbarSticky() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyNavbarFix);
        } else {
            applyNavbarFix();
        }

        // Also try after all resources are loaded
        window.addEventListener('load', applyNavbarFix);

        // And periodically check to ensure it stays fixed
        setInterval(applyNavbarFix, 2000);
    }

    function applyNavbarFix() {
        // Select all nav elements, but prioritize those with role="navigation"
        const navbars = document.querySelectorAll('nav[role="navigation"], nav');

        navbars.forEach(navbar => {
            // Skip if already processed to avoid redundant operations
            if (navbar.hasAttribute('data-sticky-fixed')) return;

            // Mark as processed
            navbar.setAttribute('data-sticky-fixed', 'true');

            // Ensure it has sticky class
            if (!navbar.classList.contains('sticky')) {
                navbar.classList.add('sticky');
            }

            // Set the navbar height as a CSS variable for spacing calculations
            document.documentElement.style.setProperty('--navbar-height', `${navbar.offsetHeight}px`);

            // Apply critical inline styles with !important
            navbar.style.cssText += `
                position: sticky !important;
                position: -webkit-sticky !important;
                top: 0 !important;
                z-index: 999 !important;
            `;

            // For iOS Safari - known to have issues with sticky positioning
            if ((/iPad|iPhone|iPod/.test(navigator.userAgent)) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {

                // Fix position only if not already fixed
                if (getComputedStyle(navbar).position !== 'fixed') {
                    navbar.style.cssText += `
                        position: fixed !important;
                        width: 100% !important;
                        left: 0 !important;
                    `;

                    // Add spacing to prevent content jump
                    if (!document.body.hasAttribute('data-navbar-fixed')) {
                        const navbarHeight = navbar.offsetHeight;
                        document.body.style.paddingTop = navbarHeight + 'px';
                        document.body.setAttribute('data-navbar-fixed', 'true');
                    }
                }
            }
        });
    }

    // Run immediately
    enforceNavbarSticky();

    // Also run after resize events (with debounce)
    let resizeTimer;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(enforceNavbarSticky, 250);
    });
})();