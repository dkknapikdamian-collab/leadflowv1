-- CloseFlow client portal tokens prerequisite for fresh Supabase projects.
-- Purpose: Stage06 hardening creates indexes on public.client_portal_tokens before Stage10 creates the table.
-- Safe/idempotent.

create extension if not exists pgcrypto;

create table if not exists public.client_portal_tokens (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  case_id uuid not null,
  token text null,
  token_hash text null,
  expires_at timestamptz null,
  revoked_at timestamptz null,
  last_used_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz null,
  created_by_user_id uuid null
);

alter table public.client_portal_tokens
  add column if not exists workspace_id uuid null,
  add column if not exists case_id uuid,
  add column if not exists token text null,
  add column if not exists token_hash text null,
  add column if not exists expires_at timestamptz null,
  add column if not exists revoked_at timestamptz null,
  add column if not exists last_used_at timestamptz null,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz null,
  add column if not exists created_by_user_id uuid null;

create index if not exists idx_client_portal_tokens_case_id
  on public.client_portal_tokens(case_id);

select 'closeflow_client_portal_tokens_prereq_ready' as status;
