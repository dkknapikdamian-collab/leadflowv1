-- CloseFlow Supabase workspace repair v4
-- Cel: naprawić workspace/profiles po migracji Firebase -> Supabase bez łamania FK owner_user_id.
-- Najważniejsza różnica względem v3:
-- - nie generuje ślepo owner_user_id, jeśli public.workspaces.owner_user_id wskazuje na auth.users;
-- - najpierw wykrywa, do jakiej tabeli prowadzi FK;
-- - jeśli FK prowadzi do auth.users, używa tylko istniejącego auth usera po email/id/uid;
-- - jeśli FK prowadzi do public.users albo FK nie istnieje, tworzy brakujący public.users;
-- - profile bez pasującego użytkownika są raportowane, a nie psują całej migracji.

begin;

create extension if not exists pgcrypto;

-- 1. Minimalny public.users, potrzebny tylko wtedy, gdy FK workspaces.owner_user_id prowadzi do public.users
-- albo gdy workspace nie ma FK. Jeśli w Twojej bazie FK idzie do auth.users, ta tabela nie jest używana jako źródło prawdy.
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text null,
  full_name text null,
  name text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users add column if not exists email text null;
alter table public.users add column if not exists full_name text null;
alter table public.users add column if not exists name text null;
alter table public.users add column if not exists created_at timestamptz not null default now();
alter table public.users add column if not exists updated_at timestamptz not null default now();

-- 2. Profile: nie zakładamy już starego schematu.
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text null,
  full_name text null,
  company_name text null,
  workspace_id uuid null,
  role text null default 'member',
  is_admin boolean null default false,
  firebase_uid text null,
  auth_uid text null,
  external_auth_uid text null,
  appearance_skin text null default 'classic-light',
  planning_conflict_warnings_enabled boolean null default true,
  browser_notifications_enabled boolean null default true,
  force_logout_after text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists id uuid default gen_random_uuid();
alter table public.profiles add column if not exists email text null;
alter table public.profiles add column if not exists full_name text null;
alter table public.profiles add column if not exists company_name text null;
alter table public.profiles add column if not exists workspace_id uuid null;
alter table public.profiles add column if not exists role text null default 'member';
alter table public.profiles add column if not exists is_admin boolean null default false;
alter table public.profiles add column if not exists firebase_uid text null;
alter table public.profiles add column if not exists auth_uid text null;
alter table public.profiles add column if not exists external_auth_uid text null;
alter table public.profiles add column if not exists appearance_skin text null default 'classic-light';
alter table public.profiles add column if not exists planning_conflict_warnings_enabled boolean null default true;
alter table public.profiles add column if not exists browser_notifications_enabled boolean null default true;
alter table public.profiles add column if not exists force_logout_after text null;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- 3. Workspace i membership.
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.users(id),
  name text not null default 'Workspace',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  timezone text not null default 'Europe/Warsaw',
  plan_id text not null default 'trial_14d',
  subscription_status text not null default 'trial_active',
  trial_ends_at timestamptz null,
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
  daily_digest_recipient_email text null
);

alter table public.workspaces add column if not exists owner_user_id uuid;
alter table public.workspaces add column if not exists name text not null default 'Workspace';
alter table public.workspaces add column if not exists created_at timestamptz not null default now();
alter table public.workspaces add column if not exists updated_at timestamptz not null default now();
alter table public.workspaces add column if not exists timezone text not null default 'Europe/Warsaw';
alter table public.workspaces add column if not exists plan_id text not null default 'trial_14d';
alter table public.workspaces add column if not exists subscription_status text not null default 'trial_active';
alter table public.workspaces add column if not exists trial_ends_at timestamptz null;
alter table public.workspaces add column if not exists owner_id uuid null;
alter table public.workspaces add column if not exists created_by_user_id uuid null;
alter table public.workspaces add column if not exists billing_provider text null default 'manual';
alter table public.workspaces add column if not exists provider_customer_id text null;
alter table public.workspaces add column if not exists provider_subscription_id text null;
alter table public.workspaces add column if not exists next_billing_at timestamptz null;
alter table public.workspaces add column if not exists cancel_at_period_end boolean not null default false;
alter table public.workspaces add column if not exists daily_digest_enabled boolean not null default true;
alter table public.workspaces add column if not exists daily_digest_hour integer not null default 7;
alter table public.workspaces add column if not exists daily_digest_timezone text null default 'Europe/Warsaw';
alter table public.workspaces add column if not exists daily_digest_recipient_email text null;

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  user_id text not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workspace_members add column if not exists workspace_id uuid;
alter table public.workspace_members add column if not exists user_id text;
alter table public.workspace_members add column if not exists role text not null default 'member';
alter table public.workspace_members add column if not exists created_at timestamptz not null default now();
alter table public.workspace_members add column if not exists updated_at timestamptz not null default now();

