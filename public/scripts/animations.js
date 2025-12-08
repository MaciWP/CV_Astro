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

      var viewportHeight = window.innerHeight;
      var aboveFoldElements = [];

      // First pass: collect all elements and classify them
      animatedElements.forEach(function(el) {
        if (el.classList.contains('is-visible')) return;

        var rect = el.getBoundingClientRect();
        var isAboveFold = rect.top < viewportHeight;

        if (isAboveFold) {
          // Collect above-fold elements for staggered reveal
          aboveFoldElements.push(el);
        } else {
          // Below-the-fold: use IntersectionObserver for scroll animation
          animationObserver.observe(el);
        }
      });

      // Above-the-fold: fast staggered fade-in (no CLS - only opacity)
      aboveFoldElements.forEach(function(el, index) {
        // Add class for CSS-only fade (no transform = no CLS)
        el.classList.add('above-fold');
        // Fast stagger - no base delay, 40ms between elements for LCP optimization
        setTimeout(function() {
          el.classList.add('is-visible');
        }, index * 40); // No base delay, minimal stagger for fast LCP
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
