-- GOOGLE_CALENDAR_SYNC_V1_STAGE01_FOUNDATION_2026_05_03
-- Foundation only. It prepares storage and sync metadata.
-- It does not enable automatic event sync by itself.

create table if not exists public.google_calendar_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null,
  google_account_email text,
  google_calendar_id text not null default 'primary',
  access_token_ciphertext text,
  refresh_token_ciphertext text,
  token_expires_at timestamptz,
  scope text,
  sync_enabled boolean not null default true,
  default_reminder_mode text not null default 'google_default',
  default_reminder_method text not null default 'popup',
  default_reminder_minutes integer not null default 30,
  connected_at timestamptz not null default now(),
  disconnected_at timestamptz,
  last_sync_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint google_calendar_connections_reminder_method_chk
    check (default_reminder_method in ('popup', 'email')),
  constraint google_calendar_connections_reminder_minutes_chk
    check (default_reminder_minutes between 0 and 40320),
  unique (workspace_id, user_id)
);

alter table public.work_items
  add column if not exists google_calendar_sync_enabled boolean not null default false,
  add column if not exists google_calendar_id text,
  add column if not exists google_calendar_event_id text,
  add column if not exists google_calendar_event_etag text,
  add column if not exists google_calendar_html_link text,
  add column if not exists google_calendar_synced_at timestamptz,
  add column if not exists google_calendar_sync_status text not null default 'not_synced',
  add column if not exists google_calendar_sync_error text,
  add column if not exists google_calendar_reminders jsonb;

create index if not exists idx_google_calendar_connections_workspace
  on public.google_calendar_connections(workspace_id);

create index if not exists idx_google_calendar_connections_user
  on public.google_calendar_connections(user_id);

create index if not exists idx_work_items_google_calendar_event
  on public.work_items(workspace_id, google_calendar_event_id)
  where google_calendar_event_id is not null;

alter table public.google_calendar_connections enable row level security;

drop policy if exists google_calendar_connections_select_own_workspace on public.google_calendar_connections;
create policy google_calendar_connections_select_own_workspace
on public.google_calendar_connections
for select
using (
  workspace_id in (
    select workspace_id
    from public.workspace_members
    where user_id = auth.uid()
  )
  or user_id = auth.uid()
);

drop policy if exists google_calendar_connections_write_own_workspace on public.google_calendar_connections;
create policy google_calendar_connections_write_own_workspace
on public.google_calendar_connections
for all
using (
  workspace_id in (
    select workspace_id
    from public.workspace_members
    where user_id = auth.uid()
  )
  or user_id = auth.uid()
)
with check (
  workspace_id in (
    select workspace_id
    from public.workspace_members
    where user_id = auth.uid()
  )
  or user_id = auth.uid()
);
