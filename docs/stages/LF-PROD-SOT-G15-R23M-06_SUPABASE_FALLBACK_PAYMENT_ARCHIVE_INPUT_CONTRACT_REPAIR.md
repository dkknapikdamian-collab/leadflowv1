---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-06_SUPABASE_FALLBACK_PAYMENT_ARCHIVE_INPUT_CONTRACT_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 8dfa73871536ce3c60b44051987af8e2f7961990
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-06 — Supabase fallback payment archive input contract repair

## Objective

Remove the stale `includeArchived` payment filter from the dev-preview path.
Preserve the existing payment query, normalization, supported filters, and API
behavior without inventing an archived-payment contract.

## Evidence and root cause

The fresh map at the exact base SHA reports 38 active TypeScript error lines.
The first error is:

```text
src/lib/supabase-fallback.ts(477,20) TS2339
Property 'includeArchived' does not exist on type fetchPayments params
```

The archive-cascade change in historical commit `5061eb595ced2c7f3042b9440074b1bdbd389e77`
added the dev-preview filter but omitted the corresponding input property in
the function signature. The payment API and canonical payment statuses do not
define an archived payment status, dev-preview payment data contains no
archived payment records, and `/api/payments` ignores `includeArchived`.
Adding the property would falsely advertise a remote contract. The bounded
repair removes the dead branch instead.

```text
ROOT_CAUSE=stale dev-preview archive branch reads an unsupported payment contract
WHY_THIS_IS_NOT_A_PATCH=the unsupported branch is removed instead of expanding a false public input type
SSOT_IMPACT=none; payment types and server API remain unchanged
PREVIOUS_STAGE_IMPACT=none; A2-05 missing-item union repair is untouched
SECURITY_IMPACT=none; no workspace, authorization, or persistence boundary changes
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/lib/supabase-fallback.ts`.
2. `scripts/check-lf-prod-sot-g15-r23m-06-payment-archive-filter.cjs`.
3. `tests/lf-prod-sot-g15-r23m-06-payment-archive-filter.test.cjs`.

Do not change `src/server/payments.ts`, payment status types, API query
construction, callers, dependencies, or archive semantics.

## Required checks

1. Fail-first evidence records the exact 38-line map and TS2339 location.
2. The focused guard proves the source equals the base source with only
   the stale `includeArchived` archive branch removed from the payment preview filter.
3. Focused Node guard/test pass with positive and negative assertions.
4. Existing payment/data-contract tests relevant to the fallback pass.
5. Fresh TypeScript mapping verifies 38 -> 37 active errors.
6. `npm run build` passes.
7. AI Code Guardian audit and independent subagent review pass before commit.
8. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
PAYMENT_ARCHIVE_FILTER_REMOVED=YES
PAYMENT_RUNTIME_SEMANTICS_UNCHANGED=YES
NO_API_EXPANSION=YES
NO_ANY_BYPASS=YES
NO_TS_IGNORE_BYPASS=YES
FOCUSED_GUARD=PASS
FOCUSED_TEST=PASS
TSC_ROOT_CAUSE_REMOVED=YES
BUILD=PASS
ALLOWLIST=PASS
INDEPENDENT_REVIEW=PASS
```

## Recovery boundary

If callers or the server require a real archived-payment behavior, stop and
route a separate product/data contract stage. This A2 substage removes only
the stale preview branch.

## Registered pre-existing test finding

```text
FINDING=R23J_FINANCE_PAYMENT_RECORD_GUARD_SCOPE_DRIFT
EVIDENCE=tests/lf-prod-sot-g15-r23j-finance-payment-record-contract.test.cjs reports finance-types.ts changes outside its historical exact-additions scope
SCOPE=pre-existing finance type evolution outside the A2-06 three-file allowlist; relevant payment runtime tests pass
FOLLOWUP=legacy guard inventory during A3 terminal SOT closeout
```

## Controller closeout

```text
STATUS=PASS_ON_WORK_BRANCH_WITH_REGISTERED_FINDINGS
SOURCE_BASE_SHA=8dfa73871536ce3c60b44051987af8e2f7961990
FINAL_SHA=8c0113cdce71bf16c16a82896bcbb2e0f8065e86
FILES_CHANGED=3 implementation files
ROOT_CAUSE_CONFIRMED=YES
WHY_NOT_PATCH=the unsupported archive branch is removed without changing supported payment runtime or API behavior
TSC=38->37
FOCUSED_GUARD=PASS
FOCUSED_TEST=3/3_PASS
PAYMENT_TESTS=RELEVANT_RUNTIME_TESTS_18/18_PASS_WITH_R23J_GUARD_FINDING
BUILD=PASS
DIFF_CHECK=PASS
GUARDIAN_STYLE_AUDIT=PASS
INDEPENDENT_REVIEW=PASS
FREEBUFF_USED=NO_MCP_EXPOSED
OPENCODE_USED=NO_MCP_EXPOSED
NEXT_STAGE=FRESH_A2_MAP_AND_ROOT_CAUSE_SELECTION
```
