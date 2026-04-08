-- ETAP 15: security hardening for portal/storage/audit

create extension if not exists pgcrypto;

alter table if exists public.client_portal_tokens
  add column if not exists failed_attempts integer not null default 0,
  add column if not exists last_failed_at timestamptz,
  add column if not exists locked_until timestamptz,
  add column if not exists last_opened_at timestamptz,
  add column if not exists revoked_reason text not null default '';

create index if not exists idx_client_portal_tokens_workspace_case
  on public.client_portal_tokens (workspace_id, case_id, created_at desc);
create index if not exists idx_client_portal_tokens_locked_until
  on public.client_portal_tokens (locked_until);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  case_id uuid references public.cases(id) on delete set null,
  case_item_id uuid references public.case_items(id) on delete set null,
  event_type text not null,
  event_title text not null,
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_log_workspace_created
  on public.audit_log (workspace_id, created_at desc);
create index if not exists idx_audit_log_event_type
  on public.audit_log (event_type);

alter table public.audit_log enable row level security;

drop policy if exists "audit_log_member_all" on public.audit_log;
create policy "audit_log_member_all"
  on public.audit_log
  for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create table if not exists public.portal_rate_limits (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  portal_token_id uuid references public.client_portal_tokens(id) on delete cascade,
  action_key text not null,
  bucket_key text not null,
  attempts_count integer not null default 0,
  window_started_at timestamptz not null default now(),
  blocked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_portal_rate_limits_workspace_bucket
  on public.portal_rate_limits (workspace_id, action_key, bucket_key);
create index if not exists idx_portal_rate_limits_blocked_until
  on public.portal_rate_limits (blocked_until);

alter table public.portal_rate_limits enable row level security;

drop policy if exists "portal_rate_limits_member_all" on public.portal_rate_limits;
create policy "portal_rate_limits_member_all"
  on public.portal_rate_limits
  for all
  using (public.is_workspace_member(workspace_id))
  with check (public.is_workspace_member(workspace_id));

create or replace function public.workspace_id_from_storage_object_path(object_name text)
returns uuid
language plpgsql
immutable
as $$
declare
  prefix text;
  workspace_id_text text;
begin
  prefix := split_part(object_name, '/', 1);
  workspace_id_text := split_part(object_name, '/', 2);

  if prefix <> 'workspace' then
    return null;
  end if;

  begin
    return workspace_id_text::uuid;
  exception
    when others then
      return null;
  end;
end;
$$;

insert into storage.buckets (id, name, public)
values ('case-files', 'case-files', false)
on conflict (id) do update
set public = false;

drop policy if exists "case_files_select_member" on storage.objects;
create policy "case_files_select_member"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'case-files'
    and public.is_workspace_member(public.workspace_id_from_storage_object_path(name))
  );

drop policy if exists "case_files_insert_member" on storage.objects;
create policy "case_files_insert_member"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'case-files'
    and public.is_workspace_member(public.workspace_id_from_storage_object_path(name))
  );

drop policy if exists "case_files_update_member" on storage.objects;
create policy "case_files_update_member"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'case-files'
    and public.is_workspace_member(public.workspace_id_from_storage_object_path(name))
  )
  with check (
    bucket_id = 'case-files'
    and public.is_workspace_member(public.workspace_id_from_storage_object_path(name))
  );

drop policy if exists "case_files_delete_member" on storage.objects;
create policy "case_files_delete_member"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'case-files'
    and public.is_workspace_member(public.workspace_id_from_storage_object_path(name))
  );
