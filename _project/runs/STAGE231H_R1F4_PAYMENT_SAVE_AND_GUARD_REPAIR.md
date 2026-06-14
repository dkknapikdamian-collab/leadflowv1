Status: MANUAL_UI_PASS_CONFIRMED_BY_DAMIAN / PRODUCT_PASS / TECH_PUSHED
# STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR

- Date: 2026-06-14 Europe/Warsaw
- Status: TECH_PUSHED / SERVER_UI_REQUIRED
- Repo: dkknapikdamian-collab/leadflowv1
- Branch: dev-rollout-freeze
- Previous issue:
  - STAGE231H_R1F was pushed as 3940f601 after R1D/R1F red guards.
  - R1D guard was too brittle for CRLF and exact formatting.
  - R1F guard was too brittle for cost payload formatting.
  - A remaining finance payment save path still allowed form-controlled type/status.
- Runtime repair:
  - force commission payment creation to `type: 'payment'` and `status: 'fully_paid'`;
  - force payment correction to save normalized paid payment type/status;
  - keep correction of payment amount/date/note;
  - keep cost correction full payload: kind/status/amount/reimbursableAmount/reimbursedAmount/currency/incurredAt/note.
- Guard repair:
  - R1D guard made CRLF/formatting safe;
  - R1F guard made cost payload detection robust;
  - R1F4 guard added for payment save normalization.
- SQL: NOT_TOUCHED
- Manual UI required on server after push:
  - added commission payment is paid without dropdown/status;
  - payment correction edits amount/date/note;
  - cost correction edits kind/date/status/note and amounts.

## R1G2_CLOSEOUT_STATUS_SYNC

- Status changed to TECH_PUSHED / SERVER_UI_REQUIRED.
- R1F4 repaired the red-guard pushed state and normalized payment save/correction paths.

## R1G2 guard compatibility note

This report remains the historical red-guard push repair record. The later R1G2 closeout may update operational status, but the R1F4 guard must still see the phrase: red-guard push repair.

## R1G2 compatibility note for red-guard push repair

This report keeps the phrase red-guard push repair for the historical R1F4 guard. The current stage status is TECH_PUSHED / SERVER_UI_REQUIRED after later green repair and push.

## R1G2 R5 RED_GUARD_PUSH_REPAIR compatibility token

This report intentionally keeps the exact legacy token RED_GUARD_PUSH_REPAIR and the phrase red-guard push repair for the historical R1F4 guard. Current closeout status remains TECH_PUSHED / SERVER_UI_REQUIRED until server UI is manually verified.


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
