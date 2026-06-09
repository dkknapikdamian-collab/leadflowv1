# Stage229A - calendar closed items hide and sync backfill

- data i godzina: 2026-06-09 14:10 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: Google Calendar sync repair / visibility repair / SQL backfill
- status: prepared by ZIP runner

## Fakty z testu Damiana

- Event test GCAL_REMOTE_DELETE_EVENT_229B byl record_type=event, show_in_calendar=true, google_calendar_event_id obecny przed usunieciem.
- Po usunieciu eventu query po tytule nie zwrocilo wierszy.
- Task test po usunieciu mial status=deleted, ale show_in_calendar=true i google_calendar_event_id obecny.

## Zakres

- PATCH /api/tasks ukrywa z kalendarza statusy done/completed/canceled/cancelled/deleted/archived/removed.
- PATCH /api/tasks ukrywa z listy tasks statusy deleted/archived/removed.
- PATCH /api/events ukrywa z kalendarza statusy done/completed/canceled/cancelled/deleted/archived/removed.
- softDeleteTaskInSupabase przekazuje show_in_calendar=false i show_in_tasks=false.
- SQL backfill czysci stare rekordy i oznacza google_calendar_sync_status=pending_delete dla rekordow z google_calendar_event_id.

## Audyt ryzyk po etapie

- Ryzyko: remote Google delete moze wymagac osobnego worker/API, jesli obecny sync nie reaguje na pending_delete.
- Ryzyko: done task ma zostac na liscie zadan, ale zniknac z kalendarza.
- Ryzyko: deleted task ma zniknac z kalendarza i listy zadan.