-- 4. Docelowe tabele produktowe: tylko dodanie brakujących kolumn, bez niszczenia danych.
do $$
begin
  if to_regclass('public.leads') is not null then
    execute 'alter table public.leads add column if not exists workspace_id uuid null';
    execute 'alter table public.leads add column if not exists created_by_user_id uuid null';
    execute 'alter table public.leads add column if not exists updated_at timestamptz not null default now()';
  end if;

  if to_regclass('public.cases') is not null then
    execute 'alter table public.cases add column if not exists workspace_id uuid null';
    execute 'alter table public.cases add column if not exists lead_id uuid null';
    execute 'alter table public.cases add column if not exists created_by_user_id uuid null';
    execute 'alter table public.cases add column if not exists updated_at timestamptz not null default now()';
  end if;

  if to_regclass('public.work_items') is not null then
    execute 'alter table public.work_items add column if not exists workspace_id uuid null';
    execute 'alter table public.work_items add column if not exists lead_id uuid null';
    execute 'alter table public.work_items add column if not exists case_id uuid null';
    execute 'alter table public.work_items add column if not exists created_by_user_id uuid null';
    execute 'alter table public.work_items add column if not exists updated_at timestamptz not null default now()';
  end if;

  if to_regclass('public.clients') is not null then
    execute 'alter table public.clients add column if not exists workspace_id uuid null';
    execute 'alter table public.clients add column if not exists created_at timestamptz not null default now()';
    execute 'alter table public.clients add column if not exists updated_at timestamptz not null default now()';
  end if;

  if to_regclass('public.payments') is not null then
    execute 'alter table public.payments add column if not exists workspace_id uuid null';
    execute 'alter table public.payments add column if not exists lead_id uuid null';
    execute 'alter table public.payments add column if not exists case_id uuid null';
    execute 'alter table public.payments add column if not exists client_id uuid null';
    execute 'alter table public.payments add column if not exists created_at timestamptz not null default now()';
    execute 'alter table public.payments add column if not exists updated_at timestamptz not null default now()';
  end if;
end $$;

-- 5. Wykrycie prawdziwego celu FK workspaces.owner_user_id.
create temporary table workspace_owner_fk_target (
  table_schema text not null,
  table_name text not null,
  column_name text not null
) on commit drop;

insert into workspace_owner_fk_target(table_schema, table_name, column_name)
select
  ccu.table_schema,
  ccu.table_name,
  ccu.column_name
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_schema = kcu.constraint_schema
 and tc.constraint_name = kcu.constraint_name
join information_schema.constraint_column_usage ccu
  on tc.constraint_schema = ccu.constraint_schema
 and tc.constraint_name = ccu.constraint_name
where tc.constraint_type = 'FOREIGN KEY'
  and kcu.table_schema = 'public'
  and kcu.table_name = 'workspaces'
  and kcu.column_name = 'owner_user_id'
limit 1;

-- Jeśli nie ma FK, używamy public.users jako bezpiecznego lokalnego targetu.
insert into workspace_owner_fk_target(table_schema, table_name, column_name)
select 'public', 'users', 'id'
where not exists (select 1 from workspace_owner_fk_target);

-- 6. Orphan workspace_id w profilach cofamy do null, żeby odbudować link.
update public.profiles p
set workspace_id = null,
    updated_at = now()
where p.workspace_id is not null
  and not exists (
    select 1
    from public.workspaces w
    where w.id = p.workspace_id
  );

