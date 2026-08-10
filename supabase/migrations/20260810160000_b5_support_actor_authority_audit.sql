create extension if not exists pgcrypto;

create table if not exists public.support_audit_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  support_request_id uuid null references public.support_requests(id) on delete restrict,
  actor_id text not null,
  actor_email text null,
  actor_role text not null check (actor_role in ('admin', 'user')),
  action text not null check (action in ('create', 'reply', 'status', 'forward')),
  from_status text null,
  to_status text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists support_audit_events_workspace_created_idx
  on public.support_audit_events(workspace_id, created_at desc);
create index if not exists support_audit_events_request_created_idx
  on public.support_audit_events(support_request_id, created_at desc);

alter table public.support_requests enable row level security;
revoke all on table public.support_requests from public, anon, authenticated;
grant all on table public.support_requests to service_role;

alter table public.support_audit_events enable row level security;
revoke all on table public.support_audit_events from public, anon, authenticated;
revoke all on table public.support_audit_events from service_role;
grant insert on table public.support_audit_events to service_role;

create or replace function public.closeflow_support_audit_immutable()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  raise exception 'SUPPORT_AUDIT_IMMUTABLE';
end;
$$;

drop trigger if exists support_audit_events_immutable_trigger on public.support_audit_events;
create trigger support_audit_events_immutable_trigger
before update or delete on public.support_audit_events
for each row execute function public.closeflow_support_audit_immutable();

