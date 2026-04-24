-- CloseFlow / LeadFlow v1
-- Supabase workspace context repair v2
-- Cel: naprawić błąd brakujących kolumn profiles.workspace_id oraz profiles.id
-- i bezpiecznie dopiąć workspace_id po migracji Firebase -> Supabase.
--
-- Skrypt jest addytywny i niedestrukcyjny:
-- - nie usuwa tabel,
-- - nie usuwa danych,
-- - dodaje brakujące kolumny,
-- - tworzy workspace dla profili bez workspace_id,
-- - robi bezpieczny backfill workspace_id tam, gdzie da się to ustalić.

begin;

create extension if not exists pgcrypto;

create or replace function pg_temp.cf_table_exists(p_table text)
returns boolean
language sql
stable
as $$
  select to_regclass('public.' || p_table) is not null;
$$;

create or replace function pg_temp.cf_column_exists(p_table text, p_column text)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = p_table
      and column_name = p_column
  );
$$;

create or replace function pg_temp.cf_column_udt(p_table text, p_column text)
returns text
language sql
stable
as $$
  select c.udt_name
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = p_table
    and c.column_name = p_column
  limit 1;
$$;

-- 1. Core tables.

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Workspace',
  plan_id text not null default 'trial_14d',
  subscription_status text not null default 'trial_active',
  trial_ends_at timestamptz null,
  timezone text not null default 'Europe/Warsaw',
  owner_user_id uuid null,
  owner_id uuid null,
  created_by_user_id uuid null,
  billing_provider text null default 'manual',
  provider_customer_id text null,
  provider_subscription_id text null,
  next_billing_at timestamptz null,
  cancel_at_period_end boolean not null default false,
  daily_digest_enabled boolean not null default true,
  daily_digest_hour integer not null default 7,
  daily_digest_timezone text null default 'Europe/Warsaw',
  daily_digest_recipient_email text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id text primary key,
  email text null,
  full_name text null,
  company_name text null,
  workspace_id uuid null,
  role text not null default 'member',
  is_admin boolean not null default false,
  appearance_skin text not null default 'classic-light',
  planning_conflict_warnings_enabled boolean not null default true,
  browser_notifications_enabled boolean not null default true,
  force_logout_after timestamptz null,
  firebase_uid text null,
  auth_uid text null,
  external_auth_uid text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  user_id text not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Additive column repair for tables that may already exist.

