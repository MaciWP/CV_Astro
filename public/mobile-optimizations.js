// public/mobile-optimizations.js - Optimizaciones específicas para móviles
(function () {
  // Detector de dispositivo móvil simple
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) || window.innerWidth < 768;

  // Solo ejecutar optimizaciones en móviles
  if (!isMobile) return;

  console.log("Aplicando optimizaciones para móvil...");

  // Cargar imagen principal inmediatamente
  const preloadMainImage = () => {
    // Crear elemento de precarga para la imagen principal
    const preloadLink = document.createElement("link");
    preloadLink.rel = "preload";
    preloadLink.as = "image";
    preloadLink.href = "/images/oriol_macias-sm.avif";
    preloadLink.type = "image/avif";
    preloadLink.crossOrigin = "anonymous";

    // Insertar al inicio del head para máxima prioridad
    const head = document.head;
    head.insertBefore(preloadLink, head.firstChild);

    console.log("Imagen principal precargada");
  };

  // Ejecutar optimizaciones inmediatamente
  preloadMainImage();
})();
