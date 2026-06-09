# Stage228R55 — supabase-fallback syntax repair after R54

- data: 2026-06-09 10:25 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow
- stage: STAGE228R55_REPAIR_SUPABASE_FALLBACK_SYNTAX

## Problem

R54 guard stack passed but production build failed in `src/lib/supabase-fallback.ts` with malformed `updateTaskInSupabase` syntax:

```txt
Unexpected ")" near line 699
```

## Fix

Replaced the broken `updateTaskInSupabase` block with a valid async function that:
- awaits `callApi('/api/tasks', PATCH)`,
- emits no-flicker update mutation with `id: input.id`,
- returns the API result.

## Guard/test

- `scripts/check-stage228r55-supabase-fallback-syntax-repair.cjs`
- `tests/stage228r55-supabase-fallback-syntax-repair.test.cjs`

## Risk audit

- Main risk: previous R50-R54 partial local patches created guard-stack drift. R55 limits scope to syntax repair and does not change Calendar.
- Manual test after deploy: create/delete `CF_DEL_TEST_4` from LeadDetail and TasksStable, refresh page, verify no return and no full flicker.
