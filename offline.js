(() => {
  if (!("serviceWorker" in navigator)) return;

  const register = () => navigator.serviceWorker
    .register("./service-worker.js", { scope: "./" })
    .then(registration => {
      registration.update().catch(() => {});
      document.documentElement.dataset.offlineReady = "true";
      window.dispatchEvent(new CustomEvent("bennu:offline-ready"));
    })
    .catch(error => console.warn("No se pudo activar el modo offline.", error));

  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
})();
