# STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC

Date: 2026-06-14 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: DOCS_ONLY_CLOSEOUT / TECH_SYNC_READY / SERVER_UI_REQUIRED

## Purpose

Docs-only closeout for the CaseDetail finance/cost/payment sequence after R1B/R1C/R1F/R1F4/R1G were pushed. This stage does not change runtime code and does not change SQL.

## Scan-first files

- AGENTS.md
- _project/04_ETAPY_ROZWOJU_APLIKACJI.md
- _project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md
- _project/06_GUARDS_AND_TESTS.md
- _project/08_CHANGELOG_AI.md
- _project/10_PROJECT_TIMELINE.md
- _project/13_TEST_HISTORY.md
- R1B/R1C/R1F/R1F4/R1G run reports
- CaseDetail finance/cost source mapping files by reference from prior stages

## Closeout decision

R1B/R1C/R1F/R1F4/R1G are treated as TECH_PUSHED / SERVER_UI_REQUIRED. Manual UI remains required before calling CaseDetail finance/cost lifecycle fully complete.

## Stage order now used

1. STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR_AND_CLOSEOUT
2. STAGE231H_R1C_CASE_DETAIL_COST_CORRECTION_MODAL
3. STAGE231H_R1F_PAYMENT_AND_COST_FULL_CORRECTION
4. STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR
5. STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG
6. STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC
7. STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME
8. STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING

## Tests

Required chain:
- R1 guard/test
- R1B guard/test
- R1C historical guard/test: SKIP if file does not exist
- R1D finance modal guard/test
- R1F guard/test
- R1F4 guard/test
- R1G guard/test
- R1G4 guard/test
- R1G2 guard/test
- npm run build
- git diff --check

## Risk audit

- R1C guard file is historical and may be absent in the repo. R1G2 records this as SKIP instead of failing closeout.
- R1D name collision is preserved in history but future dictation runtime must use R1D2.
- R1G runtime is pushed, but server UI validation still determines product PASS.
- R1E reimbursed cost marking remains a separate runtime stage.

## Manual UI remains required

Manual UI remains required for commission payment correction, custom other cost name, reimbursable flag, non-reimbursable totals, correction persistence after refresh, and delete-after-refresh behavior.


## R5 repair note

R5 fixes R1F4 legacy guard compatibility by preserving exact RED_GUARD_PUSH_REPAIR token while keeping current status honest as TECH_PUSHED / SERVER_UI_REQUIRED. Runtime remains untouched.
