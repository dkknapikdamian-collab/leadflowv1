# Prompt for next AI developer/Codex window - Stage118I Calendar shift real persistence fix

Work in CloseFlow repo only after scan-first.

## Must read first
- `AGENTS.md`, if present
- `_project/` current notes
- `_project/runs/2026-05-18_stage118h_calendar_shift_audit_and_fallback_note_local_only.md`
- `src/pages/Calendar.tsx`
- `src/lib/calendar-items.ts`
- `src/lib/supabase-fallback.ts`
- `api/work-items.ts`
- `src/server/google-calendar-inbound.ts`
- `src/server/google-calendar-sync.ts`
- existing Stage114/118 calendar tests
- related Obsidian note for Stage118H

## Main rule
Do not suppress Google conflict warnings. Damian wants overlap conflicts to remain visible.

## Task
Find and fix why `+1D`, `+1W`, and `+1H` show success but entry stays in old date/time or returns after refresh.

## Required audit
Trace exact flow:
`Calendar.tsx -> updateTaskInSupabase/updateEventInSupabase -> /api/work-items -> work_items -> Google outbound -> Google inbound -> fetchCalendarBundleFromSupabase -> rendered UI`.

## Required output
- exact root cause,
- minimal fix,
- tests/guards,
- `_project` run report,
- Obsidian update,
- no broad month grid or selected-day visual rewrite.

## Fallback option
Emergency fallback `reschedule by recreate` is allowed only if normal persistence fix is too risky:
- create shifted copy first,
- delete original second,
- no delete toast,
- only `Przesunięto` toast,
- preserve Google conflict warnings.

Do not implement fallback without explicitly marking it as fallback and documenting risks.
