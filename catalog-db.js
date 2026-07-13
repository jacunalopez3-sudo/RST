(() => {
  const DB_NAME = 'bennu-service-reports', DB_VERSION = 5;
  const REQUIRED_STORES = ['pending-reports', 'drafts', 'catalog_clients', 'catalog_equipment', 'catalog_meta', 'pending_equipment', 'pending_equipment_updates'];
  const CRITICAL_STORES = ['pending-reports', 'drafts', 'pending_equipment', 'pending_equipment_updates'];
  const REBUILD_MESSAGE = 'Se reconstruyó el catálogo local porque estaba desactualizado.';
  let client = null, currentDbVersion = DB_VERSION, rebuildPromise = null;
  const openConnections = new Set();
  const req = request => new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
  const clean = value => String(value || '').trim();
  const comparable = value => clean(value).toLocaleLowerCase('es');
  const errorField = value => value === null || value === undefined || value === '' ? '(sin información)' : String(value);
  function formatSyncError(table, error) {
    return `Error cargando ${table}\n\ncode:\n${errorField(error?.code)}\n\nmessage:\n${errorField(error?.message || error)}\n\ndetails:\n${errorField(error?.details)}\n\nhint:\n${errorField(error?.hint)}`;
  }
  function reportSyncError(table, error) {
    const diagnostic = formatSyncError(table, error);
    console.error(diagnostic, error);
    if (error && typeof error === 'object') {
      try { error.bennuCatalogTable = table; error.bennuCatalogDiagnostic = diagnostic; } catch (_) {}
    }
    return diagnostic;
  }
  function ensureSchema(db, transaction) {
    const getStore = (name, options) => db.objectStoreNames.contains(name) ? transaction?.objectStore(name) : db.createObjectStore(name, options);
    let objectStore = getStore('pending-reports', { keyPath: 'id' });
    if (objectStore && !objectStore.indexNames.contains('createdAt')) objectStore.createIndex('createdAt', 'createdAt');
    getStore('drafts', { keyPath: 'userId' });
    getStore('catalog_clients', { keyPath: 'id' });
    objectStore = getStore('catalog_equipment', { keyPath: 'id' });
    if (objectStore && !objectStore.indexNames.contains('client_id')) objectStore.createIndex('client_id', 'client_id');
    if (objectStore && !objectStore.indexNames.contains('updated_at')) objectStore.createIndex('updated_at', 'updated_at');
    getStore('catalog_meta', { keyPath: 'key' });
    getStore('pending_equipment', { keyPath: 'local_id' });
    getStore('pending_equipment_updates', { keyPath: 'id' });
  }
  function closeConnection(db) { if (!db) return; openConnections.delete(db); try { db.close(); } catch (_) {} }
  function closeOpenConnections() { for (const db of [...openConnections]) closeConnection(db); }
  function isRecoverableIndexedDbError(error) {
    const message = String(error?.message || error || '');
    return error?.name === 'InvalidStateError' || error?.name === 'NotFoundError' || error?.name === 'VersionError' || message.includes('One of the specified object stores was not found');
  }
  function openDatabase(version = currentDbVersion) {
    return new Promise((resolve, reject) => {
      let request;
      try { request = version === null ? indexedDB.open(DB_NAME) : indexedDB.open(DB_NAME, version); }
      catch (error) { reject(error); return; }
      request.onupgradeneeded = () => ensureSchema(request.result, request.transaction);
      request.onsuccess = () => {
        const db = request.result;
        currentDbVersion = Math.max(currentDbVersion, db.version);
        openConnections.add(db);
        db.onversionchange = () => closeConnection(db);
        resolve(db);
      };
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new DOMException('IndexedDB está bloqueada por otra conexión.', 'InvalidStateError'));
    });
  }
  function missingStores(db) { return REQUIRED_STORES.filter(name => !db.objectStoreNames.contains(name)); }
  async function open(recovery = { attempted: false }) {
    try {
      const db = await openDatabase(currentDbVersion);
      const missing = missingStores(db);
      if (missing.length) {
        closeConnection(db);
        throw new DOMException(`One of the specified object stores was not found: ${missing.join(', ')}`, 'NotFoundError');
      }
      return db;
    } catch (error) {
      if (error?.name === 'VersionError') {
        try {
          const db = await openDatabase(null), missing = missingStores(db);
          if (!missing.length) return db;
          closeConnection(db);
        } catch (currentError) { error = currentError; }
      }
      if (!recovery.attempted && isRecoverableIndexedDbError(error)) {
        recovery.attempted = true;
        await rebuildIndexedDb();
        return open(recovery);
      }
      throw error;
    }
  }
  async function runStore(name, mode, fn, recovery) {
    const db = await open(recovery);
    return new Promise((resolve, reject) => {
      let tx, objectStore, value;
      try { tx = db.transaction(name, mode); objectStore = tx.objectStore(name); value = fn(objectStore); }
      catch (error) { closeConnection(db); reject(error); return; }
      tx.oncomplete = () => { closeConnection(db); resolve(value); };
      tx.onerror = () => { const error = tx.error; closeConnection(db); reject(error); };
      tx.onabort = tx.onerror;
    });
  }
  async function store(name, mode, fn, recovery = { attempted: false }) {
    try { return await runStore(name, mode, fn, recovery); }
    catch (error) {
      if (!recovery.attempted && isRecoverableIndexedDbError(error)) {
        recovery.attempted = true;
        await rebuildIndexedDb();
        return store(name, mode, fn, recovery);
      }
      throw error;
    }
  }
  async function readStoreRows(db, name) {
    return new Promise((resolve, reject) => {
      let tx;
      try { tx = db.transaction(name, 'readonly'); } catch (error) { reject(error); return; }
      const request = tx.objectStore(name).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
      tx.onabort = () => reject(tx.error);
    });
  }
  async function backupCriticalData() {
    const db = await openDatabase(null), backup = {};
    try {
      for (const name of CRITICAL_STORES) if (db.objectStoreNames.contains(name)) backup[name] = await readStoreRows(db, name);
      return backup;
    } finally { closeConnection(db); }
  }
  async function upgradeMissingStores() {
    closeOpenConnections();
    const current = await openDatabase(null);
    const nextVersion = Math.max(DB_VERSION, current.version + 1);
    closeConnection(current);
    const upgraded = await openDatabase(nextVersion), missing = missingStores(upgraded);
    closeConnection(upgraded);
    if (missing.length) throw new DOMException(`One of the specified object stores was not found: ${missing.join(', ')}`, 'NotFoundError');
  }
  async function deleteDatabaseAndRestore() {
    closeOpenConnections();
    const backup = await backupCriticalData();
    closeOpenConnections();
    await new Promise((resolve, reject) => {
      const request = indexedDB.deleteDatabase(DB_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new DOMException('No se pudo reconstruir IndexedDB porque está abierta en otra pestaña.', 'InvalidStateError'));
    });
    currentDbVersion = DB_VERSION;
    const db = await openDatabase(DB_VERSION);
    const names = Object.keys(backup).filter(name => db.objectStoreNames.contains(name));
    if (names.length) {
      await new Promise((resolve, reject) => {
        const tx = db.transaction(names, 'readwrite');
        for (const name of names) { const objectStore = tx.objectStore(name); for (const row of backup[name]) objectStore.put(row); }
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
        tx.onabort = tx.onerror;
      });
    }
    closeConnection(db);
  }
  async function rebuildIndexedDb() {
    if (rebuildPromise) return rebuildPromise;
    rebuildPromise = (async () => {
      try { await upgradeMissingStores(); }
      catch (repairError) {
        console.warn('No fue posible reparar únicamente la estructura del catálogo. Se reconstruirá IndexedDB conservando los datos críticos.', repairError);
        await deleteDatabaseAndRestore();
      }
      console.warn(REBUILD_MESSAGE);
      window.dispatchEvent(new CustomEvent('bennu:catalog-rebuilt', { detail: { message: REBUILD_MESSAGE } }));
      if (client && navigator.onLine) {
        try { await sync({ forceFull: true }); }
        catch (error) {
          console.error('La reconstrucción local terminó, pero falló la sincronización completa del catálogo.', error);
          window.dispatchEvent(new CustomEvent('bennu:catalog-sync-error', { detail: { error } }));
        }
      }
    })().finally(() => { rebuildPromise = null; });
    return rebuildPromise;
  }
  const all = name => store(name, 'readonly', s => req(s.getAll()));
  const putMany = (name, rows) => store(name, 'readwrite', s => { for (const row of rows) s.put(row); });
  const meta = async key => (await store('catalog_meta', 'readonly', s => req(s.get(key))))?.value || null;
  const setMeta = (key, value) => store('catalog_meta', 'readwrite', s => s.put({ key, value }));
  async function clearStore(name) { return store(name, 'readwrite', objectStore => objectStore.clear()); }
  async function clearCatalogMeta() { await store('catalog_meta', 'readwrite', objectStore => { objectStore.delete('last_clients_sync'); objectStore.delete('last_equipment_sync'); objectStore.delete('last_catalog_sync'); }); }
  async function replaceCatalog(clients, equipment, started) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['catalog_clients', 'catalog_equipment', 'catalog_meta'], 'readwrite');
      const clientStore = tx.objectStore('catalog_clients'), equipmentStore = tx.objectStore('catalog_equipment'), metaStore = tx.objectStore('catalog_meta');
      clientStore.clear(); equipmentStore.clear();
      for (const row of clients) clientStore.put(row);
      for (const row of equipment) equipmentStore.put(row);
      metaStore.put({ key: 'last_clients_sync', value: started });
      metaStore.put({ key: 'last_equipment_sync', value: started });
      metaStore.put({ key: 'last_catalog_sync', value: started });
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error); };
      tx.onabort = tx.onerror;
    });
  }
  async function page(table, lastSync) {
    let rows = [], from = 0;
    for (;;) {
      let q = client.from(table).select('*').order('updated_at').range(from, from + 499);
      if (lastSync) q = q.gt('updated_at', lastSync);
      let response;
      try {
        response = await q;
      } catch (error) {
        reportSyncError(table, error);
        throw error;
      }
      const { data, error } = response;
      if (error) {
        reportSyncError(table, error);
        throw error;
      }
      rows.push(...(data || []));
      if (!data || data.length < 500) break;
      from += 500;
    }
    return rows;
  }
  async function sync({ forceFull = false } = {}) {
    console.info('navigator.onLine', navigator.onLine);
    if (!client || !navigator.onLine) throw new Error('Sin conexión');
    const clientMark = forceFull ? null : await meta('last_clients_sync');
    const equipmentMark = forceFull ? null : await meta('last_equipment_sync');
    const started = new Date().toISOString();
    const diagnostics = [];
    console.info('iniciando descarga de clients');
    const clients = await page('clients', clientMark);
    console.info('clients descargados', { cantidad: clients.length });
    if (clients.length === 0) {
      const message = 'La consulta terminó correctamente pero devolvió 0 clientes.';
      diagnostics.push(message);
      console.warn(message);
    }
    console.info('iniciando descarga equipment');
    const equipment = await page('equipment', equipmentMark);
    console.info('equipment descargados', { cantidad: equipment.length });
    if (equipment.length === 0) {
      const message = 'La consulta terminó correctamente pero devolvió 0 equipos.';
      diagnostics.push(message);
      console.warn(message);
    }
    if (forceFull) {
      await replaceCatalog(clients, equipment, started);
    } else {
      await putMany('catalog_clients', clients);
      await putMany('catalog_equipment', equipment);
      await setMeta('last_clients_sync', started);
      await setMeta('last_equipment_sync', started);
      await setMeta('last_catalog_sync', started);
    }
    window.dispatchEvent(new CustomEvent('bennu:catalog-updated', { detail: { at: started, full: forceFull } }));
    return { clients: clients.length, equipment: equipment.length, at: started, full: forceFull, diagnostics };
  }
  async function clients() { return (await all('catalog_clients')).filter(x => x.active).sort((a, b) => a.name.localeCompare(b.name, 'es')); }
  async function equipment(clientId) { return (await store('catalog_equipment', 'readonly', s => req(s.index('client_id').getAll(clientId)))).filter(x => x.active).sort((a, b) => [a.equipment_name, a.brand, a.model, a.serial_number].join('|').localeCompare([b.equipment_name, b.brand, b.model, b.serial_number].join('|'), 'es')); }
  async function findOrCreate(data) { if (!client || !navigator.onLine) throw new Error('Sin conexión'); const client_id = data.clientId; if (!client_id) throw new Error('Cliente registrado requerido'); let q = client.from('equipment').select('*').eq('client_id', client_id); if (clean(data.serie)) q = q.eq('serial_number', clean(data.serie)); else if (clean(data.activo)) q = q.is('serial_number', null).eq('asset_number', clean(data.activo)); else q = q.is('serial_number', null).is('asset_number', null).eq('equipment_name', clean(data.equipo)).eq('brand', clean(data.marca)).eq('model', clean(data.modelo)); const { data: found, error } = await q.limit(1); if (error) throw error; if (found?.length) { await putMany('catalog_equipment', found); return found[0]; } const payload = { client_id, equipment_name: clean(data.equipo), brand: clean(data.marca) || null, model: clean(data.modelo) || null, serial_number: clean(data.serie) || null, asset_number: clean(data.activo) || null }; const { data: created, error: createError } = await client.from('equipment').insert(payload).select('*').single(); if (createError) throw createError; await putMany('catalog_equipment', [created]); return created; }
  async function queueEquipment(data) { const record = { local_id: data.pendingEquipmentLocalId || crypto.randomUUID(), created_at: new Date().toISOString(), data }; await store('pending_equipment', 'readwrite', s => s.put(record)); return record; }
  async function flushPending() { if (!navigator.onLine) return []; const pending = await all('pending_equipment'), done = []; for (const item of pending) { const created = await findOrCreate(item.data); await store('pending_equipment', 'readwrite', s => s.delete(item.local_id)); done.push({ local_id: item.local_id, equipment: created }); } return done; }
  async function validateEquipmentConflicts(clientId, equipmentId, changes) { const { data, error } = await client.from('equipment').select('id,equipment_name,brand,model,serial_number,asset_number').eq('client_id', clientId).neq('id', equipmentId); if (error) throw error; for (const item of data || []) { if (changes.serial_number && comparable(item.serial_number) === comparable(changes.serial_number)) return { field: 'Serie', item }; if (changes.asset_number && comparable(item.asset_number) === comparable(changes.asset_number)) return { field: 'Activo', item }; } return null; }
  async function updateExistingEquipment(request) { if (!client || !navigator.onLine) throw new Error('Sin conexión'); const { equipmentId, clientId, changes } = request; const { data: current, error } = await client.from('equipment').select('*').eq('id', equipmentId).eq('client_id', clientId).single(); if (error) throw error; const payload = {}; for (const [key, value] of Object.entries(changes || {})) { const normalized = clean(value); if (normalized && normalized !== clean(current[key])) payload[key] = normalized; } if (!Object.keys(payload).length) return current; const conflict = await validateEquipmentConflicts(clientId, equipmentId, payload); if (conflict) { const e = new Error(`${conflict.field} ya está registrado en ${conflict.item.equipment_name} — ${conflict.item.brand || '-'} ${conflict.item.model || ''}`); e.code = 'EQUIPMENT_CONFLICT'; throw e; } const { data: updated, error: updateError } = await client.from('equipment').update(payload).eq('id', equipmentId).eq('client_id', clientId).select('*').single(); if (updateError) throw updateError; await putMany('catalog_equipment', [updated]); window.dispatchEvent(new CustomEvent('bennu:equipment-updated', { detail: updated })); return updated; }
  async function prepareReport(data) { if (data.saveEquipment && data.clientId && !data.equipmentId) { if (navigator.onLine) { const item = await findOrCreate(data); return { ...data, equipmentId: item.id, pendingEquipmentLocalId: null }; } const queued = await queueEquipment(data); return { ...data, equipmentId: null, pendingEquipmentLocalId: queued.local_id }; } if (data.pendingEquipmentLocalId && navigator.onLine) { const done = await flushPending(), match = done.find(x => x.local_id === data.pendingEquipmentLocalId); if (match) return { ...data, equipmentId: match.equipment.id, pendingEquipmentLocalId: null }; } return data; }
  function updateKey(request) { const raw = [request.equipmentId, ...Object.entries(request.changes || {}).sort().flat()].join('|'); let hash = 2166136261; for (let i = 0; i < raw.length; i += 1) hash = Math.imul(hash ^ raw.charCodeAt(i), 16777619); return `${request.equipmentId}:${(hash >>> 0).toString(16)}`; }
  async function queueExistingEquipmentUpdate(request) { const record = { ...request, id: request.id || updateKey(request), createdAt: request.createdAt || new Date().toISOString(), attempts: request.attempts || 0 }; await store('pending_equipment_updates', 'readwrite', s => s.put(record)); return record; }
  async function flushPendingEquipmentUpdates() { if (!navigator.onLine) return []; const pending = await all('pending_equipment_updates'), results = []; for (const item of pending) { try { const updated = await updateExistingEquipment(item); await store('pending_equipment_updates', 'readwrite', s => s.delete(item.id)); results.push({ id: item.id, ok: true, equipment: updated }); window.dispatchEvent(new CustomEvent('bennu:equipment-update-synced', { detail: { ok: true, equipment: updated } })); } catch (error) { const saved = { ...item, attempts: (item.attempts || 0) + 1, lastAttempt: new Date().toISOString(), error: error.message }; await store('pending_equipment_updates', 'readwrite', s => s.put(saved)); results.push({ id: item.id, ok: false, error }); window.dispatchEvent(new CustomEvent('bennu:equipment-update-synced', { detail: { ok: false, message: error.message } })); } } return results; }
  function init(options) { client = options.supabase; }
  window.BennuCatalog = { init, sync, fullSync: () => sync({ forceFull: true }), clients, equipment, lastSync: () => meta('last_catalog_sync'), findOrCreate, queueEquipment, flushPending, prepareReport, validateEquipmentConflicts, updateExistingEquipment, queueExistingEquipmentUpdate, flushPendingEquipmentUpdates, formatSyncError, rebuildIndexedDb };
})();
