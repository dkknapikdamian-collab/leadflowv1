# Stage123 - Calendar task shift payload source repair

## Scan-first confirmation

- Project: CloseFlow / LeadFlow.
- Branch expected: `dev-rollout-freeze`.
- Context: after Stage122, production runs the new bundle and API requests return 200, but task cards still do not move after `+1D/+1W/+1H`.
- Audited files: `src/pages/Calendar.tsx`, `src/lib/scheduling.ts`, `src/lib/task-event-contract.ts`, `api/work-items.ts`, `src/lib/supabase-fallback.ts`.

## FAKTY Z KODU / PLIKÓW

- `handleShiftEntry()` and `handleShiftEntryHours()` compute a new task date, but the previous implementation passed `{ ...entry.raw, dueAt: shifted }` into `syncTaskDerivedFields()`.
- `syncTaskDerivedFields()` derives task date from `getTaskStartAt()`, and `getTaskStartAt()` normalizes from `scheduledAt` first.
- If `entry.raw.scheduledAt` still contains the old date, it wins over the newly supplied `dueAt`.
- Backend PATCH can therefore return 200 while receiving the old scheduled date.

## DECYZJE DAMIANA

- Fix the real calendar shift bug now.
- Stop pursuing PWA/auth/Google after Stage122 proved runtime/API is alive.

## ZMIANY

- Task day shift now overwrites `scheduledAt`, `scheduled_at`, `dueAt`, `due_at`, `date`, and `time` before calling `syncTaskDerivedFields()`.
- Task hour shift applies the same rule.
- Task update payload sends `scheduledAt: shiftedStartAt` and `dueAt: shiftedStartAt` directly.
- Optimistic state now updates snake_case and camelCase task/event date fields.
- Added `tests/stage123-calendar-task-shift-payload-source-contract.test.cjs`.
- Wired Stage123 into `package.json` and `scripts/closeflow-release-check-quiet.cjs`.

## TESTY AUTOMATYCZNE

Expected apply checks:
- `node --test tests/stage123-calendar-task-shift-payload-source-contract.test.cjs`
- `node --test tests/stage121-calendar-shift-lead-branch-contract.test.cjs`
- `node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs`
- `node --test tests/stage114-calendar-shift-persistence-contract.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

## TEST RĘCZNY

1. Open `/calendar`.
2. Pick a visible task, e.g. `Zadanie 10:08`.
3. Click `+1D`; the task must move to tomorrow.
4. Click `+1W`; it must move 7 days ahead.
5. Click `+1H`; only the hour must change.
6. Hard refresh and confirm the moved date persists.

## BRAKI I RYZYKA

- This specifically repairs task payload source. If a pure event or pure lead still fails after this, handle it as a separate source-specific bug.
- If Google Calendar inbound later overwrites a moved event, that is a sync precedence bug, not this task payload bug.

## OBSIDIAN UPDATE

- Add/update `10_PROJEKTY/CloseFlow_Lead_App/2026-05-18 - CloseFlow Stage123 task shift payload source.md`.
- Record root cause, tests, and manual verification plan.


## V2 - cwd / System32 apply fix

FAKT: V1 failed when launched from `C:\WINDOWS\System32` because the patcher used `process.cwd()` and searched for `src/pages/Calendar.tsx` under System32.

ZMIANA: patcher now resolves repo root from its own location under `repo/tools`, and apply script temporarily enters `$Repo` while running Node/npm checks. Product patch remains the same Stage123 task shift payload repair.


## V3 quiet gate anchor fix

FAKT: V2 applied the Calendar/package changes but stopped while wiring the quiet release gate because it searched for an exact Stage122 anchor string.

ZMIANA V3: quiet gate registration is now structural. It inserts Stage123 after Stage122, Stage121, or Stage120 if present, and verifies the Stage123 test appears exactly once.


## V4 - Stage114 compatibility mass gate

FAKT: V3 fixed the task shift source but failed the older Stage114 guard because updateTaskInSupabase used `date: shiftedDate`, `scheduledAt: shiftedStartAt`, `dueAt: shiftedStartAt`, `time: shiftedTime` instead of the historical contract `date: taskPayload.date`, `scheduledAt: taskPayload.dueAt`, `dueAt: taskPayload.dueAt`, `time: taskPayload.time`.

DECYZJA: keep the real Stage123 fix by overwriting scheduledAt/scheduled_at/dueAt/due_at before `syncTaskDerivedFields`, but preserve the Stage114 API payload shape by sending taskPayload fields.

TESTY: Stage123, Stage114, Stage121, Stage122, PWA foundation, Vercel budget, build, verify:closeflow:quiet.
