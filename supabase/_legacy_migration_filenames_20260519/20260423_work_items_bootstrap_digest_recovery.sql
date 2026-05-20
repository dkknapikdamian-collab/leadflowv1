-- STEP 3 - work_items bootstrap + recovery/digest logs
-- Idempotent and additive. Safe to run multiple times.

create extension if not exists pgcrypto;

create table if not exists public.work_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  created_by_user_id uuid null,
  lead_id uuid null,
  case_id uuid null,
  record_type text not null default 'task',
  type text not null default 'task',
  title text not null default '',
  description text not null default '',
  status text not null default 'todo',
  priority text not null default 'medium',
  scheduled_at timestamptz null,
  start_at timestamptz null,
  end_at timestamptz null,
  recurrence text not null default 'none',
  reminder text not null default 'none',
  show_in_tasks boolean not null default false,
  show_in_calendar boolean not null default false,
  lead_name text null,
  case_title text null,
  recurrence_end_type text null,
  recurrence_end_at timestamptz null,
  recurrence_count integer null,
  legacy_firestore_id text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

alter table public.profiles
  add column if not exists timezone text null default 'Europe/Warsaw',
  add column if not exists daily_digest_email_enabled boolean not null default true,
  add column if not exists daily_digest_hour integer not null default 7,
  add column if not exists daily_digest_recipient_email text null,
  add column if not exists last_digest_sent_at timestamptz null,
  add column if not exists updated_at timestamptz not null default now();

alter table public.workspaces
  add column if not exists timezone text null default 'Europe/Warsaw';

alter table public.work_items
  add column if not exists workspace_id uuid null,
  add column if not exists created_by_user_id uuid null,
  add column if not exists lead_id uuid null,
  add column if not exists case_id uuid null,
  add column if not exists record_type text not null default 'task',
  add column if not exists type text not null default 'task',
  add column if not exists title text not null default '',
  add column if not exists description text not null default '',
  add column if not exists status text not null default 'todo',
  add column if not exists priority text not null default 'medium',
  add column if not exists scheduled_at timestamptz null,
  add column if not exists start_at timestamptz null,
  add column if not exists end_at timestamptz null,
  add column if not exists recurrence text not null default 'none',
  add column if not exists reminder text not null default 'none',
  add column if not exists show_in_tasks boolean not null default false,
  add column if not exists show_in_calendar boolean not null default false,
  add column if not exists lead_name text null,
  add column if not exists case_title text null,
  add column if not exists recurrence_end_type text null,
  add column if not exists recurrence_end_at timestamptz null,
  add column if not exists recurrence_count integer null,
  add column if not exists legacy_firestore_id text null,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_work_items_workspace_created_at on public.work_items(workspace_id, created_at desc);
create index if not exists idx_work_items_workspace_start_at on public.work_items(workspace_id, start_at asc nulls last);
create index if not exists idx_work_items_workspace_record_type on public.work_items(workspace_id, record_type);
create index if not exists idx_work_items_workspace_show_in_tasks on public.work_items(workspace_id, show_in_tasks);
create index if not exists idx_work_items_workspace_show_in_calendar on public.work_items(workspace_id, show_in_calendar);
create index if not exists idx_work_items_workspace_scheduled_at on public.work_items(workspace_id, scheduled_at asc nulls last);
create index if not exists idx_work_items_legacy_firestore_id on public.work_items(legacy_firestore_id);

create table if not exists public.workspace_recovery_logs (
  id uuid primary key default gen_random_uuid(),
  actor_email text not null,
  target_profile text not null,
  target_email text null,
  from_workspace_id uuid null,
  to_workspace_id uuid null,
  reason text null default '',
  payload jsonb not null default '{}'::jsonb,
  applied_at timestamptz not null default now()
);

create index if not exists idx_workspace_recovery_logs_applied_at on public.workspace_recovery_logs(applied_at desc);
create index if not exists idx_workspace_recovery_logs_target_profile on public.workspace_recovery_logs(target_profile);
create index if not exists idx_workspace_recovery_logs_target_email on public.workspace_recovery_logs(target_email);

create table if not exists public.digest_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  profile_id text null,
  profile_email text not null,
  sent_for_date date not null,
  sent_at timestamptz not null default now(),
  status text not null default 'sent',
  error text null,
  summary_json jsonb not null default '{}'::jsonb
);

create unique index if not exists idx_digest_logs_once_per_day
  on public.digest_logs(profile_email, sent_for_date);
create index if not exists idx_digest_logs_workspace_date on public.digest_logs(workspace_id, sent_for_date desc);
create index if not exists idx_digest_logs_sent_at on public.digest_logs(sent_at desc);

select 'ok' as status;
