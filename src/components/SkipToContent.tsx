/**
 * Skip to content component for better keyboard navigation
 * Allows keyboard users to bypass navigation menus
 * File: src/components/SkipToContent.jsx
 */
import React, { useState } from "react";

const SkipToContent = ({ targetId = "cv-content" }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <a
      href={`#${targetId}`}
      className={`
        fixed top-3 left-3 z-50 transform transition-transform duration-200
        bg-brand-red text-white px-4 py-2 text-sm font-medium rounded-none
        focus:outline-none focus:ring-2 focus:ring-white
        ${isFocused ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0"}
      `}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={(e) => {
        // Announce to screen readers when activated
        if (window.announceToScreenReader) {
          window.announceToScreenReader("Skipped to main content");
        }

        // Set focus to the content area
        const target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          target.tabIndex = -1;
          target.focus({ preventScroll: false });

          // Remove tabIndex when focus is lost
          target.addEventListener(
            "blur",
            function handler() {
              target.removeAttribute("tabIndex");
              target.removeEventListener("blur", handler);
            },
            { once: true },
          );
        }
      }}
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
