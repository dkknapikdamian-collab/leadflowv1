Status: MANUAL_UI_PASS_CONFIRMED_BY_DAMIAN / PRODUCT_PASS / TECH_PUSHED
# STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION

- Status: TECH_PUSHED / SERVER_UI_REQUIRED
- Date: 2026-06-14 16:55 Europe/Warsaw
- Repo: dkknapikdamian-collab/leadflowv1
- Branch: dev-rollout-freeze
- Scope: CaseDetail finance correction modal.

## Problem

After R1C/R1D, the modal list is visually cleaner, but correction lifecycle is still incomplete:
- commission payments show no `Koryguj` path because `canCorrectCasePaymentStage220A27` blocks `commission`;
- payment correction creates a refund-only correction record instead of editing the payment fields that were originally added;
- payment correction does not let the user edit original payment date and description/note as a normal correction;
- cost correction edits amount/status/note, but not all operational fields visible at creation/use, especially kind and date.

## Runtime decision

- Payment correction updates the existing payment via `updatePaymentInSupabase`.
- Commission payments are correctable.
- Payment correction form edits: amount, paidAt/date, note/description.
- Cost correction form edits: cost kind/date/status/note and money fields.
- Existing cost update/delete flow remains through `updateCaseCostInSupabase` and `deleteCaseCostFromSupabase`.
- SQL untouched.

## Guards/tests

Required:
- `node scripts/check-stage231h-r1-case-detail-function-mapping-audit.cjs`
- `node --test tests/stage231h-r1-case-detail-function-mapping-audit.test.cjs`
- `node scripts/check-stage231h-r1b-case-detail-runtime-repair.cjs`
- `node --test tests/stage231h-r1b-case-detail-runtime-repair.test.cjs`
- `node scripts/check-stage231h-r1c-case-detail-cost-correction-modal.cjs`
- `node --test tests/stage231h-r1c-case-detail-cost-correction-modal.test.cjs`
- `node scripts/check-stage231h-r1d-finance-correction-modal-compact.cjs`
- `node --test tests/stage231h-r1d-finance-correction-modal-compact.test.cjs`
- `node scripts/check-stage231h-r1f-payment-and-cost-full-correction.cjs`
- `node --test tests/stage231h-r1f-payment-and-cost-full-correction.test.cjs`
- `npm run build`
- `git diff --check`

## Manual server check

After push/deploy:
1. In `Koryguj wpłatę/koszt`, commission payment rows show `Koryguj`.
2. `Koryguj` on a commission payment opens a form with amount, date and note/description.
3. Saving updates the same payment; it does not create a refund-only correction row.
4. Refresh confirms payment amount/date/note persist.
5. `Koryguj` on a cost allows changing kind, date, amount, reimbursable, reimbursed, status and note.
6. Refresh confirms cost corrections persist.
7. Delete cost still removes the cost after refresh.

## Risk audit

- If PATCH `/api/payments` rejects updates for current schema, backend payment update repair is required.
- If payment notes are not persisted by API normalization, payments endpoint must be checked next.
- This stage does not close R1C2 memory; it fixes a runtime gap discovered during server UI verification.

## R1G2_CLOSEOUT_STATUS_SYNC

- Status changed to TECH_PUSHED / SERVER_UI_REQUIRED.
- Payment and cost correction runtime is guarded, but server manual UI remains required.


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
