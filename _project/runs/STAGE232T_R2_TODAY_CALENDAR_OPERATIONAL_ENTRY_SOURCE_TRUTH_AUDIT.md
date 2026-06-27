# STAGE232T_R2_TODAY_CALENDAR_OPERATIONAL_ENTRY_SOURCE_TRUTH_AUDIT

Status:
P0_PRODUCTION_BUG_REPORTED / SOURCE_AUDIT_STARTED / FIX_NOT_STARTED

Reported production symptoms:
- delete from Today or Calendar can return after refresh
- duplicate/ghost rows can appear after refresh
- marking a new row done can create a non-done copy after refresh
- restoring a struck/completed row can make it disappear
- +1H shift is inconsistent and can need refresh to settle
- repeated +1H can stop behaving correctly
- +1D shift appears more reliable

Initial source audit conclusion:
This is not a CSS/layout problem. It is a task/event operational entry state contract problem across Today, Calendar, API routes, local optimistic state, GET cache, completed retention, and Google inbound refresh.

Confirmed high-risk source areas:
- `src/pages/TodayStable.tsx`
- `src/pages/Calendar.tsx`
- `src/lib/calendar-items.ts`
- `src/lib/supabase-fallback.ts`
- `src/server/task-route-stage124f.ts`
- `src/server/event-route-stage124f.ts`
- `src/lib/work-items/no-flicker-mutation.ts`

Concrete audit findings:
1. Calendar stores completed task/event retention in localStorage and memory. This can intentionally re-add completed rows after refresh when backend omits them.
2. Completing a Calendar task/event writes completed/done status, then retention keeps a completed row visible.
3. Task/event backend routes hide completed/done from calendar by setting `show_in_calendar=false`.
4. Restore only changes status back to todo/scheduled. It does not explicitly restore `show_in_calendar=true`, so a restored row can remain hidden and disappear after refresh.
5. +1H calculates from the entry snapshot supplied by the rendered row. Repeated fast clicks can operate on stale `entry.raw` or `entry.startsAt` unless the canonical updated row is read back first.
6. Calendar has multiple state layers: events/tasks arrays, selected-day derived entries, completed retention, optimistic shift state, GET cache invalidation, mutation bus, and Google inbound background sync.
7. Today has separate local optimistic updates plus forced refresh after operations. The action contract is not yet shared as one state machine with Calendar.

Required next stage:
`STAGE232T_R3_OPERATIONAL_ENTRY_ACTION_STATE_MACHINE_GUARD`

Required tests before fix is accepted:
- delete task/event from Today cannot return after refresh
- delete task/event from Calendar cannot return after refresh
- newly created then completed task/event cannot produce an active duplicate
- restore completed task/event must update same row and restore calendar visibility
- +1H repeated clicks must use latest canonical timestamp
- +1H and +1D must share canonical payload semantics
- completed retention must not create active duplicates
- Google inbound must not resurrect deleted rows or duplicate completed rows

Non-negotiables:
- no UI hide patch
- no localStorage tombstone as final fix
- no CSS/display/z-index workaround
- no route rollback to old work-items rewrite
- no SQL/RLS/billing/finance/commission unless later audit proves need
- no push with red verify

GitHub issue:
- #5 P0: Today/Calendar task-event state divergence, ghost rows, delete resurrection, +1H drift
