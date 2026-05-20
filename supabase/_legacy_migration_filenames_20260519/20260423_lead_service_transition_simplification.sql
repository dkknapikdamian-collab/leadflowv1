create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  name text not null,
  company text null,
  email text null,
  phone text null,
  notes text null,
  tags jsonb not null default '[]'::jsonb,
  source_primary text not null default 'other',
  archived_at timestamptz null,
  last_activity_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_workspace_id_idx on public.clients(workspace_id);
create index if not exists clients_email_idx on public.clients(email);
create index if not exists clients_phone_idx on public.clients(phone);
create index if not exists clients_name_idx on public.clients(name);

alter table if exists public.leads
  add column if not exists client_id uuid null,
  add column if not exists service_profile_id uuid null,
  add column if not exists accepted_at timestamptz null,
  add column if not exists case_eligible_at timestamptz null,
  add column if not exists case_started_at timestamptz null,
  add column if not exists billing_status text not null default 'not_started',
  add column if not exists billing_model_snapshot text not null default 'manual',
  add column if not exists start_rule_snapshot text not null default 'on_acceptance',
  add column if not exists win_rule_snapshot text not null default 'manual',
  add column if not exists linked_case_id uuid null,
  add column if not exists moved_to_service_at timestamptz null,
  add column if not exists lead_visibility text not null default 'active',
  add column if not exists sales_outcome text not null default 'open',
  add column if not exists closed_at timestamptz null;

create index if not exists leads_client_id_idx on public.leads(client_id);
create index if not exists leads_service_profile_id_idx on public.leads(service_profile_id);
create index if not exists leads_linked_case_id_idx on public.leads(linked_case_id);
create index if not exists leads_workspace_status_visibility_idx on public.leads(workspace_id, status, lead_visibility);
create index if not exists leads_case_started_at_idx on public.leads(case_started_at desc);
create index if not exists leads_moved_to_service_at_idx on public.leads(moved_to_service_at desc);

alter table if exists public.cases
  add column if not exists client_id uuid null,
  add column if not exists service_profile_id uuid null,
  add column if not exists billing_status text not null default 'not_started',
  add column if not exists billing_model_snapshot text not null default 'manual',
  add column if not exists started_at timestamptz null,
  add column if not exists completed_at timestamptz null,
  add column if not exists last_activity_at timestamptz null,
  add column if not exists created_from_lead boolean not null default false,
  add column if not exists service_started_at timestamptz null;

create index if not exists cases_client_id_idx on public.cases(client_id);
create index if not exists cases_service_profile_id_idx on public.cases(service_profile_id);
create index if not exists cases_lead_id_idx on public.cases(lead_id);
create index if not exists cases_workspace_created_from_lead_idx on public.cases(workspace_id, created_from_lead);
create index if not exists cases_service_started_at_idx on public.cases(service_started_at desc);
create index if not exists cases_status_idx on public.cases(status);

update public.leads
set status = 'moved_to_service'
where status = 'active_service';

update public.leads
set status = 'accepted'
where status = 'accepted_waiting_start';

update public.leads
set lead_visibility = 'archived'
where status in ('moved_to_service', 'won', 'lost', 'archived')
  and coalesce(lead_visibility, '') <> 'archived';

update public.leads
set moved_to_service_at = coalesce(moved_to_service_at, updated_at, created_at, now())
where status = 'moved_to_service'
  and moved_to_service_at is null;

update public.leads
set case_started_at = coalesce(case_started_at, moved_to_service_at, updated_at, created_at, now())
where status = 'moved_to_service'
  and case_started_at is null;

update public.leads
set sales_outcome = 'moved_to_service'
where status = 'moved_to_service'
  and coalesce(sales_outcome, '') in ('', 'open');

update public.cases
set created_from_lead = true
where lead_id is not null
  and created_from_lead = false;

update public.cases
set service_started_at = coalesce(service_started_at, started_at, updated_at, created_at, now())
where lead_id is not null
  and service_started_at is null;