do $$
begin
  if pg_temp.cf_table_exists('profiles') then
    if not pg_temp.cf_column_exists('profiles', 'id') then
      execute 'alter table public.profiles add column id text null';
    end if;

    execute 'alter table public.profiles add column if not exists email text null';
    execute 'alter table public.profiles add column if not exists full_name text null';
    execute 'alter table public.profiles add column if not exists company_name text null';
    execute 'alter table public.profiles add column if not exists workspace_id uuid null';
    execute 'alter table public.profiles add column if not exists role text not null default ''member''';
    execute 'alter table public.profiles add column if not exists is_admin boolean not null default false';
    execute 'alter table public.profiles add column if not exists appearance_skin text not null default ''classic-light''';
    execute 'alter table public.profiles add column if not exists planning_conflict_warnings_enabled boolean not null default true';
    execute 'alter table public.profiles add column if not exists browser_notifications_enabled boolean not null default true';
    execute 'alter table public.profiles add column if not exists force_logout_after timestamptz null';
    execute 'alter table public.profiles add column if not exists firebase_uid text null';
    execute 'alter table public.profiles add column if not exists auth_uid text null';
    execute 'alter table public.profiles add column if not exists external_auth_uid text null';
    execute 'alter table public.profiles add column if not exists created_at timestamptz not null default now()';
    execute 'alter table public.profiles add column if not exists updated_at timestamptz not null default now()';
  end if;

  if pg_temp.cf_table_exists('workspaces') then
    execute 'alter table public.workspaces add column if not exists name text not null default ''Workspace''';
    execute 'alter table public.workspaces add column if not exists plan_id text not null default ''trial_14d''';
    execute 'alter table public.workspaces add column if not exists subscription_status text not null default ''trial_active''';
    execute 'alter table public.workspaces add column if not exists trial_ends_at timestamptz null';
    execute 'alter table public.workspaces add column if not exists timezone text not null default ''Europe/Warsaw''';
    execute 'alter table public.workspaces add column if not exists owner_user_id uuid null';
    execute 'alter table public.workspaces add column if not exists owner_id uuid null';
    execute 'alter table public.workspaces add column if not exists created_by_user_id uuid null';
    execute 'alter table public.workspaces add column if not exists billing_provider text null default ''manual''';
    execute 'alter table public.workspaces add column if not exists provider_customer_id text null';
    execute 'alter table public.workspaces add column if not exists provider_subscription_id text null';
    execute 'alter table public.workspaces add column if not exists next_billing_at timestamptz null';
    execute 'alter table public.workspaces add column if not exists cancel_at_period_end boolean not null default false';
    execute 'alter table public.workspaces add column if not exists daily_digest_enabled boolean not null default true';
    execute 'alter table public.workspaces add column if not exists daily_digest_hour integer not null default 7';
    execute 'alter table public.workspaces add column if not exists daily_digest_timezone text null default ''Europe/Warsaw''';
    execute 'alter table public.workspaces add column if not exists daily_digest_recipient_email text null';
    execute 'alter table public.workspaces add column if not exists created_at timestamptz not null default now()';
    execute 'alter table public.workspaces add column if not exists updated_at timestamptz not null default now()';
  end if;

  if pg_temp.cf_table_exists('workspace_members') then
    execute 'alter table public.workspace_members add column if not exists id uuid default gen_random_uuid()';
    execute 'alter table public.workspace_members add column if not exists workspace_id uuid null';
    execute 'alter table public.workspace_members add column if not exists user_id text null';
    execute 'alter table public.workspace_members add column if not exists role text not null default ''member''';
    execute 'alter table public.workspace_members add column if not exists created_at timestamptz not null default now()';
    execute 'alter table public.workspace_members add column if not exists updated_at timestamptz not null default now()';
  end if;
end $$;

-- 3. App tables: add workspace/context columns only when tables exist.

do $$
begin
  if pg_temp.cf_table_exists('leads') then
    execute 'alter table public.leads add column if not exists workspace_id uuid null';
    execute 'alter table public.leads add column if not exists created_by_user_id uuid null';
    execute 'alter table public.leads add column if not exists client_id uuid null';
    execute 'alter table public.leads add column if not exists linked_case_id uuid null';
    execute 'alter table public.leads add column if not exists next_action_at timestamptz null';
    execute 'alter table public.leads add column if not exists next_action_title text null';
    execute 'alter table public.leads add column if not exists next_action_item_id uuid null';
    execute 'alter table public.leads add column if not exists lead_visibility text null default ''active''';
    execute 'alter table public.leads add column if not exists sales_outcome text null default ''open''';
    execute 'alter table public.leads add column if not exists moved_to_service_at timestamptz null';
    execute 'alter table public.leads add column if not exists closed_at timestamptz null';
    execute 'alter table public.leads add column if not exists updated_at timestamptz not null default now()';
  end if;

  if pg_temp.cf_table_exists('cases') then
    execute 'alter table public.cases add column if not exists workspace_id uuid null';
    execute 'alter table public.cases add column if not exists lead_id uuid null';
    execute 'alter table public.cases add column if not exists client_id uuid null';
    execute 'alter table public.cases add column if not exists created_by_user_id uuid null';
    execute 'alter table public.cases add column if not exists title text not null default ''''';
    execute 'alter table public.cases add column if not exists client_name text null default ''''';
    execute 'alter table public.cases add column if not exists status text not null default ''in_progress''';
    execute 'alter table public.cases add column if not exists completeness_percent numeric not null default 0';
    execute 'alter table public.cases add column if not exists portal_ready boolean not null default false';
    execute 'alter table public.cases add column if not exists updated_at timestamptz not null default now()';
  end if;

  if pg_temp.cf_table_exists('work_items') then
    execute 'alter table public.work_items add column if not exists workspace_id uuid null';
    execute 'alter table public.work_items add column if not exists lead_id uuid null';
    execute 'alter table public.work_items add column if not exists case_id uuid null';
    execute 'alter table public.work_items add column if not exists created_by_user_id uuid null';
    execute 'alter table public.work_items add column if not exists updated_at timestamptz not null default now()';
  end if;

  if pg_temp.cf_table_exists('clients') then
    execute 'alter table public.clients add column if not exists workspace_id uuid null';
    execute 'alter table public.clients add column if not exists created_at timestamptz not null default now()';
    execute 'alter table public.clients add column if not exists updated_at timestamptz not null default now()';
  end if;

  if pg_temp.cf_table_exists('payments') then
    execute 'alter table public.payments add column if not exists workspace_id uuid null';
    execute 'alter table public.payments add column if not exists lead_id uuid null';
    execute 'alter table public.payments add column if not exists case_id uuid null';
    execute 'alter table public.payments add column if not exists client_id uuid null';
    execute 'alter table public.payments add column if not exists created_at timestamptz not null default now()';
    execute 'alter table public.payments add column if not exists updated_at timestamptz not null default now()';
  end if;
