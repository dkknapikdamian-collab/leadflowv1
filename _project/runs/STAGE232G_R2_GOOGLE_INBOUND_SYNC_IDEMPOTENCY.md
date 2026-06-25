# STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY

Data/czas: 2026-06-25 12:20 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

APPLIED_LOCAL_PENDING_GUARDS_AND_OWNER_SMOKE

## Problem

Google inbound sync could return duplicate-key 500 for unique constraint idx_work_items_google_calendar_source_external.

## Fix

- Canonical key: workspace_id + source_provider=google_calendar + source_external_id.
- Existing canonical event -> update.
- Missing canonical event -> insert.
- Duplicate race 23505 / duplicate key -> find canonical row and update as deduped, not 500.
- Single bad event -> errors[], not whole sync failure.

## Tests

Required:
- node scripts/check-stage232g-r2-google-inbound-sync-idempotency.cjs
- node --test tests/stage232g-r2-google-inbound-sync-idempotency.test.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## Manual smoke

1. Run Google inbound sync.
2. Run same sync again.
3. No duplicate-key 500.
4. Google events do not duplicate.
5. Manual task/event rows are not touched.
6. Calendar retention R1I/R3 still works.

## Risk audit

Do not remove unique constraint. No SQL/RLS/migrations in this stage.
