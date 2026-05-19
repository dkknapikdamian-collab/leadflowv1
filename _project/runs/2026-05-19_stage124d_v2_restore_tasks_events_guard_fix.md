# Stage124D V2 - guard fix for restored task/event routes

Date: 2026-05-19
Branch: dev-rollout-freeze
Mode: ZIP/local-only, manual commit/push after review

## Reason

Stage124D created api/tasks.ts and api/events.ts, Stage124A guard stayed green, node test passed, and build passed. The Stage124D guard failed before assertions due to an invalid JavaScript regex in scripts/check-stage124d-task-event-routes.cjs.

## Change

- Replace fragile regex assertion with token includes checks in Stage124D guard.
- Refresh Stage124D node test to use token assertions.
- Do not change api/tasks.ts or api/events.ts behavior.

## Required tests

- npm run check:stage124d-task-event-routes
- node --test tests/stage124d-task-event-routes.test.cjs
- npm run check:stage124-supabase-egress-contract
- npm run build
