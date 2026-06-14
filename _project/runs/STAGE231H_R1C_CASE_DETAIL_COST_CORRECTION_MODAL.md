Status: MANUAL_UI_PASS_CONFIRMED_BY_DAMIAN / PRODUCT_PASS / TECH_PUSHED
# STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL

- Status: TECH_PUSHED / SERVER_UI_REQUIRED
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

## R1G2_CLOSEOUT_STATUS_SYNC

- Status changed to TECH_PUSHED / SERVER_UI_REQUIRED.
- R1C cost correction/delete path is superseded and extended by R1F/R1G, but still requires server manual UI verification before product PASS.


## STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS — manual UI confirmation

- date: 2026-06-14 18:55 Europe/Warsaw
- confirmation: Damian confirmed manual server UI tests: "jest ok testy reczne".
- result: PRODUCT_PASS for CaseDetail cost/payment lifecycle after R1G2 docs closeout.
- confirmed area:
  - commission payment add/correction persists after refresh;
  - cost type Inny exposes required cost name;
  - reimbursable cost adds to costs incurred, costs to reimburse, and total to collect;
  - non-reimbursable cost adds only to costs incurred;
  - cost correction persists type, custom name, date, amount, reimbursable flag, status, and note after refresh;
  - deleted test cost does not return after refresh.
- not included in this PASS:
  - STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME;
  - STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING;
  - Google Calendar closeout.
- risk audit: this closes the already shipped cost/payment lifecycle only. Future reimbursement marking must not reuse R1D name and must keep the finance summary source of truth intact.
