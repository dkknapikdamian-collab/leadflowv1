alter table if exists public.leads
  add column if not exists legacy_firestore_id text;

create unique index if not exists leads_legacy_firestore_id_uidx
  on public.leads (legacy_firestore_id)
  where legacy_firestore_id is not null;

alter table if exists public.work_items
  add column if not exists legacy_firestore_id text;

create unique index if not exists work_items_legacy_firestore_id_uidx
  on public.work_items (legacy_firestore_id)
  where legacy_firestore_id is not null;

alter table if exists public.cases
  add column if not exists legacy_firestore_id text;

create unique index if not exists cases_legacy_firestore_id_uidx
  on public.cases (legacy_firestore_id)
  where legacy_firestore_id is not null;
