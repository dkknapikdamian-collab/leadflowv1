# STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL

- Status: LOCAL_PACKAGE_PREPARED / DO_TEST_AND_PUSH / MANUAL_UI_REQUIRED
- Date: 2026-06-14 Europe/Warsaw
- Repo: dkknapikdamian-collab/leadflowv1
- Branch: dev-rollout-freeze
- SQL: NOT_TOUCHED

## Scope

Manual R1B test showed a real blocker: costs can be added and counted in summary, but cannot be edited/corrected from CaseDetail.

This stage adds a simple correction path:

- finance rail button becomes `Koryguj wpłatę/koszt`,
- the correction modal lists payments/corrections and costs in one place,
- costs are shown as red rows,
- cost rows have `Koryguj` and `Usuń`,
- cost correction uses `updateCaseCostInSupabase`,
- cost delete uses `deleteCaseCostFromSupabase`,
- SQL is not changed.

## Manual test required

1. Add a cost.
2. Open `Koryguj wpłatę/koszt`.
3. Confirm cost appears as a red row.
4. Correct cost amount/status/reimbursed fields.
5. Refresh.
6. Confirm summary changes and correction persists.
7. Delete a test cost.
8. Refresh.
9. Confirm the cost does not return.

## Risk audit

- If API route for `PATCH /api/cases?resource=costs` or `DELETE /api/cases?resource=costs&id=...` is incomplete, guard/build can pass but manual runtime write can fail.
- Cost correction directly updates the cost row, not an immutable ledger. This is acceptable for simple V1, but full immutable audit ledger remains a later finance-hardening stage.
- Old dirty `231D0D/231D0E/231D0F/231D0H` files must not be included in this commit.
