(() => {
  if (!("serviceWorker" in navigator)) return;

  const VERSION = window.BENNU_APP_VERSION || "2026.07.13.2";
  const RELOAD_KEY = "bennu-sw-reloaded-version";
  let reloading = false;

  const activateWaitingWorker = registration => {
    if (registration.waiting) {
      registration.waiting.postMessage("SKIP_WAITING");
    }
  };

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloading || sessionStorage.getItem(RELOAD_KEY) === VERSION) return;
    sessionStorage.setItem(RELOAD_KEY, VERSION);
    reloading = true;
    window.location.reload();
  });

  const register = () => navigator.serviceWorker
    .register(`./service-worker.js?v=${encodeURIComponent(VERSION)}`, { scope: "./" })
    .then(async registration => {
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed") {
            activateWaitingWorker(registration);
          }
        });
      });

      await registration.update();
      activateWaitingWorker(registration);
      document.documentElement.dataset.offlineReady = "true";
      window.dispatchEvent(new CustomEvent("bennu:offline-ready"));
    })
    .catch(error => console.warn("No se pudo activar el modo offline.", error));

  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
})();
