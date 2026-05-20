-- GOOGLE_CALENDAR_STAGE09B_LEAD_PARITY_COLUMNS
alter table if exists public.leads add column if not exists google_calendar_id text;
alter table if exists public.leads add column if not exists google_calendar_event_id text;
alter table if exists public.leads add column if not exists google_calendar_event_etag text;
alter table if exists public.leads add column if not exists google_calendar_html_link text;
alter table if exists public.leads add column if not exists google_calendar_synced_at timestamptz;
alter table if exists public.leads add column if not exists google_calendar_sync_status text;
alter table if exists public.leads add column if not exists google_calendar_sync_error text;
