create extension if not exists pgcrypto;

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  owner_id text not null,
  owner_email text null,
  kind text not null default 'support',
  subject text not null,
  message text not null,
  status text not null default 'new',
  source text not null default 'app',
  admin_reply text null,
  replies jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  closed_at timestamptz null
);

create index if not exists support_requests_owner_id_idx on public.support_requests(owner_id);
create index if not exists support_requests_status_idx on public.support_requests(status);
create index if not exists support_requests_kind_idx on public.support_requests(kind);
create index if not exists support_requests_updated_at_idx on public.support_requests(updated_at desc);
