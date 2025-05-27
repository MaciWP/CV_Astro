// src/components/FontLoader.jsx
/**
 * Font loader component that optimizes font loading strategy
 * Prevents layout shifts and improves Core Web Vitals
 */
import React, { useEffect } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const FontLoader = () => {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Font loading optimization
    const optimizeFontLoading = () => {
      // Mark document as font-ready when fonts are loaded
      if ("fonts" in document) {
        document.fonts.ready.then(() => {
          document.documentElement.classList.add("fonts-loaded");

          // Measure & report font loading time for performance monitoring
          if (window.performance && window.performance.mark) {
            window.performance.mark("fonts-loaded");
          }
        });
      } else {
        // Fallback for browsers without fonts API
        // Add class after a reasonable timeout
        setTimeout(() => {
          document.documentElement.classList.add("fonts-loaded");
        }, 1000);
      }
    };

    // Check if the fonts are already cached
    const fontsCached = sessionStorage.getItem("fonts-cached");

    if (fontsCached === "true") {
      // Fonts already cached, mark as loaded immediately
      document.documentElement.classList.add("fonts-loaded");
      document.documentElement.classList.add("fonts-cached");
    } else {
      // First visit, optimize loading
      optimizeFontLoading();

      // Mark fonts as cached for future visits
      sessionStorage.setItem("fonts-cached", "true");
    }

    // Disable animations during font loading if user prefers reduced motion
    if (prefersReducedMotion) {
      document.documentElement.classList.add("fonts-loaded"); // Skip font animation
      document.documentElement.classList.add("reduce-motion");
    }
  }, [prefersReducedMotion]);

  return null; // This is a utility component with no UI
};

export default FontLoader;