end $$;

-- 4. Safe indexes. Create only when the required columns exist.

do $$
begin
  if pg_temp.cf_column_exists('profiles', 'workspace_id') then
    execute 'create index if not exists idx_profiles_workspace_id on public.profiles(workspace_id)';
  end if;

  if pg_temp.cf_column_exists('workspace_members', 'workspace_id') and pg_temp.cf_column_exists('workspace_members', 'user_id') then
    execute 'create index if not exists idx_workspace_members_workspace_user on public.workspace_members(workspace_id, user_id)';
    execute 'create index if not exists idx_workspace_members_user_id on public.workspace_members(user_id)';
  end if;

  if pg_temp.cf_column_exists('workspaces', 'owner_user_id') then
    execute 'create index if not exists idx_workspaces_owner_user_id on public.workspaces(owner_user_id)';
  end if;

  if pg_temp.cf_column_exists('leads', 'workspace_id') then
    execute 'create index if not exists idx_leads_workspace_id on public.leads(workspace_id)';
  end if;

  if pg_temp.cf_column_exists('leads', 'linked_case_id') then
    execute 'create index if not exists idx_leads_linked_case_id on public.leads(linked_case_id)';
  end if;

  if pg_temp.cf_column_exists('cases', 'workspace_id') then
    execute 'create index if not exists idx_cases_workspace_id on public.cases(workspace_id)';
  end if;

  if pg_temp.cf_column_exists('work_items', 'workspace_id') then
    execute 'create index if not exists idx_work_items_workspace_id on public.work_items(workspace_id)';
  end if;

  if pg_temp.cf_column_exists('work_items', 'case_id') then
    execute 'create index if not exists idx_work_items_case_id on public.work_items(case_id)';
  end if;

  if pg_temp.cf_column_exists('clients', 'workspace_id') then
    execute 'create index if not exists idx_clients_workspace_id on public.clients(workspace_id)';
  end if;

  if pg_temp.cf_column_exists('payments', 'workspace_id') then
    execute 'create index if not exists idx_payments_workspace_id on public.payments(workspace_id)';
  end if;
end $$;

-- 5. Ensure profiles.id values exist when the id column is text/uuid.
-- This fixes the exact error: column p.id does not exist.

do $$
declare
  profile_id_type text;
