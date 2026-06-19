# Obsidian update — STAGE232I4_R8_WORK_ITEMS_API_MISSING_ITEM_CLIENT_SOURCE_TRUTH

Date: 2026-06-19 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status
R8 patches the real backend target for `/api/tasks`: `api/work-items.ts`, because Vercel rewrites `/api/tasks` to `/api/work-items?kind=tasks`.

## Why
Manual Vercel smoke showed history entries were created, but ClientDetail missing tile and manager stayed empty. Network showed `/api/tasks` and `/api/system?apiRoute=tasks` returned 200. This points to source/type/status normalization in the work-items API, not the UI tile.

## Files
- api/work-items.ts
- scripts/check-stage232i4-r8-work-items-api-missing-source-truth.cjs
- tests/stage232i4-r8-work-items-api-missing-source-truth.test.cjs
- _project/runs/STAGE232I4_R8_WORK_ITEMS_API_MISSING_ITEM_CLIENT_SOURCE_TRUTH.md

## Not touched
SQL/RLS, finance, Google Calendar config, billing, Owner Control I3, CaseDetail runtime.
