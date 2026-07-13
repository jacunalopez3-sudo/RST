(() => {
  const DB_NAME = "bennu-service-reports";
  const STORE_NAME = "pending-reports";
  const DB_VERSION = 4;
  let flushing = false;

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
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
          store.createIndex("createdAt", "createdAt");
        }
        if (!db.objectStoreNames.contains("drafts")) {
          db.createObjectStore("drafts", { keyPath: "userId" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function withStore(mode, operation) {
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
      transaction.onabort = () => {
        db.close();
        reject(transaction.error);
      };
    });
  }

  function notify() {
    count()
      .then(pending => window.dispatchEvent(
        new CustomEvent("bennu:sync-change", { detail: { pending } })
      ))
      .catch(() => {});
  }

  async function put(record) {
    record.updatedAt = new Date().toISOString();
    await withStore("readwrite", store => store.put(record));
    notify();
    return record;
  }

  async function enqueue(data, userId, state = {}) {
    const record = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId,
      attempts: 0,
      lastError: null,
      state: { ...state },
      data
    };
    await put(record);
    return record;
  }

  async function list() {
    const records = await withStore("readonly", store => requestResult(store.getAll()));
    return records.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async function remove(id) {
    await withStore("readwrite", store => store.delete(id));
    notify();
  }

  async function count() {
    return withStore("readonly", store => requestResult(store.count()));
  }

  async function flush(handler) {
    if (flushing || !navigator.onLine) return;
    flushing = true;
    try {
      const records = await list();
      for (const record of records) {
        if (!navigator.onLine) break;
        try {
          const completed = await handler(record, { update: put });
          if (completed === false) continue;
          await remove(record.id);
        } catch (error) {
          record.attempts = (record.attempts || 0) + 1;
          record.lastError = error?.message || String(error);
          await put(record);
          if (!navigator.onLine) break;
        }
      }
    } finally {
      flushing = false;
      notify();
    }
  }

  window.BennuSyncQueue = { enqueue, list, update: put, remove, count, flush };
})();
