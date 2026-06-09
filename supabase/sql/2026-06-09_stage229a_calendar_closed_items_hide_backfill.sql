-- Stage229A - backfill calendar visibility for closed/deleted work_items before Google Calendar sync.
-- Where: Supabase SQL Editor, production project.
-- Why: closed/deleted tasks/events must disappear from CloseFlow calendar and be eligible for Google Calendar remote cleanup.
-- Order: run after app code deploy, or before deploy if you need to clean already-broken rows.

begin;
update public.work_items
set
  show_in_calendar = false,
  show_in_tasks = case when lower(coalesce(status, '')) in ('deleted', 'archived', 'removed') then false else show_in_tasks end,
  google_calendar_sync_status = case when google_calendar_event_id is not null then 'pending_delete' else google_calendar_sync_status end,
  updated_at = now()
where lower(coalesce(status, '')) in ('done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted', 'removed')
  and coalesce(show_in_calendar, false) = true;
commit;

-- Verification:
select id, workspace_id, record_type, type, title, status, show_in_tasks, show_in_calendar, google_calendar_id, google_calendar_event_id, google_calendar_sync_status, google_calendar_sync_error, google_calendar_synced_at, updated_at
from public.work_items
where lower(coalesce(status, '')) in ('done', 'completed', 'cancelled', 'canceled', 'archived', 'deleted', 'removed')
  and (coalesce(show_in_calendar, false) = true or title ilike '%GCAL_REMOTE_DELETE%' or title ilike '%CF_DEL_TEST%')
order by updated_at desc
limit 100;
