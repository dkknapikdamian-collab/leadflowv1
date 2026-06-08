# 2026-06-08 21:50 Europe/Warsaw - Stage228R18R5 - missing item hard delete mass preflight

## Routing
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App/

## Problem
LeadDetail Brak disappeared after click but returned after hard refresh. Earlier R18 packages did not safely change runtime because their patch/apply scripts failed.

## Fix direction
Stage228R18R5 uses mass preflight and a hard-delete contract:
- add `hardDeleteTaskFromSupabase(taskId)` in `supabase-fallback.ts`,
- LeadDetail missing_item delete calls hard DELETE,
- local UI filters item immediately,
- silent refresh runs after delete,
- guard is wired into prebuild.

## Tests
- node scripts/check-stage228r18r5-missing-item-hard-delete-source-truth.cjs
- node --test tests/stage228r18r5-missing-item-hard-delete-source-truth.test.cjs
- npm run build
- git diff --check
- manual: add Brak -> hard refresh -> Usun -> hard refresh -> Brak does not return

## Risk sweep
Hard delete removes the work_item row. This matches user expectation for Brak delete. Activity/history can remain, but it must not rebuild active Brak state.
