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

    // Use rAF to batch DOM operations - CRITICAL: read ALL first, then write ALL
    requestAnimationFrame(function() {
      var animatedElements = document.querySelectorAll(
        '.animate-on-scroll, .animate-scale, .animate-fade-left, .animate-width'
      );

      var viewportHeight = window.innerHeight;

      // PHASE 1: BATCH ALL DOM READS (single reflow)
      var measurements = [];
      animatedElements.forEach(function(el) {
        if (el.classList.contains('is-visible')) return;
        measurements.push({
          el: el,
          top: el.getBoundingClientRect().top
        });
      });

      // PHASE 2: BATCH ALL DOM WRITES (no new reflows)
      var aboveFoldElements = [];
      measurements.forEach(function(m) {
        if (m.top < viewportHeight) {
          aboveFoldElements.push(m.el);
        } else {
          animationObserver.observe(m.el);
        }
      });

      // PHASE 3: Apply above-fold classes (batched writes)
      aboveFoldElements.forEach(function(el, index) {
        el.classList.add('above-fold');
        // First 3 elements show instantly, then 30ms stagger
        var delay = index < 3 ? 0 : (index - 3) * 30;
        setTimeout(function() {
          el.classList.add('is-visible');
        }, delay);
      });
    });
  }

  // Event delegation for print button (avoids inline onclick)
  document.addEventListener('click', function(e) {
    if (e.target.matches('[data-print], [data-print] *')) {
      window.print();
    }
  });

  // Single initialization - no repeated calls
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    // Use rAF to defer initialization and not block rendering
    requestAnimationFrame(initAnimations);
  }
})();
