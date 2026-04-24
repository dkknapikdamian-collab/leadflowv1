-- CloseFlow / LeadFlowV1
-- Workspace context repair v5 FK-safe.
-- Run in Supabase SQL Editor as one query.
-- Fixes live schema where workspaces.owner_user_id has FK to public.users(id).

begin;

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text null,
  full_name text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references public.users(id),
  name text not null default 'Workspace',
  plan_id text not null default 'trial_14d',
  subscription_status text not null default 'trial_active',
  trial_ends_at timestamptz null,
  timezone text not null default 'Europe/Warsaw',
  owner_id uuid null,
  created_by_user_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id text primary key,
  email text null,
  full_name text null,
  workspace_id uuid null,
  firebase_uid text null,
  auth_uid text null,
  external_auth_uid text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id text not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users add column if not exists email text null;
alter table public.users add column if not exists full_name text null;
alter table public.users add column if not exists created_at timestamptz not null default now();
alter table public.users add column if not exists updated_at timestamptz not null default now();

alter table public.profiles add column if not exists id text;
alter table public.profiles add column if not exists email text null;
alter table public.profiles add column if not exists full_name text null;
alter table public.profiles add column if not exists workspace_id uuid null;
alter table public.profiles add column if not exists firebase_uid text null;
alter table public.profiles add column if not exists auth_uid text null;
alter table public.profiles add column if not exists external_auth_uid text null;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

alter table public.workspaces add column if not exists name text not null default 'Workspace';
alter table public.workspaces add column if not exists plan_id text not null default 'trial_14d';
alter table public.workspaces add column if not exists subscription_status text not null default 'trial_active';
alter table public.workspaces add column if not exists trial_ends_at timestamptz null;
alter table public.workspaces add column if not exists timezone text not null default 'Europe/Warsaw';
alter table public.workspaces add column if not exists owner_id uuid null;
alter table public.workspaces add column if not exists created_by_user_id uuid null;
alter table public.workspaces add column if not exists created_at timestamptz not null default now();
alter table public.workspaces add column if not exists updated_at timestamptz not null default now();

update public.profiles
set id = coalesce(nullif(trim(id::text), ''), nullif(trim(firebase_uid), ''), nullif(trim(auth_uid), ''), nullif(trim(external_auth_uid), ''), nullif(trim(email), ''), gen_random_uuid()::text),
    updated_at = now()
where nullif(trim(coalesce(id::text, '')), '') is null;

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

-- Build profile identity seed.
drop table if exists pg_temp.cf_profile_seed;
create temporary table cf_profile_seed as
select
  p.id::text as profile_id,
  nullif(trim(p.email), '') as email,
  nullif(trim(p.full_name), '') as full_name,
  p.workspace_id,
  case
    when p.id::text ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then p.id::uuid
    when p.firebase_uid ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then p.firebase_uid::uuid
    when p.auth_uid ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then p.auth_uid::uuid
    when p.external_auth_uid ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' then p.external_auth_uid::uuid
    else null
  end as profile_uuid_candidate
from public.profiles p;

-- Create missing public.users rows. This is the FK safety gate.
do $$
declare
  unknown_required_count integer := 0;
begin
  select count(*) into unknown_required_count
  from information_schema.columns c
  where c.table_schema = 'public'
    and c.table_name = 'users'
    and c.is_nullable = 'NO'
    and c.column_default is null
    and c.column_name not in ('id', 'email', 'full_name', 'name', 'created_at', 'updated_at');

  if unknown_required_count = 0 then
    insert into public.users (id, email, full_name, created_at, updated_at)
    select
      coalesce(s.profile_uuid_candidate, gen_random_uuid()),
      s.email,
      s.full_name,
      now(),
      now()
    from cf_profile_seed s
    where not exists (
      select 1 from public.users u
      where (s.profile_uuid_candidate is not null and u.id = s.profile_uuid_candidate)
         or (s.email is not null and lower(coalesce(u.email, '')) = lower(s.email))
    )
    on conflict (id) do nothing;
  end if;
end $$;

-- Rebuild final map after public.users insert.
drop table if exists pg_temp.cf_profile_owner_map;
create temporary table cf_profile_owner_map as
select
  s.profile_id,
  s.email,
  s.full_name,
  s.workspace_id,
  coalesce(u_by_id.id, u_by_email.id) as owner_user_id,
  coalesce(nullif(trim(s.full_name), ''), nullif(trim(s.email), ''), concat('Workspace ', left(s.profile_id, 8))) as workspace_name
from cf_profile_seed s
left join public.users u_by_id
  on s.profile_uuid_candidate is not null and u_by_id.id = s.profile_uuid_candidate
left join public.users u_by_email
  on s.email is not null and lower(coalesce(u_by_email.email, '')) = lower(s.email);

-- Backfill profiles.workspace_id from membership and ownership.
update public.profiles p
set workspace_id = wm.workspace_id,
    updated_at = now()
from public.workspace_members wm
where p.workspace_id is null
  and wm.workspace_id is not null
  and (p.id::text = wm.user_id::text or coalesce(p.firebase_uid, '') = wm.user_id::text or coalesce(p.auth_uid, '') = wm.user_id::text or coalesce(p.external_auth_uid, '') = wm.user_id::text);

update public.profiles p
set workspace_id = w.id,
    updated_at = now()
