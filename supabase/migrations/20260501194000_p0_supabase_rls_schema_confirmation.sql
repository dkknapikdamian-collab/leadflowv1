-- P0 - Supabase schema + RLS confirmation for service-role backed API
-- Purpose:
-- 1) Ensure production schema has the tables/columns used by the current code.
-- 2) Keep RLS enabled and forced as a second protection layer.
-- 3) Keep API schema fallbacks in code until this migration is applied in production.

begin;

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Core auth/workspace tables
-- ---------------------------------------------------------------------------

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid,
  owner_id uuid,
  created_by_user_id uuid,
  name text not null default 'Moj Workspace',
  plan_id text not null default 'trial_21d',
  subscription_status text not null default 'trial_active',
  trial_ends_at timestamptz,
  billing_provider text not null default 'manual',
  provider_customer_id text,
  provider_subscription_id text,
  next_billing_at timestamptz,
  cancel_at_period_end boolean not null default false,
  timezone text not null default 'Europe/Warsaw',
  daily_digest_enabled boolean not null default true,
  daily_digest_hour integer not null default 7,
  daily_digest_timezone text not null default 'Europe/Warsaw',
  daily_digest_recipient_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key,
  auth_user_id uuid,
  firebase_uid uuid,
  auth_uid uuid,
  external_auth_uid uuid,
  email text,
  full_name text not null default '',
  company_name text not null default '',
  workspace_id uuid,
  role text not null default 'member',
  is_admin boolean not null default false,
  appearance_skin text not null default 'classic-light',
  planning_conflict_warnings_enabled boolean not null default true,
  browser_notifications_enabled boolean not null default true,
  force_logout_after timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id, user_id)
);

alter table if exists public.workspaces add column if not exists owner_user_id uuid;
alter table if exists public.workspaces add column if not exists owner_id uuid;
alter table if exists public.workspaces add column if not exists created_by_user_id uuid;
alter table if exists public.workspaces add column if not exists name text not null default 'Moj Workspace';
alter table if exists public.workspaces add column if not exists plan_id text not null default 'trial_21d';
alter table if exists public.workspaces add column if not exists subscription_status text not null default 'trial_active';
alter table if exists public.workspaces add column if not exists trial_ends_at timestamptz;
alter table if exists public.workspaces add column if not exists billing_provider text not null default 'manual';
alter table if exists public.workspaces add column if not exists provider_customer_id text;
alter table if exists public.workspaces add column if not exists provider_subscription_id text;
alter table if exists public.workspaces add column if not exists next_billing_at timestamptz;
alter table if exists public.workspaces add column if not exists cancel_at_period_end boolean not null default false;
alter table if exists public.workspaces add column if not exists timezone text not null default 'Europe/Warsaw';
alter table if exists public.workspaces add column if not exists daily_digest_enabled boolean not null default true;
alter table if exists public.workspaces add column if not exists daily_digest_hour integer not null default 7;
alter table if exists public.workspaces add column if not exists daily_digest_timezone text not null default 'Europe/Warsaw';
alter table if exists public.workspaces add column if not exists daily_digest_recipient_email text;
alter table if exists public.workspaces add column if not exists created_at timestamptz not null default now();
alter table if exists public.workspaces add column if not exists updated_at timestamptz not null default now();

alter table if exists public.profiles add column if not exists id uuid;
alter table if exists public.profiles alter column id set default gen_random_uuid();
update public.profiles set id = gen_random_uuid() where id is null;
alter table if exists public.profiles add column if not exists auth_user_id uuid;
alter table if exists public.profiles add column if not exists firebase_uid uuid;
alter table if exists public.profiles add column if not exists auth_uid uuid;
alter table if exists public.profiles add column if not exists external_auth_uid uuid;
alter table if exists public.profiles add column if not exists email text;
alter table if exists public.profiles add column if not exists full_name text not null default '';
alter table if exists public.profiles add column if not exists company_name text not null default '';
alter table if exists public.profiles add column if not exists workspace_id uuid;
alter table if exists public.profiles add column if not exists role text not null default 'member';
alter table if exists public.profiles add column if not exists is_admin boolean not null default false;
alter table if exists public.profiles add column if not exists appearance_skin text not null default 'classic-light';
alter table if exists public.profiles add column if not exists planning_conflict_warnings_enabled boolean not null default true;
alter table if exists public.profiles add column if not exists browser_notifications_enabled boolean not null default true;
alter table if exists public.profiles add column if not exists force_logout_after timestamptz;
alter table if exists public.profiles add column if not exists created_at timestamptz not null default now();
alter table if exists public.profiles add column if not exists updated_at timestamptz not null default now();

