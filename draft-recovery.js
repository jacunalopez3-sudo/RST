(() => {
  const DB_NAME = "bennu-service-reports";
  const STORE_NAME = "drafts";
  const DB_VERSION = 3;
  const MAX_AGE = 30 * 24 * 60 * 60 * 1000;
  let options = null;
  let activeUser = null;
  let timer = null;
  let restoring = false;

  function requestResult(request) {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("pending-reports")) {
          const pending = db.createObjectStore("pending-reports", { keyPath: "id" });
          pending.createIndex("createdAt", "createdAt");
        }
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "userId" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function storeAction(mode, operation) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, mode);
      const store = transaction.objectStore(STORE_NAME);
      let result;
      try {
        result = operation(store);
      } catch (error) {
        db.close();
        reject(error);
        return;
      }
      transaction.oncomplete = () => {
        db.close();
        resolve(result);
      };
      transaction.onerror = () => {
        db.close();
        reject(transaction.error);
      };
    });
  }

  function emit(type, detail = {}) {
    window.dispatchEvent(new CustomEvent(`bennu:draft-${type}`, { detail }));
  }

  async function saveNow() {
    clearTimeout(timer);
    timer = null;
    if (!options || !activeUser || restoring || !options.canSave()) return;
    try {
      const data = options.capture();
      const draft = {
        userId: activeUser,
        savedAt: new Date().toISOString(),
        data
      };
      await storeAction("readwrite", store => store.put(draft));
      emit("saved", { savedAt: draft.savedAt });
    } catch (error) {
      emit("error", { message: error?.message || String(error) });
    }
  }

  function schedule() {
    if (!options || !activeUser || restoring || !options.canSave()) return;
    clearTimeout(timer);
    timer = setTimeout(saveNow, 700);
  }

  async function clear() {
    clearTimeout(timer);
    timer = null;
    if (!activeUser) return;
    await storeAction("readwrite", store => store.delete(activeUser));
    emit("cleared");
  }

  async function setUser(userId) {
    clearTimeout(timer);
    timer = null;
    activeUser = userId || null;
    if (!activeUser || !options) return;

    const draft = await storeAction("readonly", store =>
      requestResult(store.get(activeUser))
    );
    if (!draft) return;

    const age = Date.now() - new Date(draft.savedAt).getTime();
    if (!Number.isFinite(age) || age > MAX_AGE) {
      await clear();
      return;
    }

    restoring = true;
    try {
      await options.restore(draft.data);
      emit("restored", { savedAt: draft.savedAt });
    } finally {
      restoring = false;
    }
  }

  function configure(config) {
    if (options) return;
    options = config;
    const form = config.form;
    form.addEventListener("input", schedule);
    form.addEventListener("change", schedule);
    const signature = config.signatureElement;
    if (signature) {
      signature.addEventListener("pointerup", () => setTimeout(schedule, 0));
      signature.addEventListener("touchend", () => setTimeout(schedule, 0), { passive: true });
    }
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") saveNow();
    });
  }

  window.BennuDrafts = { configure, setUser, schedule, saveNow, clear };
})();