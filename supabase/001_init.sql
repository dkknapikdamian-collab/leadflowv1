create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null default '',
  full_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My workspace',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  company text not null default '',
  source text not null default 'Other',
  status text not null default 'new',
  value numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  title text not null,
  at timestamptz not null,
  type text not null default 'task',
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists workspaces_set_updated_at on public.workspaces;
create trigger workspaces_set_updated_at before update on public.workspaces for each row execute function public.set_updated_at();

drop trigger if exists leads_set_updated_at on public.leads;
create trigger leads_set_updated_at before update on public.leads for each row execute function public.set_updated_at();

drop trigger if exists activities_set_updated_at on public.activities;
create trigger activities_set_updated_at before update on public.activities for each row execute function public.set_updated_at();

create index if not exists idx_workspace_members_user_id on public.workspace_members(user_id);
create index if not exists idx_leads_workspace_id on public.leads(workspace_id);
create index if not exists idx_activities_workspace_id on public.activities(workspace_id);

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.leads enable row level security;
alter table public.activities enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
for insert to authenticated
with check ((select auth.uid()) = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists workspaces_select_member on public.workspaces;
create policy workspaces_select_member on public.workspaces
for select to authenticated
using (
  exists (
    select 1 from public.workspace_members members
    where members.workspace_id = workspaces.id
      and members.user_id = (select auth.uid())
  )
);

drop policy if exists workspaces_insert_owner on public.workspaces;
create policy workspaces_insert_owner on public.workspaces
for insert to authenticated
with check (owner_user_id = (select auth.uid()));

drop policy if exists workspace_members_select_own on public.workspace_members;
create policy workspace_members_select_own on public.workspace_members
for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists workspace_members_insert_owner on public.workspace_members;
create policy workspace_members_insert_owner on public.workspace_members
for insert to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.workspaces workspaces_check
    where workspaces_check.id = workspace_members.workspace_id
      and workspaces_check.owner_user_id = (select auth.uid())
  )
);

drop policy if exists leads_select_member on public.leads;
create policy leads_select_member on public.leads
for select to authenticated
using (
  exists (
    select 1 from public.workspace_members members
    where members.workspace_id = leads.workspace_id
      and members.user_id = (select auth.uid())
  )
);

drop policy if exists leads_insert_member on public.leads;
create policy leads_insert_member on public.leads
for insert to authenticated
with check (
  exists (
    select 1 from public.workspace_members members
    where members.workspace_id = leads.workspace_id
      and members.user_id = (select auth.uid())
  )
);

drop policy if exists activities_select_member on public.activities;
create policy activities_select_member on public.activities
for select to authenticated
using (
  exists (
    select 1 from public.workspace_members members
    where members.workspace_id = activities.workspace_id
      and members.user_id = (select auth.uid())
  )
);

drop policy if exists activities_insert_member on public.activities;
create policy activities_insert_member on public.activities
for insert to authenticated
with check (
  exists (
    select 1 from public.workspace_members members
    where members.workspace_id = activities.workspace_id
      and members.user_id = (select auth.uid())
  )
);