-- 7. Seed naprawczy. profile_row_id używa ctid tylko w obrębie tej transakcji.
create temporary table workspace_repair_seed (
  profile_row_id text not null,
  profile_id_text text null,
  email text null,
  full_name text null,
  owner_user_id uuid null,
  workspace_id uuid not null default gen_random_uuid(),
  workspace_name text not null,
  owner_resolution text not null default 'unresolved'
) on commit drop;

do $$
declare
  fk record;
  target_has_email boolean;
  target_exists boolean;
begin
  select * into fk from workspace_owner_fk_target limit 1;

  select to_regclass(format('%I.%I', fk.table_schema, fk.table_name)) is not null
  into target_exists;

  if not target_exists then
    raise exception 'WORKSPACE_OWNER_FK_TARGET_NOT_FOUND: %.%', fk.table_schema, fk.table_name;
  end if;

  select exists (
    select 1
    from information_schema.columns
    where table_schema = fk.table_schema
      and table_name = fk.table_name
      and column_name = 'email'
  ) into target_has_email;

  if target_has_email then
    execute format($sql$
      insert into workspace_repair_seed (
        profile_row_id,
        profile_id_text,
        email,
        full_name,
        owner_user_id,
        workspace_id,
        workspace_name,
        owner_resolution
      )
      select
        p.ctid::text as profile_row_id,
        p.id::text as profile_id_text,
        nullif(trim(coalesce(p.email::text, '')), '') as email,
        nullif(trim(coalesce(p.full_name::text, '')), '') as full_name,
        coalesce(
          u_email.%1$I,
          u_id.%1$I,
          u_firebase.%1$I,
          u_auth.%1$I,
          u_external.%1$I
        )::uuid as owner_user_id,
        gen_random_uuid() as workspace_id,
        coalesce(
          nullif(trim(coalesce(p.full_name::text, '')), ''),
          nullif(trim(coalesce(p.email::text, '')), ''),
          concat('Workspace ', left(coalesce(p.id::text, gen_random_uuid()::text), 8))
        ) as workspace_name,
        case
          when u_email.%1$I is not null then 'matched_by_email'
          when u_id.%1$I is not null then 'matched_by_profile_id'
          when u_firebase.%1$I is not null then 'matched_by_firebase_uid'
          when u_auth.%1$I is not null then 'matched_by_auth_uid'
          when u_external.%1$I is not null then 'matched_by_external_auth_uid'
          else 'unresolved'
        end as owner_resolution
      from public.profiles p
      left join %2$I.%3$I u_email
        on lower(coalesce(u_email.email::text, '')) = lower(coalesce(p.email::text, ''))
       and nullif(trim(coalesce(p.email::text, '')), '') is not null
      left join %2$I.%3$I u_id
        on u_id.%1$I::text = p.id::text
      left join %2$I.%3$I u_firebase
        on u_firebase.%1$I::text = p.firebase_uid::text
      left join %2$I.%3$I u_auth
        on u_auth.%1$I::text = p.auth_uid::text
      left join %2$I.%3$I u_external
        on u_external.%1$I::text = p.external_auth_uid::text
      where p.workspace_id is null
    $sql$, fk.column_name, fk.table_schema, fk.table_name);
  else
    execute format($sql$
      insert into workspace_repair_seed (
        profile_row_id,
        profile_id_text,
        email,
        full_name,
        owner_user_id,
        workspace_id,
        workspace_name,
        owner_resolution
      )
      select
        p.ctid::text as profile_row_id,
        p.id::text as profile_id_text,
        nullif(trim(coalesce(p.email::text, '')), '') as email,
        nullif(trim(coalesce(p.full_name::text, '')), '') as full_name,
        coalesce(
          u_id.%1$I,
          u_firebase.%1$I,
          u_auth.%1$I,
          u_external.%1$I
        )::uuid as owner_user_id,
        gen_random_uuid() as workspace_id,
        coalesce(
          nullif(trim(coalesce(p.full_name::text, '')), ''),
          nullif(trim(coalesce(p.email::text, '')), ''),
          concat('Workspace ', left(coalesce(p.id::text, gen_random_uuid()::text), 8))
        ) as workspace_name,
        case
          when u_id.%1$I is not null then 'matched_by_profile_id'
          when u_firebase.%1$I is not null then 'matched_by_firebase_uid'
          when u_auth.%1$I is not null then 'matched_by_auth_uid'
          when u_external.%1$I is not null then 'matched_by_external_auth_uid'
          else 'unresolved'
        end as owner_resolution
      from public.profiles p
      left join %2$I.%3$I u_id
        on u_id.%1$I::text = p.id::text
      left join %2$I.%3$I u_firebase
        on u_firebase.%1$I::text = p.firebase_uid::text
      left join %2$I.%3$I u_auth
        on u_auth.%1$I::text = p.auth_uid::text
      left join %2$I.%3$I u_external
        on u_external.%1$I::text = p.external_auth_uid::text
      where p.workspace_id is null
    $sql$, fk.column_name, fk.table_schema, fk.table_name);
  end if;

  -- Jeżeli FK prowadzi do public.users, możemy bezpiecznie utworzyć technicznego usera.
  -- Jeżeli FK prowadzi do auth.users, NIE tworzymy fałszywych auth users.
  if fk.table_schema = 'public' and fk.table_name = 'users' then
    update workspace_repair_seed
    set owner_user_id = gen_random_uuid(),
        owner_resolution = 'created_public_user'
    where owner_user_id is null;

    insert into public.users (
      id,
      email,
      full_name,
      name,
      created_at,
      updated_at
    )
    select distinct
      s.owner_user_id,
      coalesce(nullif(trim(s.email), ''), concat(s.owner_user_id::text, '@local.closeflow')),
      coalesce(nullif(trim(s.full_name), ''), nullif(trim(s.email), ''), 'Użytkownik CloseFlow'),
      coalesce(nullif(trim(s.full_name), ''), nullif(trim(s.email), ''), 'Użytkownik CloseFlow'),
      now(),
      now()
    from workspace_repair_seed s
    where s.owner_user_id is not null
    on conflict (id) do nothing;
  end if;
