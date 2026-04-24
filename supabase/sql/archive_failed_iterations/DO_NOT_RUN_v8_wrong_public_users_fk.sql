-- CloseFlow / LeadFlowV1
-- Workspace context repair v8 — public.users FK safe.
-- Run in Supabase SQL Editor as one query.
-- Fixes: workspaces.owner_user_id must exist in public.users(id).

begin;

create extension if not exists pgcrypto;

-- Base tables / additive only.
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

-- Make profile id usable even if old table existed without a real id value.
update public.profiles
set id = coalesce(
      nullif(trim(id::text), ''),
      nullif(trim(firebase_uid), ''),
      nullif(trim(auth_uid), ''),
      nullif(trim(external_auth_uid), ''),
      nullif(trim(email), ''),
      gen_random_uuid()::text
    ),
    updated_at = now()
where nullif(trim(coalesce(id::text, '')), '') is null;

-- Compatibility columns on business tables.
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

-- Build deterministic owner seed.
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
  end as uuid_candidate,
  coalesce(nullif(trim(p.full_name), ''), nullif(trim(p.email), ''), concat('Workspace ', left(p.id::text, 8))) as workspace_name
from public.profiles p;

-- Choose exact public.users.id that will be used as workspaces.owner_user_id.
drop table if exists pg_temp.cf_owner_plan;
create temporary table cf_owner_plan as
select
  s.profile_id,
  s.email,
  s.full_name,
  s.workspace_id,
  coalesce(u_by_email.id, u_by_uuid.id, s.uuid_candidate, gen_random_uuid()) as planned_user_id,
  s.workspace_name
from cf_profile_seed s
left join public.users u_by_email
  on s.email is not null and lower(coalesce(u_by_email.email, '')) = lower(s.email)
left join public.users u_by_uuid
  on s.uuid_candidate is not null and u_by_uuid.id = s.uuid_candidate;

-- Create missing public.users. If this fails, public.users has extra required columns and we need schema_probe output.
insert into public.users (id, email, full_name, created_at, updated_at)
select distinct on (planned_user_id)
  planned_user_id,
  email,
  full_name,
  now(),
  now()
from cf_owner_plan p
where not exists (select 1 from public.users u where u.id = p.planned_user_id)
on conflict (id) do nothing;

-- Fill empty user metadata, without overwriting existing values.
update public.users u
set email = coalesce(nullif(trim(u.email), ''), p.email),
    full_name = coalesce(nullif(trim(u.full_name), ''), p.full_name),
    updated_at = now()
from cf_owner_plan p
where u.id = p.planned_user_id;

-- Final verified owner map: only owners that actually exist in public.users.
drop table if exists pg_temp.cf_owner_map;
create temporary table cf_owner_map as
select
  p.profile_id,
  p.email,
  p.full_name,
  p.workspace_id,
  u.id as owner_user_id,
  p.workspace_name
from cf_owner_plan p
join public.users u on u.id = p.planned_user_id;

-- Existing workspace from membership.
update public.profiles p
set workspace_id = wm.workspace_id,
    updated_at = now()
from public.workspace_members wm
where p.workspace_id is null
  and wm.workspace_id is not null
  and (
    p.id::text = wm.user_id::text
    or coalesce(p.firebase_uid, '') = wm.user_id::text
    or coalesce(p.auth_uid, '') = wm.user_id::text
    or coalesce(p.external_auth_uid, '') = wm.user_id::text
    or exists (
      select 1
      from cf_owner_map m
      where m.profile_id = p.id::text
        and m.owner_user_id::text = wm.user_id::text
    )
  );

-- Existing workspace from ownership.
update public.profiles p
set workspace_id = w.id,
    updated_at = now()
from cf_owner_map m
join public.workspaces w on w.owner_user_id = m.owner_user_id
where p.workspace_id is null
  and p.id::text = m.profile_id;

-- Create missing workspaces. owner_user_id is guaranteed to exist in public.users by cf_owner_map.
drop table if exists pg_temp.cf_workspace_seed;
create temporary table cf_workspace_seed as
select
  p.id::text as profile_id,
  gen_random_uuid() as workspace_id,
  m.owner_user_id,
  m.workspace_name
from public.profiles p
join cf_owner_map m on m.profile_id = p.id::text
where p.workspace_id is null;

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
  now(),
  now()
from cf_workspace_seed s
join public.users u on u.id = s.owner_user_id
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
select p.workspace_id, m.owner_user_id::text, 'owner', now(), now()
from public.profiles p
join cf_owner_map m on m.profile_id = p.id::text
where p.workspace_id is not null
  and not exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = p.workspace_id
      and wm.user_id::text = m.owner_user_id::text
  );

-- Backfill business tables where there is enough data.
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
insert into cf_repair_summary select 'counts', 'users_public', count(*)::text from public.users;
insert into cf_repair_summary select 'counts', 'profiles', count(*)::text from public.profiles;
insert into cf_repair_summary select 'counts', 'workspaces', count(*)::text from public.workspaces;
insert into cf_repair_summary select 'counts', 'workspace_members', count(*)::text from public.workspace_members;
insert into cf_repair_summary select 'profiles', 'without_workspace_id', count(*)::text from public.profiles where workspace_id is null;
insert into cf_repair_summary select 'profiles', 'resolved_owner_user_match', count(*)::text from cf_owner_map;
insert into cf_repair_summary select 'workspaces', 'owner_user_without_public_user', count(*)::text from public.workspaces w left join public.users u on u.id = w.owner_user_id where u.id is null;
insert into cf_repair_summary select 'profiles', 'orphan_workspace_reference', count(*)::text from public.profiles p left join public.workspaces w on w.id = p.workspace_id where p.workspace_id is not null and w.id is null;

select section, metric, value
from cf_repair_summary
order by section, metric;

commit;
