-- STEP 2 — cutover operacyjnego rdzenia: case items + activities + portal token API
-- Skrypt additive. Nie usuwa danych.

create extension if not exists pgcrypto;

create table if not exists public.case_items (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null,
  title text not null default '',
  description text not null default '',
  type text not null default 'file',
  status text not null default 'missing',
  is_required boolean not null default true,
  due_date date null,
  sort_order integer not null default 0,
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
  lead_id uuid null,
  case_id uuid null,
  owner_id text null,
  actor_id text null,
  actor_type text not null default 'operator',
  event_type text not null default 'activity',
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_case_items_case_id on public.case_items(case_id);
create index if not exists idx_case_items_sort_order on public.case_items(case_id, sort_order);
create index if not exists idx_activities_case_id on public.activities(case_id);
create index if not exists idx_activities_lead_id on public.activities(lead_id);
create index if not exists idx_activities_created_at on public.activities(created_at desc);

select 'ok' as status;
