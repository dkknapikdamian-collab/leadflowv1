# STAGE231E2_R8A_PLAN_MATRIX_LIMIT_ROW_HOTFIX

Date: 2026-06-13 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status
LOCAL_ONLY_PACKAGE_FIX2.

## Why FIX2 exists
The first R8A package used an exact `activeEvents` row anchor. The current matrix row text differed from that exact anchor, so apply stopped. FIX2 searches for a row containing the `activeEvents` key and falls back to appending a separate row if the table anchor is not found.

## AUDYT PRZED ETAPEM
R8 was pushed as commit `c1fd8320`, but the dedicated R8 guard failed before push because the central plan matrix missed the `activeTasksAndEvents` limit row.

## FAKTY
- `PlanLimits` contains `activeTasksAndEvents`.
- R8 guard requires every limit in `PlanLimits` to be represented in `_project/06_STAGE231E2_PLAN_ENTITLEMENT_MATRIX.md`.
- Runtime code was not the problem; this is a matrix/documentation completeness issue.

## ZMIANA
- Added `activeTasksAndEvents` row to `_project/06_STAGE231E2_PLAN_ENTITLEMENT_MATRIX.md`.
- Added R8A note in the same matrix file.

## TESTY / GUARDY
Run:
- `node scripts/check-stage231e2-r8-sidebar-polish-and-plan-wiring.cjs`
- `node scripts/check-stage231e2-r7-trial-access-bootstrap-repair.cjs`
- `node scripts/check-stage231e2-trial-14d-contract.cjs`
- `node scripts/check-stage231e2-plan-entitlement-matrix.cjs`
- `npm run build`
- `git diff --check`

## AUDYT PO ETAPIE
- This fixes the exact R8 guard failure.
- No runtime, SQL, Stripe, Google Calendar or billing logic changed.
- Existing Stage231D local files remain out of scope.

## MANUAL TEST
After push and deploy, refresh sidebar and verify:
- `Trial aktywny`
- `14 dni`
- no mojibake.