alter table if exists public.workspace_members add column if not exists workspace_id uuid;
alter table if exists public.workspace_members add column if not exists user_id uuid;
alter table if exists public.workspace_members add column if not exists role text not null default 'owner';
alter table if exists public.workspace_members add column if not exists created_at timestamptz not null default now();
alter table if exists public.workspace_members add column if not exists updated_at timestamptz not null default now();

-- ---------------------------------------------------------------------------
-- Business tables used by API/frontend
-- ---------------------------------------------------------------------------

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  name text not null default 'Klient',
  company text,
  email text,
  phone text,
  notes text,
  tags text[] not null default '{}',
  source_primary text not null default 'other',
  last_activity_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  created_by_user_id uuid,
  client_id uuid,
  linked_case_id uuid,
  service_profile_id uuid,
  name text not null default '',
  company text,
  email text,
  phone text,
  source text not null default 'other',
  value numeric not null default 0,
  partial_payments jsonb not null default '[]'::jsonb,
  summary text,
  notes text,
  status text not null default 'new',
  priority text not null default 'medium',
  is_at_risk boolean not null default false,
  next_action_title text,
  next_action_at timestamptz,
  next_action_item_id uuid,
  billing_status text not null default 'not_started',
  billing_model_snapshot text not null default 'manual',
  start_rule_snapshot text not null default 'on_acceptance',
  win_rule_snapshot text not null default 'manual',
  accepted_at timestamptz,
  case_eligible_at timestamptz,
  case_started_at timestamptz,
  closed_at timestamptz,
  moved_to_service_at timestamptz,
  lead_visibility text not null default 'active',
  sales_outcome text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cases (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  lead_id uuid,
  client_id uuid,
  service_profile_id uuid,
  title text not null default 'Nowa sprawa',
  client_name text,
  client_email text,
  client_phone text,
  status text not null default 'in_progress',
  billing_status text not null default 'not_started',
  billing_model_snapshot text not null default 'manual',
  completeness_percent integer not null default 0,
  portal_ready boolean not null default false,
  created_from_lead boolean not null default false,
  service_started_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  created_by_user_id uuid,
  lead_id uuid,
  case_id uuid,
  record_type text not null default 'task',
  type text not null default 'task',
  title text not null default '',
  description text not null default '',
  status text not null default 'open',
  priority text not null default 'medium',
  scheduled_at timestamptz,
  start_at timestamptz,
  end_at timestamptz,
  due_at timestamptz,
  date date,
  reminder text not null default 'none',
  reminder_at timestamptz,
  recurrence text not null default 'none',
  recurrence_rule text,
  recurrence_end_type text,
  recurrence_end_at timestamptz,
  recurrence_count integer,
  show_in_tasks boolean not null default true,
  show_in_calendar boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  owner_id uuid,
  actor_id uuid,
  actor_type text not null default 'operator',
  event_type text not null default 'activity',
  payload jsonb not null default '{}'::jsonb,
  lead_id uuid,
  case_id uuid,
  client_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_drafts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  kind text not null default 'note',
  status text not null default 'draft',
  raw_text text,
  rawText text,
  payload jsonb not null default '{}'::jsonb,
  target_type text,
  target_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.response_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  name text not null default '',
  title text,
  body text not null default '',
  category text not null default 'general',
  tags text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_templates (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  name text not null default '',
  description text,
  items jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_items (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  case_id uuid,
  title text not null default '',
  status text not null default 'open',
  type text not null default 'task',
  sort_order integer not null default 0,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_portal_tokens (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  case_id uuid,
  token_hash text,
  token text,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.billing_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  provider text not null default 'manual',
  event_type text not null default '',
  event_id text,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Column repair for existing installs.
alter table if exists public.clients add column if not exists workspace_id uuid;
alter table if exists public.clients add column if not exists name text not null default 'Klient';
alter table if exists public.clients add column if not exists company text;
alter table if exists public.clients add column if not exists email text;
alter table if exists public.clients add column if not exists phone text;
alter table if exists public.clients add column if not exists notes text;
alter table if exists public.clients add column if not exists tags text[] not null default '{}';
alter table if exists public.clients add column if not exists source_primary text not null default 'other';
alter table if exists public.clients add column if not exists last_activity_at timestamptz;
alter table if exists public.clients add column if not exists archived_at timestamptz;
alter table if exists public.clients add column if not exists created_at timestamptz not null default now();
alter table if exists public.clients add column if not exists updated_at timestamptz not null default now();

alter table if exists public.leads add column if not exists workspace_id uuid;
alter table if exists public.leads add column if not exists created_by_user_id uuid;
alter table if exists public.leads add column if not exists client_id uuid;
alter table if exists public.leads add column if not exists linked_case_id uuid;
alter table if exists public.leads add column if not exists service_profile_id uuid;
alter table if exists public.leads add column if not exists name text not null default '';
alter table if exists public.leads add column if not exists company text;
alter table if exists public.leads add column if not exists email text;
alter table if exists public.leads add column if not exists phone text;
alter table if exists public.leads add column if not exists source text not null default 'other';
alter table if exists public.leads add column if not exists value numeric not null default 0;
alter table if exists public.leads add column if not exists partial_payments jsonb not null default '[]'::jsonb;
alter table if exists public.leads add column if not exists summary text;
alter table if exists public.leads add column if not exists notes text;
alter table if exists public.leads add column if not exists status text not null default 'new';
alter table if exists public.leads add column if not exists priority text not null default 'medium';
alter table if exists public.leads add column if not exists is_at_risk boolean not null default false;
alter table if exists public.leads add column if not exists next_action_title text;
alter table if exists public.leads add column if not exists next_action_at timestamptz;
alter table if exists public.leads add column if not exists next_action_item_id uuid;
alter table if exists public.leads add column if not exists billing_status text not null default 'not_started';
alter table if exists public.leads add column if not exists billing_model_snapshot text not null default 'manual';
alter table if exists public.leads add column if not exists start_rule_snapshot text not null default 'on_acceptance';
alter table if exists public.leads add column if not exists win_rule_snapshot text not null default 'manual';
alter table if exists public.leads add column if not exists accepted_at timestamptz;
alter table if exists public.leads add column if not exists case_eligible_at timestamptz;
alter table if exists public.leads add column if not exists case_started_at timestamptz;
alter table if exists public.leads add column if not exists closed_at timestamptz;
alter table if exists public.leads add column if not exists moved_to_service_at timestamptz;
alter table if exists public.leads add column if not exists lead_visibility text not null default 'active';
alter table if exists public.leads add column if not exists sales_outcome text not null default 'open';
alter table if exists public.leads add column if not exists created_at timestamptz not null default now();
alter table if exists public.leads add column if not exists updated_at timestamptz not null default now();

alter table if exists public.cases add column if not exists workspace_id uuid;
alter table if exists public.cases add column if not exists lead_id uuid;
alter table if exists public.cases add column if not exists client_id uuid;
alter table if exists public.cases add column if not exists service_profile_id uuid;
alter table if exists public.cases add column if not exists title text not null default 'Nowa sprawa';
alter table if exists public.cases add column if not exists client_name text;
alter table if exists public.cases add column if not exists client_email text;
alter table if exists public.cases add column if not exists client_phone text;
alter table if exists public.cases add column if not exists status text not null default 'in_progress';
alter table if exists public.cases add column if not exists billing_status text not null default 'not_started';
alter table if exists public.cases add column if not exists billing_model_snapshot text not null default 'manual';
alter table if exists public.cases add column if not exists completeness_percent integer not null default 0;
alter table if exists public.cases add column if not exists portal_ready boolean not null default false;
alter table if exists public.cases add column if not exists created_from_lead boolean not null default false;
alter table if exists public.cases add column if not exists service_started_at timestamptz;
alter table if exists public.cases add column if not exists started_at timestamptz;
alter table if exists public.cases add column if not exists completed_at timestamptz;
alter table if exists public.cases add column if not exists last_activity_at timestamptz;
alter table if exists public.cases add column if not exists created_at timestamptz not null default now();
alter table if exists public.cases add column if not exists updated_at timestamptz not null default now();

alter table if exists public.work_items add column if not exists workspace_id uuid;
alter table if exists public.work_items add column if not exists created_by_user_id uuid;
alter table if exists public.work_items add column if not exists lead_id uuid;
alter table if exists public.work_items add column if not exists case_id uuid;
alter table if exists public.work_items add column if not exists record_type text not null default 'task';
alter table if exists public.work_items add column if not exists type text not null default 'task';
alter table if exists public.work_items add column if not exists title text not null default '';
alter table if exists public.work_items add column if not exists description text not null default '';
alter table if exists public.work_items add column if not exists status text not null default 'open';
alter table if exists public.work_items add column if not exists priority text not null default 'medium';
alter table if exists public.work_items add column if not exists scheduled_at timestamptz;
alter table if exists public.work_items add column if not exists start_at timestamptz;
alter table if exists public.work_items add column if not exists end_at timestamptz;
alter table if exists public.work_items add column if not exists due_at timestamptz;
alter table if exists public.work_items add column if not exists date date;
alter table if exists public.work_items add column if not exists reminder text not null default 'none';
alter table if exists public.work_items add column if not exists reminder_at timestamptz;
alter table if exists public.work_items add column if not exists recurrence text not null default 'none';
alter table if exists public.work_items add column if not exists recurrence_rule text;
alter table if exists public.work_items add column if not exists recurrence_end_type text;
alter table if exists public.work_items add column if not exists recurrence_end_at timestamptz;
alter table if exists public.work_items add column if not exists recurrence_count integer;
alter table if exists public.work_items add column if not exists show_in_tasks boolean not null default true;
alter table if exists public.work_items add column if not exists show_in_calendar boolean not null default true;
alter table if exists public.work_items add column if not exists created_at timestamptz not null default now();
alter table if exists public.work_items add column if not exists updated_at timestamptz not null default now();

alter table if exists public.activities add column if not exists workspace_id uuid;
alter table if exists public.activities add column if not exists owner_id uuid;
alter table if exists public.activities add column if not exists actor_id uuid;
alter table if exists public.activities add column if not exists actor_type text not null default 'operator';
alter table if exists public.activities add column if not exists event_type text not null default 'activity';
alter table if exists public.activities add column if not exists payload jsonb not null default '{}'::jsonb;
alter table if exists public.activities add column if not exists lead_id uuid;
alter table if exists public.activities add column if not exists case_id uuid;
alter table if exists public.activities add column if not exists client_id uuid;
alter table if exists public.activities add column if not exists created_at timestamptz not null default now();
alter table if exists public.activities add column if not exists updated_at timestamptz not null default now();

alter table if exists public.ai_drafts add column if not exists workspace_id uuid;
alter table if exists public.ai_drafts add column if not exists kind text not null default 'note';
alter table if exists public.ai_drafts add column if not exists status text not null default 'draft';
alter table if exists public.ai_drafts add column if not exists raw_text text;
alter table if exists public.ai_drafts add column if not exists rawText text;
alter table if exists public.ai_drafts add column if not exists payload jsonb not null default '{}'::jsonb;
alter table if exists public.ai_drafts add column if not exists target_type text;
alter table if exists public.ai_drafts add column if not exists target_id uuid;
alter table if exists public.ai_drafts add column if not exists created_at timestamptz not null default now();
alter table if exists public.ai_drafts add column if not exists updated_at timestamptz not null default now();

alter table if exists public.response_templates add column if not exists workspace_id uuid;
alter table if exists public.response_templates add column if not exists name text not null default '';
alter table if exists public.response_templates add column if not exists title text;
alter table if exists public.response_templates add column if not exists body text not null default '';
alter table if exists public.response_templates add column if not exists category text not null default 'general';
alter table if exists public.response_templates add column if not exists tags text[] not null default '{}';
alter table if exists public.response_templates add column if not exists is_active boolean not null default true;
alter table if exists public.response_templates add column if not exists created_at timestamptz not null default now();
alter table if exists public.response_templates add column if not exists updated_at timestamptz not null default now();

alter table if exists public.case_templates add column if not exists workspace_id uuid;
alter table if exists public.case_templates add column if not exists name text not null default '';
alter table if exists public.case_templates add column if not exists description text;
alter table if exists public.case_templates add column if not exists items jsonb not null default '[]'::jsonb;
alter table if exists public.case_templates add column if not exists is_active boolean not null default true;
alter table if exists public.case_templates add column if not exists created_at timestamptz not null default now();
alter table if exists public.case_templates add column if not exists updated_at timestamptz not null default now();

alter table if exists public.case_items add column if not exists workspace_id uuid;
alter table if exists public.case_items add column if not exists case_id uuid;
alter table if exists public.case_items add column if not exists title text not null default '';
alter table if exists public.case_items add column if not exists status text not null default 'open';
alter table if exists public.case_items add column if not exists type text not null default 'task';
alter table if exists public.case_items add column if not exists sort_order integer not null default 0;
alter table if exists public.case_items add column if not exists payload jsonb not null default '{}'::jsonb;
alter table if exists public.case_items add column if not exists created_at timestamptz not null default now();
alter table if exists public.case_items add column if not exists updated_at timestamptz not null default now();

alter table if exists public.client_portal_tokens add column if not exists workspace_id uuid;
alter table if exists public.client_portal_tokens add column if not exists case_id uuid;
alter table if exists public.client_portal_tokens add column if not exists token_hash text;
alter table if exists public.client_portal_tokens add column if not exists token text;
alter table if exists public.client_portal_tokens add column if not exists expires_at timestamptz;
alter table if exists public.client_portal_tokens add column if not exists revoked_at timestamptz;
alter table if exists public.client_portal_tokens add column if not exists created_at timestamptz not null default now();
alter table if exists public.client_portal_tokens add column if not exists updated_at timestamptz not null default now();

alter table if exists public.billing_events add column if not exists workspace_id uuid;
alter table if exists public.billing_events add column if not exists provider text not null default 'manual';
alter table if exists public.billing_events add column if not exists event_type text not null default '';
alter table if exists public.billing_events add column if not exists event_id text;
alter table if exists public.billing_events add column if not exists payload jsonb not null default '{}'::jsonb;
alter table if exists public.billing_events add column if not exists processed_at timestamptz;
alter table if exists public.billing_events add column if not exists created_at timestamptz not null default now();

-- ---------------------------------------------------------------------------
-- Indexes used by API filters
-- ---------------------------------------------------------------------------

create index if not exists closeflow_clients_workspace_id_idx on public.clients(workspace_id);
create index if not exists closeflow_clients_email_idx on public.clients(email);
create index if not exists closeflow_clients_phone_idx on public.clients(phone);

create index if not exists closeflow_leads_workspace_id_idx on public.leads(workspace_id);
create index if not exists closeflow_leads_client_id_idx on public.leads(client_id);
create index if not exists closeflow_leads_linked_case_id_idx on public.leads(linked_case_id);
create index if not exists closeflow_leads_next_action_at_idx on public.leads(next_action_at);
create index if not exists closeflow_leads_updated_at_idx on public.leads(updated_at);

create index if not exists closeflow_cases_workspace_id_idx on public.cases(workspace_id);
create index if not exists closeflow_cases_client_id_idx on public.cases(client_id);
create index if not exists closeflow_cases_lead_id_idx on public.cases(lead_id);

create index if not exists closeflow_work_items_workspace_id_idx on public.work_items(workspace_id);
create index if not exists closeflow_work_items_record_type_idx on public.work_items(record_type);
create index if not exists closeflow_work_items_lead_id_idx on public.work_items(lead_id);
create index if not exists closeflow_work_items_case_id_idx on public.work_items(case_id);
create index if not exists closeflow_work_items_start_at_idx on public.work_items(start_at);
create index if not exists closeflow_work_items_scheduled_at_idx on public.work_items(scheduled_at);

create index if not exists closeflow_activities_workspace_id_idx on public.activities(workspace_id);
create index if not exists closeflow_ai_drafts_workspace_id_idx on public.ai_drafts(workspace_id);
create index if not exists closeflow_response_templates_workspace_id_idx on public.response_templates(workspace_id);
create index if not exists closeflow_case_templates_workspace_id_idx on public.case_templates(workspace_id);
create index if not exists closeflow_case_items_workspace_id_idx on public.case_items(workspace_id);
create index if not exists closeflow_client_portal_tokens_workspace_id_idx on public.client_portal_tokens(workspace_id);
create index if not exists closeflow_billing_events_workspace_id_idx on public.billing_events(workspace_id);

-- ---------------------------------------------------------------------------
-- RLS confirmation
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.profiles force row level security;
alter table public.workspaces force row level security;
alter table public.workspace_members force row level security;

drop policy if exists profiles_select_self_or_workspace on public.profiles;
create policy profiles_select_self_or_workspace on public.profiles
for select using (
  auth.uid() is not null and (
    auth_user_id::text = auth.uid()::text
    or id::text = auth.uid()::text
    or firebase_uid::text = auth.uid()::text
    or auth_uid::text = auth.uid()::text
    or external_auth_uid::text = auth.uid()::text
    or public.closeflow_is_workspace_member(workspace_id::text)
  )
);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
for update using (
  auth.uid() is not null and (
    auth_user_id::text = auth.uid()::text
    or id::text = auth.uid()::text
    or firebase_uid::text = auth.uid()::text
    or auth_uid::text = auth.uid()::text
    or external_auth_uid::text = auth.uid()::text
    or public.closeflow_is_admin()
  )
) with check (
  auth.uid() is not null and (
    auth_user_id::text = auth.uid()::text
    or id::text = auth.uid()::text
    or firebase_uid::text = auth.uid()::text
    or auth_uid::text = auth.uid()::text
    or external_auth_uid::text = auth.uid()::text
    or public.closeflow_is_admin()
  )
);

drop policy if exists workspaces_select_member on public.workspaces;
create policy workspaces_select_member on public.workspaces
for select using (public.closeflow_is_workspace_member(id::text));

drop policy if exists workspaces_update_owner_admin on public.workspaces;
create policy workspaces_update_owner_admin on public.workspaces
for update using (
  auth.uid() is not null and (
    owner_user_id::text = auth.uid()::text
    or owner_id::text = auth.uid()::text
    or created_by_user_id::text = auth.uid()::text
    or public.closeflow_is_admin()
  )
) with check (
  auth.uid() is not null and (
    owner_user_id::text = auth.uid()::text
    or owner_id::text = auth.uid()::text
    or created_by_user_id::text = auth.uid()::text
    or public.closeflow_is_admin()
  )
);

drop policy if exists workspace_members_select_member on public.workspace_members;
create policy workspace_members_select_member on public.workspace_members
for select using (public.closeflow_is_workspace_member(workspace_id::text));

drop policy if exists workspace_members_manage_owner_admin on public.workspace_members;
create policy workspace_members_manage_owner_admin on public.workspace_members
for all using (
  public.closeflow_is_admin()
  or exists (
    select 1
    from public.workspaces w
    where w.id = workspace_members.workspace_id
      and (
        w.owner_user_id::text = auth.uid()::text
        or w.owner_id::text = auth.uid()::text
        or w.created_by_user_id::text = auth.uid()::text
      )
  )
) with check (
  public.closeflow_is_admin()
  or exists (
    select 1
    from public.workspaces w
    where w.id = workspace_members.workspace_id
      and (
        w.owner_user_id::text = auth.uid()::text
        or w.owner_id::text = auth.uid()::text
        or w.created_by_user_id::text = auth.uid()::text
      )
  )
);

do $$
declare
  v_table text;
  policy_name text;
  scoped_tables text[] := array[
    'leads',
    'clients',
    'cases',
    'work_items',
    'activities',
    'ai_drafts',
    'response_templates',
    'case_templates',
    'case_items',
    'client_portal_tokens',
    'billing_events'
  ];
begin
  foreach v_table in array scoped_tables loop
    if to_regclass('public.' || v_table) is not null
       and exists (
         select 1
         from information_schema.columns
         where table_schema = 'public'
           and table_name = v_table
           and column_name = 'workspace_id'
       ) then
      execute format('alter table public.%I enable row level security', v_table);
      execute format('alter table public.%I force row level security', v_table);

      policy_name := 'closeflow_' || v_table || '_workspace_member_select';
      execute format('drop policy if exists %I on public.%I', policy_name, v_table);
      execute format(
        'create policy %I on public.%I for select using (public.closeflow_is_workspace_member(workspace_id::text))',
        policy_name,
        v_table
      );

      policy_name := 'closeflow_' || v_table || '_workspace_member_insert';
      execute format('drop policy if exists %I on public.%I', policy_name, v_table);
      execute format(
        'create policy %I on public.%I for insert with check (public.closeflow_is_workspace_member(workspace_id::text))',
        policy_name,
        v_table
      );

      policy_name := 'closeflow_' || v_table || '_workspace_member_update';
      execute format('drop policy if exists %I on public.%I', policy_name, v_table);
      execute format(
        'create policy %I on public.%I for update using (public.closeflow_is_workspace_member(workspace_id::text)) with check (public.closeflow_is_workspace_member(workspace_id::text))',
        policy_name,
        v_table
      );

      policy_name := 'closeflow_' || v_table || '_workspace_member_delete';
      execute format('drop policy if exists %I on public.%I', policy_name, v_table);
      execute format(
        'create policy %I on public.%I for delete using (public.closeflow_is_workspace_member(workspace_id::text))',
        policy_name,
        v_table
      );
    end if;
  end loop;
end $$;

commit;