from public.workspaces w
join cf_profile_owner_map m on m.owner_user_id = w.owner_user_id
where p.workspace_id is null
  and p.id::text = m.profile_id;

-- Create missing workspaces only for resolved public.users owners.
drop table if exists pg_temp.cf_workspace_seed;
create temporary table cf_workspace_seed as
select
  p.id::text as profile_id,
  gen_random_uuid() as workspace_id,
  m.owner_user_id,
  m.workspace_name
from public.profiles p
join cf_profile_owner_map m on m.profile_id = p.id::text
where p.workspace_id is null
  and m.owner_user_id is not null;

insert into public.workspaces (id, owner_user_id, name, plan_id, subscription_status, trial_ends_at, timezone, owner_id, created_by_user_id, created_at, updated_at)
select workspace_id, owner_user_id, workspace_name, 'trial_14d', 'trial_active', now() + interval '14 day', 'Europe/Warsaw', owner_user_id, owner_user_id, now(), now()
from cf_workspace_seed
on conflict (id) do nothing;

update public.profiles p
set workspace_id = s.workspace_id,
    updated_at = now()
from cf_workspace_seed s
where p.id::text = s.profile_id
  and p.workspace_id is null;

update public.workspaces
set owner_id = coalesce(owner_id, owner_user_id),
    created_by_user_id = coalesce(created_by_user_id, owner_user_id),
    updated_at = now()
where owner_user_id is not null
  and (owner_id is null or created_by_user_id is null);

insert into public.workspace_members (workspace_id, user_id, role, created_at, updated_at)
select p.workspace_id, coalesce(m.owner_user_id::text, p.id::text), 'owner', now(), now()
from public.profiles p
left join cf_profile_owner_map m on m.profile_id = p.id::text
where p.workspace_id is not null
  and not exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = p.workspace_id
      and wm.user_id::text = coalesce(m.owner_user_id::text, p.id::text)
  );

-- Backfill main business tables where possible.
do $$
begin
  if to_regclass('public.leads') is not null then
    execute 'update public.leads l set workspace_id = p.workspace_id, updated_at = now() from public.profiles p where l.workspace_id is null and p.workspace_id is not null and (l.created_by_user_id::text = p.id::text or l.created_by_user_id::text = coalesce(p.firebase_uid, '''') or l.created_by_user_id::text = coalesce(p.auth_uid, '''') or l.created_by_user_id::text = coalesce(p.external_auth_uid, ''''))';
  end if;
  if to_regclass('public.cases') is not null and to_regclass('public.leads') is not null then
    execute 'update public.cases c set workspace_id = l.workspace_id, updated_at = now() from public.leads l where c.workspace_id is null and c.lead_id = l.id and l.workspace_id is not null';
  end if;
  if to_regclass('public.work_items') is not null and to_regclass('public.leads') is not null then
    execute 'update public.work_items wi set workspace_id = l.workspace_id, updated_at = now() from public.leads l where wi.workspace_id is null and wi.lead_id = l.id and l.workspace_id is not null';
  end if;
  if to_regclass('public.work_items') is not null and to_regclass('public.cases') is not null then
    execute 'update public.work_items wi set workspace_id = c.workspace_id, updated_at = now() from public.cases c where wi.workspace_id is null and wi.case_id = c.id and c.workspace_id is not null';
  end if;
  if to_regclass('public.clients') is not null then
    execute 'update public.clients cl set workspace_id = p.workspace_id, updated_at = now() from public.profiles p where cl.workspace_id is null and p.workspace_id is not null and (lower(coalesce(cl.email, '''')) = lower(coalesce(p.email, '''')) or lower(coalesce(cl.name, '''')) = lower(coalesce(p.full_name, '''')))';
  end if;
end $$;

create index if not exists idx_profiles_workspace_id on public.profiles(workspace_id);
create index if not exists idx_users_email_lower on public.users(lower(email));
create index if not exists idx_workspaces_owner_user_id on public.workspaces(owner_user_id);
create index if not exists idx_workspace_members_workspace_user on public.workspace_members(workspace_id, user_id);

create temporary table cf_repair_summary(section text not null, metric text not null, value text not null);
insert into cf_repair_summary select 'counts', 'users', count(*)::text from public.users;
insert into cf_repair_summary select 'counts', 'profiles', count(*)::text from public.profiles;
insert into cf_repair_summary select 'counts', 'workspaces', count(*)::text from public.workspaces;
insert into cf_repair_summary select 'counts', 'workspace_members', count(*)::text from public.workspace_members;
insert into cf_repair_summary select 'profiles', 'without_workspace_id', count(*)::text from public.profiles where workspace_id is null;
insert into cf_repair_summary select 'profiles', 'unresolved_owner_user_match', count(*)::text from cf_profile_owner_map m left join public.profiles p on p.id::text = m.profile_id where p.workspace_id is null and m.owner_user_id is null;
insert into cf_repair_summary select 'workspaces', 'owner_user_without_public_user', count(*)::text from public.workspaces w left join public.users u on u.id = w.owner_user_id where u.id is null;
insert into cf_repair_summary select 'profiles', 'orphan_workspace_reference', count(*)::text from public.profiles p left join public.workspaces w on w.id = p.workspace_id where p.workspace_id is not null and w.id is null;

select section, metric, value
from cf_repair_summary
order by section, metric;

commit;
