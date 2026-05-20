-- ETAP 01 — Supabase Auth identity bootstrap
-- Cel: Supabase Auth jako docelowe logowanie oraz automatyczne utworzenie profilu, workspace i membership.
-- Migracja jest addytywna.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid unique,
  firebase_uid uuid,
  external_auth_uid uuid,
  email text unique,
  full_name text,
  company_name text,
  workspace_id uuid,
  role text not null default 'member',
  is_admin boolean not null default false,
  appearance_skin text not null default 'classic-light',
  planning_conflict_warnings_enabled boolean not null default true,
  browser_notifications_enabled boolean not null default true,
  force_logout_after timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Mój Workspace',
  owner_user_id uuid,
  owner_id uuid,
  created_by_user_id uuid,
  plan_id text not null default 'trial_14d',
  subscription_status text not null default 'trial_active',
  trial_ends_at timestamptz,
  billing_provider text default 'manual',
  provider_customer_id text,
  provider_subscription_id text,
  next_billing_at timestamptz,
  cancel_at_period_end boolean not null default false,
  timezone text not null default 'Europe/Warsaw',
  daily_digest_enabled boolean not null default true,
  daily_digest_hour integer not null default 7,
  daily_digest_timezone text not null default 'Europe/Warsaw',
  daily_digest_recipient_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id, user_id)
);

alter table public.profiles add column if not exists auth_uid uuid;
alter table public.profiles add column if not exists external_auth_uid uuid;
alter table public.profiles add column if not exists firebase_uid uuid;
alter table public.profiles add column if not exists workspace_id uuid;
alter table public.profiles add column if not exists force_logout_after timestamptz;

alter table public.workspaces add column if not exists owner_user_id uuid;
alter table public.workspaces add column if not exists owner_id uuid;
alter table public.workspaces add column if not exists created_by_user_id uuid;
alter table public.workspaces add column if not exists trial_ends_at timestamptz;
alter table public.workspaces add column if not exists timezone text default 'Europe/Warsaw';

create index if not exists profiles_auth_uid_idx on public.profiles(auth_uid);
create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists profiles_workspace_id_idx on public.profiles(workspace_id);
create index if not exists workspaces_owner_user_id_idx on public.workspaces(owner_user_id);
create index if not exists workspace_members_user_id_idx on public.workspace_members(user_id);
create index if not exists workspace_members_workspace_id_idx on public.workspace_members(workspace_id);

create or replace function public.closeflow_handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_workspace_id uuid;
  v_full_name text;
begin
  v_full_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email, 'Użytkownik');

  insert into public.profiles (
    id, auth_uid, external_auth_uid, email, full_name, company_name, role, is_admin, created_at, updated_at
  ) values (
    new.id, new.id, new.id, new.email, v_full_name, '', 'member', false, now(), now()
  )
  on conflict (id) do update set
    auth_uid = excluded.auth_uid,
    external_auth_uid = excluded.external_auth_uid,
    email = excluded.email,
    full_name = coalesce(public.profiles.full_name, excluded.full_name),
    updated_at = now();

  select workspace_id into v_workspace_id from public.profiles where auth_uid = new.id limit 1;

  if v_workspace_id is null then
    insert into public.workspaces (
      name, owner_user_id, owner_id, created_by_user_id, plan_id, subscription_status, trial_ends_at,
      billing_provider, timezone, daily_digest_enabled, daily_digest_hour, daily_digest_timezone,
      daily_digest_recipient_email, created_at, updated_at
    ) values (
      coalesce(v_full_name, 'Mój') || ' Workspace', new.id, new.id, new.id, 'trial_14d', 'trial_active',
      now() + interval '14 days', 'manual', 'Europe/Warsaw', true, 7, 'Europe/Warsaw', new.email, now(), now()
    ) returning id into v_workspace_id;

    update public.profiles set workspace_id = v_workspace_id, updated_at = now() where auth_uid = new.id;
  end if;

  insert into public.workspace_members (workspace_id, user_id, role, created_at, updated_at)
  values (v_workspace_id, new.id, 'owner', now(), now())
  on conflict (workspace_id, user_id) do update set role = excluded.role, updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_closeflow on auth.users;
create trigger on_auth_user_created_closeflow
  after insert on auth.users
  for each row execute procedure public.closeflow_handle_new_auth_user();