end $$;

-- 8. Tworzymy workspace tylko tam, gdzie owner_user_id jest pewny i istnieje w target FK.
insert into public.workspaces (
  id,
  owner_user_id,
  name,
  plan_id,
  subscription_status,
  trial_ends_at,
  timezone,
  owner_id,
  created_by_user_id,
  billing_provider,
  provider_customer_id,
  provider_subscription_id,
  next_billing_at,
  cancel_at_period_end,
  daily_digest_enabled,
  daily_digest_hour,
  daily_digest_timezone,
  daily_digest_recipient_email,
  created_at,
  updated_at
)
select
  s.workspace_id,
  s.owner_user_id,
  s.workspace_name,
  'trial_14d',
  'trial_active',
  now() + interval '14 day',
  'Europe/Warsaw',
  s.owner_user_id,
  s.owner_user_id,
  'manual',
  null,
  null,
  null,
  false,
  true,
  7,
  'Europe/Warsaw',
  s.email,
  now(),
  now()
from workspace_repair_seed s
where s.owner_user_id is not null
on conflict (id) do nothing;

-- 9. Podpinamy profile do utworzonych workspace.
update public.profiles p
set workspace_id = s.workspace_id,
    updated_at = now()
from workspace_repair_seed s
where p.ctid::text = s.profile_row_id
  and p.workspace_id is null
  and s.owner_user_id is not null
  and exists (
    select 1
    from public.workspaces w
    where w.id = s.workspace_id
  );

-- 10. Membership, z obsługą user_id jako text lub uuid.
do $$
declare
  user_id_udt text;
