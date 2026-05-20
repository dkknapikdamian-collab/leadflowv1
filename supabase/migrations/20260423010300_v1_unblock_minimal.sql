-- Minimal unblock migration for production
-- Run this before 20260423_closeflow_v1_domain_model.sql
-- Purpose: add only the prerequisite columns needed by the V1 domain model,
-- without the heavier work_items / digest / recovery bootstrap.

create extension if not exists pgcrypto;

alter table public.leads
  add column if not exists workspace_id uuid null,
  add column if not exists created_by_user_id uuid null,
  add column if not exists value numeric not null default 0,
  add column if not exists partial_payments jsonb not null default '[]'::jsonb,
  add column if not exists summary text not null default '',
  add column if not exists notes text not null default '',
  add column if not exists priority text not null default 'medium',
  add column if not exists is_at_risk boolean not null default false,
  add column if not exists next_action_title text not null default '',
  add column if not exists next_action_at timestamptz null,
  add column if not exists next_action_item_id text null,
  add column if not exists linked_case_id uuid null,
  add column if not exists updated_at timestamptz not null default now();

alter table public.cases
  add column if not exists workspace_id uuid null,
  add column if not exists lead_id uuid null,
  add column if not exists client_email text null default '',
  add column if not exists client_phone text null default '',
  add column if not exists updated_at timestamptz not null default now();

select 'ok' as status;
