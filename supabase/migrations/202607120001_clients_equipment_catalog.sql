create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (btrim(name) <> ''),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  equipment_name text not null check (btrim(equipment_name) <> ''),
  brand text,
  model text,
  serial_number text,
  asset_number text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.service_reports add column if not exists client_id uuid null references public.clients(id);
alter table public.service_reports add column if not exists equipment_id uuid null references public.equipment(id);

create unique index if not exists clients_name_lower_uidx on public.clients (lower(btrim(name)));
create index if not exists equipment_client_id_idx on public.equipment (client_id);
create index if not exists equipment_client_active_idx on public.equipment (client_id, active);
create index if not exists equipment_updated_at_idx on public.equipment (updated_at);
create index if not exists clients_updated_at_idx on public.clients (updated_at);
create unique index if not exists equipment_client_serial_uidx on public.equipment (client_id, lower(btrim(serial_number))) where nullif(btrim(serial_number), '') is not null;
create unique index if not exists equipment_client_asset_no_serial_uidx on public.equipment (client_id, lower(btrim(asset_number))) where nullif(btrim(serial_number), '') is null and nullif(btrim(asset_number), '') is not null;
create unique index if not exists equipment_client_fallback_uidx on public.equipment (client_id, lower(btrim(equipment_name)), lower(btrim(coalesce(brand,''))), lower(btrim(coalesce(model,'')))) where nullif(btrim(serial_number), '') is null and nullif(btrim(asset_number), '') is null;

create or replace function public.catalog_set_updated_at() returns trigger language plpgsql security invoker set search_path = public as $$ begin new.updated_at = now(); return new; end $$;
drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at before update on public.clients for each row execute function public.catalog_set_updated_at();
drop trigger if exists equipment_set_updated_at on public.equipment;
create trigger equipment_set_updated_at before update on public.equipment for each row execute function public.catalog_set_updated_at();

alter table public.clients enable row level security;
alter table public.equipment enable row level security;
grant select, insert, update on public.clients to authenticated;
grant select, insert, update on public.equipment to authenticated;
revoke delete on public.clients, public.equipment from anon, authenticated;

drop policy if exists clients_authenticated_select on public.clients;
create policy clients_authenticated_select on public.clients for select to authenticated using (true);
drop policy if exists clients_authenticated_insert on public.clients;
create policy clients_authenticated_insert on public.clients for insert to authenticated with check (true);
drop policy if exists clients_authenticated_update on public.clients;
create policy clients_authenticated_update on public.clients for update to authenticated using (true) with check (true);
drop policy if exists equipment_authenticated_select on public.equipment;
create policy equipment_authenticated_select on public.equipment for select to authenticated using (true);
drop policy if exists equipment_authenticated_insert on public.equipment;
create policy equipment_authenticated_insert on public.equipment for insert to authenticated with check (true);
drop policy if exists equipment_authenticated_update on public.equipment;
create policy equipment_authenticated_update on public.equipment for update to authenticated using (true) with check (true);
