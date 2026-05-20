-- GOOGLE_CALENDAR_STAGE10J_INBOUND_SOURCE_COLUMNS
alter table if exists public.work_items add column if not exists source_provider text;
alter table if exists public.work_items add column if not exists source_external_id text;
alter table if exists public.work_items add column if not exists source_calendar_id text;
alter table if exists public.work_items add column if not exists source_synced_at timestamptz;
alter table if exists public.work_items add column if not exists source_updated_at timestamptz;
alter table if exists public.work_items add column if not exists inbound_conflict_detected boolean default false;
alter table if exists public.work_items add column if not exists inbound_conflict_count integer default 0;
alter table if exists public.work_items add column if not exists inbound_conflict_summary text;
alter table if exists public.google_calendar_connections add column if not exists google_calendar_last_inbound_sync_at timestamptz;
alter table if exists public.google_calendar_connections add column if not exists google_calendar_last_inbound_sync_error text;
alter table if exists public.google_calendar_connections add column if not exists google_calendar_last_inbound_sync_count integer default 0;
create unique index if not exists idx_work_items_google_calendar_source_external
on public.work_items(workspace_id, source_provider, source_external_id)
where source_provider = 'google_calendar' and source_external_id is not null;
