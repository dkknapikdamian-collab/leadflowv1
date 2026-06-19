# STAGE232I4_R9_WORK_ITEMS_STATUS_DOMAIN_SAFE

Date/time: 2026-06-19 11:20 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Problem
After R8, production rejected client missing item creation:
`work_items_status_domain_check` rejected `status = blocking_missing_item`.

## Fix
Do not write `missing_item` or `blocking_missing_item` into `work_items.status`.
Use DB-safe task status through `normalizeTaskStatus('todo')` for active missing items, keep missing item truth in `type = missing_item`, `client_id`, source fields, and blocker signal through priority/high.

## Guard
- `scripts/check-stage232i4-r9-work-items-status-domain-safe.cjs`
- `tests/stage232i4-r9-work-items-status-domain-safe.test.cjs`

## Scope
Touched: `api/work-items.ts`, R9 guard/test/docs only.
Not touched: UI, SQL, Google Calendar runtime beyond preserving R8 no-calendar-sync condition.

## Status
Prepared as patch package. Requires local apply, guards, build, selective commit/push, Vercel smoke.
