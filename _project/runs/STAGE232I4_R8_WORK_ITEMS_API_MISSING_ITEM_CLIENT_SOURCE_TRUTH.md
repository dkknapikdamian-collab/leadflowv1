# STAGE232I4_R8_WORK_ITEMS_API_MISSING_ITEM_CLIENT_SOURCE_TRUTH

Date: 2026-06-19 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch: dev-rollout-freeze

## Purpose
Fix the real source-of-truth path for ClientDetail missing items. `/api/tasks` is not a standalone `api/tasks.ts`; Vercel rewrites it to `/api/work-items?kind=tasks`. This stage patches `api/work-items.ts`.

## Findings
- R7 failed because it targeted missing `api/tasks.ts`.
- Vercel `vercel.json` rewrites `/api/tasks` to `/api/work-items?kind=tasks`.
- Existing work item POST normalized task statuses and types in a way that could turn `missing_item` into a normal `task/todo` item.

## Change
- Preserve `missing_item` / `blocking_missing_item` status and raw missing type.
- Save `client_id` on work_items POST.
- Return client/source/payload compatibility fields from normalizeTask.
- Keep missing items out of Google Calendar sync.

## Tests
- scripts/check-stage232i4-r8-work-items-api-missing-source-truth.cjs
- tests/stage232i4-r8-work-items-api-missing-source-truth.test.cjs
- Existing R14/R6 guards/tests
- npm run build
- git diff --check
