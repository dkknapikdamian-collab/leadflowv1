-- B4: server-authoritative AI usage/rate accounting.
-- The service-role RPC is the only writer. Browser localStorage remains UX-only.
create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id text not null,
  user_id text not null,
  operation text not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_usage_events_workspace_user_created_idx
  on public.ai_usage_events (workspace_id, user_id, created_at desc);

alter table public.ai_usage_events enable row level security;

create or replace function public.consume_ai_usage(
  p_workspace_id text,
  p_user_id text,
  p_operation text,
  p_daily_limit integer,
  p_monthly_limit integer,
  p_rate_limit integer default 8
)
returns table (
  allowed boolean,
  reason text,
  daily_used integer,
  monthly_used integer,
  minute_used integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_daily integer;
  v_monthly integer;
  v_minute integer;
begin
  if nullif(trim(p_workspace_id), '') is null
    or nullif(trim(p_user_id), '') is null
    or p_daily_limit is null
    or p_monthly_limit is null
    or p_daily_limit <= 0
    or p_monthly_limit <= 0 then
    return query select false, 'invalid_request', 0, 0, 0;
    return;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(trim(p_workspace_id) || ':' || trim(p_user_id), 0));

  select count(*)::integer into v_daily
    from public.ai_usage_events
   where workspace_id = trim(p_workspace_id)
     and user_id = trim(p_user_id)
     and created_at >= date_trunc('day', now());

  select count(*)::integer into v_monthly
    from public.ai_usage_events
   where workspace_id = trim(p_workspace_id)
     and user_id = trim(p_user_id)
     and created_at >= date_trunc('month', now());

  select count(*)::integer into v_minute
    from public.ai_usage_events
   where workspace_id = trim(p_workspace_id)
     and user_id = trim(p_user_id)
     and created_at >= now() - interval '1 minute';

  if v_minute >= greatest(coalesce(p_rate_limit, 8), 1) then
    return query select false, 'rate_limit', v_daily, v_monthly, v_minute;
    return;
  end if;

  if v_daily >= p_daily_limit or v_monthly >= p_monthly_limit then
    return query select false, 'usage_limit', v_daily, v_monthly, v_minute;
    return;
  end if;

  insert into public.ai_usage_events (workspace_id, user_id, operation)
  values (trim(p_workspace_id), trim(p_user_id), coalesce(nullif(trim(p_operation), ''), 'unknown'));

  return query select true, 'allowed', v_daily + 1, v_monthly + 1, v_minute + 1;
end;
$$;

revoke all on function public.consume_ai_usage(text, text, text, integer, integer, integer) from public, anon, authenticated;
grant execute on function public.consume_ai_usage(text, text, text, integer, integer, integer) to service_role;

create table if not exists public.ai_draft_confirmation_claims (
  draft_id text primary key,
  workspace_id text not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_draft_confirmation_claims_workspace_idx
  on public.ai_draft_confirmation_claims (workspace_id, created_at desc);

alter table public.ai_draft_confirmation_claims enable row level security;
revoke all on table public.ai_draft_confirmation_claims from public, anon, authenticated;
grant all on table public.ai_draft_confirmation_claims to service_role;

create or replace function public.claim_ai_draft_confirmation(
  p_draft_id text,
  p_workspace_id text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.ai_draft_confirmation_claims (draft_id, workspace_id)
  values (p_draft_id, p_workspace_id)
  on conflict (draft_id) do nothing;
  return found;
end;
$$;

create or replace function public.release_ai_draft_confirmation(
  p_draft_id text,
  p_workspace_id text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.ai_draft_confirmation_claims
  where draft_id = p_draft_id and workspace_id = p_workspace_id;
  return found;
end;
$$;

revoke execute on function public.claim_ai_draft_confirmation(text, text) from public, anon, authenticated;
revoke execute on function public.release_ai_draft_confirmation(text, text) from public, anon, authenticated;
grant execute on function public.claim_ai_draft_confirmation(text, text) to service_role;
grant execute on function public.release_ai_draft_confirmation(text, text) to service_role;
