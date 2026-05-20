-- GOOGLE_CALENDAR_STAGE10K_INBOUND_SOURCE_COLUMNS
alter table if exists public.work_items add column if not exists source_provider text;
alter table if exists public.work_items add column if not exists source_external_id text;
alter table if exists public.work_items add column if not exists source_updated_at timestamptz;
alter table if exists public.work_items add column if not exists source_deleted_at timestamptz;
alter table if exists public.work_items add column if not exists inbound_conflict_status text;
alter table if exists public.work_items add column if not exists inbound_conflict_message text;
alter table if exists public.work_items add column if not exists inbound_conflict_count integer;
create index if not exists work_items_google_source_idx on public.work_items(workspace_id, source_provider, source_external_id);
create index if not exists work_items_google_event_id_idx on public.work_items(workspace_id, google_calendar_event_id);
