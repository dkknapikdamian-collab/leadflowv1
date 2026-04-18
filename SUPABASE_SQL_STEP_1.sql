-- KROK 1 / bezpieczna migracja pod runtime Supabase dla leadflowv1
-- Wklej CAŁOŚĆ do Supabase -> SQL Editor -> New query -> Run
-- Ten skrypt jest ADDITIVE. Nie usuwa danych.

create extension if not exists pgcrypto;

-- ===== work_items =====
alter table if exists public.work_items add column if not exists case_id uuid null;
alter table if exists public.work_items add column if not exists case_title text null;
alter table if exists public.work_items add column if not exists lead_id uuid null;
alter table if exists public.work_items add column if not exists record_type text null;
alter table if exists public.work_items add column if not exists show_in_tasks boolean not null default false;
alter table if exists public.work_items add column if not exists show_in_calendar boolean not null default false;
alter table if exists public.work_items add column if not exists scheduled_at timestamptz null;
alter table if exists public.work_items add column if not exists start_at timestamptz null;
alter table if exists public.work_items add column if not exists end_at timestamptz null;
alter table if exists public.work_items add column if not exists reminder text null;
alter table if exists public.work_items add column if not exists recurrence text null;
alter table if exists public.work_items add column if not exists priority text null default 'medium';
alter table if exists public.work_items add column if not exists description text null default '';
alter table if exists public.work_items add column if not exists updated_at timestamptz null default now();

create index if not exists idx_work_items_case_id on public.work_items(case_id);
create index if not exists idx_work_items_lead_id on public.work_items(lead_id);
create index if not exists idx_work_items_record_type on public.work_items(record_type);
create index if not exists idx_work_items_show_in_calendar on public.work_items(show_in_calendar);

-- ===== leads =====
alter table if exists public.leads add column if not exists linked_case_id uuid null;
alter table if exists public.leads add column if not exists next_action_item_id uuid null;
alter table if exists public.leads add column if not exists updated_at timestamptz null default now();

create index if not exists idx_leads_linked_case_id on public.leads(linked_case_id);

-- ===== clients =====
alter table if exists public.clients add column if not exists primary_case_id uuid null;
alter table if exists public.clients add column if not exists linked_case_ids jsonb not null default '[]'::jsonb;
alter table if exists public.clients add column if not exists updated_at timestamptz null default now();

create index if not exists idx_clients_primary_case_id on public.clients(primary_case_id);

-- ===== client_portal_tokens =====
create table if not exists public.client_portal_tokens (
  id uuid primary key default gen_random_uuid(),
  case_id uuid null,
  token text not null default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now()
);

create unique index if not exists idx_client_portal_tokens_case_id on public.client_portal_tokens(case_id);

-- ===== cases =====
alter table if exists public.cases add column if not exists client_name text null;
alter table if exists public.cases add column if not exists client_id uuid null;
alter table if exists public.cases add column if not exists lead_id uuid null;
alter table if exists public.cases add column if not exists completeness_percent numeric not null default 0;
alter table if exists public.cases add column if not exists portal_ready boolean not null default false;
alter table if exists public.cases add column if not exists updated_at timestamptz null default now();

create index if not exists idx_cases_lead_id on public.cases(lead_id);
create index if not exists idx_cases_updated_at on public.cases(updated_at);

-- szybki test po migracji
select
  'ok' as status,
  now() as checked_at;
