-- A24 - Lead -> client -> case transactional handoff
-- This migration adds a Supabase RPC used by /api/leads action=start_service.
-- The function keeps lead as source history and makes case the operational workspace.

begin;

create extension if not exists pgcrypto;

alter table if exists public.leads add column if not exists linked_case_id uuid;
alter table if exists public.leads add column if not exists client_id uuid;
alter table if exists public.leads add column if not exists moved_to_service_at timestamptz;
alter table if exists public.leads add column if not exists case_started_at timestamptz;
alter table if exists public.leads add column if not exists lead_visibility text not null default 'active';
alter table if exists public.leads add column if not exists sales_outcome text not null default 'open';
alter table if exists public.leads add column if not exists closed_at timestamptz;
alter table if exists public.leads add column if not exists next_action_title text;
alter table if exists public.leads add column if not exists next_action_at timestamptz;
alter table if exists public.leads add column if not exists next_action_item_id uuid;
alter table if exists public.leads add column if not exists updated_at timestamptz not null default now();

alter table if exists public.clients add column if not exists id uuid default gen_random_uuid();
alter table if exists public.clients add column if not exists workspace_id uuid;
alter table if exists public.clients add column if not exists name text;
alter table if exists public.clients add column if not exists company text;
alter table if exists public.clients add column if not exists email text;
alter table if exists public.clients add column if not exists phone text;
alter table if exists public.clients add column if not exists source_primary text;
alter table if exists public.clients add column if not exists created_at timestamptz not null default now();
alter table if exists public.clients add column if not exists updated_at timestamptz not null default now();
alter table if exists public.clients add column if not exists last_activity_at timestamptz;

alter table if exists public.cases add column if not exists id uuid default gen_random_uuid();
alter table if exists public.cases add column if not exists workspace_id uuid;
alter table if exists public.cases add column if not exists lead_id uuid;
alter table if exists public.cases add column if not exists client_id uuid;
alter table if exists public.cases add column if not exists title text;
alter table if exists public.cases add column if not exists client_name text;
alter table if exists public.cases add column if not exists client_email text;
alter table if exists public.cases add column if not exists client_phone text;
alter table if exists public.cases add column if not exists status text not null default 'in_progress';
alter table if exists public.cases add column if not exists completeness_percent integer not null default 0;
alter table if exists public.cases add column if not exists portal_ready boolean not null default false;
alter table if exists public.cases add column if not exists created_from_lead boolean not null default false;
alter table if exists public.cases add column if not exists service_started_at timestamptz;
alter table if exists public.cases add column if not exists started_at timestamptz;
alter table if exists public.cases add column if not exists completed_at timestamptz;
alter table if exists public.cases add column if not exists last_activity_at timestamptz;
alter table if exists public.cases add column if not exists created_at timestamptz not null default now();
alter table if exists public.cases add column if not exists updated_at timestamptz not null default now();

alter table if exists public.activities add column if not exists workspace_id uuid;
alter table if exists public.activities add column if not exists lead_id uuid;
alter table if exists public.activities add column if not exists case_id uuid;
alter table if exists public.activities add column if not exists owner_id uuid;
alter table if exists public.activities add column if not exists actor_id uuid;
alter table if exists public.activities add column if not exists actor_type text;
alter table if exists public.activities add column if not exists event_type text;
alter table if exists public.activities add column if not exists payload jsonb;
alter table if exists public.activities add column if not exists created_at timestamptz not null default now();
alter table if exists public.activities add column if not exists updated_at timestamptz not null default now();

create index if not exists leads_workspace_active_idx on public.leads(workspace_id, lead_visibility, status);
create index if not exists leads_linked_case_id_idx on public.leads(linked_case_id);
create index if not exists cases_workspace_lead_id_idx on public.cases(workspace_id, lead_id);
create index if not exists cases_workspace_client_id_idx on public.cases(workspace_id, client_id);
create index if not exists clients_workspace_email_idx on public.clients(workspace_id, lower(email)) where email is not null;
create index if not exists clients_workspace_phone_idx on public.clients(workspace_id, phone) where phone is not null;

