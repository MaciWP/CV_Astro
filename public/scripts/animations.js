/**
 * Lightweight Intersection Observer for scroll animations
 * Handles both initial load and scroll-triggered animations
 * Works with Astro islands (React hydration)
 */

(function() {
  'use strict';

  var animationObserver = null;

  function initAnimations() {
    if (animationObserver) animationObserver.disconnect();

    var observerOptions = {
      root: null,
      rootMargin: '100px',
      threshold: 0.05
    };

    animationObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.style.transitionDelay || '0ms';
          var delayMs = parseInt(delay) || 0;

          setTimeout(function() {
            entry.target.classList.add('is-visible');
          }, delayMs);

          animationObserver.unobserve(entry.target);
        }
      });
    }, observerOptions);

    var animatedElements = document.querySelectorAll(
      '.animate-on-scroll, .animate-scale, .animate-fade-left, .animate-width'
    );

    animatedElements.forEach(function(el) {
      if (el.classList.contains('is-visible')) return;

      var rect = el.getBoundingClientRect();
      var isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        var delay = el.style.transitionDelay || '0ms';
        var delayMs = parseInt(delay) || 0;

        setTimeout(function() {
          el.classList.add('is-visible');
        }, delayMs + 50);
      } else {
        animationObserver.observe(el);
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }

  // Re-run after React hydration delays
  setTimeout(initAnimations, 100);
  setTimeout(initAnimations, 500);
})();
