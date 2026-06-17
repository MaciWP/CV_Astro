/// <reference types="astro/client" />

declare global {
  interface Window {
    /** Announces a message to assistive tech via the live region (A11yAnnouncer.astro). */
    announceToScreenReader: (
      message: string,
      priority?: "polite" | "assertive"
    ) => void;
  }
}

export {};