create or replace function public.closeflow_support_record_audit(
  p_workspace_id uuid,
  p_support_request_id uuid,
  p_actor_id text,
  p_actor_email text,
  p_actor_role text,
  p_action text,
  p_from_status text,
  p_to_status text,
  p_metadata jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_workspace_id is null or nullif(trim(p_actor_id), '') is null then
    raise exception 'SUPPORT_AUDIT_ACTOR_REQUIRED';
  end if;
  if p_actor_role not in ('admin', 'user') then
    raise exception 'SUPPORT_AUDIT_ACTOR_ROLE_INVALID';
  end if;
  if p_action not in ('create', 'reply', 'status', 'forward') then
    raise exception 'SUPPORT_AUDIT_ACTION_INVALID';
  end if;

  insert into public.support_audit_events (
    workspace_id,
    support_request_id,
    actor_id,
    actor_email,
    actor_role,
    action,
    from_status,
    to_status,
    metadata
  ) values (
    p_workspace_id,
    p_support_request_id,
    trim(p_actor_id),
    nullif(lower(trim(coalesce(p_actor_email, ''))), ''),
    p_actor_role,
    p_action,
    p_from_status,
    p_to_status,
    coalesce(p_metadata, '{}'::jsonb)
  );
end;
$$;

create or replace function public.closeflow_support_create_request(
  p_workspace_id uuid,
  p_owner_id text,
  p_owner_email text,
  p_kind text,
  p_subject text,
  p_message text,
  p_actor_id text,
  p_actor_email text,
  p_actor_role text,
  p_metadata jsonb default '{}'::jsonb
)
returns setof public.support_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  created_request public.support_requests;
begin
  if p_workspace_id is null or p_owner_id is null or p_actor_role not in ('admin', 'user') or p_actor_id is null or p_actor_id <> p_owner_id then
    raise exception 'SUPPORT_CREATE_ACTOR_INVALID';
  end if;

  insert into public.support_requests (
    workspace_id, owner_id, owner_email, kind, subject, message, status,
    source, admin_reply, replies, created_at, updated_at, closed_at
  ) values (
    p_workspace_id, p_owner_id, nullif(lower(trim(coalesce(p_owner_email, ''))), ''),
    p_kind, p_subject, p_message, 'new', 'app', null, '[]'::jsonb, now(), now(), null
  ) returning * into created_request;

  perform public.closeflow_support_record_audit(
    p_workspace_id, created_request.id, p_actor_id, p_actor_email, p_actor_role,
    'create', null, 'new', p_metadata
  );

  return next created_request;
end;
$$;

create or replace function public.closeflow_support_reply_request(
  p_support_request_id uuid,
  p_workspace_id uuid,
  p_actor_id text,
  p_actor_email text,
  p_actor_role text,
  p_message text,
  p_metadata jsonb default '{}'::jsonb
)
returns setof public.support_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  current_request public.support_requests;
  updated_request public.support_requests;
  next_status text;
  reply_entry jsonb;
begin
  if p_actor_role not in ('admin', 'user') or nullif(trim(p_actor_id), '') is null then
    raise exception 'SUPPORT_REPLY_ACTOR_INVALID';
  end if;

  select * into current_request
  from public.support_requests
  where id = p_support_request_id and workspace_id = p_workspace_id
  for update;

  if not found then raise exception 'SUPPORT_REQUEST_NOT_FOUND'; end if;
  if current_request.status = 'closed' then raise exception 'SUPPORT_REQUEST_CLOSED'; end if;

  next_status := case when p_actor_role = 'admin' then 'answered' else 'in_progress' end;
  reply_entry := jsonb_build_object(
    'id', gen_random_uuid(),
    'authorType', p_actor_role,
    'authorLabel', case when p_actor_role = 'admin' then 'Support' else 'Użytkownik' end,
    'message', p_message,
    'createdAt', now()
  );

  update public.support_requests
  set replies = coalesce(current_request.replies, '[]'::jsonb) || jsonb_build_array(reply_entry),
      status = next_status,
      admin_reply = case when p_actor_role = 'admin' then p_message else current_request.admin_reply end,
      updated_at = now(),
      closed_at = null
  where id = p_support_request_id and workspace_id = p_workspace_id
  returning * into updated_request;

  perform public.closeflow_support_record_audit(
    p_workspace_id, updated_request.id, p_actor_id, p_actor_email, p_actor_role,
    'reply', current_request.status, next_status, p_metadata
  );

  return next updated_request;
end;
$$;

create or replace function public.closeflow_support_set_status(
  p_support_request_id uuid,
  p_workspace_id uuid,
  p_actor_id text,
  p_actor_email text,
  p_actor_role text,
  p_to_status text,
  p_metadata jsonb default '{}'::jsonb
)
returns setof public.support_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  current_request public.support_requests;
  updated_request public.support_requests;
begin
  if p_actor_role <> 'admin' or nullif(trim(p_actor_id), '') is null then
    raise exception 'SUPPORT_STATUS_ADMIN_REQUIRED';
  end if;
  if p_to_status not in ('new', 'in_progress', 'answered', 'closed') then
    raise exception 'SUPPORT_STATUS_INVALID';
  end if;

  select * into current_request
  from public.support_requests
  where id = p_support_request_id and workspace_id = p_workspace_id
  for update;

  if not found then raise exception 'SUPPORT_REQUEST_NOT_FOUND'; end if;

  update public.support_requests
  set status = p_to_status,
      updated_at = now(),
      closed_at = case when p_to_status = 'closed' then now() else null end
  where id = p_support_request_id and workspace_id = p_workspace_id
  returning * into updated_request;

  perform public.closeflow_support_record_audit(
    p_workspace_id, updated_request.id, p_actor_id, p_actor_email, p_actor_role,
    'status', current_request.status, p_to_status, p_metadata
  );

  return next updated_request;
end;
$$;

revoke all on function public.closeflow_support_record_audit(uuid, uuid, text, text, text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.closeflow_support_create_request(uuid, text, text, text, text, text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.closeflow_support_reply_request(uuid, uuid, text, text, text, text, jsonb) from public, anon, authenticated;
revoke all on function public.closeflow_support_set_status(uuid, uuid, text, text, text, text, jsonb) from public, anon, authenticated;
grant execute on function public.closeflow_support_record_audit(uuid, uuid, text, text, text, text, text, text, jsonb) to service_role;
grant execute on function public.closeflow_support_create_request(uuid, text, text, text, text, text, text, text, text, jsonb) to service_role;
grant execute on function public.closeflow_support_reply_request(uuid, uuid, text, text, text, text, jsonb) to service_role;
grant execute on function public.closeflow_support_set_status(uuid, uuid, text, text, text, text, jsonb) to service_role;