begin
  select udt_name
  into user_id_udt
  from information_schema.columns
  where table_schema = 'public'
    and table_name = 'workspace_members'
    and column_name = 'user_id'
  limit 1;

  if user_id_udt = 'uuid' then
    execute '
      insert into public.workspace_members (workspace_id, user_id, role, created_at, updated_at)
      select distinct
        p.workspace_id,
        s.owner_user_id,
        ''owner'',
        now(),
        now()
      from public.profiles p
      join workspace_repair_seed s on p.ctid::text = s.profile_row_id
      where p.workspace_id is not null
        and s.owner_user_id is not null
        and not exists (
          select 1
          from public.workspace_members wm
          where wm.workspace_id = p.workspace_id
            and wm.user_id::text = s.owner_user_id::text
        )
    ';
  else
    execute '
      insert into public.workspace_members (workspace_id, user_id, role, created_at, updated_at)
      select distinct
        p.workspace_id,
        s.owner_user_id::text,
        ''owner'',
        now(),
        now()
      from public.profiles p
      join workspace_repair_seed s on p.ctid::text = s.profile_row_id
      where p.workspace_id is not null
        and s.owner_user_id is not null
        and not exists (
          select 1
          from public.workspace_members wm
          where wm.workspace_id = p.workspace_id
            and wm.user_id::text = s.owner_user_id::text
        )
    ';
  end if;
end $$;

