# STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS

Status: PRODUCT_PASS / MANUAL_UI_PASS_CONFIRMED_BY_DAMIAN / DOCS_ONLY

Date: 2026-06-14 18:55 Europe/Warsaw

## Scope

Record Damian's manual server UI confirmation after STAGE231H_R1G2.

This stage does not change runtime code, SQL, Supabase, Google Calendar, LeadDetail, billing/trial, or AI Drafts.

## Manual confirmation

Damian confirmed:

```txt
jest ok testy reczne
```

Meaning: the CaseDetail cost/payment lifecycle that was previously technically pushed and marked SERVER_UI_REQUIRED is now product-confirmed.

## Product area confirmed

- commission payment add/correction persists after refresh;
- cost type `Inny` exposes required custom name;
- reimbursable cost affects `Koszty poniesione`, `Koszty do zwrotu`, and `Razem do pobrania`;
- non-reimbursable cost affects only `Koszty poniesione`;
- cost correction persists after refresh;
- deleted test cost does not return after refresh.

## Not included

- STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME
- STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING
- STAGE231F_R2_GOOGLE_CALENDAR_MULTI_USER_OWNERSHIP_AND_SYNC_CLOSEOUT

## Tests

Required:

```txt
node scripts/check-stage231h-r1g3-case-detail-manual-ui-pass.cjs
node --test tests/stage231h-r1g3-case-detail-manual-ui-pass.test.cjs
npm run build
git diff --check
```

## Risk audit

The main risk is treating the whole CaseDetail module as done. This stage closes only the cost/payment lifecycle already covered by R1B/R1C/R1F/R1F4/R1G/R1G2 and confirmed manually by Damian.

Next runtime work must stay separated:
1. R1D2 note dictation restore.
2. R1E reimbursed cost marking.
