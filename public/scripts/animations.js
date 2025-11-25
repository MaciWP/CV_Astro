/**
 * Lightweight Intersection Observer for scroll animations
 * Optimized to prevent CLS (Cumulative Layout Shift)
 * Uses requestAnimationFrame to batch DOM reads/writes
 */

(function() {
  'use strict';

  var animationObserver = null;
  var initialized = false;

  function initAnimations() {
    if (initialized) return;
    initialized = true;

    if (animationObserver) animationObserver.disconnect();

    var observerOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    animationObserver = new IntersectionObserver(function(entries) {
      // Batch all DOM writes in a single rAF
      requestAnimationFrame(function() {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            animationObserver.unobserve(entry.target);
          }
        });
      });
    }, observerOptions);

    // Use rAF to avoid forced reflow - read all positions first, then write
    requestAnimationFrame(function() {
      var animatedElements = document.querySelectorAll(
        '.animate-on-scroll, .animate-scale, .animate-fade-left, .animate-width'
      );

      // Make above-the-fold elements visible immediately (no animation)
      // This prevents CLS by not animating content that's already visible
      var viewportHeight = window.innerHeight;

      animatedElements.forEach(function(el) {
        if (el.classList.contains('is-visible')) return;

        // Check if element is in initial viewport (above-the-fold)
        var rect = el.getBoundingClientRect();
        var isAboveFold = rect.top < viewportHeight;

        if (isAboveFold) {
          // Immediately show without animation to prevent CLS
          el.classList.add('is-visible', 'no-animation');
        } else {
          // Only animate elements below the fold
          animationObserver.observe(el);
        }
      });
    });
  }

  // Single initialization - no repeated calls
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    // Use rAF to defer initialization and not block rendering
    requestAnimationFrame(initAnimations);
  }
})();
