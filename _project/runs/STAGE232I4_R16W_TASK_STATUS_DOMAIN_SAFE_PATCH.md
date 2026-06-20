# STAGE232I4_R16W_TASK_STATUS_DOMAIN_SAFE_PATCH

Date/time: 2026-06-20 13:05 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Problem
Runtime smoke after R16V no longer failed with `existing is not defined`; it reached the backend/database layer and failed with:

`work_items_status_domain_check` because the PATCH sent `status = missing_item`.

`missing_item` is a work-item type/source, not a valid `work_items.status` value.

## Scope
- sanitize `updateTaskInSupabase` before PATCH,
- remove invalid status values from task patch payload,
- preserve approved compact manager layout,
- add guard/test.

## Not touched
SQL, finances, calendar, Owner Control, CaseDetail.

## Expected tests
- R16W guard PASS
- R16W node test PASS
- npm run build PASS
- git diff --check PASS
- browser smoke: checkbox toggles with no 23514 constraint error
