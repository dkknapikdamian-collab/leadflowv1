-- A22 - Supabase Auth + RLS + workspace foundation
-- Cel: profiles + workspaces + workspace_members + RLS dla danych biznesowych.
-- V1: jeden użytkownik = jeden workspace. workspace_members zostaje technicznie pod przyszłość.

begin;

create extension if not exists pgcrypto;

-- 1. Core SaaS identity tables
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid,
  owner_id uuid,
  created_by_user_id uuid,
  name text not null default 'Mój Workspace',
  plan_id text not null default 'trial_21d',
  subscription_status text not null default 'trial_active',
  trial_ends_at timestamptz,
  billing_provider text not null default 'manual',
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

create table if not exists public.profiles (
  id uuid primary key,
  auth_user_id uuid unique,
  firebase_uid uuid,
  auth_uid uuid,
  external_auth_uid uuid,
  email text,
  full_name text not null default '',
  company_name text not null default '',
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

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id, user_id)
);

-- 2. Idempotent schema repair for older installs
alter table if exists public.workspaces add column if not exists owner_user_id uuid;
alter table if exists public.workspaces add column if not exists owner_id uuid;
alter table if exists public.workspaces add column if not exists created_by_user_id uuid;
alter table if exists public.workspaces add column if not exists name text not null default 'Mój Workspace';
alter table if exists public.workspaces add column if not exists plan_id text not null default 'trial_21d';
alter table if exists public.workspaces add column if not exists subscription_status text not null default 'trial_active';
alter table if exists public.workspaces add column if not exists trial_ends_at timestamptz;
alter table if exists public.workspaces add column if not exists billing_provider text not null default 'manual';
alter table if exists public.workspaces add column if not exists provider_customer_id text;
alter table if exists public.workspaces add column if not exists provider_subscription_id text;
alter table if exists public.workspaces add column if not exists next_billing_at timestamptz;
alter table if exists public.workspaces add column if not exists cancel_at_period_end boolean not null default false;
alter table if exists public.workspaces add column if not exists timezone text not null default 'Europe/Warsaw';
alter table if exists public.workspaces add column if not exists daily_digest_enabled boolean not null default true;
alter table if exists public.workspaces add column if not exists daily_digest_hour integer not null default 7;
alter table if exists public.workspaces add column if not exists daily_digest_timezone text not null default 'Europe/Warsaw';
alter table if exists public.workspaces add column if not exists daily_digest_recipient_email text;
alter table if exists public.workspaces add column if not exists created_at timestamptz not null default now();
alter table if exists public.workspaces add column if not exists updated_at timestamptz not null default now();

alter table if exists public.profiles add column if not exists auth_user_id uuid;
alter table if exists public.profiles add column if not exists firebase_uid uuid;
alter table if exists public.profiles add column if not exists auth_uid uuid;
alter table if exists public.profiles add column if not exists external_auth_uid uuid;
alter table if exists public.profiles add column if not exists email text;
alter table if exists public.profiles add column if not exists full_name text not null default '';
alter table if exists public.profiles add column if not exists company_name text not null default '';
alter table if exists public.profiles add column if not exists workspace_id uuid;
alter table if exists public.profiles add column if not exists role text not null default 'member';
alter table if exists public.profiles add column if not exists is_admin boolean not null default false;
alter table if exists public.profiles add column if not exists appearance_skin text not null default 'classic-light';
alter table if exists public.profiles add column if not exists planning_conflict_warnings_enabled boolean not null default true;
alter table if exists public.profiles add column if not exists browser_notifications_enabled boolean not null default true;
alter table if exists public.profiles add column if not exists force_logout_after timestamptz;
alter table if exists public.profiles add column if not exists created_at timestamptz not null default now();
alter table if exists public.profiles add column if not exists updated_at timestamptz not null default now();

alter table if exists public.workspace_members add column if not exists workspace_id uuid;
alter table if exists public.workspace_members add column if not exists user_id uuid;
alter table if exists public.workspace_members add column if not exists role text not null default 'owner';
alter table if exists public.workspace_members add column if not exists created_at timestamptz not null default now();
alter table if exists public.workspace_members add column if not exists updated_at timestamptz not null default now();

-- 3. Constraints and indexes
create unique index if not exists profiles_auth_user_id_unique_idx on public.profiles(auth_user_id) where auth_user_id is not null;
create index if not exists profiles_workspace_id_idx on public.profiles(workspace_id);
create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_is_admin_idx on public.profiles(is_admin);
create index if not exists workspaces_owner_user_id_idx on public.workspaces(owner_user_id);
create index if not exists workspace_members_workspace_id_idx on public.workspace_members(workspace_id);
create index if not exists workspace_members_user_id_idx on public.workspace_members(user_id);
create unique index if not exists workspace_members_workspace_user_unique_idx on public.workspace_members(workspace_id, user_id);

