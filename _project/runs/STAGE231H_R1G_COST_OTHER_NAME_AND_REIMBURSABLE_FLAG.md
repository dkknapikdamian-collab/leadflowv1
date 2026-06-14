# STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG

- Date: 2026-06-14 Europe/Warsaw
- Status: LOCAL_PACKAGE_PREPARED / DO_TEST_AND_PUSH
- Repo: dkknapikdamian-collab/leadflowv1
- Branch: dev-rollout-freeze
- SQL: NOT_TOUCHED

## Scan-first evidence
- Read AGENTS.md.
- Read _project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md.
- Checked that _project/CODEX_CONTEXT_INDEX.md is missing in this repo.
- Read current CaseDetail cost/payment runtime after R1F4.
- Read central cost summary source: src/lib/finance/case-costs-source.ts.

## Audit before stage
R1F4 is pushed and green in the uploaded log. The next active runtime issue is cost creation/editing:
- cost kind `other` has no separate human name field;
- the add-cost dialog has a hidden reimbursable boolean in state, but no visible user control;
- correction currently treats empty reimbursable amount as full amount, so without an explicit toggle a non-reimbursable cost can become reimbursable during correction;
- finance summary already supports the correct model if `reimbursable=false` and `reimbursableAmount=0` are persisted.

## Scope
- Add visible name field when cost kind is `other`.
- Store custom other-name without SQL by prefixing it into existing note text.
- Add visible `Koszt do zwrotu` checkbox in create and correction dialogs, default checked.
- If checked: reimbursable=true and reimbursableAmount=amount or entered amount.
- If unchecked: reimbursable=false, reimbursableAmount=0, reimbursedAmount=0.
- Keep non-reimbursable costs in `Koszty poniesione` only.
- Keep reimbursable costs in `Koszty do zwrotu` and `Razem do pobrania`.

## Guard/test plan
- R1G guard verifies add/edit forms, payloads, summary model and docs.
- R1/R1B/R1D/R1F/R1F4/R1G guard/test should pass.
- npm run build must pass.
- git diff --check must pass.

## Manual test on server after push/deploy
1. Open CaseDetail.
2. Add cost with type `Inny`.
3. Confirm `Nazwa kosztu` appears and is required.
4. Leave `Koszt do zwrotu` checked, save cost, verify it appears in `Koszty poniesione`, `Koszty do zwrotu` and `Razem do pobrania`.
5. Add second cost with `Koszt do zwrotu` unchecked.
6. Verify it appears in `Koszty poniesione` only and does not increase `Koszty do zwrotu` nor `Razem do pobrania`.
7. Correct both costs and verify name, flag, date, amount, status and note persist after refresh.

## Audit after stage
To be completed after apply/push and server verification.
