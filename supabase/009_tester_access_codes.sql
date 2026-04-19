create extension if not exists pgcrypto;

create table if not exists public.access_codes (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  code_hash text not null unique,
  access_override_mode text not null default 'tester_unlimited'
    check (access_override_mode in ('tester_unlimited')),
  access_override_expires_at timestamptz null,
  access_override_note text null,
  valid_until timestamptz null,
  max_redemptions integer null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.access_code_redemptions (
  id uuid primary key default gen_random_uuid(),
  access_code_id uuid not null references public.access_codes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique (access_code_id, user_id)
);

create index if not exists idx_access_codes_active on public.access_codes (is_active, valid_until);
create index if not exists idx_access_code_redemptions_user_id on public.access_code_redemptions (user_id);
create index if not exists idx_access_code_redemptions_code_id on public.access_code_redemptions (access_code_id);

create or replace function public.normalize_access_code(raw_code text)
returns text
language sql
immutable
as $$
  select upper(regexp_replace(coalesce(raw_code, ''), '\s+', '', 'g'))
$$;

create or replace function public.hash_access_code(raw_code text)
returns text
language sql
immutable
as $$
  select encode(digest(public.normalize_access_code(raw_code), 'sha256'), 'hex')
$$;

create or replace function public.redeem_access_code(target_user_id uuid, raw_code text)
returns table (
  applied boolean,
  access_override_mode text,
  access_override_expires_at timestamptz,
  access_override_note text
)
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  code_record public.access_codes%rowtype;
  redemption_exists boolean;
  redemption_count integer;
begin
  if target_user_id is null then
    raise exception 'missing_user_id';
  end if;

  select *
  into code_record
  from public.access_codes
  where code_hash = public.hash_access_code(raw_code)
    and is_active = true
  limit 1;

  if code_record.id is null then
    raise exception 'invalid_access_code';
  end if;

  if code_record.valid_until is not null and code_record.valid_until < now() then
    raise exception 'access_code_expired';
  end if;

  select exists(
    select 1
    from public.access_code_redemptions
    where access_code_id = code_record.id
      and user_id = target_user_id
  ) into redemption_exists;

  select count(*)::integer
  into redemption_count
  from public.access_code_redemptions
  where access_code_id = code_record.id;

  if not redemption_exists and code_record.max_redemptions is not null and redemption_count >= code_record.max_redemptions then
    raise exception 'access_code_limit_reached';
  end if;

  insert into public.access_code_redemptions (access_code_id, user_id)
  values (code_record.id, target_user_id)
  on conflict (access_code_id, user_id) do nothing;

  update public.access_status
  set access_override_mode = case
        when public.access_status.access_override_mode = 'admin_unlimited' then public.access_status.access_override_mode
        else code_record.access_override_mode
      end,
      access_override_expires_at = case
        when public.access_status.access_override_mode = 'admin_unlimited' then public.access_status.access_override_expires_at
        else code_record.access_override_expires_at
      end,
      access_override_note = case
        when public.access_status.access_override_mode = 'admin_unlimited' then public.access_status.access_override_note
        else coalesce(code_record.access_override_note, 'Tester access code')
      end,
      updated_at = now()
  where user_id = target_user_id;

  return query
  select
    true,
    case
      when exists (
        select 1
        from public.access_status
        where user_id = target_user_id
          and access_override_mode = 'admin_unlimited'
      ) then 'admin_unlimited'
      else code_record.access_override_mode
    end,
    case
      when exists (
        select 1
        from public.access_status
        where user_id = target_user_id
          and access_override_mode = 'admin_unlimited'
      ) then (
        select access_override_expires_at from public.access_status where user_id = target_user_id limit 1
      )
      else code_record.access_override_expires_at
    end,
    case
      when exists (
        select 1
        from public.access_status
        where user_id = target_user_id
          and access_override_mode = 'admin_unlimited'
      ) then (
        select access_override_note from public.access_status where user_id = target_user_id limit 1
      )
      else coalesce(code_record.access_override_note, 'Tester access code')
    end;
end;
$$;

revoke all on function public.redeem_access_code(uuid, text) from public;
revoke all on function public.redeem_access_code(uuid, text) from anon;
revoke all on function public.redeem_access_code(uuid, text) from authenticated;
grant execute on function public.redeem_access_code(uuid, text) to service_role;

alter table public.access_codes enable row level security;
alter table public.access_code_redemptions enable row level security;

drop policy if exists "access_codes_no_direct_access" on public.access_codes;
create policy "access_codes_no_direct_access"
  on public.access_codes
  for all
  to authenticated
  using (false)
  with check (false);

drop policy if exists "access_code_redemptions_select_own" on public.access_code_redemptions;
create policy "access_code_redemptions_select_own"
  on public.access_code_redemptions
  for select
  to authenticated
  using (auth.uid() = user_id);
