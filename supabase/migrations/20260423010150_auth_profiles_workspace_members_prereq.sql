-- CloseFlow auth/profile prerequisite for fresh Supabase projects.
-- Purpose: create public.profiles and public.workspace_members before older profile/workspace migrations alter them.
-- Safe/idempotent: create table if not exists + add column if not exists + create index if not exists.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_uid uuid unique,
  firebase_uid uuid,
  external_auth_uid uuid,
  email text unique,
  full_name text,
  company_name text null default '',
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

alter table public.profiles add column if not exists auth_uid uuid;
alter table public.profiles add column if not exists firebase_uid uuid;
alter table public.profiles add column if not exists external_auth_uid uuid;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists company_name text null default '';
alter table public.profiles add column if not exists workspace_id uuid;
alter table public.profiles add column if not exists role text not null default 'member';
alter table public.profiles add column if not exists is_admin boolean not null default false;
alter table public.profiles add column if not exists appearance_skin text not null default 'classic-light';
alter table public.profiles add column if not exists planning_conflict_warnings_enabled boolean not null default true;
alter table public.profiles add column if not exists browser_notifications_enabled boolean not null default true;
alter table public.profiles add column if not exists force_logout_after timestamptz;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

alter table public.workspaces add column if not exists owner_user_id uuid;
alter table public.workspaces add column if not exists owner_id uuid;
alter table public.workspaces add column if not exists created_by_user_id uuid;
alter table public.workspaces add column if not exists timezone text not null default 'Europe/Warsaw';
alter table public.workspaces add column if not exists daily_digest_enabled boolean not null default true;
alter table public.workspaces add column if not exists daily_digest_hour integer not null default 7;
alter table public.workspaces add column if not exists daily_digest_timezone text not null default 'Europe/Warsaw';
alter table public.workspaces add column if not exists daily_digest_recipient_email text null;

create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null,
  role text not null default 'owner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(workspace_id, user_id)
);

create index if not exists profiles_auth_uid_idx on public.profiles(auth_uid);
create index if not exists profiles_email_idx on public.profiles(email);
create index if not exists profiles_workspace_id_idx on public.profiles(workspace_id);
create index if not exists workspace_members_user_id_idx on public.workspace_members(user_id);
create index if not exists workspace_members_workspace_id_idx on public.workspace_members(workspace_id);

select 'closeflow_auth_profiles_workspace_members_prereq_ready' as status;