-- 11. Backfill workspace_id do danych produktowych tam, gdzie da się to zrobić po created_by_user_id.
do $$
begin
  if to_regclass('public.leads') is not null then
    execute '
      update public.leads l
      set workspace_id = p.workspace_id,
          updated_at = now()
      from public.profiles p
      where l.workspace_id is null
        and p.workspace_id is not null
        and (
          l.created_by_user_id::text = p.id::text
          or l.created_by_user_id::text = coalesce(p.firebase_uid::text, '''')
          or l.created_by_user_id::text = coalesce(p.auth_uid::text, '''')
          or l.created_by_user_id::text = coalesce(p.external_auth_uid::text, '''')
        )
    ';
  end if;

  if to_regclass('public.cases') is not null and to_regclass('public.leads') is not null then
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

  if to_regclass('public.cases') is not null then
    execute '
      update public.cases c
      set workspace_id = p.workspace_id,
          updated_at = now()
      from public.profiles p
      where c.workspace_id is null
        and p.workspace_id is not null
        and (
          c.created_by_user_id::text = p.id::text
          or c.created_by_user_id::text = coalesce(p.firebase_uid::text, '''')
          or c.created_by_user_id::text = coalesce(p.auth_uid::text, '''')
          or c.created_by_user_id::text = coalesce(p.external_auth_uid::text, '''')
        )
    ';
  end if;

  if to_regclass('public.work_items') is not null and to_regclass('public.leads') is not null then
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

  if to_regclass('public.work_items') is not null and to_regclass('public.cases') is not null then
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

  if to_regclass('public.work_items') is not null then
    execute '
      update public.work_items wi
      set workspace_id = p.workspace_id,
          updated_at = now()
      from public.profiles p
      where wi.workspace_id is null
        and p.workspace_id is not null
        and (
          wi.created_by_user_id::text = p.id::text
          or wi.created_by_user_id::text = coalesce(p.firebase_uid::text, '''')
          or wi.created_by_user_id::text = coalesce(p.auth_uid::text, '''')
          or wi.created_by_user_id::text = coalesce(p.external_auth_uid::text, '''')
        )
    ';
  end if;

  if to_regclass('public.clients') is not null then
    execute '
      update public.clients cl
      set workspace_id = p.workspace_id,
          updated_at = now()
      from public.profiles p
      where cl.workspace_id is null
        and p.workspace_id is not null
        and (
          lower(coalesce(cl.email::text, '''')) = lower(coalesce(p.email::text, ''''))
          or lower(coalesce(cl.name::text, '''')) = lower(coalesce(p.full_name::text, ''''))
        )
    ';
  end if;

  if to_regclass('public.payments') is not null and to_regclass('public.leads') is not null then
    execute '
      update public.payments pay
      set workspace_id = l.workspace_id,
          updated_at = now()
      from public.leads l
      where pay.workspace_id is null
        and pay.lead_id = l.id
        and l.workspace_id is not null
    ';
  end if;

  if to_regclass('public.payments') is not null and to_regclass('public.cases') is not null then
    execute '
      update public.payments pay
      set workspace_id = c.workspace_id,
          updated_at = now()
      from public.cases c
      where pay.workspace_id is null
        and pay.case_id = c.id
        and c.workspace_id is not null
    ';
  end if;

  if to_regclass('public.payments') is not null and to_regclass('public.clients') is not null then
    execute '
      update public.payments pay
      set workspace_id = cl.workspace_id,
          updated_at = now()
      from public.clients cl
      where pay.workspace_id is null
        and pay.client_id = cl.id
        and cl.workspace_id is not null
    ';
  end if;
end $$;

-- 12. Indeksy.
create index if not exists idx_profiles_workspace_id on public.profiles(workspace_id);
create index if not exists idx_workspaces_owner_user_id on public.workspaces(owner_user_id);
create index if not exists idx_workspace_members_workspace_user on public.workspace_members(workspace_id, user_id);

do $$
begin
  if to_regclass('public.leads') is not null then
    execute 'create index if not exists idx_leads_workspace_id on public.leads(workspace_id)';
  end if;
  if to_regclass('public.cases') is not null then
    execute 'create index if not exists idx_cases_workspace_id on public.cases(workspace_id)';
  end if;
  if to_regclass('public.work_items') is not null then
    execute 'create index if not exists idx_work_items_workspace_id on public.work_items(workspace_id)';
  end if;
  if to_regclass('public.clients') is not null then
    execute 'create index if not exists idx_clients_workspace_id on public.clients(workspace_id)';
  end if;
  if to_regclass('public.payments') is not null then
    execute 'create index if not exists idx_payments_workspace_id on public.payments(workspace_id)';
  end if;
end $$;

-- 13. Diagnostyka końcowa.
create temporary table workspace_repair_summary (
  section text not null,
  metric text not null,
  value text not null
) on commit drop;

insert into workspace_repair_summary(section, metric, value)
select 'fk', 'workspaces.owner_user_id_target',
       table_schema || '.' || table_name || '.' || column_name
from workspace_owner_fk_target
limit 1;

insert into workspace_repair_summary(section, metric, value)
select 'profiles', 'without_workspace_id', count(*)::text
from public.profiles
where workspace_id is null;

insert into workspace_repair_summary(section, metric, value)
select 'profiles', 'unresolved_owner_user_match', count(*)::text
from workspace_repair_seed
where owner_user_id is null;

insert into workspace_repair_summary(section, metric, value)
select 'profiles', 'created_or_repaired_this_run', count(*)::text
from workspace_repair_seed
where owner_user_id is not null;

insert into workspace_repair_summary(section, metric, value)
select 'workspaces', 'total', count(*)::text
from public.workspaces;

insert into workspace_repair_summary(section, metric, value)
select 'workspace_members', 'total', count(*)::text
from public.workspace_members;

do $$
begin
  if to_regclass('public.leads') is not null then
    execute '
      insert into workspace_repair_summary(section, metric, value)
      select ''leads'', ''without_workspace_id'', count(*)::text
      from public.leads
      where workspace_id is null
    ';
  end if;

  if to_regclass('public.cases') is not null then
    execute '
      insert into workspace_repair_summary(section, metric, value)
      select ''cases'', ''without_workspace_id'', count(*)::text
      from public.cases
      where workspace_id is null
    ';
  end if;

  if to_regclass('public.work_items') is not null then
    execute '
      insert into workspace_repair_summary(section, metric, value)
      select ''work_items'', ''without_workspace_id'', count(*)::text
      from public.work_items
      where workspace_id is null
    ';
  end if;

  if to_regclass('public.clients') is not null then
    execute '
      insert into workspace_repair_summary(section, metric, value)
      select ''clients'', ''without_workspace_id'', count(*)::text
      from public.clients
      where workspace_id is null
    ';
  end if;

  if to_regclass('public.payments') is not null then
    execute '
      insert into workspace_repair_summary(section, metric, value)
      select ''payments'', ''without_workspace_id'', count(*)::text
      from public.payments
      where workspace_id is null
    ';
  end if;
end $$;

select section, metric, value
from workspace_repair_summary
order by section, metric;

-- Jeśli unresolved_owner_user_match > 0 i FK target to auth.users,
-- oznacza to profile bez odpowiadającego użytkownika w auth.users. Tych nie wolno podpinać do losowego UUID.

commit;
