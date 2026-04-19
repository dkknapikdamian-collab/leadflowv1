-- STEP 2A — cases + case_items + activities + portal token cutover pod Supabase
-- Skrypt additive. Nie usuwa danych.

create extension if not exists pgcrypto;

alter table public.cases
  add column if not exists client_email text null default '',
  add column if not exists client_phone text null default '';

create table if not exists public.case_items (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null,
  title text not null default '',
  description text null default '',
  type text not null default 'file',
  status text not null default 'missing',
  is_required boolean not null default true,
  due_date date null,
  item_order integer not null default 0,
  response text null,
  file_url text null,
  file_name text null,
  approved_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  case_id uuid null,
  lead_id uuid null,
  owner_id text null,
  actor_id text null,
  actor_type text not null default 'operator',
  event_type text not null default 'unknown',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_case_items_case_id on public.case_items(case_id);
create index if not exists idx_case_items_order on public.case_items(case_id, item_order, created_at);
create index if not exists idx_activities_case_id on public.activities(case_id, created_at desc);
create index if not exists idx_activities_lead_id on public.activities(lead_id, created_at desc);
create index if not exists idx_activities_workspace_id on public.activities(workspace_id, created_at desc);

select 'ok' as status;