update public.profiles set role = 'member' where role is null or role not in ('admin', 'owner', 'member', 'operator');
alter table public.profiles drop constraint if exists profiles_role_allowed_values;
alter table public.profiles add constraint profiles_role_allowed_values check (role in ('admin', 'owner', 'member', 'operator'));

update public.workspace_members set role = 'owner' where role is null or role not in ('owner', 'admin', 'member', 'operator');
alter table public.workspace_members drop constraint if exists workspace_members_role_allowed_values;
alter table public.workspace_members add constraint workspace_members_role_allowed_values check (role in ('owner', 'admin', 'member', 'operator'));

update public.workspaces set subscription_status = 'trial_active' where subscription_status is null or subscription_status not in ('trial_active', 'trial_ending', 'trial_expired', 'free_active', 'paid_active', 'payment_failed', 'canceled', 'inactive');
alter table public.workspaces drop constraint if exists workspaces_subscription_status_allowed_values;
alter table public.workspaces add constraint workspaces_subscription_status_allowed_values check (
  subscription_status in ('trial_active', 'trial_ending', 'trial_expired', 'free_active', 'paid_active', 'payment_failed', 'canceled', 'inactive')
);

-- 4. Auth/RLS helpers. Text parameter keeps compatibility with old text workspace_id columns.
create or replace function public.closeflow_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where (
      p.auth_user_id = auth.uid()
      or p.id = auth.uid()
      or p.firebase_uid = auth.uid()
      or p.auth_uid = auth.uid()
      or p.external_auth_uid = auth.uid()
    )
    and (p.role = 'admin' or p.is_admin is true)
  );
$$;

create or replace function public.closeflow_is_workspace_member(target_workspace_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select target_workspace_id is not null
    and target_workspace_id <> ''
    and auth.uid() is not null
    and (
      exists (
        select 1
        from public.workspace_members wm
        where wm.workspace_id::text = target_workspace_id
          and wm.user_id = auth.uid()
      )
      or exists (
        select 1
        from public.workspaces w
        where w.id::text = target_workspace_id
          and (
            w.owner_user_id = auth.uid()
            or w.owner_id = auth.uid()
            or w.created_by_user_id = auth.uid()
          )
      )
      or public.closeflow_is_admin()
    );
$$;

create or replace function public.closeflow_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.closeflow_bootstrap_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid;
  display_name text;
begin
  display_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email, 'Użytkownik');

  insert into public.workspaces (
    owner_user_id,
    owner_id,
    created_by_user_id,
    name,
    plan_id,
    subscription_status,
    trial_ends_at,
    billing_provider,
    timezone,
    daily_digest_enabled,
    daily_digest_hour,
    daily_digest_timezone,
    created_at,
    updated_at
  ) values (
    new.id,
    new.id,
    new.id,
    coalesce(nullif(display_name, ''), 'Mój') || ' Workspace',
    'trial_21d',
    'trial_active',
    now() + interval '21 days',
    'manual',
    'Europe/Warsaw',
    true,
    7,
    'Europe/Warsaw',
    now(),
    now()
  )
  returning id into new_workspace_id;

  insert into public.profiles (
    id,
    auth_user_id,
    firebase_uid,
    auth_uid,
    external_auth_uid,
    email,
    full_name,
    workspace_id,
    role,
    is_admin,
    created_at,
    updated_at
  ) values (
    new.id,
    new.id,
    new.id,
    new.id,
    new.id,
    new.email,
    coalesce(display_name, ''),
    new_workspace_id,
    'owner',
    false,
    now(),
    now()
  )
  on conflict (id) do update set
    auth_user_id = coalesce(public.profiles.auth_user_id, excluded.auth_user_id),
    email = coalesce(excluded.email, public.profiles.email),
    full_name = coalesce(nullif(excluded.full_name, ''), public.profiles.full_name),
    workspace_id = coalesce(public.profiles.workspace_id, excluded.workspace_id),
    updated_at = now();

  insert into public.workspace_members (workspace_id, user_id, role, created_at, updated_at)
  values (new_workspace_id, new.id, 'owner', now(), now())
  on conflict (workspace_id, user_id) do update set
    role = excluded.role,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists closeflow_bootstrap_user_after_auth_insert on auth.users;
create trigger closeflow_bootstrap_user_after_auth_insert
after insert on auth.users
for each row execute function public.closeflow_bootstrap_user();

-- 5. Updated_at triggers for core tables
do $$
declare
  v_table text;
begin
  foreach v_table in array array['profiles', 'workspaces', 'workspace_members'] loop
    execute format('drop trigger if exists closeflow_%I_touch_updated_at on public.%I', v_table, v_table);
    execute format('create trigger closeflow_%I_touch_updated_at before update on public.%I for each row execute function public.closeflow_touch_updated_at()', v_table, v_table);
  end loop;
end $$;

-- 6. RLS: core auth/workspace tables
alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

