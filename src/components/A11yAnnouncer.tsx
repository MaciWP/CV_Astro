/**
 * Accessibility announcer component
 * Allows screen readers to announce dynamic content changes
 * File: src/components/A11yAnnouncer.jsx
 */
import React, { useState, useEffect } from "react";

const A11yAnnouncer = () => {
  const [announcement, setAnnouncement] = useState("");
  const [previousAnnouncement, setPreviousAnnouncement] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create a global method to make announcements to screen readers
    window.announceToScreenReader = (message, priority = "polite") => {
      if (priority !== "polite" && priority !== "assertive") {
        priority = "polite";
      }

      // Store previous announcement to avoid duplicates
      setPreviousAnnouncement(announcement?.message || "");
      setAnnouncement({ message, priority });

      // Clear after a reasonable time
      setTimeout(() => {
        setAnnouncement("");
      }, 3000);
    };

    // Custom event for announcements
    const handleAnnouncement = (event) => {
      if (event.detail && event.detail.message) {
        window.announceToScreenReader(
          event.detail.message,
          event.detail.priority || "polite",
        );
      }
    };

    document.addEventListener("a11y-announce", handleAnnouncement);
    return () => {
      document.removeEventListener("a11y-announce", handleAnnouncement);
      delete window.announceToScreenReader;
    };
  }, [announcement]);

  // Don't render if no announcement or if it's a duplicate
  if (!announcement || announcement.message === previousAnnouncement) {
    return null;
  }

  return (
    <div
      aria-live={announcement.priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement.message}
    </div>
  );
};

export default A11yAnnouncer;
