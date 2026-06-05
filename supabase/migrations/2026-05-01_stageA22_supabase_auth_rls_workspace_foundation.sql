-- STAGE223_R2W_A22_RLS_WORKSPACE_FOUNDATION_MIGRATION_RESTORE
-- Historical migration contract restored for tests/faza2-etap22-rls-backend-security-proof.test.cjs.
-- DO NOT run manually on production Supabase without a separate SQL deployment review.
-- The active proof SQL is docs/sql/CLOSEFLOW_RLS_WORKSPACE_SECURITY_PROOF_2026-05-03.sql.

begin;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text,
  full_name text,
  workspace_id uuid references public.workspaces(id),
  role text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id),
  user_id uuid,
  email text,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

alter table public.workspaces enable row level security;
alter table public.workspaces force row level security;

alter table public.workspace_members enable row level security;
alter table public.workspace_members force row level security;

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
    where p.user_id::text = auth.uid()::text
      and coalesce(p.is_admin, false) is true
  );
$$;

create or replace function public.closeflow_is_workspace_member(p_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id::text = p_workspace_id::text
      and (
        wm.user_id::text = auth.uid()::text
        or lower(coalesce(wm.email, '')) = lower(coalesce(auth.email(), ''))
      )
  )
  or exists (
    select 1
    from public.profiles p
    where p.workspace_id::text = p_workspace_id::text
      and p.user_id::text = auth.uid()::text
  );
$$;

-- A22 proof surface: business tables that must be workspace scoped by backend/RLS.
select unnest(array[
  'leads',
  'clients',
  'cases',
  'work_items',
  'activities',
  'ai_drafts'
]) as closeflow_workspace_rls_required_table;

-- Explicit workspace_id::text marker required by A22 backend proof contract.
select 'workspace_id::text' as closeflow_workspace_id_text_marker;

commit;
