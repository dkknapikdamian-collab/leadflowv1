# STAGE232I4_R16Y_R2_MISSING_BLOCKER_SOURCE_TRUTH_ROBUST_FINAL — Obsidian update

Date: 2026-06-20 15:35 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

Prepared local patch. Update central files after PASS + push.

## Summary

R16Y_R2 aligns the client missing blocker source truth: blocker state is persisted as legal `priority: high/medium`, and ClientDetail now recognizes `priority === high` as blocker. It also preserves the accepted compact modal and makes delete action visible.

## Tests required

- guard PASS
- node test PASS
- build PASS
- diff check PASS
- manual smoke: checkbox updates main tile + F5 stable + delete visible

## Risks

If state still does not reflect after F5, backend PATCH may ignore `priority`; next audit should inspect `/api/system?apiRoute=tasks` update mapping, not modal UI.
