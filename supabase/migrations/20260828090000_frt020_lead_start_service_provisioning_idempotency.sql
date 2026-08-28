-- FRT-020: durable claim boundary for the option-specific provisioner.
-- The transition RPC owns lead/client/case creation. This table owns the
-- follow-up checklist/portal/task side effects and prevents concurrent retries
-- from executing that same option set twice.

begin;

create table if not exists public.lead_start_service_provisioning_claims (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  lead_id uuid not null,
  case_id uuid not null,
  request_key text not null,
  status text not null default 'processing'
    check (status in ('processing', 'completed')),
  expires_at timestamptz not null default (now() + interval '10 minutes'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lead_start_service_claims_request_key_not_blank
    check (length(trim(request_key)) > 0)
);

create unique index if not exists lead_start_service_claims_scope_key_uidx
  on public.lead_start_service_provisioning_claims (workspace_id, case_id, request_key);

create index if not exists lead_start_service_claims_expiry_idx
  on public.lead_start_service_provisioning_claims (expires_at);

-- The selected owner is a property of the case itself. The activity receipt
-- and first-task assignment are supporting evidence, not the source of truth.
alter table if exists public.cases
  add column if not exists owner_id uuid;

create index if not exists closeflow_cases_owner_id_idx
  on public.cases (owner_id);

-- Canonical owner identity is auth.users.id. Older installs may expose the
-- same identity as auth_user_id; backfill only from that auth identity and
-- never from profiles.id, which is a legacy profile-row key.
alter table if exists public.profiles
  add column if not exists user_id uuid;

do $$
begin
  if to_regclass('public.profiles') is not null
    and exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'profiles' and column_name = 'user_id'
    )
    and exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'profiles' and column_name = 'auth_user_id'
    ) then
    update public.profiles
    set user_id = auth_user_id
    where user_id is null
      and auth_user_id is not null;
  end if;
end $$;

create unique index if not exists profiles_user_id_workspace_uidx
  on public.profiles (user_id, workspace_id)
  where user_id is not null;

-- P0 and core bootstrap migrations expose different subsets of work-item
-- columns. FRT-020 writes these fields for its durable first-task marker;
-- make the required contract explicit without changing existing column types.
alter table if exists public.work_items
  add column if not exists source_type text,
  add column if not exists owner_id uuid,
  add column if not exists assigned_to text,
  add column if not exists client_id uuid,
  add column if not exists lead_name text,
  add column if not exists case_title text;

-- The checklist item shape also differs between historical schema paths.
alter table if exists public.case_items
  add column if not exists description text,
  add column if not exists is_required boolean not null default false,
  add column if not exists sort_order integer not null default 0,
  add column if not exists payload jsonb not null default '{}'::jsonb;

alter table if exists public.work_items
  add column if not exists source_key text;

create unique index if not exists work_items_workspace_frt020_source_key_uidx
  on public.work_items (workspace_id, source_type, source_key)
  where source_type = 'frt020_lead_start_service' and source_key is not null;

alter table public.lead_start_service_provisioning_claims enable row level security;
alter table public.lead_start_service_provisioning_claims force row level security;
revoke all on table public.lead_start_service_provisioning_claims from public, anon, authenticated;
grant all on table public.lead_start_service_provisioning_claims to service_role;

comment on table public.lead_start_service_provisioning_claims is
  'Server-owned FRT-020 idempotency claims; request_key is a one-way digest, never a raw client token.';

commit;
