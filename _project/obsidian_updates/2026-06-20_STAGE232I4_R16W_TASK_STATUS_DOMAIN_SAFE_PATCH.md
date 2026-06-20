# 2026-06-20 13:05 Europe/Warsaw — STAGE232I4_R16W_TASK_STATUS_DOMAIN_SAFE_PATCH

Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status
Prepared local ZIP stage to fix backend constraint error after R16V.

## Finding
Checkbox toggle now reaches backend but fails with database check constraint:
`work_items_status_domain_check`.
Failing row has `status = missing_item`.

## Decision
`missing_item` must not be sent as `work_items.status`. It remains a type/source classification. `updateTaskInSupabase` must sanitize status before calling `/api/system?apiRoute=tasks`.

## Tests required
- guard
- node test
- build
- diff-check
- manual smoke: checkbox can be unchecked/checked with no 23514 error.

## Risk
If error persists after R16W, inspect server-side PATCH mapping in `/api/system?apiRoute=tasks` and task handler status/domain mapping.
