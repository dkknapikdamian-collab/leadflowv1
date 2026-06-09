# Stage228R50 â€” no-flicker real anchors for work items

Data: 2026-06-09 08:45 Europe/Warsaw

## FAKTY
- Stage228R49B scan showed LeadDetail uses linkedTasks/setLinkedTasks and linkedEvents/setLinkedEvents, not tasks/setTasks.
- TasksStable uses tasks/setTasks.
- Calendar already has local delete prune and remains the baseline; this stage does not change Calendar.
- R46 Supabase SQL allowed status='deleted'; runtime delete now persists after the database constraint update.

## ZMIANY
- Added SQL memory file for work_items_status_domain_check with 'deleted'.
- Added shared no-flicker work-item mutation event helper.
- Stabilized supabase-fallback task/event create/update/delete events.
- LeadDetail context saved records append locally and handlers use silent refresh for task/event/missing-item operations.
- TasksStable refreshData supports silent mode and task delete uses optimistic local prune with rollback.

## TESTY / GUARDY
- check:stage228r47-sql-deleted-status-constraint
- test:stage228r47-sql-deleted-status-constraint
- check:stage228r50-no-flicker-real-anchors
- test:stage228r50-no-flicker-real-anchors
- npm run build
- git diff --check
- git diff --cached --check

## TEST MANUALNY
1. Open lead detail.
2. Add CF_DEL_TEST_4 as a task/brak.
3. It should appear without full-card/page flicker.
4. Delete it.
5. It should disappear immediately.
6. Refresh page: it must not return.

## RYZYKA
- Silent background refresh can reorder entries after server normalization.
- Cross-page live updates depend on existing mutation bus and no-flicker event helper.
- If server returns non-normalized created records, local row can render differently until silent refresh.
