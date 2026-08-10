create extension if not exists pgcrypto;

create table if not exists public.portal_upload_usage (
  workspace_id uuid not null,
  usage_date date not null,
  bytes_reserved bigint not null default 0,
  upload_count integer not null default 0,
  rate_window_started_at timestamptz not null default now(),
  rate_window_count integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (workspace_id, usage_date),
  check (bytes_reserved >= 0),
  check (upload_count >= 0),
  check (rate_window_count >= 0)
);

create table if not exists public.portal_upload_admissions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  case_id uuid not null,
  case_item_id uuid not null,
  idempotency_key text not null,
  content_hash text not null,
  mime_type text not null,
  file_name text not null,
  object_path text not null,
  bytes bigint not null,
  status text not null default 'pending' check (status in ('pending', 'uploaded', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (bytes > 0)
);

create unique index if not exists portal_upload_admissions_workspace_key_uidx
  on public.portal_upload_admissions(workspace_id, idempotency_key);
create index if not exists portal_upload_admissions_workspace_created_idx
  on public.portal_upload_admissions(workspace_id, created_at desc);
create index if not exists portal_upload_admissions_parent_idx
  on public.portal_upload_admissions(workspace_id, case_id, case_item_id);

alter table public.portal_upload_usage enable row level security;
alter table public.portal_upload_admissions enable row level security;
revoke all on table public.portal_upload_usage, public.portal_upload_admissions from public, anon, authenticated;
grant all on table public.portal_upload_usage, public.portal_upload_admissions to service_role;

create or replace function public.closeflow_portal_upload_admit(
  p_workspace_id uuid,
  p_case_id uuid,
  p_case_item_id uuid,
  p_bytes bigint,
  p_mime_type text,
  p_file_name text,
  p_content_hash text,
  p_idempotency_key text,
  p_object_path text,
  p_daily_quota_bytes bigint,
  p_window_upload_count integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_admission public.portal_upload_admissions;
  usage_row public.portal_upload_usage;
  new_admission public.portal_upload_admissions;
begin
  if p_workspace_id is null or p_case_id is null or p_case_item_id is null
    or p_bytes is null or p_bytes <= 0 or p_daily_quota_bytes is null or p_daily_quota_bytes <= 0
    or p_window_upload_count is null or p_window_upload_count <= 0
    or nullif(trim(p_idempotency_key), '') is null then
    raise exception 'PORTAL_UPLOAD_ADMISSION_INPUT_INVALID';
  end if;

  if not exists (
    select 1 from public.cases
    where id = p_case_id and workspace_id = p_workspace_id
  ) then
    raise exception 'PORTAL_PARENT_SCOPE_REQUIRED';
  end if;

  if not exists (
    select 1 from public.case_items
    where id = p_case_item_id and case_id = p_case_id
  ) then
    raise exception 'CASE_ITEM_NOT_FOUND';
  end if;

  select * into existing_admission
  from public.portal_upload_admissions
  where workspace_id = p_workspace_id and idempotency_key = p_idempotency_key
  limit 1
  for update;
  if found then
    if existing_admission.case_id <> p_case_id
      or existing_admission.case_item_id <> p_case_item_id
      or existing_admission.content_hash <> p_content_hash then
      raise exception 'PORTAL_UPLOAD_IDEMPOTENCY_CONFLICT';
    end if;
    return to_jsonb(existing_admission) || jsonb_build_object('is_existing', true);
  end if;

  insert into public.portal_upload_usage (workspace_id, usage_date)
  values (p_workspace_id, current_date)
  on conflict (workspace_id, usage_date) do nothing;

  select * into usage_row
  from public.portal_upload_usage
  where workspace_id = p_workspace_id and usage_date = current_date
  for update;

  if usage_row.rate_window_started_at < now() - interval '1 hour' then
    usage_row.rate_window_started_at := now();
    usage_row.rate_window_count := 0;
  end if;

  if usage_row.bytes_reserved + p_bytes > p_daily_quota_bytes then
    raise exception 'PORTAL_UPLOAD_QUOTA_EXCEEDED';
  end if;
  if usage_row.rate_window_count >= p_window_upload_count then
    raise exception 'PORTAL_UPLOAD_RATE_LIMIT';
  end if;

  update public.portal_upload_usage
  set bytes_reserved = usage_row.bytes_reserved + p_bytes,
      upload_count = usage_row.upload_count + 1,
      rate_window_started_at = usage_row.rate_window_started_at,
      rate_window_count = usage_row.rate_window_count + 1,
      updated_at = now()
  where workspace_id = p_workspace_id and usage_date = current_date;

  insert into public.portal_upload_admissions (
    workspace_id, case_id, case_item_id, idempotency_key, content_hash,
    mime_type, file_name, object_path, bytes, status, created_at, updated_at
  ) values (
    p_workspace_id, p_case_id, p_case_item_id, trim(p_idempotency_key),
    p_content_hash, p_mime_type, p_file_name, p_object_path, p_bytes,
    'pending', now(), now()
  ) returning * into new_admission;

  return to_jsonb(new_admission) || jsonb_build_object('is_existing', false);
end;
$$;

create or replace function public.closeflow_portal_upload_finalize(
  p_admission_id uuid,
  p_workspace_id uuid,
  p_status text,
  p_object_path text
)
returns setof public.portal_upload_admissions
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_admission public.portal_upload_admissions;
begin
  if p_status not in ('uploaded', 'failed') then
    raise exception 'PORTAL_UPLOAD_FINALIZE_STATUS_INVALID';
  end if;

  update public.portal_upload_admissions
  set status = p_status,
      object_path = coalesce(nullif(trim(p_object_path), ''), object_path),
      updated_at = now()
  where id = p_admission_id
    and workspace_id = p_workspace_id
    and status = 'pending'
  returning * into updated_admission;

  if not found then raise exception 'PORTAL_UPLOAD_ADMISSION_NOT_FOUND'; end if;
  return next updated_admission;
end;
$$;

revoke all on function public.closeflow_portal_upload_admit(uuid, uuid, uuid, bigint, text, text, text, text, text, bigint, integer) from public, anon, authenticated;
revoke all on function public.closeflow_portal_upload_finalize(uuid, uuid, text, text) from public, anon, authenticated;
grant execute on function public.closeflow_portal_upload_admit(uuid, uuid, uuid, bigint, text, text, text, text, text, bigint, integer) to service_role;
grant execute on function public.closeflow_portal_upload_finalize(uuid, uuid, text, text) to service_role;
