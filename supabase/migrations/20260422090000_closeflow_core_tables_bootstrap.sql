-- CloseFlow core tables bootstrap for fresh Supabase projects.
-- Purpose: create base tables that older migrations assume already exist.
-- Safe/idempotent: create table if not exists + add column if not exists.

create extension if not exists pgcrypto;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid null,
  owner_id uuid null,
  created_by_user_id uuid null,
  name text not null default 'Mój Workspace',
  plan_id text not null default 'trial_21d',
  subscription_status text not null default 'trial_active',
  trial_ends_at timestamptz null,
  billing_provider text not null default 'manual',
  provider_customer_id text null,
  provider_subscription_id text null,
  next_billing_at timestamptz null,
  cancel_at_period_end boolean not null default false,
  timezone text not null default 'Europe/Warsaw',
  daily_digest_enabled boolean not null default true,
  daily_digest_hour integer not null default 7,
  daily_digest_timezone text not null default 'Europe/Warsaw',
  daily_digest_recipient_email text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  created_by_user_id uuid null,
  owner_id text null,
  name text not null default '',
  company text null default '',
  email text null default '',
  phone text null default '',
  source text null default 'manual',
  status text not null default 'new',
  value numeric not null default 0,
  deal_value numeric not null default 0,
  partial_payments jsonb not null default '[]'::jsonb,
  summary text not null default '',
  notes text not null default '',
  priority text not null default 'medium',
  is_at_risk boolean not null default false,
  next_action_title text not null default '',
  next_action_at timestamptz null,
  next_action_item_id text null,
  linked_case_id uuid null,
  client_id uuid null,
  service_profile_id uuid null,
  accepted_at timestamptz null,
  case_eligible_at timestamptz null,
  case_started_at timestamptz null,
  billing_status text not null default 'not_started',
  billing_model_snapshot text null default 'manual',
  start_rule_snapshot text null default 'on_acceptance',
  win_rule_snapshot text null default 'manual',
  closed_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  lead_id uuid null,
  client_id uuid null,
  service_profile_id uuid null,
  title text not null default '',
  client_name text null default '',
  client_email text null default '',
  client_phone text null default '',
  status text not null default 'in_progress',
  billing_status text not null default 'not_started',
  billing_model_snapshot text null default 'manual',
  completeness_percent numeric not null default 0,
  portal_ready boolean not null default false,
  started_at timestamptz null,
  completed_at timestamptz null,
  last_activity_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  title text not null default '',
  description text null default '',
  type text not null default 'task',
  status text not null default 'todo',
  priority text not null default 'medium',
  due_at timestamptz null,
  scheduled_at timestamptz null,
  reminder_at timestamptz null,
  recurrence_rule text null,
  client_id text null,
  lead_id text null,
  case_id text null,
  linked_case_id text null,
  owner_id text null,
  assigned_to text null,
  user_id text null,
  created_by text null,
  updated_by text null,
  source_type text null,
  source_url text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_workspaces_owner_user_id on public.workspaces(owner_user_id);
create index if not exists idx_leads_workspace_id on public.leads(workspace_id);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_next_action_at on public.leads(next_action_at);
create index if not exists idx_cases_workspace_id on public.cases(workspace_id);
create index if not exists idx_cases_lead_id on public.cases(lead_id);
create index if not exists idx_work_items_workspace_id on public.work_items(workspace_id);
create index if not exists idx_work_items_type_status on public.work_items(type, status);
create index if not exists idx_work_items_due_at on public.work_items(due_at);
create index if not exists idx_work_items_scheduled_at on public.work_items(scheduled_at);

select 'closeflow_core_tables_bootstrap_ready' as status;
