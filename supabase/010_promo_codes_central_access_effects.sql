create extension if not exists pgcrypto;

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  legacy_code_hash text unique,
  kind text not null default 'access',
  effect_type text not null check (effect_type in ('trial_days', 'discount_percent', 'tester_unlimited', 'tester_until_date', 'paid_access_until_date')),
  effect_value jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  max_redemptions integer,
  used_count integer not null default 0,
  expires_at timestamptz,
  allowed_email text,
  allowed_domain text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.promo_code_redemptions (
  id uuid primary key default gen_random_uuid(),
  promo_code_id uuid not null references public.promo_codes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  applied_effect_snapshot jsonb not null default '{}'::jsonb,
  unique (promo_code_id, user_id)
);

create index if not exists idx_promo_codes_active on public.promo_codes (is_active, expires_at);
create index if not exists idx_promo_codes_allowed_email on public.promo_codes (allowed_email) where allowed_email is not null;
create index if not exists idx_promo_codes_allowed_domain on public.promo_codes (allowed_domain) where allowed_domain is not null;
create index if not exists idx_promo_code_redemptions_user_id on public.promo_code_redemptions (user_id);
create index if not exists idx_promo_code_redemptions_workspace_id on public.promo_code_redemptions (workspace_id);

create or replace function public.normalize_promo_code(raw_code text)
returns text
language sql
immutable
as $$
  select upper(regexp_replace(coalesce(raw_code, ''), '\s+', '', 'g'))
$$;

create or replace function public.hash_promo_code(raw_code text)
returns text
language sql
immutable
as $$
  select encode(digest(public.normalize_promo_code(raw_code), 'sha256'), 'hex')
$$;

insert into public.promo_codes (
  id,
  code,
  legacy_code_hash,
  kind,
  effect_type,
  effect_value,
  is_active,
  max_redemptions,
  used_count,
  expires_at,
  note,
  created_at,
  updated_at
)
select
  access_codes.id,
  'LEGACY-' || access_codes.id::text,
  access_codes.code_hash,
  'legacy_access',
  case
    when access_codes.access_override_mode = 'tester_unlimited' and access_codes.access_override_expires_at is not null then 'tester_until_date'
    else 'tester_unlimited'
  end,
  case
    when access_codes.access_override_expires_at is not null then jsonb_build_object('until', access_codes.access_override_expires_at)
    else '{}'::jsonb
  end,
  access_codes.is_active,
  access_codes.max_redemptions,
  coalesce((select count(*)::integer from public.access_code_redemptions where access_code_id = access_codes.id), 0),
  access_codes.valid_until,
  access_codes.access_override_note,
  access_codes.created_at,
  access_codes.updated_at
from public.access_codes
where exists (
  select 1
  from information_schema.tables
  where table_schema = 'public'
    and table_name = 'access_codes'
)
on conflict (id) do update
  set legacy_code_hash = excluded.legacy_code_hash,
      kind = excluded.kind,
      effect_type = excluded.effect_type,
      effect_value = excluded.effect_value,
      is_active = excluded.is_active,
      max_redemptions = excluded.max_redemptions,
      used_count = greatest(public.promo_codes.used_count, excluded.used_count),
      expires_at = excluded.expires_at,
      note = coalesce(public.promo_codes.note, excluded.note),
      updated_at = now();

insert into public.promo_code_redemptions (
  id,
  promo_code_id,
  user_id,
  workspace_id,
  redeemed_at,
  applied_effect_snapshot
)
select
  legacy.id,
  legacy.access_code_id,
  legacy.user_id,
  access_status.workspace_id,
  legacy.redeemed_at,
  jsonb_build_object(
    'source', 'legacy_access_code',
    'redeemed_at', legacy.redeemed_at
  )
from public.access_code_redemptions as legacy
left join public.access_status as access_status
  on access_status.user_id = legacy.user_id
