# STAGE231H_R1D_FINANCE_CORRECTION_MODAL_COMPACT

- Date: 2026-06-14 15:45 Europe/Warsaw
- Project: CloseFlow / LeadFlow
- Branch: dev-rollout-freeze
- Status: PASS_TECHNICAL_PUSH_READY / MANUAL_UI_REQUIRED
- Scope: compact cleanup of CaseDetail `Koryguj wpłatę/koszt` modal after R1C.

## Changes

- Removed redundant cost status chip from the correction list.
- Kept cost status editable inside the cost correction form.
- Removed redundant `Korekta / prowizja` fallback label from payment rows.
- Removed commission payment status/type selectors from the add-payment UI — commission payment status/type selectors removed.
- Commission payment write now uses implicit paid defaults: `type: payment`, `status: fully_paid`.
- SQL: NOT_TOUCHED.

## Guard / tests

- `scripts/check-stage231h-r1d-finance-correction-modal-compact.cjs`
- `tests/stage231h-r1d-finance-correction-modal-compact.test.cjs`

## Manual UI test required

1. Open `Koryguj wpłatę/koszt`.
2. Cost rows should fit better without `Status: Poniesiony`.
3. Payment rows should not show redundant `Korekta / prowizja` text.
4. Add commission payment: no status/type choice should be visible.
5. Refresh and verify payment remains in settlement/history.
6. Correct and delete a cost, then refresh.
