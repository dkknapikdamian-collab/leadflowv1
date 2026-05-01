-- Stage A26 - AI Drafts / Quick Capture / Voice capture in Supabase
-- AI and voice create temporary drafts for review. Final records are created only after user confirmation.

create extension if not exists pgcrypto;

create table if not exists public.ai_drafts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  user_id text null,
  type text not null default 'lead',
  kind text null,
  raw_text text null,
  parsed_data jsonb not null default '{}'::jsonb,
  provider text not null default 'local',
  status text not null default 'draft',
  source text not null default 'manual',
  expires_at timestamptz null,
  confirmed_at timestamptz null,
  cancelled_at timestamptz null,
  converted_at timestamptz null,
  linked_record_id uuid null,
  linked_record_type text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ai_drafts add column if not exists workspace_id uuid;
alter table public.ai_drafts add column if not exists user_id text;
alter table public.ai_drafts add column if not exists type text not null default 'lead';
alter table public.ai_drafts add column if not exists kind text;
alter table public.ai_drafts add column if not exists raw_text text;
alter table public.ai_drafts add column if not exists parsed_data jsonb not null default '{}'::jsonb;
alter table public.ai_drafts add column if not exists provider text not null default 'local';
alter table public.ai_drafts add column if not exists status text not null default 'draft';
alter table public.ai_drafts add column if not exists source text not null default 'manual';
alter table public.ai_drafts add column if not exists expires_at timestamptz;
alter table public.ai_drafts add column if not exists confirmed_at timestamptz;
alter table public.ai_drafts add column if not exists cancelled_at timestamptz;
alter table public.ai_drafts add column if not exists converted_at timestamptz;
alter table public.ai_drafts add column if not exists linked_record_id uuid;
alter table public.ai_drafts add column if not exists linked_record_type text;
alter table public.ai_drafts add column if not exists created_at timestamptz not null default now();
alter table public.ai_drafts add column if not exists updated_at timestamptz not null default now();

update public.ai_drafts
set status = 'confirmed', confirmed_at = coalesce(confirmed_at, converted_at, updated_at, now())
where status = 'converted';

update public.ai_drafts
set raw_text = null
where status in ('confirmed', 'cancelled', 'expired', 'archived');

create index if not exists ai_drafts_workspace_status_created_idx on public.ai_drafts (workspace_id, status, created_at desc);
create index if not exists ai_drafts_workspace_expires_idx on public.ai_drafts (workspace_id, expires_at) where expires_at is not null;
create index if not exists ai_drafts_linked_record_idx on public.ai_drafts (linked_record_type, linked_record_id) where linked_record_id is not null;

create or replace function public.expire_ai_drafts()
returns integer
language plpgsql
security definer
as $$
declare
  changed_count integer := 0;
begin
  update public.ai_drafts
  set status = 'expired', raw_text = null, updated_at = now()
  where status in ('draft', 'pending', 'failed')
    and expires_at is not null
    and expires_at < now();

  get diagnostics changed_count = row_count;
  return changed_count;
end;
$$;

alter table public.ai_drafts enable row level security;
