(() => {
  const $ = id => document.getElementById(id);
  let db, allClients = [], allEquipment = [], ready = false, originalEquipment = null, editingRegistered = false;
  const option = (text, value) => new Option(text, value);
  const normalizeCatalogValue = value => String(value || '').trim();
  const debounce = (fn, ms) => { let timer; return () => { clearTimeout(timer); timer = setTimeout(fn, ms); }; };
  const equipmentFields = () => [$('equipo'), $('marca'), $('modelo'), $('serie'), $('activo')];
  function setReadOnly(value) { equipmentFields().forEach(field => field.readOnly = value); }
  function snapshot(item) { return item ? { equipment_name: item.equipment_name || '', brand: item.brand || '', model: item.model || '', serial_number: item.serial_number || '', asset_number: item.asset_number || '' } : null; }
  function equipmentChanges(original, current) { const fields = { equipment_name: current.equipo, brand: current.marca, model: current.modelo, serial_number: current.serie, asset_number: current.activo }, changes = {}; for (const [key, value] of Object.entries(fields)) { const normalized = normalizeCatalogValue(value), before = normalizeCatalogValue(original?.[key]); if (normalized !== before) changes[key] = normalized || null; } return changes; }
  function build() {
    const clientInput = $('cliente'), clientWrap = clientInput.parentElement;
    clientWrap.insertAdjacentHTML('afterbegin', '<label>Cliente registrado</label><select id="catalogClient"><option value="">Seleccione…</option><option value="manual">+ Cliente no registrado</option></select>');
    clientInput.placeholder = 'Nombre del cliente'; clientInput.readOnly = true;
    const equipmentInput = $('equipo'), wrap = equipmentInput.parentElement;
    wrap.insertAdjacentHTML('afterbegin', '<label>Equipo registrado</label><select id="catalogEquipment" disabled><option value="">Seleccione cliente primero</option></select><input id="catalogSearch" class="hidden" placeholder="Buscar equipo, marca, modelo, serie o activo">');
    wrap.insertAdjacentHTML('beforeend', '<div class="btns"><button type="button" id="catalogManualEdit">Editar datos manualmente</button></div>');
    $('activo').parentElement.insertAdjacentHTML('beforeend', '<label id="catalogSaveWrap" class="hidden"><input id="catalogSaveEquipment" type="checkbox" style="width:auto"> Guardar este equipo para futuras visitas</label>');
    $('reporteForm').insertAdjacentHTML('afterbegin', '<input type="hidden" id="catalogClientId"><input type="hidden" id="catalogEquipmentId">');
    $('catalogClient').onchange = onClient; $('catalogEquipment').onchange = onEquipment; $('catalogSearch').oninput = debounce(renderEquipment, 200); $('catalogManualEdit').onclick = editManually; $('catalogRefresh').onclick = refresh;
  }
  function clearEquipment() { $('catalogEquipmentId').value = ''; $('catalogEquipment').value = ''; equipmentFields().forEach(field => field.value = ''); originalEquipment = null; editingRegistered = false; }
  async function onClient() { const id = $('catalogClient').value; clearEquipment(); if (id === 'manual' || !id) { $('catalogClientId').value = ''; $('cliente').readOnly = false; $('cliente').value = id === 'manual' ? '' : $('cliente').value; $('catalogEquipment').disabled = true; manualNewEquipment(true); return; } const selected = allClients.find(item => item.id === id); $('catalogClientId').value = id; $('cliente').value = selected?.name || ''; $('cliente').readOnly = true; allEquipment = await BennuCatalog.equipment(id); $('catalogEquipment').disabled = false; $('catalogSearch').classList.toggle('hidden', allEquipment.length <= 100); renderEquipment(); }
  function label(item) { return `${item.equipment_name || '-'} — ${[item.brand, item.model].filter(Boolean).join(' ') || '-'} — Serie: ${item.serial_number || '-'} — Activo: ${item.asset_number || '-'}`; }
  function renderEquipment() { const select = $('catalogEquipment'), current = select.value, term = ($('catalogSearch').value || '').toLowerCase(); select.innerHTML = ''; select.add(option('+ Equipo no registrado', 'manual')); for (const item of allEquipment.filter(x => !term || label(x).toLowerCase().includes(term)).slice(0, 50)) select.add(option(label(item), item.id)); if ([...select.options].some(item => item.value === current)) select.value = current; }
  function onEquipment() { const id = $('catalogEquipment').value; if (id === 'manual') { clearEquipment(); manualNewEquipment(true); return; } const item = allEquipment.find(entry => entry.id === id); if (!item) return; $('catalogEquipmentId').value = id; $('equipo').value = item.equipment_name || ''; $('marca').value = item.brand || ''; $('modelo').value = item.model || ''; $('serie').value = item.serial_number || ''; $('activo').value = item.asset_number || ''; originalEquipment = snapshot(item); editingRegistered = false; setReadOnly(true); $('catalogSaveWrap').classList.add('hidden'); }
  function manualNewEquipment(showSave) { $('catalogEquipmentId').value = ''; originalEquipment = null; editingRegistered = false; setReadOnly(false); $('catalogSaveWrap').classList.toggle('hidden', !showSave || !$('catalogClientId').value); }
  function editManually() { if ($('catalogEquipmentId').value && originalEquipment) { editingRegistered = true; setReadOnly(false); $('catalogSaveWrap').classList.add('hidden'); return; } manualNewEquipment(false); }
  async function loadLocal() { allClients = await BennuCatalog.clients(); const select = $('catalogClient'), current = select.value; select.innerHTML = ''; select.add(option('Seleccione…', '')); for (const item of allClients) select.add(option(item.name, item.id)); select.add(option('+ Cliente no registrado', 'manual')); if ([...select.options].some(item => item.value === current)) select.value = current; }
  const formatDate = value => value ? new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value)) : null;
  function localStatus() {
    if (!allClients.length) return 'Catálogo vacío. Pulse “Actualizar catálogo”.';
    return navigator.onLine ? 'Se utiliza la copia local del catálogo.' : 'Sin conexión; se utiliza el catálogo local.';
  }
  function showLocalCatalogStatus() { $('catalogStatus').textContent = localStatus(); }
  function updateCatalogStatus(value) { const formatted = formatDate(value); $('catalogStatus').textContent = formatted ? 'Catálogo actualizado: ' + formatted : localStatus(); }
  async function reloadCatalog(selectedClientId) {
    await loadLocal();
    const select = $('catalogClient');
    if (selectedClientId && allClients.some(item => item.id === selectedClientId)) {
      select.value = selectedClientId;
      allEquipment = await BennuCatalog.equipment(selectedClientId);
      $('catalogEquipment').disabled = false;
      $('catalogSearch').classList.toggle('hidden', allEquipment.length <= 100);
      renderEquipment();
    }
  }
  async function refresh({ forceFull = true } = {}) {
    const button = $('catalogRefresh'), selectedClientId = $('catalogClient')?.value || '';
    if (button) { button.disabled = true; button.textContent = 'Actualizando catálogo…'; }
    $('catalogStatus').textContent = 'Actualizando catálogo…';
    try {
      const result = await BennuCatalog.sync({ forceFull });
      await reloadCatalog(selectedClientId);
      updateCatalogStatus(result.at);
      return result;
    } catch (error) {
      console.error('No se pudo actualizar el catálogo:', error);
      $('catalogStatus').textContent = 'No se pudo actualizar; se mantiene la copia local.';
      throw error;
    } finally {
      if (button) { button.disabled = false; button.textContent = 'Actualizar catálogo'; }
    }
  }
  async function initializeCatalogData() {
    await loadLocal();
    const lastSync = await BennuCatalog.lastSync();
    if (!navigator.onLine) { showLocalCatalogStatus(); return; }
    let fullAttempted = false;
    try {
      let result;
      if (!allClients.length) {
        fullAttempted = true;
        result = await BennuCatalog.sync({ forceFull: true });
      } else {
        result = await BennuCatalog.sync();
      }
      await loadLocal();
      if (!allClients.length && !fullAttempted) {
        fullAttempted = true;
        result = await BennuCatalog.sync({ forceFull: true });
        await loadLocal();
      }
      updateCatalogStatus(result?.at || lastSync);
    } catch (error) {
      console.error('No se pudo actualizar el catálogo:', error);
      showLocalCatalogStatus();
    }
  }
  async function init(options) {
    if (ready) return;
    ready = true;
    db = options.supabase;
    BennuCatalog.init({ supabase: db });
    build();
    await initializeCatalogData();
    window.addEventListener('online', async () => {
      await BennuCatalog.flushPending().catch(() => {});
      const results = await BennuCatalog.flushPendingEquipmentUpdates().catch(() => []);
      for (const result of results) alert(result.ok ? 'Equipo actualizado en el catálogo.' : 'No se pudo actualizar un equipo pendiente: ' + result.error.message);
      await refresh({ forceFull: true }).catch(() => {});
    });
    window.addEventListener('offline', showLocalCatalogStatus);
  }
  function capture() { return { clientId: $('catalogClientId')?.value || null, equipmentId: $('catalogEquipmentId')?.value || null, clientMode: $('catalogClient')?.value === 'manual' ? 'manual' : 'registered', equipmentMode: $('catalogEquipment')?.value === 'manual' ? 'manual' : 'registered', saveEquipment: !!$('catalogSaveEquipment')?.checked, pendingEquipmentLocalId: null, originalEquipment: originalEquipment ? { ...originalEquipment } : null, editingRegistered }; }
  async function restore(data) { if (!ready) return; await loadLocal(); if (data?.clientId && allClients.some(item => item.id === data.clientId)) { $('catalogClient').value = data.clientId; await onClient(); if (data.equipmentId && allEquipment.some(item => item.id === data.equipmentId)) { $('catalogEquipment').value = data.equipmentId; onEquipment(); if (data.originalEquipment) originalEquipment = { ...data.originalEquipment }; editingRegistered = !!data.editingRegistered; if (editingRegistered) setReadOnly(false); } else manualNewEquipment(false); } else { $('catalogClient').value = 'manual'; await onClient(); $('cliente').value = data?.cliente || $('cliente').value; } if ($('catalogSaveEquipment')) $('catalogSaveEquipment').checked = !!data?.saveEquipment; }
  async function prepare(data) {
    if (window.__bennuCatalogCancelled) { window.__bennuCatalogCancelled = false; const stopped = new Error('Guardado cancelado por el usuario'); stopped.code = 'CATALOG_CANCELLED'; throw stopped; }
    if (data?.catalogUpdateQueuedId) return BennuCatalog.prepareReport(data);
    if (!data?.equipmentId || !data.editingRegistered || !data.originalEquipment) return BennuCatalog.prepareReport(data);
    const changes = equipmentChanges(data.originalEquipment, data);
    if (!Object.keys(changes).length) return BennuCatalog.prepareReport(data);
    const choice = window.prompt('Se detectaron cambios en un equipo registrado.\n\n1 = Solo este reporte\n2 = Actualizar catálogo\n3 = Cancelar', '1');
    if (choice === null || choice.trim() === '3') { window.__bennuCatalogCancelled = true; const error = new Error('Guardado cancelado'); error.code = 'CATALOG_CANCELLED'; throw error; }
    if (choice.trim() !== '2') return BennuCatalog.prepareReport(data);
    const replacesProtected = ['serial_number', 'asset_number'].some(key => changes[key] && normalizeCatalogValue(data.originalEquipment[key]) && normalizeCatalogValue(data.originalEquipment[key]) !== normalizeCatalogValue(changes[key]));
    if (replacesProtected && !confirm('El equipo ya tiene una serie o activo registrado.\n¿Confirma que desea reemplazarlo?')) { window.__bennuCatalogCancelled = true; const error = new Error('Guardado cancelado'); error.code = 'CATALOG_CANCELLED'; throw error; }
    if (!navigator.onLine) { const { data: authData } = await db.auth.getUser().catch(() => ({ data: null })); const queued = await BennuCatalog.queueExistingEquipmentUpdate({ equipmentId: data.equipmentId, clientId: data.clientId, original: data.originalEquipment, changes, createdAt: new Date().toISOString(), userId: authData?.user?.id || null }); alert('La actualización del equipo quedó pendiente y se aplicará al recuperar conexión.'); return BennuCatalog.prepareReport({ ...data, catalogUpdateQueuedId: queued.id }); }
    try { await BennuCatalog.updateExistingEquipment({ equipmentId: data.equipmentId, clientId: data.clientId, original: data.originalEquipment, changes, createdAt: new Date().toISOString() }); alert('Equipo actualizado en el catálogo.'); }
    catch (error) { if (error.code === 'EQUIPMENT_CONFLICT') { alert(error.message + '\nLos cambios se guardarán únicamente en este reporte.'); return BennuCatalog.prepareReport(data); } throw error; }
    return BennuCatalog.prepareReport(data);
  }
  window.BennuCatalogUI = { init, capture, restore, prepare, equipmentChanges };
})();
