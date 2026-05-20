create table if not exists public.client_portal_tokens (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  case_id uuid not null,
  token_hash text not null,
  expires_at timestamptz null,
  revoked_at timestamptz null,
  last_used_at timestamptz null,
  created_at timestamptz not null default now(),
  created_by_user_id uuid null
);

alter table if exists public.client_portal_tokens
  add column if not exists workspace_id uuid;
alter table if exists public.client_portal_tokens
  add column if not exists case_id uuid;
alter table if exists public.client_portal_tokens
  add column if not exists token_hash text;
alter table if exists public.client_portal_tokens
  add column if not exists expires_at timestamptz;
alter table if exists public.client_portal_tokens
  add column if not exists revoked_at timestamptz;
alter table if exists public.client_portal_tokens
  add column if not exists last_used_at timestamptz;
alter table if exists public.client_portal_tokens
  add column if not exists created_at timestamptz;
alter table if exists public.client_portal_tokens
  add column if not exists created_by_user_id uuid;

create index if not exists idx_client_portal_tokens_workspace_case
  on public.client_portal_tokens(workspace_id, case_id, created_at desc);

create unique index if not exists idx_client_portal_tokens_hash_active
  on public.client_portal_tokens(case_id, token_hash, revoked_at);
