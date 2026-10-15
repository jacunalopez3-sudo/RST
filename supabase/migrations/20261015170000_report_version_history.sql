-- Preserve immutable snapshots of each completed report before a new PDF version becomes current.
begin;

alter table public.service_reports
  add column if not exists change_reason text;

create table if not exists public.service_report_versions (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.service_reports(id) on delete restrict,
  version_number integer not null check (version_number > 0),
  changed_at timestamptz not null default now(),
  changed_by uuid,
  change_reason text,
  snapshot jsonb not null,
  pdf_path text,
  signature_path text,
  unique (report_id, version_number)
);

alter table public.service_report_versions enable row level security;
grant select on public.service_report_versions to authenticated;
drop policy if exists "authenticated team can read report versions" on public.service_report_versions;
create policy "authenticated team can read report versions"
  on public.service_report_versions for select to authenticated
  using (true);

create or replace function public.archive_service_report_before_pdf_change()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.status = 'completed'
     and old.pdf_path is not null
     and old.pdf_path is distinct from new.pdf_path then
    if nullif(btrim(new.change_reason), '') is null then
      raise exception 'change_reason is required when revising a completed report';
    end if;
    new.edit_count := coalesce(old.edit_count, 0) + 1;
    new.edited_at := coalesce(new.edited_at, now());
    new.edited_by := coalesce(new.edited_by, auth.uid());
    insert into public.service_report_versions
      (report_id, version_number, changed_by, change_reason, snapshot, pdf_path, signature_path)
    values
      (old.id,
       coalesce(old.edit_count, 0) + 1,
       coalesce(new.edited_by, auth.uid()),
       new.change_reason,
       to_jsonb(old),
       old.pdf_path,
       old.signature_path);
  end if;
  return new;
end;
$$;

revoke all on function public.archive_service_report_before_pdf_change() from public;
drop trigger if exists service_reports_archive_before_pdf_change on public.service_reports;
create trigger service_reports_archive_before_pdf_change
  before update on public.service_reports
  for each row execute function public.archive_service_report_before_pdf_change();

commit;
