# Stage124D V3 - restore tasks/events guard/test fix

Date: 2026-05-19

## Status
LOCAL PATCH APPLIED, COMMIT AFTER GREEN GUARDS ONLY.

## Purpose
Fix Stage124D guard/test false positives without changing the task/event route logic.

## What V3 changes
- Rewrites `scripts/check-stage124d-task-event-routes.cjs`.
- Rewrites `tests/stage124d-task-event-routes.test.cjs`.
- Ensures `package.json` exposes `check:stage124d-task-event-routes`.
- Does not modify `api/tasks.ts` or `api/events.ts`.

## Why
Stage124D V2 route logic built successfully, but the guard/test still had faulty regex checks:
- invalid regex around limit,
- false positive where `/select=*/i` matched ordinary `select=` strings.

## Required checks
- `npm run check:stage124d-task-event-routes`
- `node --test tests/stage124d-task-event-routes.test.cjs`
- `npm run check:stage124-supabase-egress-contract`
- `npm run build`

## Commit policy
Do not use `git add .`.
Only commit explicit Stage124D files after all checks are green.