alter table public.profiles force row level security;
alter table public.workspaces force row level security;
alter table public.workspace_members force row level security;

drop policy if exists profiles_select_self_or_workspace on public.profiles;
create policy profiles_select_self_or_workspace on public.profiles
for select using (
  auth.uid() is not null and (
    auth_user_id = auth.uid()
    or id = auth.uid()
    or firebase_uid = auth.uid()
    or auth_uid = auth.uid()
    or external_auth_uid = auth.uid()
    or public.closeflow_is_workspace_member(workspace_id::text)
  )
);

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
for update using (
  auth.uid() is not null and (
    auth_user_id = auth.uid()
    or id = auth.uid()
    or firebase_uid = auth.uid()
    or auth_uid = auth.uid()
    or external_auth_uid = auth.uid()
    or public.closeflow_is_admin()
  )
) with check (
  auth.uid() is not null and (
    auth_user_id = auth.uid()
    or id = auth.uid()
    or firebase_uid = auth.uid()
    or auth_uid = auth.uid()
    or external_auth_uid = auth.uid()
    or public.closeflow_is_admin()
  )
);

drop policy if exists workspaces_select_member on public.workspaces;
create policy workspaces_select_member on public.workspaces
for select using (public.closeflow_is_workspace_member(id::text));

drop policy if exists workspaces_update_owner_admin on public.workspaces;
create policy workspaces_update_owner_admin on public.workspaces
for update using (
  auth.uid() is not null and (
    owner_user_id = auth.uid()
    or owner_id = auth.uid()
    or created_by_user_id = auth.uid()
    or public.closeflow_is_admin()
  )
) with check (
  auth.uid() is not null and (
    owner_user_id = auth.uid()
    or owner_id = auth.uid()
    or created_by_user_id = auth.uid()
    or public.closeflow_is_admin()
  )
);

drop policy if exists workspace_members_select_member on public.workspace_members;
create policy workspace_members_select_member on public.workspace_members
for select using (public.closeflow_is_workspace_member(workspace_id::text));

drop policy if exists workspace_members_manage_owner_admin on public.workspace_members;
create policy workspace_members_manage_owner_admin on public.workspace_members
for all using (
  public.closeflow_is_admin()
  or exists (
    select 1
    from public.workspaces w
    where w.id = workspace_members.workspace_id
      and (w.owner_user_id = auth.uid() or w.owner_id = auth.uid() or w.created_by_user_id = auth.uid())
  )
) with check (
  public.closeflow_is_admin()
  or exists (
    select 1
    from public.workspaces w
    where w.id = workspace_members.workspace_id
      and (w.owner_user_id = auth.uid() or w.owner_id = auth.uid() or w.created_by_user_id = auth.uid())
  )
);

-- 7. RLS for business tables with workspace_id. This is idempotent and only runs for existing tables.
do $$
declare
  v_table text;
  policy_name text;
  policy_sql text;
  business_tables text[] := array[
    'leads',
    'clients',
    'cases',
    'work_items',
    'activities',
    'ai_drafts',
    'response_templates',
    'case_items',
    'payments',
    'notifications',
    'workspace_settings',
    'client_portal_items',
    'portal_items',
    'portal_access_tokens',
    'files',
    'documents'
  ];
begin
  foreach v_table in array business_tables loop
    if to_regclass('public.' || v_table) is not null
       and exists (
         select 1
         from information_schema.columns
         where table_schema = 'public'
           and table_name = v_table
           and column_name = 'workspace_id'
       ) then
      execute format('alter table public.%I enable row level security', v_table);
      execute format('alter table public.%I force row level security', v_table);

      policy_name := 'closeflow_' || v_table || '_workspace_member_select';
      if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = v_table and policyname = policy_name) then
        policy_sql := format('create policy %I on public.%I for select using (public.closeflow_is_workspace_member(workspace_id::text))', policy_name, v_table);
        execute policy_sql;
      end if;

      policy_name := 'closeflow_' || v_table || '_workspace_member_insert';
      if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = v_table and policyname = policy_name) then
        policy_sql := format('create policy %I on public.%I for insert with check (public.closeflow_is_workspace_member(workspace_id::text))', policy_name, v_table);
        execute policy_sql;
      end if;

      policy_name := 'closeflow_' || v_table || '_workspace_member_update';
      if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = v_table and policyname = policy_name) then
        policy_sql := format('create policy %I on public.%I for update using (public.closeflow_is_workspace_member(workspace_id::text)) with check (public.closeflow_is_workspace_member(workspace_id::text))', policy_name, v_table);
        execute policy_sql;
      end if;

      policy_name := 'closeflow_' || v_table || '_workspace_member_delete';
      if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = v_table and policyname = policy_name) then
        policy_sql := format('create policy %I on public.%I for delete using (public.closeflow_is_workspace_member(workspace_id::text))', policy_name, v_table);
        execute policy_sql;
      end if;
    end if;
  end loop;
end $$;

commit;