where exists (
  select 1
  from information_schema.tables
  where table_schema = 'public'
    and table_name = 'access_code_redemptions'
)
on conflict (promo_code_id, user_id) do nothing;

create or replace function public.redeem_promo_code(target_user_id uuid, raw_code text)
returns table (
  applied boolean,
  access_override_mode text,
  access_override_expires_at timestamptz,
  access_override_note text,
  access_status text,
  paid_until timestamptz,
  effect_type text
)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  promo_record public.promo_codes%rowtype;
  current_access public.access_status%rowtype;
  existing_redemption public.promo_code_redemptions%rowtype;
  user_email text;
  user_domain text;
  workspace_uuid uuid;
  normalized_code text;
  code_hash text;
  until_value timestamptz;
  days_value integer;
  trial_base timestamptz;
  applied_snapshot jsonb;
begin
  if target_user_id is null then
    raise exception 'missing_user_id';
  end if;

  normalized_code := public.normalize_promo_code(raw_code);
  code_hash := public.hash_promo_code(raw_code);

  select profiles.normalized_email,
         split_part(profiles.normalized_email, '@', 2),
         access_status.workspace_id
  into user_email, user_domain, workspace_uuid
  from public.profiles as profiles
  left join public.access_status as access_status
    on access_status.user_id = profiles.user_id
  where profiles.user_id = target_user_id
  limit 1;

  if user_email is null then
    raise exception 'missing_profile';
  end if;

  select *
  into current_access
  from public.access_status
  where user_id = target_user_id
  limit 1
  for update;

  if current_access.user_id is null then
    raise exception 'missing_access_status';
  end if;

  select *
  into promo_record
  from public.promo_codes
  where (code = normalized_code or legacy_code_hash = code_hash)
    and is_active = true
  limit 1
  for update;

  if promo_record.id is null then
    raise exception 'invalid_promo_code';
  end if;

  if promo_record.expires_at is not null and promo_record.expires_at < now() then
    raise exception 'promo_code_expired';
  end if;

  if promo_record.allowed_email is not null and public.normalize_email(promo_record.allowed_email) <> user_email then
    raise exception 'promo_code_email_not_allowed';
  end if;

  if promo_record.allowed_domain is not null and lower(promo_record.allowed_domain) <> lower(user_domain) then
    raise exception 'promo_code_domain_not_allowed';
  end if;

  select *
  into existing_redemption
  from public.promo_code_redemptions
  where promo_code_id = promo_record.id
    and user_id = target_user_id
  limit 1;

  if existing_redemption.id is not null then
    return query
    select
      true,
      current_access.access_override_mode,
      current_access.access_override_expires_at,
      current_access.access_override_note,
      current_access.access_status,
      current_access.paid_until,
      promo_record.effect_type;
    return;
  end if;

  if promo_record.max_redemptions is not null and promo_record.used_count >= promo_record.max_redemptions then
    raise exception 'promo_code_limit_reached';
  end if;

  if promo_record.effect_type = 'tester_unlimited' then
    update public.access_status
    set access_override_mode = case
          when public.access_status.access_override_mode = 'admin_unlimited' then public.access_status.access_override_mode
          else 'tester_unlimited'
        end,
        access_override_expires_at = case
          when public.access_status.access_override_mode = 'admin_unlimited' then public.access_status.access_override_expires_at
          else null
        end,
        access_override_note = case
          when public.access_status.access_override_mode = 'admin_unlimited' then public.access_status.access_override_note
          else coalesce(promo_record.note, 'Promo code tester access')
        end,
        updated_at = now()
    where user_id = target_user_id;
  elsif promo_record.effect_type = 'tester_until_date' then
    until_value := coalesce((promo_record.effect_value ->> 'until')::timestamptz, promo_record.expires_at);
    if until_value is null then
      raise exception 'invalid_promo_effect_value';
    end if;

    update public.access_status
    set access_override_mode = case
          when public.access_status.access_override_mode = 'admin_unlimited' then public.access_status.access_override_mode
          else 'tester_unlimited'
        end,
        access_override_expires_at = case
          when public.access_status.access_override_mode = 'admin_unlimited' then public.access_status.access_override_expires_at
          else until_value
        end,
        access_override_note = case
          when public.access_status.access_override_mode = 'admin_unlimited' then public.access_status.access_override_note
          else coalesce(promo_record.note, 'Promo code tester access until date')
        end,
        updated_at = now()
    where user_id = target_user_id;
  elsif promo_record.effect_type = 'paid_access_until_date' then
    until_value := coalesce((promo_record.effect_value ->> 'until')::timestamptz, promo_record.expires_at);
    if until_value is null then
      raise exception 'invalid_promo_effect_value';
    end if;

    update public.access_status
    set access_status = 'paid_active',
        paid_until = case
          when public.access_status.paid_until is null or public.access_status.paid_until < until_value then until_value
          else public.access_status.paid_until
        end,
        updated_at = now()
    where user_id = target_user_id;
  elsif promo_record.effect_type = 'trial_days' then
    days_value := coalesce((promo_record.effect_value ->> 'days')::integer, 0);
    if days_value <= 0 then
      raise exception 'invalid_promo_effect_value';
    end if;

    trial_base := greatest(coalesce(current_access.trial_end, now()), now());

    update public.access_status
    set access_status = 'trial_active',
        trial_start = coalesce(public.access_status.trial_start, now()),
        trial_end = trial_base + make_interval(days => days_value),
        trial_activated_at = coalesce(public.access_status.trial_activated_at, now()),
        trial_used = true,
        updated_at = now()
    where user_id = target_user_id;
  elsif promo_record.effect_type = 'discount_percent' then
    null;
  else
    raise exception 'unsupported_promo_effect_type';
  end if;

  update public.promo_codes
  set used_count = used_count + 1,
      updated_at = now()
  where id = promo_record.id;

  select *
  into current_access
  from public.access_status
  where user_id = target_user_id
  limit 1;

  applied_snapshot := jsonb_build_object(
    'kind', promo_record.kind,
    'effect_type', promo_record.effect_type,
    'effect_value', promo_record.effect_value,
    'applied_at', now(),
    'access_override_mode', current_access.access_override_mode,
    'access_override_expires_at', current_access.access_override_expires_at,
    'access_override_note', current_access.access_override_note,
    'access_status', current_access.access_status,
    'paid_until', current_access.paid_until
  );

  insert into public.promo_code_redemptions (
    promo_code_id,
    user_id,
    workspace_id,
    redeemed_at,
    applied_effect_snapshot
  ) values (
    promo_record.id,
    target_user_id,
    coalesce(workspace_uuid, current_access.workspace_id),
    now(),
    applied_snapshot
  );

  return query
  select
    true,
    current_access.access_override_mode,
    current_access.access_override_expires_at,
    current_access.access_override_note,
    current_access.access_status,
    current_access.paid_until,
    promo_record.effect_type;
end;
$$;

revoke all on function public.redeem_promo_code(uuid, text) from public;
revoke all on function public.redeem_promo_code(uuid, text) from anon;
revoke all on function public.redeem_promo_code(uuid, text) from authenticated;
grant execute on function public.redeem_promo_code(uuid, text) to service_role;

alter table public.promo_codes enable row level security;
alter table public.promo_code_redemptions enable row level security;

drop policy if exists "promo_codes_no_direct_access" on public.promo_codes;
create policy "promo_codes_no_direct_access"
  on public.promo_codes
  for all
  to authenticated
  using (false)
  with check (false);

drop policy if exists "promo_code_redemptions_select_own" on public.promo_code_redemptions;
create policy "promo_code_redemptions_select_own"
  on public.promo_code_redemptions
  for select
  to authenticated
  using (auth.uid() = user_id);
