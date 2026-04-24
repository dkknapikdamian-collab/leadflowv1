-- STEP 1 — bezpieczne przygotowanie Supabase pod cases delete / cases API
-- Skrypt jest additive. Nie usuwa danych.

create extension if not exists pgcrypto;

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  lead_id uuid null,
  client_id uuid null,
  title text not null default '',
  client_name text null default '',
  status text not null default 'in_progress',
  completeness_percent numeric not null default 0,
  portal_ready boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads
  add column if not exists linked_case_id uuid null;

alter table public.work_items
  add column if not exists case_id uuid null,
  add column if not exists case_title text null;

create table if not exists public.client_portal_tokens (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null,
  token text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_cases_updated_at on public.cases(updated_at desc);
create index if not exists idx_cases_workspace_id on public.cases(workspace_id);
create index if not exists idx_leads_linked_case_id on public.leads(linked_case_id);
create index if not exists idx_work_items_case_id on public.work_items(case_id);
create index if not exists idx_client_portal_tokens_case_id on public.client_portal_tokens(case_id);

select 'ok' as status;
