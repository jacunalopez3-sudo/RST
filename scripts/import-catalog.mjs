import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';

const apply = process.argv.includes('--apply');
const dataDir = path.resolve('data');
const files = (await fs.readdir(dataDir)).filter(name => name.toLowerCase().endsWith('.xlsx'));
if (files.length !== 1) throw new Error(`Se esperaba exactamente un .xlsx en data/; encontrados: ${files.length}`);
const workbook = XLSX.readFile(path.join(dataDir, files[0]), { raw: false });
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { defval: '' });
const clean = value => { const v = String(value ?? '').trim(); return v === '0' ? '' : v; };
const expected = ['Cliente','Equipo','Marca','Modelo','Serie','Activo'];
const headers = Object.keys(rows[0] || {});
for (const header of expected) if (!headers.includes(header)) throw new Error(`Falta la columna ${header}`);
const normalized = [], invalid = [];
for (let index=0; index<rows.length; index++) {
  const row = Object.fromEntries(expected.map(key => [key, clean(rows[index][key])]));
  if (Object.values(row).every(value => !value)) { invalid.push({ row:index+2, reason:'fila vacía o compuesta solo por ceros' }); continue; }
  if (!row.Cliente || !row.Equipo) { invalid.push({ row:index+2, reason:'Cliente o Equipo ausente', data:row }); continue; }
  normalized.push({ sourceRow:index+2, client_name:row.Cliente, equipment_name:row.Equipo, brand:row.Marca||null, model:row.Modelo||null, serial_number:row.Serie||null, asset_number:row.Activo||null });
}
const clientKey = name => name.toLocaleLowerCase('es-CR');
const clients = new Map(); for (const row of normalized) if (!clients.has(clientKey(row.client_name))) clients.set(clientKey(row.client_name), row.client_name);
const duplicateKey = row => row.serial_number ? `serie:${row.serial_number.toLowerCase()}` : row.asset_number ? `activo:${row.asset_number.toLowerCase()}` : `datos:${[row.equipment_name,row.brand||'',row.model||''].join('|').toLowerCase()}`;
const seen = new Map(), duplicates = [], accepted = [];
for (const row of normalized) { const key=`${clientKey(row.client_name)}|${duplicateKey(row)}`; if(seen.has(key)) duplicates.push({row:row.sourceRow, duplicateOf:seen.get(key), key}); else {seen.set(key,row.sourceRow); accepted.push(row);} }
const ambiguityKey = name => name.toLowerCase().replace(/^\s*\(\d+[^)]*\)\s*/,'').replace(/\s*[\/7]\s*taladro\s*$/,'').replace(/\s+/g,' ').trim();
const ambiguityGroups = new Map(); for (const name of clients.values()) { const key=ambiguityKey(name); const list=ambiguityGroups.get(key)||[]; list.push(name); ambiguityGroups.set(key,list); }
const ambiguousClients=[...ambiguityGroups.values()].filter(list=>list.length>1);
const report={file:files[0],sheet:workbook.SheetNames[0],source_rows:rows.length,clients_detected:clients.size,equipment_detected:accepted.length,duplicates,invalid,ambiguous_clients:ambiguousClients,applied:false};

if (apply) {
  const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key) throw new Error('Defina SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:existingClients,error:clientsError}=await db.from('clients').select('id,name'); if(clientsError) throw clientsError;
  const ids=new Map((existingClients||[]).map(item=>[clientKey(item.name),item.id]));
  for(const name of clients.values()) if(!ids.has(clientKey(name))){const {data,error}=await db.from('clients').insert({name}).select('id').single();if(error)throw error;ids.set(clientKey(name),data.id)}
  const {data:existingEquipment,error:eqError}=await db.from('equipment').select('*'); if(eqError) throw eqError;
  const existing=new Map((existingEquipment||[]).map(item=>[`${item.client_id}|${duplicateKey(item)}`,item]));
  for(const row of accepted){const client_id=ids.get(clientKey(row.client_name)),key2=`${client_id}|${duplicateKey(row)}`,prior=existing.get(key2),payload={client_id,equipment_name:row.equipment_name,brand:row.brand,model:row.model,serial_number:row.serial_number,asset_number:row.asset_number,active:true};if(!prior){const {data,error}=await db.from('equipment').insert(payload).select('*').single();if(error)throw error;existing.set(key2,data)}else{const merged={};for(const field of ['equipment_name','brand','model','serial_number','asset_number'])if(payload[field]&&!prior[field])merged[field]=payload[field];if(Object.keys(merged).length){const {error}=await db.from('equipment').update(merged).eq('id',prior.id);if(error)throw error}}}
  report.applied=true;
}
await fs.mkdir('reports',{recursive:true});
await fs.writeFile('reports/catalog-import-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));