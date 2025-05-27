// Script para registrar el Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registrado con éxito: ", registration.scope);
      })
      .catch((error) => {
        console.log("Falló el registro del ServiceWorker: ", error);
      });
  });
}
