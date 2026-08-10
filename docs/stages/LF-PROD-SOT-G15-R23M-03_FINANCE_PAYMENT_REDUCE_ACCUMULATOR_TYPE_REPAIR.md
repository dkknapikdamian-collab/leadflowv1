---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_finding
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-03_FINANCE_PAYMENT_REDUCE_ACCUMULATOR_TYPE_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 5501ee0f1f9bc61bb1f768f4bae64da1f8b47422
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-03 — Finance payment reduce accumulator type repair

## Objective

Make the three payment reducers in `src/lib/finance/case-finance-source.ts`
explicitly numeric with `.reduce<number>(...)`. Preserve every payment filter,
refund sign, amount normalizer, and finance source-of-truth rule.

## Evidence and root cause

The fresh map at the exact base SHA has 44 active error lines. The first group
is:

```text
src/lib/finance/case-finance-source.ts(298,14) TS2365 unknown + number
src/lib/finance/case-finance-source.ts(300,33) TS2345 unknown is not assignable to number
src/lib/finance/case-finance-source.ts(308,33) TS2365 unknown + number
src/lib/finance/case-finance-source.ts(349,33) TS2365 unknown + number
```

All three reducers operate on arrays typed `unknown[]`, so the unannotated
initial `0` does not establish a numeric accumulator in the active compiler
configuration. The fourth error is the resulting `total: unknown` flowing to
`Math.max`.

```text
ROOT_CAUSE=three unknown[] reducers leave the accumulator inferred as unknown
WHY_THIS_IS_NOT_A_PATCH=state the existing numeric accumulator contract at each reduction boundary
SSOT_IMPACT=none; payment rows remain the source for paid/refund amounts
PREVIOUS_STAGE_IMPACT=none; A2-02 runtime access-plan source is unchanged
SECURITY_IMPACT=none; no authorization, billing authority, or tenant boundary changes
```

## Bounded read set

Read before implementation:

1. `src/lib/finance/case-finance-source.ts` around `paymentAmount` and the three
   reducers.
2. `tests/case-finance-source.test.cjs`.
3. relevant payment/commission source tests and existing finance guards.
4. the fresh TypeScript map at `5501ee0f1f9bc61bb1f768f4bae64da1f8b47422`.

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/lib/finance/case-finance-source.ts`
2. `scripts/check-lf-prod-sot-g15-r23m-03-finance-payment-reduce.cjs`
3. `tests/lf-prod-sot-g15-r23m-03-finance-payment-reduce.test.cjs`

The contract and workflow are controller metadata and are not part of the
implementation commit. Do not change finance types, callers, dependencies,
payment semantics, or billing behavior.

## Required checks

1. Fail-first evidence records the four listed errors and 44 total lines.
2. The focused guard proves the current source equals the base source with only
   three `.reduce<number>` accumulator annotations.
3. Focused Node guard/test pass with positive and negative assertions.
4. Existing `tests/case-finance-source.test.cjs` and relevant finance static
   tests pass. Any unrelated pre-existing UI test failure is recorded with
   exact path and is not repaired in this accumulator-only substage.
5. Fresh TypeScript mapping reports 44 -> 40 active error lines.
6. `npm run build` passes.
7. AI Code Guardian audit and independent subagent review pass before commit.
8. `git diff --check` and exact three-file scope pass.

## PASS conditions

```text
ACTIVE_TSC_DELTA=44->40
FINANCE_PAYMENT_SEMANTICS_UNCHANGED=YES
NO_ANY_BYPASS=YES
NO_TS_IGNORE_BYPASS=YES
FOCUSED_GUARD=PASS
FOCUSED_TEST=PASS
FINANCE_TESTS=PASS_OR_PREEXISTING_FAILURE_REGISTERED
BUILD=PASS
ALLOWLIST=PASS
INDEPENDENT_REVIEW=PASS
```

## Pre-existing finding observed during execution

```text
FINDING=FIN14_PAYMENT_BUTTON_LABEL_EXPECTATION_MISMATCH
TEST=tests/fin14-payment-types.test.cjs
FAILURE=expects "Dodaj płatność prowizji" but existing component renders "Dodaj wpłatę prowizji"
SCOPE=outside A2-03; no UI component or copy file changed
FOLLOWUP=product/acceptance finance copy decision before D-stage acceptance
```

## Recovery boundary

The executor may change only the three implementation files and must stop
before A2-04. If the expected four-error reduction does not occur, preserve
the branch and remap the error class rather than broadening this stage.

## Controller closeout

```text
STATUS=PASS_ON_WORK_BRANCH_WITH_REGISTERED_FINDING
SOURCE_BASE_SHA=5501ee0f1f9bc61bb1f768f4bae64da1f8b47422
ROUTER_BASE_SHA=1179c4e2f4afefc0cdff3f02b543354bd6802b87
FINAL_SHA=c4599df72af7552d50db70660d5479e82c4dc20f
FILES_CHANGED=3 implementation files; contract evidence is recorded separately
ROOT_CAUSE_CONFIRMED=YES
WHY_NOT_PATCH=numeric accumulator type is declared at the existing reducer boundaries; payment logic is untouched
FINANCE_PAYMENT_SEMANTICS_UNCHANGED=YES
TSC=44->40
FOCUSED_GUARD=PASS
FOCUSED_TEST=3/3_PASS
RELEVANT_FINANCE_TESTS=21/21_PASS
CLEAN_CHECKOUT_GUARD_AND_TESTS=24/24_PASS
DIFF_CHECK=PASS
BUILD=PASS
GUARDIAN_STYLE_AUDIT=PASS
INDEPENDENT_REVIEW=PASS
FINANCE_TESTS=PASS_WITH_REGISTERED_FINDING
FREEBUFF_USED=NO_MCP_EXPOSED
OPENCODE_USED=NO_MCP_EXPOSED
NEXT_STAGE=FRESH_A2_MAP_AND_ROOT_CAUSE_SELECTION
```

The registered FIN14 finding is outside this reducer-only scope. The failing
test expects `Dodaj płatność prowizji`, while the unchanged existing component
renders `Dodaj wpłatę prowizji`; the exact relevant finance source and payment
tests pass in a clean checkout. Product/acceptance review must decide whether
the test or UI copy is canonical before D-stage acceptance.