create or replace function public.closeflow_start_lead_service(
  p_workspace_id uuid,
  p_lead_id uuid,
  p_title text default null,
  p_case_status text default 'in_progress',
  p_client_name text default null,
  p_client_email text default null,
  p_client_phone text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_lead record;
  v_client record;
  v_case record;
  v_existing_case record;
  v_client_id uuid;
  v_case_status text := coalesce(nullif(trim(p_case_status), ''), 'in_progress');
  v_case_title text;
  v_client_name text;
  v_client_email text;
  v_client_phone text;
begin
  if p_workspace_id is null then
    raise exception 'WORKSPACE_ID_REQUIRED';
  end if;

  if p_lead_id is null then
    raise exception 'LEAD_ID_REQUIRED';
  end if;

  select *
  into v_lead
  from public.leads
  where id = p_lead_id
    and workspace_id = p_workspace_id
  for update;

  if not found then
    raise exception 'LEAD_NOT_FOUND';
  end if;

  if coalesce(v_lead.linked_case_id::text, '') <> '' then
    raise exception 'LEAD_ALREADY_HAS_CASE';
  end if;

  select *
  into v_existing_case
  from public.cases
  where workspace_id = p_workspace_id
    and lead_id = p_lead_id
  limit 1;

  if found then
    raise exception 'LEAD_ALREADY_HAS_CASE';
  end if;

  v_client_name := coalesce(nullif(trim(p_client_name), ''), nullif(trim(coalesce(v_lead.name::text, '')), ''), nullif(trim(coalesce(v_lead.company::text, '')), ''), 'Klient');
  v_client_email := lower(coalesce(nullif(trim(p_client_email), ''), nullif(trim(coalesce(v_lead.email::text, '')), '')));
  v_client_phone := coalesce(nullif(trim(p_client_phone), ''), nullif(trim(coalesce(v_lead.phone::text, '')), ''));

  if v_lead.client_id is not null then
    select *
    into v_client
    from public.clients
    where id = v_lead.client_id
      and workspace_id = p_workspace_id
    limit 1;
  end if;

  if v_client.id is null and v_client_email is not null and v_client_email <> '' then
    select *
    into v_client
    from public.clients
    where workspace_id = p_workspace_id
      and lower(email) = v_client_email
    limit 1;
  end if;

  if v_client.id is null and v_client_phone is not null and v_client_phone <> '' then
    select *
    into v_client
    from public.clients
    where workspace_id = p_workspace_id
      and phone = v_client_phone
    limit 1;
  end if;

  if v_client.id is null then
    insert into public.clients (
      workspace_id,
      name,
      company,
      email,
      phone,
      source_primary,
      created_at,
      updated_at,
      last_activity_at
    ) values (
      p_workspace_id,
      v_client_name,
      nullif(trim(coalesce(v_lead.company::text, '')), ''),
      nullif(v_client_email, ''),
      nullif(v_client_phone, ''),
      coalesce(nullif(trim(coalesce(v_lead.source::text, '')), ''), 'other'),
      v_now,
      v_now,
      v_now
    )
    returning * into v_client;
  end if;

  v_client_id := v_client.id;
  v_case_title := coalesce(nullif(trim(p_title), ''), nullif(trim(coalesce(v_lead.name::text, '')), ''), v_client_name || ' - obsługa');

  insert into public.cases (
    workspace_id,
    lead_id,
    client_id,
    title,
    client_name,
    client_email,
    client_phone,
    status,
    completeness_percent,
    portal_ready,
    created_from_lead,
    service_started_at,
    started_at,
    last_activity_at,
    created_at,
    updated_at
  ) values (
    p_workspace_id,
    p_lead_id,
    v_client_id,
    v_case_title,
    coalesce(nullif(trim(coalesce(v_client.name::text, '')), ''), v_client_name),
    coalesce(nullif(trim(coalesce(v_client.email::text, '')), ''), v_client_email),
    coalesce(nullif(trim(coalesce(v_client.phone::text, '')), ''), v_client_phone),
    v_case_status,
    0,
    false,
    true,
    v_now,
    case when v_case_status = 'in_progress' then v_now else null end,
    v_now,
    v_now,
    v_now
  )
  returning * into v_case;

  update public.leads
  set
    linked_case_id = v_case.id,
    client_id = v_client_id,
    status = 'moved_to_service',
    moved_to_service_at = v_now,
    case_started_at = v_now,
    lead_visibility = 'archived',
    sales_outcome = 'moved_to_service',
    closed_at = v_now,
    next_action_title = '',
    next_action_at = null,
    next_action_item_id = null,
    updated_at = v_now
  where id = p_lead_id
    and workspace_id = p_workspace_id
  returning * into v_lead;

  insert into public.activities (
    workspace_id,
    lead_id,
    case_id,
    owner_id,
    actor_id,
    actor_type,
    event_type,
    payload,
    created_at,
    updated_at
  ) values
  (
    p_workspace_id,
    p_lead_id,
    v_case.id,
    null,
    null,
    'operator',
    'case_created',
    jsonb_build_object('caseId', v_case.id, 'caseTitle', v_case_title, 'leadId', p_lead_id, 'clientId', v_client_id),
    v_now,
    v_now
  ),
  (
    p_workspace_id,
    p_lead_id,
    v_case.id,
    null,
    null,
    'operator',
    'lead_moved_to_service',
    jsonb_build_object('caseId', v_case.id, 'caseTitle', v_case_title, 'movedToServiceAt', v_now),
    v_now,
    v_now
  );

  return jsonb_build_object(
    'caseId', v_case.id,
    'clientId', v_client_id,
    'movedToServiceAt', v_now,
    'lead', jsonb_build_object(
      'id', v_lead.id,
      'status', v_lead.status,
      'linkedCaseId', v_lead.linked_case_id,
      'clientId', v_lead.client_id,
      'leadVisibility', v_lead.lead_visibility,
      'salesOutcome', v_lead.sales_outcome,
      'movedToServiceAt', v_lead.moved_to_service_at,
      'caseStartedAt', v_lead.case_started_at,
      'closedAt', v_lead.closed_at
    ),
    'case', jsonb_build_object(
      'id', v_case.id,
      'title', v_case.title,
      'status', v_case.status,
      'leadId', v_case.lead_id,
      'clientId', v_case.client_id,
      'createdFromLead', v_case.created_from_lead,
      'serviceStartedAt', v_case.service_started_at
    ),
    'client', jsonb_build_object(
      'id', v_client.id,
      'name', v_client.name,
      'email', v_client.email,
      'phone', v_client.phone
    )
  );
end;
$$;

commit;
