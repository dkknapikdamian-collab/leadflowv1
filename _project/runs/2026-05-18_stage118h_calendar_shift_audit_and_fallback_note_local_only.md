# Stage118H - Calendar shift audit and emergency fallback note

## Status
LOCAL-ONLY / AUDIT NOTE / DO NOT IMPLEMENT YET.

## Scope
This note records the current diagnosis and the emergency fallback proposal for the Calendar shift bug. It does not implement any code change.

## Damian confirmation
Damian confirmed that the `Konflikt z Google Calendar` toast is not necessarily a bug. Many entries can intentionally overlap on the same day and hour. The conflict warning is desired and should remain visible when events overlap.

## Real problem
`+1D`, `+1W`, and `+1H` can show a success toast, but the calendar entry remains in the old position or returns there after refresh.

This means the success contract is false or incomplete: the UI reports a move, but the persisted/read state does not confirm the move.

## Facts from code audit

### Frontend shift path
`src/pages/Calendar.tsx` uses `handleShiftEntry` and `handleShiftEntryHours` for `+1D`, `+1W`, and `+1H`. For tasks it calls `updateTaskInSupabase()` with `date`, `scheduledAt`, `dueAt`, `time`, then calls `refreshSupabaseBundle()`, then shows a success toast.

### API path
`vercel.json` rewrites:
- `/api/tasks` -> `/api/work-items?kind=tasks`
- `/api/events` -> `/api/work-items?kind=events`

The actual backend mutation logic is in `api/work-items.ts`.

### Task backend date mapping risk
For `kind === 'tasks'`, backend PATCH supports `date` and `scheduledAt`, but does not treat `dueAt` and `time` as first-class fallback inputs. If `scheduledAt` is absent, malformed, or not the value actually used by the request, the backend can accept the request but not persist the exact intended shift.

### Google inbound risk
`fetchCalendarBundleFromSupabase()` calls `maybePullGoogleCalendarInboundBeforeBundle()` before reading tasks/events/leads/cases. That function calls Google inbound sync and can show the conflict toast.

The toast itself is only a warning and must not be considered a bug.

However, inbound sync can patch existing `work_items` rows. Therefore it is still a possible race condition if a freshly shifted CloseFlow row is overwritten with an older Google state.

## Hypotheses to test

### H1 - UI handler does not perform real PATCH
A shift click may not send a PATCH request for the specific clicked item, despite showing a success toast or triggering reads.

Test:
- clear Network log,
- click `+1D`,
- filter by `tasks` or `events`,
- verify there is a PATCH request with changed date/time payload.

### H2 - Backend PATCH accepts request but persists old date
The PATCH request may return `200`, but response may contain the old date/time or a normalized date that does not match the intended shift.

Test:
- inspect PATCH request payload,
- inspect response body,
- compare requested `scheduledAt/startAt` to response `scheduledAt/startAt`.

### H3 - Backend persists new date, but later refetch/inbound returns old date
PATCH response may contain the new date, but a later `sync-inbound` or bundle refetch may return the old state.

Test:
- check request order in Network,
- compare PATCH response date with the following `tasks/events` response,
- check if `system?kind=google-calendar&route=sync-inbound` happens between them.

### H4 - UI state uses stale data after successful PATCH
PATCH and API reads may both be correct, but local state/selected day cache keeps old entries.

Test:
- inspect `tasks/events` response after shift,
- hard refresh,
- compare data response vs rendered day placement.

## Emergency fallback proposal - reschedule by recreate

### Status
Recorded as emergency option only. Do not implement yet.

### Idea
If normal update/sync repair remains risky, implement shift as:
1. create a new shifted copy,
2. after successful create, delete the original,
3. show only `Przesunięto`, not `Usunięto`,
4. keep Google conflict warnings intact.

### Safe order
Use create-then-delete, not delete-then-create.

Reason:
- if create fails, original still exists,
- if delete fails, user may see duplicate and app can show a warning,
- data loss risk is lower.

### Risks
- new ID for shifted entry,
- possible temporary duplicate in CloseFlow or Google Calendar,
- history may look like create/delete rather than update,
- relation fields must be copied: `leadId`, `caseId`, `clientId`, reminders, recurrence, Google fields where applicable,
- recurring entries need a separate decision: shift instance vs shift series.

## Recommended proper fix before fallback

### Stage118I candidate: Calendar shift real persistence audit + fix

1. Add temporary local-only diagnostic logs for shift:
   - entry id,
   - source id,
   - kind,
   - old start,
   - intended next start,
   - request payload,
   - response payload.

2. Strengthen backend task PATCH mapping:
   - accept `scheduledAt`,
   - accept `dueAt` as fallback,
   - accept `date + time` as fallback,
   - keep `date` only fallback at `09:00` as last resort.

3. Make post-mutation refresh deterministic:
   - after local shift, fetch CloseFlow state first,
   - do not use Google inbound as proof of immediate local shift,
   - do not remove conflict warning.

4. Add inbound overwrite guard:
   - if existing CloseFlow `updated_at` is newer than Google `updated`, inbound must not overwrite local schedule fields,
   - mark conflict or skip update instead.

5. Add regression tests:
   - backend task PATCH date normalization,
   - shift request/response contract,
   - inbound does not overwrite fresher local change,
   - conflict toast remains allowed and not treated as failure.

## Manual verification checklist

1. Add test event/task in CloseFlow.
2. Confirm it appears in Google Calendar.
3. Click `+1D`.
4. Verify Network PATCH exists.
5. Verify PATCH payload contains intended next time.
6. Verify PATCH response contains intended next time.
7. Verify following `tasks/events` response contains intended next time.
8. Verify hard refresh keeps the shifted entry in the new place.
9. Verify Google conflict warning still appears for overlapping entries.
10. Verify create/delete two-way sync still works.

## Decision
Fallback recreate is saved as an emergency option, not current implementation. The correct next step is a real audit of the update/sync path before code changes.
