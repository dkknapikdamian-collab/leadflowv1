-- GOOGLE_CALENDAR_STAGE10D_INBOUND_SOURCE_COLUMNS
alter table if exists public.work_items add column if not exists source_provider text;
alter table if exists public.work_items add column if not exists source_external_id text;
alter table if exists public.work_items add column if not exists google_calendar_external_updated_at timestamptz;
alter table if exists public.work_items add column if not exists google_calendar_imported_at timestamptz;
create index if not exists work_items_workspace_source_external_idx on public.work_items (workspace_id, source_provider, source_external_id);
create index if not exists work_items_workspace_google_event_idx on public.work_items (workspace_id, google_calendar_event_id);
