-- Stage 06: client portal token hardening
alter table if exists public.client_portal_tokens
  add column if not exists token_hash text;

alter table if exists public.client_portal_tokens
  add column if not exists expires_at timestamptz;

alter table if exists public.client_portal_tokens
  add column if not exists revoked_at timestamptz;

alter table if exists public.client_portal_tokens
  add column if not exists last_used_at timestamptz;

alter table if exists public.client_portal_tokens
  add column if not exists updated_at timestamptz;

create index if not exists idx_client_portal_tokens_case_hash
  on public.client_portal_tokens(case_id, token_hash);

create index if not exists idx_client_portal_tokens_case_active
  on public.client_portal_tokens(case_id, expires_at, revoked_at);
