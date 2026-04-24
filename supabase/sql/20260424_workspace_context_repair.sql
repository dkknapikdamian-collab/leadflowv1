-- Workspace context repair after Firebase -> Supabase migration.
-- Idempotent and non-destructive: creates missing structures, backfills workspace_id links.

begin;

create extension if not exists pgcrypto;

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
  workspace_id uuid not null,
  user_id text not null,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles add column if not exists workspace_id uuid null;
alter table public.profiles add column if not exists full_name text null;
alter table public.profiles add column if not exists email text null;
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
alter table public.workspaces add column if not exists owner_user_id uuid null;
alter table public.workspaces add column if not exists owner_id uuid null;
alter table public.workspaces add column if not exists created_by_user_id uuid null;
alter table public.workspaces add column if not exists created_at timestamptz not null default now();
alter table public.workspaces add column if not exists updated_at timestamptz not null default now();

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

create index if not exists idx_profiles_workspace_id on public.profiles(workspace_id);
create index if not exists idx_workspace_members_workspace_user on public.workspace_members(workspace_id, user_id);

-- Backfill profiles.workspace_id from workspace_members.
update public.profiles p
set
  workspace_id = wm.workspace_id,
  updated_at = now()
from public.workspace_members wm
where p.workspace_id is null
  and wm.workspace_id is not null
  and (
    p.id::text = wm.user_id::text
    or coalesce(p.firebase_uid, '') = wm.user_id::text
    or coalesce(p.auth_uid, '') = wm.user_id::text
    or coalesce(p.external_auth_uid, '') = wm.user_id::text
  );

-- Backfill profiles.workspace_id from workspace ownership columns.
update public.profiles p
set
  workspace_id = w.id,
  updated_at = now()
from public.workspaces w
where p.workspace_id is null
  and (
    p.id::text = w.owner_user_id::text
    or p.id::text = w.owner_id::text
    or p.id::text = w.created_by_user_id::text
    or coalesce(p.firebase_uid, '') = w.owner_user_id::text
    or coalesce(p.auth_uid, '') = w.owner_user_id::text
    or coalesce(p.external_auth_uid, '') = w.owner_user_id::text
  );

-- Auto-create workspace for every profile still missing workspace_id.
create temporary table workspace_repair_seed as
select
  p.id as profile_id,
  gen_random_uuid() as workspace_id,
  coalesce(nullif(trim(p.full_name), ''), nullif(trim(p.email), ''), concat('Workspace ', left(p.id::text, 8))) as workspace_name
from public.profiles p
where p.workspace_id is null;

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
  null,
  null,
  null,
  now(),
  now()
from workspace_repair_seed s
on conflict (id) do nothing;

update public.profiles p
set
  workspace_id = s.workspace_id,
  updated_at = now()
from workspace_repair_seed s
where p.id = s.profile_id
  and p.workspace_id is null;

insert into public.workspace_members (workspace_id, user_id, role, created_at, updated_at)
select
  p.workspace_id,
  p.id::text,
  'owner',
  now(),
  now()
from public.profiles p
where p.workspace_id is not null
  and not exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = p.workspace_id
      and wm.user_id::text = p.id::text
  );

-- Backfill leads.workspace_id from profiles using created_by_user_id.
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
          or l.created_by_user_id::text = coalesce(p.firebase_uid, '''')
          or l.created_by_user_id::text = coalesce(p.auth_uid, '''')
          or l.created_by_user_id::text = coalesce(p.external_auth_uid, '''')
        )
    ';
  end if;
end $$;

-- Backfill cases.workspace_id from linked lead and profiles.
do $$
begin
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
          or c.created_by_user_id::text = coalesce(p.firebase_uid, '''')
          or c.created_by_user_id::text = coalesce(p.auth_uid, '''')
          or c.created_by_user_id::text = coalesce(p.external_auth_uid, '''')
        )
    ';
  end if;
end $$;

-- Backfill work_items.workspace_id from lead, case and profile.
do $$
begin
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
          or wi.created_by_user_id::text = coalesce(p.firebase_uid, '''')
          or wi.created_by_user_id::text = coalesce(p.auth_uid, '''')
          or wi.created_by_user_id::text = coalesce(p.external_auth_uid, '''')
        )
    ';
  end if;
end $$;

-- Backfill clients.workspace_id from profiles (best effort).
do $$
begin
  if to_regclass('public.clients') is not null then
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
  end if;
end $$;

-- Backfill payments.workspace_id from linked lead/case/client.
do $$
begin
  if to_regclass('public.payments') is not null and to_regclass('public.leads') is not null then
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

  if to_regclass('public.payments') is not null and to_regclass('public.cases') is not null then
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

  if to_regclass('public.payments') is not null and to_regclass('public.clients') is not null then
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

-- Final safety: orphan workspace references in profiles reset to null and rebuilt via seed.
update public.profiles p
set workspace_id = null,
    updated_at = now()
where p.workspace_id is not null
  and not exists (
    select 1
    from public.workspaces w
    where w.id = p.workspace_id
  );

create temporary table workspace_repair_summary (
  metric text not null,
  value text not null
);

insert into workspace_repair_summary(metric, value)
select 'profiles_without_workspace_id', count(*)::text
from public.profiles
where workspace_id is null;

do $$
begin
  if to_regclass('public.leads') is not null then
    execute '
      insert into workspace_repair_summary(metric, value)
      select ''leads_without_workspace_id'', count(*)::text
      from public.leads
      where workspace_id is null
    ';
  end if;

  if to_regclass('public.cases') is not null then
    execute '
      insert into workspace_repair_summary(metric, value)
      select ''cases_without_workspace_id'', count(*)::text
      from public.cases
      where workspace_id is null
    ';
  end if;

  if to_regclass('public.work_items') is not null then
    execute '
      insert into workspace_repair_summary(metric, value)
      select ''work_items_without_workspace_id'', count(*)::text
      from public.work_items
      where workspace_id is null
    ';
  end if;

  if to_regclass('public.clients') is not null then
    execute '
      insert into workspace_repair_summary(metric, value)
      select ''clients_without_workspace_id'', count(*)::text
      from public.clients
      where workspace_id is null
    ';
  end if;

  if to_regclass('public.payments') is not null then
    execute '
      insert into workspace_repair_summary(metric, value)
      select ''payments_without_workspace_id'', count(*)::text
      from public.payments
      where workspace_id is null
    ';
  end if;
end $$;

select metric, value
from workspace_repair_summary
order by metric;

commit;
