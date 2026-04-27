-- CloseFlow / LeadFlow — Szkice AI do Supabase
-- Data: 2026-04-27
-- Uruchom w Supabase SQL Editor przed wdrożeniem patcha aplikacji.
-- Cel: jeden wspólny mechanizm szkiców AI, widoczny dla aplikacji po workspace_id.

create extension if not exists pgcrypto;

create table if not exists public.ai_drafts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id text null,
  type text not null default 'lead',
  kind text not null default 'lead_capture',
  raw_text text null,
  parsed_data jsonb null default '{}'::jsonb,
  provider text not null default 'local',
  source text not null default 'manual',
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz null,
  confirmed_at timestamptz null,
  cancelled_at timestamptz null,
  converted_at timestamptz null,
  constraint ai_drafts_type_check check (type in ('lead', 'task', 'event', 'note')),
  constraint ai_drafts_kind_check check (kind in ('lead_capture', 'task_capture', 'event_capture', 'note_capture')),
  constraint ai_drafts_status_check check (status in ('draft', 'converted', 'archived', 'cancelled', 'expired', 'failed')),
  constraint ai_drafts_source_check check (source in ('quick_capture', 'today_assistant', 'manual', 'assistant')),
  constraint ai_drafts_provider_check check (provider in ('local', 'rule_parser', 'gemini', 'cloudflare', 'mixed', 'none', 'today_assistant'))
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

create index if not exists ai_drafts_workspace_status_created_idx
  on public.ai_drafts (workspace_id, status, created_at desc);

create index if not exists ai_drafts_workspace_type_created_idx
  on public.ai_drafts (workspace_id, type, created_at desc);

create index if not exists ai_drafts_expires_at_idx
  on public.ai_drafts (expires_at)
  where expires_at is not null and status = 'draft';

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

-- API aplikacji używa service role, więc ta polityka jest wymagana dla endpointów serwerowych.
drop policy if exists ai_drafts_service_role_all on public.ai_drafts;
create policy ai_drafts_service_role_all
on public.ai_drafts
for all
to service_role
using (true)
with check (true);

-- Dodatkowa polityka bezpieczeństwa, gdyby w przyszłości frontend czytał tabelę bezpośrednio przez Supabase klienta.
drop policy if exists ai_drafts_workspace_members_select on public.ai_drafts;
create policy ai_drafts_workspace_members_select
on public.ai_drafts
for select
to authenticated
using (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = ai_drafts.workspace_id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists ai_drafts_workspace_members_insert on public.ai_drafts;
create policy ai_drafts_workspace_members_insert
on public.ai_drafts
for insert
to authenticated
with check (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = ai_drafts.workspace_id
      and wm.user_id = auth.uid()
  )
);

drop policy if exists ai_drafts_workspace_members_update on public.ai_drafts;
create policy ai_drafts_workspace_members_update
on public.ai_drafts
for update
to authenticated
using (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = ai_drafts.workspace_id
      and wm.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workspace_members wm
    where wm.workspace_id = ai_drafts.workspace_id
      and wm.user_id = auth.uid()
  )
);

-- Prywatność: endpoint aplikacji czyści raw_text po zatwierdzeniu/anulowaniu.
-- Ten SELECT pozwala sprawdzić, czy tabela istnieje.
select 'ai_drafts_ready' as status, count(*) as existing_rows from public.ai_drafts;
