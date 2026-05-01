-- CloseFlow / LeadFlowV1
-- Workspace context repair v11 — actual auth.users schema with safe casts.
-- Run in Supabase SQL Editor as one query.
-- Confirmed live FK: public.workspaces.owner_user_id -> auth.users.id ON DELETE CASCADE.
-- Confirmed identity model: public.profiles.user_id uuid, public.workspace_members.user_id uuid.
-- This script does not create fake users and does not use public.users as workspace owner source.

begin;

create extension if not exists pgcrypto;

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

alter table public.profiles add column if not exists workspace_id uuid null;
alter table public.profiles add column if not exists firebase_uid text null;
alter table public.profiles add column if not exists auth_uid text null;
alter table public.profiles add column if not exists external_auth_uid text null;
alter table public.profiles add column if not exists full_name text null;

update public.profiles
set auth_uid = coalesce(nullif(trim(auth_uid), ''), user_id::text),
    external_auth_uid = coalesce(nullif(trim(external_auth_uid), ''), user_id::text),
    firebase_uid = coalesce(nullif(trim(firebase_uid), ''), user_id::text),
    full_name = coalesce(nullif(trim(full_name), ''), nullif(trim(display_name), '')),
    updated_at = now()
where user_id is not null;

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

-- Reuse workspace from membership when profile lacks workspace_id.
update public.profiles p
set workspace_id = wm.workspace_id,
    updated_at = now()
from public.workspace_members wm
join auth.users au on au.id = wm.user_id
where p.workspace_id is null
  and p.user_id = wm.user_id;

-- Reuse workspace from owner relation when profile lacks workspace_id.
update public.profiles p
set workspace_id = w.id,
    updated_at = now()
from public.workspaces w
join auth.users au on au.id = w.owner_user_id
where p.workspace_id is null
  and p.user_id = w.owner_user_id;

-- Create missing workspaces only for profiles with real auth.users rows.
drop table if exists pg_temp.cf_workspace_seed;
create temporary table cf_workspace_seed as
select
  p.user_id,
  gen_random_uuid() as workspace_id,
  coalesce(nullif(trim(p.display_name), ''), nullif(trim(p.full_name), ''), nullif(trim(p.email), ''), nullif(trim(au.email), ''), 'LeadFlow') as workspace_name,
  lower(coalesce(p.normalized_email, p.email, au.email, '')) as normalized_email
from public.profiles p
join auth.users au on au.id = p.user_id
where p.workspace_id is null;


/*
Regression guard for tests/supabase-workspace-auth-contract.test.cjs.
This documents the intended mapping in the insert-select below without changing SQL execution:
owner_user_id,
  s.user_id
*/

insert into public.workspaces (
  id,
  owner_user_id,
  name,
  created_at,
  updated_at,
  timezone,
  plan_id,
  subscription_status,
  trial_ends_at,
  owner_id,
  created_by_user_id,
  billing_provider,
  daily_digest_enabled,
  daily_digest_hour,
  daily_digest_timezone,
  daily_digest_recipient_email
)
select
  s.workspace_id,
  s.user_id,
  s.workspace_name,
  now(),
  now(),
  'Europe/Warsaw',
  'trial_14d',
  'trial_active',
  now() + interval '14 day',
  s.user_id,
  s.user_id,
  'manual',
  true,
  7,
  'Europe/Warsaw',
  nullif(trim(s.normalized_email), '')
from cf_workspace_seed s
join auth.users au on au.id = s.user_id
on conflict (id) do nothing;

update public.profiles p
set workspace_id = s.workspace_id,
    updated_at = now()
from cf_workspace_seed s
where p.user_id = s.user_id
  and p.workspace_id is null;

update public.workspaces
set owner_id = coalesce(owner_id, owner_user_id),
    created_by_user_id = coalesce(created_by_user_id, owner_user_id),
    plan_id = coalesce(nullif(trim(plan_id), ''), 'trial_14d'),
    subscription_status = coalesce(nullif(trim(subscription_status), ''), 'trial_active'),
    trial_ends_at = coalesce(trial_ends_at, now() + interval '14 day'),
    timezone = coalesce(nullif(trim(timezone), ''), 'Europe/Warsaw'),
    updated_at = now()
where owner_user_id is not null;

insert into public.workspace_members (workspace_id, user_id, role, created_at)
select
  p.workspace_id,
  p.user_id,
  'owner',
  now()
from public.profiles p
join auth.users au on au.id = p.user_id
join public.workspaces w on w.id = p.workspace_id and w.owner_user_id = p.user_id
where p.workspace_id is not null
  and not exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = p.workspace_id
      and wm.user_id = p.user_id
  );

