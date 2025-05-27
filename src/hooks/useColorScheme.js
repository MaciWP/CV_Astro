// src/hooks/useColorScheme.js
/**
 * Custom hook to detect and handle user's color scheme preferences
 * Improves accessibility by respecting user's system preferences when possible
 */
import { useState, useEffect } from "react";

export function useColorScheme() {
  // Default to dark if we can't detect (SSR or unsupported)
  const [prefersDark, setPrefersDark] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : true,
  );

  const [userTheme, setUserTheme] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check local storage first for user preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setUserTheme(storedTheme);
    }

    // Set up listener for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setPrefersDark(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersDark(e.matches);

      // Only update theme if user hasn't explicitly chosen one
      if (!localStorage.getItem("theme")) {
        document.documentElement.classList.remove("dark", "light");
        document.documentElement.classList.add(e.matches ? "dark" : "light");

        // Announce to screen readers
        if (window.announceToScreenReader) {
          window.announceToScreenReader(
            `Theme changed to ${e.matches ? "dark" : "light"} mode based on your system preference`,
          );
        }
      }
    };

    // Use modern API or fallback for older browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    } else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  // Get effective theme (user choice or system preference)
  const effectiveTheme = userTheme || (prefersDark ? "dark" : "light");

  return {
    prefersDark,
    userTheme,
    effectiveTheme,
    setUserTheme: (theme) => {
      setUserTheme(theme);
      localStorage.setItem("theme", theme);

      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(theme);
    },
  };
}

export default useColorScheme;
