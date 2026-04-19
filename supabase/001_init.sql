create extension if not exists pgcrypto;

create or replace function public.normalize_email(value text)
returns text
language sql
immutable
as $$
  select lower(trim(coalesce(value, '')))
$$;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  normalized_email text not null unique,
  email text,
  display_name text,
  auth_provider text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null unique references auth.users(id) on delete cascade,
  name text not null default 'LeadFlow',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null unique references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.account_access (
  user_id uuid primary key references auth.users(id) on delete cascade,
  normalized_email text not null unique,
  status text not null default 'trial_active' check (status in ('trial_active', 'trial_expired', 'paid_active', 'payment_failed', 'canceled')),
  billing_status text not null default 'trial' check (billing_status in ('local', 'trial', 'active', 'past_due')),
  trial_started_at timestamptz not null default now(),
  trial_ends_at timestamptz not null default (now() + interval '7 days'),
  trial_used boolean not null default true,
  current_period_ends_at timestamptz,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  snapshot_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.bootstrap_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  workspace_uuid uuid;
  resolved_email text;
  resolved_name text;
  resolved_provider text;
begin
  resolved_email := public.normalize_email(new.email);
  resolved_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
    split_part(resolved_email, '@', 1),
    'Twoje konto'
  );
  resolved_provider := coalesce(
    nullif(trim(new.raw_app_meta_data ->> 'provider'), ''),
    'email'
  );

  insert into public.profiles (user_id, normalized_email, email, display_name, auth_provider)
  values (new.id, resolved_email, new.email, resolved_name, resolved_provider)
  on conflict (user_id) do update
    set normalized_email = excluded.normalized_email,
        email = excluded.email,
        display_name = coalesce(excluded.display_name, public.profiles.display_name),
        auth_provider = coalesce(excluded.auth_provider, public.profiles.auth_provider);

  insert into public.workspaces (owner_user_id, name)
  values (new.id, 'LeadFlow')
  on conflict (owner_user_id) do nothing;

  select id into workspace_uuid
  from public.workspaces
  where owner_user_id = new.id
  limit 1;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (workspace_uuid, new.id, 'owner')
  on conflict (user_id) do nothing;

  insert into public.account_access (user_id, normalized_email)
  values (new.id, resolved_email)
  on conflict (user_id) do update
    set normalized_email = excluded.normalized_email;

  insert into public.app_snapshots (user_id, workspace_id, snapshot_json)
  values (
    new.id,
    workspace_uuid,
    jsonb_build_object(
      'context', jsonb_build_object(
        'userId', new.id,
        'workspaceId', workspace_uuid,
        'accessStatus', 'trial_active',
        'billingStatus', 'trial'
      )
    )
  )
  on conflict (user_id) do update
    set workspace_id = excluded.workspace_id;

  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists trg_workspaces_updated_at on public.workspaces;
create trigger trg_workspaces_updated_at
before update on public.workspaces
for each row
execute function public.set_updated_at();

drop trigger if exists trg_account_access_updated_at on public.account_access;
create trigger trg_account_access_updated_at
before update on public.account_access
for each row
execute function public.set_updated_at();

drop trigger if exists trg_app_snapshots_updated_at on public.app_snapshots;
create trigger trg_app_snapshots_updated_at
before update on public.app_snapshots
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.bootstrap_new_user();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.account_access enable row level security;
alter table public.app_snapshots enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (auth.uid() = user_id);

drop policy if exists "workspaces_select_own" on public.workspaces;
create policy "workspaces_select_own"
on public.workspaces
for select
using (
  owner_user_id = auth.uid()
  or exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.workspaces.id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists "workspaces_update_owner" on public.workspaces;
create policy "workspaces_update_owner"
on public.workspaces
for update
using (owner_user_id = auth.uid());

drop policy if exists "workspace_members_select_own" on public.workspace_members;
create policy "workspace_members_select_own"
on public.workspace_members
for select
using (
  user_id = auth.uid()
  or exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = public.workspace_members.workspace_id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists "account_access_select_own" on public.account_access;
create policy "account_access_select_own"
on public.account_access
for select
using (auth.uid() = user_id);

drop policy if exists "account_access_update_own" on public.account_access;
create policy "account_access_update_own"
on public.account_access
for update
using (auth.uid() = user_id);

drop policy if exists "app_snapshots_select_own" on public.app_snapshots;
create policy "app_snapshots_select_own"
on public.app_snapshots
for select
using (auth.uid() = user_id);

drop policy if exists "app_snapshots_insert_own" on public.app_snapshots;
create policy "app_snapshots_insert_own"
on public.app_snapshots
for insert
with check (auth.uid() = user_id);

drop policy if exists "app_snapshots_update_own" on public.app_snapshots;
create policy "app_snapshots_update_own"
on public.app_snapshots
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