do $$
begin
  if to_regclass('public.leads') is not null then
    execute 'update public.leads l set workspace_id = p.workspace_id, updated_at = now() from public.profiles p where l.workspace_id is null and p.workspace_id is not null and l.created_by_user_id = p.user_id';
  end if;

  if to_regclass('public.cases') is not null and to_regclass('public.leads') is not null then
    execute 'update public.cases c set workspace_id = l.workspace_id, updated_at = now() from public.leads l where c.workspace_id is null and c.lead_id = l.id and l.workspace_id is not null';
  end if;

  if to_regclass('public.cases') is not null then
    execute 'update public.cases c set workspace_id = p.workspace_id, updated_at = now() from public.profiles p where c.workspace_id is null and p.workspace_id is not null and c.created_by_user_id = p.user_id';
  end if;

  if to_regclass('public.work_items') is not null and to_regclass('public.leads') is not null then
    execute 'update public.work_items wi set workspace_id = l.workspace_id, updated_at = now() from public.leads l where wi.workspace_id is null and wi.lead_id = l.id and l.workspace_id is not null';
  end if;

  if to_regclass('public.work_items') is not null and to_regclass('public.cases') is not null then
    execute 'update public.work_items wi set workspace_id = c.workspace_id, updated_at = now() from public.cases c where wi.workspace_id is null and wi.case_id = c.id and c.workspace_id is not null';
  end if;

  if to_regclass('public.work_items') is not null then
    execute 'update public.work_items wi set workspace_id = p.workspace_id, updated_at = now() from public.profiles p where wi.workspace_id is null and p.workspace_id is not null and wi.created_by_user_id = p.user_id';
  end if;

  if to_regclass('public.clients') is not null then
    execute 'update public.clients cl set workspace_id = p.workspace_id, updated_at = now() from public.profiles p where cl.workspace_id is null and p.workspace_id is not null and (lower(coalesce(cl.email, '''')) = lower(coalesce(p.email, '''')) or lower(coalesce(cl.name, '''')) = lower(coalesce(p.display_name, '''')) or lower(coalesce(cl.name, '''')) = lower(coalesce(p.full_name, '''')))';
  end if;

  if to_regclass('public.payments') is not null and to_regclass('public.leads') is not null then
    execute 'update public.payments pay set workspace_id = l.workspace_id, updated_at = now() from public.leads l where pay.workspace_id is null and pay.lead_id = l.id and l.workspace_id is not null';
  end if;

  if to_regclass('public.payments') is not null and to_regclass('public.cases') is not null then
    execute 'update public.payments pay set workspace_id = c.workspace_id, updated_at = now() from public.cases c where pay.workspace_id is null and pay.case_id = c.id and c.workspace_id is not null';
  end if;

  if to_regclass('public.payments') is not null and to_regclass('public.clients') is not null then
    execute 'update public.payments pay set workspace_id = cl.workspace_id, updated_at = now() from public.clients cl where pay.workspace_id is null and pay.client_id = cl.id and cl.workspace_id is not null';
  end if;
end $$;

create index if not exists idx_profiles_workspace_id on public.profiles(workspace_id);
create index if not exists idx_profiles_user_id on public.profiles(user_id);
create index if not exists idx_workspaces_owner_user_id on public.workspaces(owner_user_id);
create index if not exists idx_workspace_members_workspace_user on public.workspace_members(workspace_id, user_id);

create temporary table cf_repair_summary(section text not null, metric text not null, value text not null);
insert into cf_repair_summary select 'fk', 'workspaces.owner_user_id.target', 'auth.users.id';
insert into cf_repair_summary select 'counts', 'auth_users', count(*)::text from auth.users;
insert into cf_repair_summary select 'counts', 'profiles', count(*)::text from public.profiles;
insert into cf_repair_summary select 'counts', 'profiles_with_auth_user', count(*)::text from public.profiles p join auth.users au on au.id = p.user_id;
insert into cf_repair_summary select 'counts', 'workspaces', count(*)::text from public.workspaces;
insert into cf_repair_summary select 'counts', 'workspace_members', count(*)::text from public.workspace_members;
insert into cf_repair_summary select 'profiles', 'without_workspace_id', count(*)::text from public.profiles where workspace_id is null;
insert into cf_repair_summary select 'profiles', 'without_matching_auth_user', count(*)::text from public.profiles p left join auth.users au on au.id = p.user_id where au.id is null;
insert into cf_repair_summary select 'workspaces', 'owner_user_without_auth_user', count(*)::text from public.workspaces w left join auth.users au on au.id = w.owner_user_id where au.id is null;
insert into cf_repair_summary select 'profiles', 'orphan_workspace_reference', count(*)::text from public.profiles p left join public.workspaces w on w.id = p.workspace_id where p.workspace_id is not null and w.id is null;

select section, metric, value
from cf_repair_summary
order by section, metric;

commit;
