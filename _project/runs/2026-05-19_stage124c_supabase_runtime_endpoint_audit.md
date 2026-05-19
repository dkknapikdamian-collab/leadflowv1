# 2026-05-19 - Stage124C Supabase runtime endpoint audit

## Status
Prepared as audit-first ZIP stage. Do not treat this as a code optimization patch yet.

## Why
Stage124A reduced list payload size for leads/clients/cases and passed guard/test/build. Stage124B request-dedupe was intentionally reverted after repeated guard/test failures. The next safe move is to resolve the real runtime route source for `/api/tasks` and `/api/events` before patching task/event range queries.

## Scope
- Scan runtime files for `/api/tasks` and `/api/events` call sites.
- Detect matching local API route files.
- Detect heavy `work_items?select=*` task/event patterns.
- Write audit result to `_project/runs/2026-05-19_stage124c_supabase_runtime_endpoint_audit_result.md`.
- Keep this stage local-only and no push by default.

## Rules
- Do not use `git add .`.
- Do not patch `src/lib/supabase-fallback.ts` in this stage.
- Do not change Calendar UI.
- If audit reports blockers, next stage must resolve route source first.

## Expected commands
- `node tools/audit-stage124c-supabase-runtime-endpoints.cjs`
- `node scripts/check-stage124c-supabase-runtime-endpoints.cjs`
- `node --test tests/stage124c-supabase-runtime-endpoints.test.cjs`
- `npm run build`
