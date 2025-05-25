(function () {
  function trackScroll() {
    const scrolledRatio =
      (window.scrollY + window.innerHeight) /
      document.documentElement.scrollHeight;
    if (scrolledRatio > 0.5) {
      window.removeEventListener("scroll", trackScroll);
      if (window.gtag) {
        window.gtag("event", "scroll_halfway");
      }
    }
  }

  window.addEventListener("scroll", trackScroll, { passive: true });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("#cv-download-button, .cta").forEach((el) => {
      el.addEventListener("click", () => {
        const label = el.id || el.textContent?.trim() || "cta";
        if (window.gtag) {
          window.gtag("event", "cta_click", {
            event_category: "engagement",
            event_label: label,
          });
        }
      });
    });
  });
})();
