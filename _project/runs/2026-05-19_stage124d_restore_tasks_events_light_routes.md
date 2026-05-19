# Stage124D - restore tasks/events lightweight API routes

Date: 2026-05-19
Branch: dev-rollout-freeze
Mode: ZIP/local-only, manual commit/push after review

## Goal

Resolve Stage124C blockers by restoring tracked /api/tasks and /api/events route files with lightweight, scoped ListDTO reads.

## What changed

- api/tasks.ts added/restored.
- api/events.ts added/restored.
- Both routes avoid select=*.
- Both routes use explicit list select constants.
- Both routes resolve workspace from request context and apply workspace filters.
- Both routes support optional from/to range params.
- Both routes keep POST/PATCH/DELETE functionality.

## Tests

Run:
- npm run check:stage124d-task-event-routes
- node --test tests/stage124d-task-event-routes.test.cjs
- npm run check:stage124-supabase-egress-contract
- npm run build

## Obsidian update

CloseFlow Supabase egress P0 memory already exists in Obsidian. This stage adds repo-side run/report and should be summarized there after commit.
