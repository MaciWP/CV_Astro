/**
 * Font Awesome Loader
 * Estrategia de carga optimizada con fallbacks
 */
(function () {
  // Configuración
  const FA_VERSION = "6.4.0";
  const OPTIMIZED_URL = "/styles/font-awesome-optimized.css";
  const LOCAL_URL = "/styles/font-awesome-minimal.css";
  const FALLBACK_URL = "/styles/font-awesome-fallback.css";

  // Función para cargar CSS con manejo de errores
  function loadCSS(url, integrity, crossorigin) {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;

      if (integrity) {
        link.integrity = integrity;
        link.crossOrigin = crossorigin || "anonymous";
      }

      link.onload = () => resolve(link);
      link.onerror = () => reject(new Error("Failed to load " + url));

      document.head.appendChild(link);
    });
  }

  // Cargar fallback primero (garantiza iconos básicos)
  loadCSS(FALLBACK_URL)
    .then(() => loadCSS(LOCAL_URL))
    .then(() => loadCSS(OPTIMIZED_URL))
    .then(() => {
      document.documentElement.classList.add("fa-loaded");
    })
    .catch((error) => {
      console.error("Font Awesome error:", error);
      injectFallbackIcons();
    });

  // Último recurso: emojis unicode
  function injectFallbackIcons() {
    const style = document.createElement("style");
    style.textContent = `
            .fas, .fab { display: inline-block; width: 1em; height: 1em; }
            .fa-user:before { content: "👤"; }
            .fa-envelope:before { content: "✉️"; }
            .fa-linkedin:before { content: "📎"; }
            .fa-github:before { content: "🔄"; }
            .fa-download:before { content: "⬇️"; }
            .fa-code:before { content: "🧩"; }
            .fa-graduation-cap:before { content: "🎓"; }
            .fa-language:before { content: "🌐"; }
        `;
    document.head.appendChild(style);
    document.documentElement.classList.add("fa-fallback");
  }
})();
