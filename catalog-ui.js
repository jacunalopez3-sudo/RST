(() => {
  const $ = id => document.getElementById(id);
  let db, allClients = [], allEquipment = [], ready = false, originalEquipment = null, editingRegistered = false, rebuildNoticeUntil = 0, rebuildNoticeTimer = null, clientVisibleOptions = [], clientActiveIndex = -1, clientCloseTimer = null;
  const option = (text, value) => new Option(text, value);
  const normalizeCatalogValue = value => String(value || '').trim();
  const normalizeClientSearch = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es').trim();
  const debounce = (fn, ms) => { let timer; return () => { clearTimeout(timer); timer = setTimeout(fn, ms); }; };
  const equipmentFields = () => [$('equipo'), $('marca'), $('modelo'), $('serie'), $('activo')];
  function setReadOnly(value) { equipmentFields().forEach(field => field.readOnly = value); }
  function snapshot(item) { return item ? { equipment_name: item.equipment_name || '', brand: item.brand || '', model: item.model || '', serial_number: item.serial_number || '', asset_number: item.asset_number || '' } : null; }
  function equipmentChanges(original, current) { const fields = { equipment_name: current.equipo, brand: current.marca, model: current.modelo, serial_number: current.serie, asset_number: current.activo }, changes = {}; for (const [key, value] of Object.entries(fields)) { const normalized = normalizeCatalogValue(value), before = normalizeCatalogValue(original?.[key]); if (normalized !== before) changes[key] = normalized || null; } return changes; }
  function syncClientSearchValue(value) {
    const input = $('catalogClientSearch');
    if (!input) return;
    const selected = value && value !== 'manual' ? allClients.find(item => item.id === value) : null;
    input.value = value === 'manual' ? '+ Cliente no registrado' : selected?.name || '';
    input.dataset.selectedValue = value || '';
    input.setCustomValidity('');
    input.setAttribute('aria-invalid', 'false');
  }
  function paintActiveClientOption() {
    const input = $('catalogClientSearch'), list = $('catalogClientList');
    if (!input || !list) return;
    const buttons = [...list.querySelectorAll('[data-client-value]')];
    buttons.forEach((button, index) => {
      const active = index === clientActiveIndex;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    const activeButton = buttons[clientActiveIndex];
    if (activeButton) {
      input.setAttribute('aria-activedescendant', activeButton.id);
      activeButton.scrollIntoView({ block: 'nearest' });
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }
  function renderClientOptions(term = null) {
    const input = $('catalogClientSearch'), list = $('catalogClientList');
    if (!input || !list) return;
    const query = normalizeClientSearch(term === null ? input.value : term);
    const matches = allClients.filter(item => !query || normalizeClientSearch(item.name).includes(query));
    clientVisibleOptions = matches.map(item => ({ id: item.id, name: item.name, manual: false }));
    clientVisibleOptions.push({ id: 'manual', name: '+ Cliente no registrado', manual: true });
    clientActiveIndex = query ? -1 : clientVisibleOptions.findIndex(item => item.id === input.dataset.selectedValue);
    list.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement('div');
      empty.className = 'catalog-client-empty';
      empty.textContent = 'No se encontraron clientes';
      list.append(empty);
    }
    clientVisibleOptions.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = 'catalogClientOption' + index;
      button.className = 'catalog-client-option' + (item.manual ? ' manual' : '');
      button.dataset.clientValue = item.id;
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', 'false');
      button.textContent = item.name;
      list.append(button);
    });
    paintActiveClientOption();
  }
  function openClientOptions(showAll = false) {
    clearTimeout(clientCloseTimer);
    const input = $('catalogClientSearch'), list = $('catalogClientList');
    renderClientOptions(showAll ? '' : null);
    list.classList.remove('hidden');
    input.setAttribute('aria-expanded', 'true');
  }
  function closeClientOptions() {
    const input = $('catalogClientSearch'), list = $('catalogClientList');
    if (!input || !list) return;
    list.classList.add('hidden');
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    clientActiveIndex = -1;
  }
  function moveActiveClientOption(step) {
    if (!clientVisibleOptions.length) return;
    clientActiveIndex = clientActiveIndex < 0 ? (step > 0 ? 0 : clientVisibleOptions.length - 1) : (clientActiveIndex + step + clientVisibleOptions.length) % clientVisibleOptions.length;
    paintActiveClientOption();
  }
  async function selectClientOption(value) {
    const select = $('catalogClient');
    if (![...select.options].some(item => item.value === value)) return;
    select.value = value;
    closeClientOptions();
    await onClient();
  }
  function invalidateClientSelection() {
    const input = $('catalogClientSearch'), select = $('catalogClient');
    select.value = '';
    input.dataset.selectedValue = '';
    input.setCustomValidity(input.value.trim() ? 'Seleccione un cliente de la lista.' : '');
    input.setAttribute('aria-invalid', input.value.trim() ? 'true' : 'false');
    $('catalogClientId').value = '';
    $('cliente').value = '';
    $('cliente').readOnly = true;
    clearEquipment();
    $('catalogEquipment').disabled = true;
    $('catalogSearch').classList.add('hidden');
    manualNewEquipment(false);
  }
  function onClientSearchKeydown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if ($('catalogClientList').classList.contains('hidden')) openClientOptions(false);
      moveActiveClientOption(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if (event.key === 'Enter') {
      const selected = clientVisibleOptions[clientActiveIndex] || clientVisibleOptions.find(item => !item.manual);
      if (selected && !$('catalogClientList').classList.contains('hidden')) {
        event.preventDefault();
        selectClientOption(selected.id).catch(error => console.error('No se pudo seleccionar el cliente.', error));
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      closeClientOptions();
    }
  }
  function build() {
    const clientInput = $('cliente'), clientWrap = clientInput.parentElement;
    clientWrap.insertAdjacentHTML('afterbegin', '<label>Cliente registrado</label><div id="catalogClientCombobox" class="catalog-client-combobox"><input id="catalogClientSearch" type="search" role="combobox" aria-autocomplete="list" aria-haspopup="listbox" aria-expanded="false" aria-controls="catalogClientList" autocomplete="off" autocapitalize="words" spellcheck="false" placeholder="Seleccione o busque un cliente"><select id="catalogClient" class="hidden" tabindex="-1" aria-hidden="true"><option value="">Seleccione…</option><option value="manual">+ Cliente no registrado</option></select><div id="catalogClientList" class="catalog-client-list hidden" role="listbox"></div></div>');
    clientInput.placeholder = 'Nombre del cliente'; clientInput.readOnly = true;
    const equipmentInput = $('equipo'), wrap = equipmentInput.parentElement;
    wrap.insertAdjacentHTML('afterbegin', '<label>Equipo registrado</label><select id="catalogEquipment" disabled><option value="">Seleccione cliente primero</option></select><input id="catalogSearch" class="hidden" placeholder="Buscar equipo, marca, modelo, serie o activo">');
    wrap.insertAdjacentHTML('beforeend', '<div class="btns"><button type="button" id="catalogManualEdit">Editar datos manualmente</button></div>');
    $('activo').parentElement.insertAdjacentHTML('beforeend', '<label id="catalogSaveWrap" class="hidden"><input id="catalogSaveEquipment" type="checkbox" style="width:auto"> Guardar este equipo para futuras visitas</label>');
    $('reporteForm').insertAdjacentHTML('afterbegin', '<input type="hidden" id="catalogClientId"><input type="hidden" id="catalogEquipmentId">');
    $('catalogClient').onchange = onClient;
    const clientSearch = $('catalogClientSearch'), clientList = $('catalogClientList');
    clientSearch.addEventListener('focus', () => { const hasSelection = !!clientSearch.dataset.selectedValue; if (hasSelection) clientSearch.select(); openClientOptions(hasSelection || !clientSearch.value); });
    clientSearch.addEventListener('click', () => openClientOptions(!!clientSearch.dataset.selectedValue || !clientSearch.value));
    clientSearch.addEventListener('input', () => { invalidateClientSelection(); openClientOptions(false); });
    clientSearch.addEventListener('keydown', onClientSearchKeydown);
    clientSearch.addEventListener('blur', () => { clientCloseTimer = setTimeout(closeClientOptions, 180); });
    clientList.addEventListener('mousedown', event => event.preventDefault());
    clientList.addEventListener('click', event => { const target = event.target.closest('[data-client-value]'); if (target) selectClientOption(target.dataset.clientValue).catch(error => console.error('No se pudo seleccionar el cliente.', error)); });
    $('catalogEquipment').onchange = onEquipment; $('catalogSearch').oninput = debounce(renderEquipment, 200); $('catalogManualEdit').onclick = editManually; $('catalogRefresh').onclick = refresh;
  }
  function clearEquipment() { $('catalogEquipmentId').value = ''; $('catalogEquipment').value = ''; equipmentFields().forEach(field => field.value = ''); originalEquipment = null; editingRegistered = false; }
  async function onClient() { const id = $('catalogClient').value; syncClientSearchValue(id); clearEquipment(); if (id === 'manual' || !id) { $('catalogClientId').value = ''; $('cliente').readOnly = false; $('cliente').value = id === 'manual' ? '' : $('cliente').value; $('catalogEquipment').disabled = true; manualNewEquipment(true); return; } const selected = allClients.find(item => item.id === id); $('catalogClientId').value = id; $('cliente').value = selected?.name || ''; $('cliente').readOnly = true; allEquipment = await BennuCatalog.equipment(id); $('catalogEquipment').disabled = false; $('catalogSearch').classList.toggle('hidden', allEquipment.length <= 100); renderEquipment(); }
  function label(item) { return `${item.equipment_name || '-'} — ${[item.brand, item.model].filter(Boolean).join(' ') || '-'} — Serie: ${item.serial_number || '-'} — Activo: ${item.asset_number || '-'}`; }
  function renderEquipment() { const select = $('catalogEquipment'), current = select.value, term = ($('catalogSearch').value || '').toLowerCase(); select.innerHTML = ''; select.add(option('+ Equipo no registrado', 'manual')); for (const item of allEquipment.filter(x => !term || label(x).toLowerCase().includes(term)).slice(0, 50)) select.add(option(label(item), item.id)); if ([...select.options].some(item => item.value === current)) select.value = current; }
  function onEquipment() { const id = $('catalogEquipment').value; if (id === 'manual') { clearEquipment(); manualNewEquipment(true); return; } const item = allEquipment.find(entry => entry.id === id); if (!item) return; $('catalogEquipmentId').value = id; $('equipo').value = item.equipment_name || ''; $('marca').value = item.brand || ''; $('modelo').value = item.model || ''; $('serie').value = item.serial_number || ''; $('activo').value = item.asset_number || ''; originalEquipment = snapshot(item); editingRegistered = false; setReadOnly(true); $('catalogSaveWrap').classList.add('hidden'); }
  function manualNewEquipment(showSave) { $('catalogEquipmentId').value = ''; originalEquipment = null; editingRegistered = false; setReadOnly(false); $('catalogSaveWrap').classList.toggle('hidden', !showSave || !$('catalogClientId').value); }
  function editManually() { if ($('catalogEquipmentId').value && originalEquipment) { editingRegistered = true; setReadOnly(false); $('catalogSaveWrap').classList.add('hidden'); return; } manualNewEquipment(false); }
  async function loadLocal() { allClients = await BennuCatalog.clients(); const select = $('catalogClient'), current = select.value; select.innerHTML = ''; select.add(option('Seleccione…', '')); for (const item of allClients) select.add(option(item.name, item.id)); select.add(option('+ Cliente no registrado', 'manual')); if ([...select.options].some(item => item.value === current)) select.value = current; syncClientSearchValue(select.value); if ($('catalogClientSearch')?.getAttribute('aria-expanded') === 'true') renderClientOptions(); }
  const formatDate = value => value ? new Intl.DateTimeFormat('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value)) : null;
  function localStatus() {
    if (!allClients.length) return 'Catálogo vacío. Pulse “Actualizar catálogo”.';
    return navigator.onLine ? 'Se utiliza la copia local del catálogo.' : 'Sin conexión; se utiliza el catálogo local.';
  }
  function showLocalCatalogStatus() { $('catalogStatus').textContent = localStatus(); }
  function showRebuildNotice(event) {
    const message = event?.detail?.message || 'Se reconstruyó el catálogo local porque estaba desactualizado.';
    rebuildNoticeUntil = Date.now() + 8000;
    $('catalogStatus').textContent = message;
    clearTimeout(rebuildNoticeTimer);
    rebuildNoticeTimer = setTimeout(() => {
      if (Date.now() >= rebuildNoticeUntil && $('catalogStatus').textContent === message) showLocalCatalogStatus();
    }, 8000);
  }
  function updateCatalogStatus(value) { const formatted = formatDate(value); $('catalogStatus').textContent = formatted ? 'Catálogo actualizado: ' + formatted : localStatus(); }
  function syncErrorText(error) {
    return error?.bennuCatalogDiagnostic || BennuCatalog.formatSyncError?.('sin tabla identificada', error) || String(error?.message || error);
  }
  function showSyncError(error) {
    const diagnostic = syncErrorText(error);
    console.error(diagnostic, error);
    $('catalogStatus').textContent = diagnostic;
  }
  function showSyncResult(result, fallbackAt = null) {
    if (result?.diagnostics?.length) {
      $('catalogStatus').textContent = result.diagnostics.join('\n\n');
      return;
    }
    if (Date.now() < rebuildNoticeUntil) return;
    updateCatalogStatus(result?.at || fallbackAt);
  }
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
      showSyncResult(result);
      return result;
    } catch (error) {
      showSyncError(error);
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
      showSyncResult(result, lastSync);
    } catch (error) {
      showSyncError(error);
    }
  }
  async function init(options) {
    if (ready) return;
    ready = true;
    db = options.supabase;
    BennuCatalog.init({ supabase: db });
    build();
    window.addEventListener('bennu:catalog-rebuilt', showRebuildNotice);
    window.addEventListener('bennu:catalog-sync-error', event => showSyncError(event.detail?.error));
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
  function normalizeCatalogText(value) {
    return String(value ?? '').trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, ' ');
  }
  function catalogText(value) {
    const text = String(value ?? '').trim().replace(/\s+/g, ' ');
    return text || null;
  }
  async function syncUnregisteredClientToCatalog(reportData) {
    if (reportData?.clientMode !== 'manual') return;
    try {
      const clientName = catalogText(reportData.cliente);
      if (!clientName) return;

      const clientsResult = await db.from('clients').select('id,name');
      if (clientsResult.error) throw clientsResult.error;
      const normalizedClientName = normalizeCatalogText(clientName);
      let client = (clientsResult.data || []).find(item => normalizeCatalogText(item.name) === normalizedClientName);

      if (!client) {
        const createdClient = await db.from('clients').insert({ name: clientName, active: true }).select('id,name').single();
        if (createdClient.error) throw createdClient.error;
        client = createdClient.data;
      }

      const equipmentName = catalogText(reportData.equipo);
      if (equipmentName) {
        const equipmentResult = await db.from('equipment')
          .select('id,equipment_name,brand,model,serial_number,asset_number')
          .eq('client_id', client.id);
        if (equipmentResult.error) throw equipmentResult.error;

        const incoming = {
          equipment_name: equipmentName,
          brand: catalogText(reportData.marca),
          model: catalogText(reportData.modelo),
          serial_number: catalogText(reportData.serie),
          asset_number: catalogText(reportData.activo)
        };
        const normalizedSerial = normalizeCatalogText(incoming.serial_number);
        const normalizedAsset = normalizeCatalogText(incoming.asset_number);
        let equipment = null;

        if (normalizedSerial) {
          equipment = (equipmentResult.data || []).find(item => normalizeCatalogText(item.serial_number) === normalizedSerial);
        }
        if (!equipment && normalizedAsset) {
          equipment = (equipmentResult.data || []).find(item => normalizeCatalogText(item.asset_number) === normalizedAsset);
        }
        if (!equipment) {
          equipment = (equipmentResult.data || []).find(item =>
            normalizeCatalogText(item.equipment_name) === normalizeCatalogText(incoming.equipment_name) &&
            normalizeCatalogText(item.brand) === normalizeCatalogText(incoming.brand) &&
            normalizeCatalogText(item.model) === normalizeCatalogText(incoming.model)
          );
        }

        if (!equipment) {
          const equipmentPayload = {
            client_id: client.id,
            equipment_name: incoming.equipment_name,
            brand: incoming.brand,
            model: incoming.model,
            serial_number: incoming.serial_number,
            asset_number: incoming.asset_number,
            active: true
          };
          const { data: createdEquipment, error: equipmentError } = await db
            .from('equipment')
            .insert(equipmentPayload)
            .select('id,client_id,equipment_name,brand,model,serial_number,asset_number')
            .single();
          if (equipmentError) {
            console.error('Error creando equipo automático', {
              code: equipmentError.code,
              message: equipmentError.message,
              details: equipmentError.details,
              hint: equipmentError.hint,
              clientId: client.id,
              equipmentPayload
            });
            throw equipmentError;
          }
          if (!createdEquipment?.id) throw new Error('Supabase no devolvió el equipo creado.');
        } else {
          const emptyFields = {};
          for (const [field, value] of Object.entries(incoming)) {
            if (!normalizeCatalogText(equipment[field]) && normalizeCatalogText(value)) emptyFields[field] = value;
          }
          if (Object.keys(emptyFields).length) {
            const updatedEquipment = await db.from('equipment').update(emptyFields).eq('id', equipment.id);
            if (updatedEquipment.error) throw updatedEquipment.error;
          }
        }
      }

      await BennuCatalog.sync({ forceFull: true });
      await loadLocal();
    } catch (error) {
      console.error('No se pudo incorporar el cliente no registrado al catálogo.', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        error
      });
    }
  }
  window.BennuCatalogUI = { init, capture, restore, prepare, equipmentChanges, syncUnregisteredClientToCatalog };
})();
