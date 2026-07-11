(() => {
  let syncing = false;

  function element() {
    return document.getElementById("connectionStatus");
  }

  function show(state, text) {
    const status = element();
    if (!status) return;
    status.dataset.state = state;
    const label = status.querySelector(".connection-status__label");
    if (label) label.textContent = text;
    status.title = text;
  }

  async function pendingCount() {
    try {
      if (!window.BennuSyncQueue) return 0;
      return await Promise.race([
        BennuSyncQueue.count(),
        new Promise(resolve => setTimeout(() => resolve(0), 1500))
      ]);
    } catch (_) {
      return 0;
    }
  }

  async function refresh() {
    if (syncing) {
      show("syncing", "Sincronizando…");
      return;
    }

    const pending = await pendingCount();
    if (!navigator.onLine) {
      show(
        "offline",
        pending ? `Sin conexión · ${pending} pendiente(s)` : "Sin conexión"
      );
      return;
    }

    if (pending) {
      show("pending", `En línea · ${pending} pendiente(s)`);
      return;
    }

    show("online", "En línea");
  }

  window.addEventListener("online", refresh);
  window.addEventListener("offline", refresh);
  window.addEventListener("bennu:sync-change", refresh);
  window.addEventListener("bennu:sync-start", () => {
    syncing = true;
    refresh();
  });
  window.addEventListener("bennu:sync-end", () => {
    syncing = false;
    refresh();
  });
  window.addEventListener("bennu:offline-ready", refresh);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh, { once: true });
  } else {
    refresh();
  }

  window.BennuConnectionStatus = { refresh };
})();