begin
  if pg_temp.cf_column_exists('profiles', 'id') then
    profile_id_type := pg_temp.cf_column_udt('profiles', 'id');

    if profile_id_type in ('text', 'varchar', 'bpchar') then
      execute '
        update public.profiles
        set id = coalesce(
          nullif(trim(firebase_uid), ''''),
          nullif(trim(auth_uid), ''''),
          nullif(trim(external_auth_uid), ''''),
          nullif(trim(email), ''''),
          gen_random_uuid()::text
        ),
        updated_at = now()
        where id is null or nullif(trim(id::text), '''') is null
      ';
    elsif profile_id_type = 'uuid' then
      execute '
        update public.profiles
        set id = gen_random_uuid(),
            updated_at = now()
        where id is null
      ';
    end if;
  end if;
end $$;

-- 6. Backfill profiles.workspace_id from workspace_members.

do $$
begin
  if pg_temp.cf_column_exists('profiles', 'id')
     and pg_temp.cf_column_exists('profiles', 'workspace_id')
     and pg_temp.cf_column_exists('workspace_members', 'workspace_id')
     and pg_temp.cf_column_exists('workspace_members', 'user_id') then
    execute '
      update public.profiles p
      set workspace_id = wm.workspace_id,
          updated_at = now()
      from public.workspace_members wm
      where p.workspace_id is null
        and wm.workspace_id is not null
        and (
          p.id::text = wm.user_id::text
          or coalesce(p.firebase_uid, '''') = wm.user_id::text
          or coalesce(p.auth_uid, '''') = wm.user_id::text
          or coalesce(p.external_auth_uid, '''') = wm.user_id::text
          or lower(coalesce(p.email, '''')) = lower(wm.user_id::text)
        )
    ';
  end if;
end $$;

-- 7. Backfill profiles.workspace_id from workspace ownership columns.

do $$
begin
  if pg_temp.cf_column_exists('profiles', 'id')
     and pg_temp.cf_column_exists('profiles', 'workspace_id')
     and pg_temp.cf_table_exists('workspaces') then
    execute '
      update public.profiles p
      set workspace_id = w.id,
          updated_at = now()
      from public.workspaces w
      where p.workspace_id is null
        and (
          p.id::text = w.owner_user_id::text
          or p.id::text = w.owner_id::text
          or p.id::text = w.created_by_user_id::text
          or coalesce(p.firebase_uid, '''') = w.owner_user_id::text
          or coalesce(p.auth_uid, '''') = w.owner_user_id::text
          or coalesce(p.external_auth_uid, '''') = w.owner_user_id::text
        )
    ';
  end if;
end $$;

-- 8. Auto-create workspace for profiles still missing workspace_id.

create temporary table if not exists workspace_repair_seed (
  profile_id text not null,
  workspace_id uuid not null,
  workspace_name text not null
);

truncate table workspace_repair_seed;

insert into workspace_repair_seed(profile_id, workspace_id, workspace_name)
select
  p.id::text as profile_id,
  gen_random_uuid() as workspace_id,
  coalesce(
    nullif(trim(p.full_name), ''),
    nullif(trim(p.email), ''),
    concat('Workspace ', left(p.id::text, 8))
  ) as workspace_name
from public.profiles p
where p.workspace_id is null
  and p.id is not null;

insert into public.workspaces (
  id,
  name,
  plan_id,
  subscription_status,
  trial_ends_at,
  timezone,
  owner_user_id,
  owner_id,
  created_by_user_id,
  billing_provider,
  daily_digest_enabled,
  daily_digest_hour,
  daily_digest_timezone,
  created_at,
  updated_at
)
select
  s.workspace_id,
  s.workspace_name,
  'trial_14d',
  'trial_active',
  now() + interval '14 day',
  'Europe/Warsaw',
  case when s.profile_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then s.profile_id::uuid else null end,
  case when s.profile_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then s.profile_id::uuid else null end,
  case when s.profile_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then s.profile_id::uuid else null end,
  'manual',
  true,
  7,
  'Europe/Warsaw',
  now(),
  now()
from workspace_repair_seed s
on conflict (id) do nothing;

update public.profiles p
set workspace_id = s.workspace_id,
    updated_at = now()
from workspace_repair_seed s
where p.id::text = s.profile_id
  and p.workspace_id is null;

-- 9. Make sure every profile has workspace membership.

do $$
declare
  member_user_type text;
begin
  if pg_temp.cf_column_exists('workspace_members', 'workspace_id')
     and pg_temp.cf_column_exists('workspace_members', 'user_id')
     and pg_temp.cf_column_exists('profiles', 'workspace_id')
     and pg_temp.cf_column_exists('profiles', 'id') then
    member_user_type := pg_temp.cf_column_udt('workspace_members', 'user_id');

    if member_user_type = 'uuid' then
      execute '
        insert into public.workspace_members (workspace_id, user_id, role, created_at, updated_at)
        select
          p.workspace_id,
          p.id::uuid,
          ''owner'',
          now(),
          now()
        from public.profiles p
        where p.workspace_id is not null
          and p.id::text ~* ''^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$''
          and not exists (
            select 1
            from public.workspace_members wm
            where wm.workspace_id = p.workspace_id
              and wm.user_id::text = p.id::text
          )
      ';
    else
      execute '
        insert into public.workspace_members (workspace_id, user_id, role, created_at, updated_at)
        select
          p.workspace_id,
          p.id::text,
          ''owner'',
          now(),
          now()
        from public.profiles p
        where p.workspace_id is not null
          and p.id is not null
          and not exists (
            select 1
            from public.workspace_members wm
            where wm.workspace_id = p.workspace_id
              and wm.user_id::text = p.id::text
          )
      ';
    end if;
  end if;
end $$;

-- 10. Backfill app rows from profile/workspace links.

do $$
begin
  if pg_temp.cf_table_exists('leads')
     and pg_temp.cf_column_exists('leads', 'workspace_id')
     and pg_temp.cf_column_exists('leads', 'created_by_user_id') then
    execute '
      update public.leads l
      set workspace_id = p.workspace_id,
          updated_at = now()
      from public.profiles p
      where l.workspace_id is null
        and p.workspace_id is not null
        and (
          l.created_by_user_id::text = p.id::text
          or l.created_by_user_id::text = coalesce(p.firebase_uid, '''')
          or l.created_by_user_id::text = coalesce(p.auth_uid, '''')
          or l.created_by_user_id::text = coalesce(p.external_auth_uid, '''')
        )
    ';
  end if;

  if pg_temp.cf_table_exists('cases')
     and pg_temp.cf_table_exists('leads')
     and pg_temp.cf_column_exists('cases', 'workspace_id')
     and pg_temp.cf_column_exists('cases', 'lead_id')
     and pg_temp.cf_column_exists('leads', 'workspace_id') then
    execute '
      update public.cases c
      set workspace_id = l.workspace_id,
          updated_at = now()
      from public.leads l
      where c.workspace_id is null
        and c.lead_id = l.id
        and l.workspace_id is not null
    ';
  end if;

  if pg_temp.cf_table_exists('cases')
     and pg_temp.cf_column_exists('cases', 'workspace_id')
     and pg_temp.cf_column_exists('cases', 'created_by_user_id') then
    execute '
      update public.cases c
      set workspace_id = p.workspace_id,
          updated_at = now()
      from public.profiles p
      where c.workspace_id is null
        and p.workspace_id is not null
        and (
          c.created_by_user_id::text = p.id::text
          or c.created_by_user_id::text = coalesce(p.firebase_uid, '''')
          or c.created_by_user_id::text = coalesce(p.auth_uid, '''')
          or c.created_by_user_id::text = coalesce(p.external_auth_uid, '''')
        )
    ';
  end if;

  if pg_temp.cf_table_exists('work_items')
     and pg_temp.cf_table_exists('leads')
     and pg_temp.cf_column_exists('work_items', 'workspace_id')
     and pg_temp.cf_column_exists('work_items', 'lead_id')
     and pg_temp.cf_column_exists('leads', 'workspace_id') then
    execute '
      update public.work_items wi
      set workspace_id = l.workspace_id,
          updated_at = now()
      from public.leads l
      where wi.workspace_id is null
        and wi.lead_id = l.id
        and l.workspace_id is not null
    ';
  end if;

  if pg_temp.cf_table_exists('work_items')
     and pg_temp.cf_table_exists('cases')
     and pg_temp.cf_column_exists('work_items', 'workspace_id')
     and pg_temp.cf_column_exists('work_items', 'case_id')
     and pg_temp.cf_column_exists('cases', 'workspace_id') then
    execute '
      update public.work_items wi
      set workspace_id = c.workspace_id,
          updated_at = now()
      from public.cases c
      where wi.workspace_id is null
        and wi.case_id = c.id
        and c.workspace_id is not null
    ';
  end if;

  if pg_temp.cf_table_exists('work_items')
     and pg_temp.cf_column_exists('work_items', 'workspace_id')
     and pg_temp.cf_column_exists('work_items', 'created_by_user_id') then
    execute '
      update public.work_items wi
      set workspace_id = p.workspace_id,
          updated_at = now()
      from public.profiles p
      where wi.workspace_id is null
        and p.workspace_id is not null
        and (
          wi.created_by_user_id::text = p.id::text
          or wi.created_by_user_id::text = coalesce(p.firebase_uid, '''')
          or wi.created_by_user_id::text = coalesce(p.auth_uid, '''')
          or wi.created_by_user_id::text = coalesce(p.external_auth_uid, '''')
        )
    ';
  end if;
end $$;

-- 11. Best-effort clients and payments backfill.

do $$
begin
  if pg_temp.cf_table_exists('clients')
     and pg_temp.cf_column_exists('clients', 'workspace_id')
     and (
       pg_temp.cf_column_exists('clients', 'email')
       or pg_temp.cf_column_exists('clients', 'name')
     ) then
    if pg_temp.cf_column_exists('clients', 'email') and pg_temp.cf_column_exists('clients', 'name') then
      execute '
        update public.clients cl
        set workspace_id = p.workspace_id,
            updated_at = now()
        from public.profiles p
        where cl.workspace_id is null
          and p.workspace_id is not null
          and (
            lower(coalesce(cl.email, '''')) = lower(coalesce(p.email, ''''))
            or lower(coalesce(cl.name, '''')) = lower(coalesce(p.full_name, ''''))
          )
      ';
    elsif pg_temp.cf_column_exists('clients', 'email') then
      execute '
        update public.clients cl
        set workspace_id = p.workspace_id,
            updated_at = now()
        from public.profiles p
        where cl.workspace_id is null
          and p.workspace_id is not null
          and lower(coalesce(cl.email, '''')) = lower(coalesce(p.email, ''''))
      ';
    elsif pg_temp.cf_column_exists('clients', 'name') then
      execute '
        update public.clients cl
        set workspace_id = p.workspace_id,
            updated_at = now()
        from public.profiles p
        where cl.workspace_id is null
          and p.workspace_id is not null
          and lower(coalesce(cl.name, '''')) = lower(coalesce(p.full_name, ''''))
      ';
    end if;
  end if;

  if pg_temp.cf_table_exists('payments')
     and pg_temp.cf_table_exists('leads')
     and pg_temp.cf_column_exists('payments', 'workspace_id')
     and pg_temp.cf_column_exists('payments', 'lead_id')
     and pg_temp.cf_column_exists('leads', 'workspace_id') then
    execute '
      update public.payments p
      set workspace_id = l.workspace_id,
          updated_at = now()
      from public.leads l
      where p.workspace_id is null
        and p.lead_id = l.id
        and l.workspace_id is not null
    ';
  end if;

  if pg_temp.cf_table_exists('payments')
     and pg_temp.cf_table_exists('cases')
     and pg_temp.cf_column_exists('payments', 'workspace_id')
     and pg_temp.cf_column_exists('payments', 'case_id')
     and pg_temp.cf_column_exists('cases', 'workspace_id') then
    execute '
      update public.payments p
      set workspace_id = c.workspace_id,
          updated_at = now()
      from public.cases c
      where p.workspace_id is null
        and p.case_id = c.id
        and c.workspace_id is not null
    ';
  end if;

  if pg_temp.cf_table_exists('payments')
     and pg_temp.cf_table_exists('clients')
     and pg_temp.cf_column_exists('payments', 'workspace_id')
     and pg_temp.cf_column_exists('payments', 'client_id')
     and pg_temp.cf_column_exists('clients', 'workspace_id') then
    execute '
      update public.payments p
      set workspace_id = cl.workspace_id,
          updated_at = now()
      from public.clients cl
      where p.workspace_id is null
        and p.client_id = cl.id
        and cl.workspace_id is not null
    ';
  end if;
end $$;

-- 12. Final safety: reset orphan profile.workspace_id and rebuild once.

update public.profiles p
set workspace_id = null,
    updated_at = now()
where p.workspace_id is not null
  and not exists (
    select 1
    from public.workspaces w
    where w.id = p.workspace_id
  );

truncate table workspace_repair_seed;

insert into workspace_repair_seed(profile_id, workspace_id, workspace_name)
select
  p.id::text as profile_id,
  gen_random_uuid() as workspace_id,
  coalesce(
    nullif(trim(p.full_name), ''),
    nullif(trim(p.email), ''),
    concat('Workspace ', left(p.id::text, 8))
  ) as workspace_name
from public.profiles p
where p.workspace_id is null
  and p.id is not null;

insert into public.workspaces (
  id,
  name,
  plan_id,
  subscription_status,
  trial_ends_at,
  timezone,
  billing_provider,
  daily_digest_enabled,
  daily_digest_hour,
  daily_digest_timezone,
  created_at,
  updated_at
)
select
  s.workspace_id,
  s.workspace_name,
  'trial_14d',
  'trial_active',
  now() + interval '14 day',
  'Europe/Warsaw',
  'manual',
  true,
  7,
  'Europe/Warsaw',
  now(),
  now()
from workspace_repair_seed s
on conflict (id) do nothing;

update public.profiles p
set workspace_id = s.workspace_id,
    updated_at = now()
from workspace_repair_seed s
where p.id::text = s.profile_id
  and p.workspace_id is null;

-- 13. Diagnostics. These checks verify columns before referencing them.

create temporary table if not exists workspace_repair_summary (
  section text not null,
  metric text not null,
  value text not null
);

truncate table workspace_repair_summary;

insert into workspace_repair_summary(section, metric, value)
select
  'tables',
  table_name,
  case when to_regclass(format('public.%I', table_name)) is null then 'missing' else 'present' end
from unnest(array[
  'profiles',
  'workspaces',
  'workspace_members',
  'leads',
  'cases',
  'work_items',
  'clients',
  'payments'
]) as table_name;

insert into workspace_repair_summary(section, metric, value)
select 'columns', 'profiles.id', case when pg_temp.cf_column_exists('profiles', 'id') then 'present' else 'missing' end
union all
select 'columns', 'profiles.workspace_id', case when pg_temp.cf_column_exists('profiles', 'workspace_id') then 'present' else 'missing' end
union all
select 'columns', 'workspaces.id', case when pg_temp.cf_column_exists('workspaces', 'id') then 'present' else 'missing' end
union all
select 'columns', 'workspace_members.user_id', case when pg_temp.cf_column_exists('workspace_members', 'user_id') then 'present' else 'missing' end
union all
select 'columns', 'workspace_members.workspace_id', case when pg_temp.cf_column_exists('workspace_members', 'workspace_id') then 'present' else 'missing' end;

insert into workspace_repair_summary(section, metric, value)
select 'profiles', 'without_workspace_id', count(*)::text
from public.profiles
where workspace_id is null;

insert into workspace_repair_summary(section, metric, value)
select 'profiles', 'orphan_workspace_reference', count(*)::text
from public.profiles p
left join public.workspaces w on w.id = p.workspace_id
where p.workspace_id is not null
  and w.id is null;

do $$
begin
  if pg_temp.cf_table_exists('leads') and pg_temp.cf_column_exists('leads', 'workspace_id') then
    execute '
      insert into workspace_repair_summary(section, metric, value)
      select ''leads'', ''without_workspace_id'', count(*)::text
      from public.leads
      where workspace_id is null
    ';
  end if;

  if pg_temp.cf_table_exists('cases') and pg_temp.cf_column_exists('cases', 'workspace_id') then
    execute '
      insert into workspace_repair_summary(section, metric, value)
      select ''cases'', ''without_workspace_id'', count(*)::text
      from public.cases
      where workspace_id is null
    ';
  end if;

  if pg_temp.cf_table_exists('work_items') and pg_temp.cf_column_exists('work_items', 'workspace_id') then
    execute '
      insert into workspace_repair_summary(section, metric, value)
      select ''work_items'', ''without_workspace_id'', count(*)::text
      from public.work_items
      where workspace_id is null
    ';
  end if;

  if pg_temp.cf_table_exists('clients') and pg_temp.cf_column_exists('clients', 'workspace_id') then
    execute '
      insert into workspace_repair_summary(section, metric, value)
      select ''clients'', ''without_workspace_id'', count(*)::text
      from public.clients
      where workspace_id is null
    ';
  end if;

  if pg_temp.cf_table_exists('payments') and pg_temp.cf_column_exists('payments', 'workspace_id') then
    execute '
      insert into workspace_repair_summary(section, metric, value)
      select ''payments'', ''without_workspace_id'', count(*)::text
      from public.payments
      where workspace_id is null
    ';
  end if;
end $$;

commit;

select section, metric, value
from workspace_repair_summary
order by section, metric;
