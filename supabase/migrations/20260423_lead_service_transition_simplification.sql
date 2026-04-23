alter table if exists public.leads
  add column if not exists moved_to_service_at timestamptz null,
  add column if not exists lead_visibility text not null default 'active',
  add column if not exists sales_outcome text not null default 'open';

alter table if exists public.cases
  add column if not exists created_from_lead boolean not null default false,
  add column if not exists service_started_at timestamptz null;

create index if not exists leads_workspace_status_visibility_idx
  on public.leads (workspace_id, status, lead_visibility);

create index if not exists cases_workspace_created_from_lead_idx
  on public.cases (workspace_id, created_from_lead);
