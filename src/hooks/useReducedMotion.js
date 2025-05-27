// src/hooks/useReducedMotion.js
/**
 * Custom hook to detect and adapt to reduced motion preferences
 * Improves accessibility for users with vestibular disorders
 */
import { useState, useEffect } from "react";

export function useReducedMotion() {
  // Default to no animations if SSR
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : true,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Crear media query
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Handler inicial
    setPrefersReducedMotion(mediaQuery.matches);

    // Handler para cambios
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    // Agregar listener de evento (usando técnicas compatibles)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      // Fallback para navegadores más antiguos
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  return prefersReducedMotion;
}

export default useReducedMotion;
