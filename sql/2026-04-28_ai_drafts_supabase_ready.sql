-- CloseFlow Stage 19 - AI drafts Supabase ready
-- Run in Supabase SQL Editor.
-- Idempotent: safe to run more than once.

create extension if not exists pgcrypto;

create table if not exists public.ai_drafts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id text null,
  type text not null default 'lead',
  kind text not null default 'lead_capture',
  raw_text text null,
  parsed_data jsonb not null default '{}'::jsonb,
  provider text not null default 'local',
  source text not null default 'manual',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz null,
  confirmed_at timestamptz null,
  cancelled_at timestamptz null,
  converted_at timestamptz null
);

alter table public.ai_drafts add column if not exists workspace_id uuid;
alter table public.ai_drafts add column if not exists user_id text;
alter table public.ai_drafts add column if not exists type text default 'lead';
alter table public.ai_drafts add column if not exists kind text default 'lead_capture';
alter table public.ai_drafts add column if not exists raw_text text;
alter table public.ai_drafts add column if not exists parsed_data jsonb default '{}'::jsonb;
alter table public.ai_drafts add column if not exists provider text default 'local';
alter table public.ai_drafts add column if not exists source text default 'manual';
alter table public.ai_drafts add column if not exists status text default 'draft';
alter table public.ai_drafts add column if not exists created_at timestamptz default now();
alter table public.ai_drafts add column if not exists updated_at timestamptz default now();
alter table public.ai_drafts add column if not exists expires_at timestamptz;
alter table public.ai_drafts add column if not exists confirmed_at timestamptz;
alter table public.ai_drafts add column if not exists cancelled_at timestamptz;
alter table public.ai_drafts add column if not exists converted_at timestamptz;

update public.ai_drafts set parsed_data = '{}'::jsonb where parsed_data is null;
update public.ai_drafts set provider = 'local' where provider is null or provider = '';
update public.ai_drafts set source = 'manual' where source is null or source = '';
update public.ai_drafts set status = 'draft' where status is null or status = '';
update public.ai_drafts set type = 'lead' where type is null or type = '';
update public.ai_drafts set kind = 'lead_capture' where kind is null or kind = '';
update public.ai_drafts set type = 'lead' where type not in ('lead', 'task', 'event', 'note');
update public.ai_drafts set kind = 'lead_capture' where kind not in ('lead_capture', 'task_capture', 'event_capture', 'note_capture');
update public.ai_drafts set status = 'draft' where status not in ('draft', 'converted', 'archived', 'cancelled', 'expired', 'failed');
update public.ai_drafts set source = 'manual' where source not in ('quick_capture', 'today_assistant', 'manual', 'assistant');
update public.ai_drafts set provider = 'local' where provider not in ('local', 'rule_parser', 'gemini', 'cloudflare', 'mixed', 'none', 'today_assistant');

alter table public.ai_drafts alter column parsed_data set default '{}'::jsonb;
alter table public.ai_drafts alter column provider set default 'local';
alter table public.ai_drafts alter column source set default 'manual';
alter table public.ai_drafts alter column status set default 'draft';
alter table public.ai_drafts alter column type set default 'lead';
alter table public.ai_drafts alter column kind set default 'lead_capture';

create index if not exists ai_drafts_workspace_status_created_idx
  on public.ai_drafts (workspace_id, status, created_at desc);

create index if not exists ai_drafts_workspace_type_created_idx
  on public.ai_drafts (workspace_id, type, created_at desc);

create index if not exists ai_drafts_expires_at_idx
  on public.ai_drafts (expires_at)
  where expires_at is not null and status = 'draft';

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'ai_drafts_type_check') then
    alter table public.ai_drafts add constraint ai_drafts_type_check check (type in ('lead', 'task', 'event', 'note'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ai_drafts_kind_check') then
    alter table public.ai_drafts add constraint ai_drafts_kind_check check (kind in ('lead_capture', 'task_capture', 'event_capture', 'note_capture'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ai_drafts_status_check') then
    alter table public.ai_drafts add constraint ai_drafts_status_check check (status in ('draft', 'converted', 'archived', 'cancelled', 'expired', 'failed'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ai_drafts_source_check') then
    alter table public.ai_drafts add constraint ai_drafts_source_check check (source in ('quick_capture', 'today_assistant', 'manual', 'assistant'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'ai_drafts_provider_check') then
    alter table public.ai_drafts add constraint ai_drafts_provider_check check (provider in ('local', 'rule_parser', 'gemini', 'cloudflare', 'mixed', 'none', 'today_assistant'));
  end if;
end $$;

create or replace function public.touch_ai_drafts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_ai_drafts_touch_updated_at on public.ai_drafts;
create trigger trg_ai_drafts_touch_updated_at
before update on public.ai_drafts
for each row execute function public.touch_ai_drafts_updated_at();

alter table public.ai_drafts enable row level security;

drop policy if exists ai_drafts_service_role_all on public.ai_drafts;
create policy ai_drafts_service_role_all
on public.ai_drafts
for all
to service_role
using (true)
with check (true);

do $$
begin
  if to_regclass('public.workspace_members') is not null then
    drop policy if exists ai_drafts_workspace_members_select on public.ai_drafts;
    create policy ai_drafts_workspace_members_select
    on public.ai_drafts
    for select
    to authenticated
    using (
      exists (
        select 1 from public.workspace_members wm
        where wm.workspace_id = ai_drafts.workspace_id
          and wm.user_id::text = auth.uid()::text
      )
    );

    drop policy if exists ai_drafts_workspace_members_insert on public.ai_drafts;
    create policy ai_drafts_workspace_members_insert
    on public.ai_drafts
    for insert
    to authenticated
    with check (
      exists (
        select 1 from public.workspace_members wm
        where wm.workspace_id = ai_drafts.workspace_id
          and wm.user_id::text = auth.uid()::text
      )
    );

    drop policy if exists ai_drafts_workspace_members_update on public.ai_drafts;
    create policy ai_drafts_workspace_members_update
    on public.ai_drafts
    for update
    to authenticated
    using (
      exists (
        select 1 from public.workspace_members wm
        where wm.workspace_id = ai_drafts.workspace_id
          and wm.user_id::text = auth.uid()::text
      )
    )
    with check (
      exists (
        select 1 from public.workspace_members wm
        where wm.workspace_id = ai_drafts.workspace_id
          and wm.user_id::text = auth.uid()::text
      )
    );
  end if;
end $$;

select 'stage19_ai_drafts_sql_ready' as status, count(*) as existing_rows from public.ai_drafts;
