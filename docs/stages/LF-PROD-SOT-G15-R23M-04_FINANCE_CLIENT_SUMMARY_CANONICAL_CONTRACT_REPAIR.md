---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-04_FINANCE_CLIENT_SUMMARY_CANONICAL_CONTRACT_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: b695965e3540d7f2675be94241b4cd959bf40534
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-04 — Finance client summary canonical contract repair

## Objective

Align `buildClientFinanceSummary` with the current canonical `FinanceSummary`
contract without adding a second public finance shape. Preserve the FIN-7
client/case aggregation inputs and the existing component-facing fields.

## Evidence and root cause

The fresh A2 map at the exact base SHA reports 40 active TypeScript error lines.
The first error is:

```text
src/lib/finance/finance-client-summary.ts(140,5) TS2561
Object literal may only specify known properties, and plannedAmount does not
exist in type FinanceSummary
```

`buildClientFinanceSummary` was introduced by FIN-7 against an older summary
shape. The later FIN-1 compatibility repair made `FinanceSummary` extend the
canonical `FinanceSnapshot` and added compatibility aliases, but the FIN-7
builder still returns the historical `plannedAmount`, `dueAmount`, and
`refundedAmount` fields while omitting current snapshot fields. A repository
search found no active source caller reading those three historical fields;
the active FIN-7 component reads `contractValue`, `commissionAmount`,
`paidAmount`, `remainingAmount`, and `currency`.

The canonical implementation for a complete `FinanceSummary` is
`buildFinanceSummary` in `src/lib/finance/finance-calculations.ts`. The bounded
repair must delegate completion of the canonical shape to that helper rather
than expanding `FinanceSummary` or creating another calculator.

```text
ROOT_CAUSE=FIN-7 builder return shape drifted from the later canonical FinanceSummary contract
WHY_THIS_IS_NOT_A_PATCH=the builder is routed through the existing canonical finance calculator
SSOT_IMPACT=FinanceSummary remains the single public summary shape; no historical fields are added
PREVIOUS_STAGE_IMPACT=none; A2-03 payment reducer typing and semantics remain unchanged
SECURITY_IMPACT=none; no authorization, tenant, billing authority, or provider boundary changes
```

## Bounded read set

1. `src/lib/finance/finance-client-summary.ts`.
2. `src/lib/finance/finance-types.ts`.
3. `src/lib/finance/finance-calculations.ts` and its payment/commission tests.
4. `src/components/finance/FinanceMiniSummary.tsx` and active FIN-7 guards.
5. The fresh A2 map at `b695965e3540d7f2675be94241b4cd959bf40534`.

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/lib/finance/finance-client-summary.ts`.
2. `scripts/check-lf-prod-sot-g15-r23m-04-finance-client-summary.cjs`.
3. `tests/lf-prod-sot-g15-r23m-04-finance-client-summary.test.cjs`.

Do not add fields to `FinanceSummary`, change FIN-7 component copy, change
payment normalization, alter database/API contracts, or modify dependencies.

## Required checks

1. Fail-first evidence records the 40-line map and the `plannedAmount`
   contract error.
2. The focused guard proves the source keeps the FIN-7 aggregation inputs,
   routes the complete result through `buildFinanceSummary`, and does not
   retain the three stale output properties.
3. Focused Node guard/test pass with positive and negative assertions.
4. Existing FIN-7, finance-domain, case-finance, and relevant finance tests
   pass. The previously registered FIN14 copy mismatch remains outside this
   type-contract substage unless independently changed.
5. Fresh TypeScript mapping verifies the exact post-change error count and
   root-cause removal.
6. `npm run build` passes.
7. AI Code Guardian audit and independent subagent review pass before commit.
8. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
FINANCE_SUMMARY_CANONICAL_SOT=YES
STALE_OUTPUT_FIELDS_REMOVED=YES
NO_FINANCE_TYPE_EXPANSION=YES
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

If the canonical delegation changes a tested FIN-7 runtime rule, stop before
broadened edits and remap the contract. Do not repair the issue by adding
historical fields to `FinanceSummary`, weakening the type, or introducing a
second summary helper.

## Registered findings observed during execution

```text
FINDING=LEGACY_FIN7_STATIC_GUARD_DRIFT
EVIDENCE=scripts/check-closeflow-fin7-client-finance-summary.cjs reports four missing historical UI markers
SCOPE=current FIN13 client-finance runtime replaced the historical FIN-7 mount; no A2-04 UI file changed
FOLLOWUP=review legacy guard ownership during A3 terminal SOT closeout

FINDING=LEGACY_FINANCE_CONTRACT_GUARD_DRIFT
EVIDENCE=scripts/check-closeflow-finance-contract.cjs reports five missing historical API markers; finance-domain guard reports CaseSettlementPanel compatibility drift
SCOPE=pre-existing API/component architecture drift outside the three-file A2-04 allowlist
FOLLOWUP=classify or retire stale guards at A3/D-stage acceptance; do not broaden A2-04

FINDING=FIN13_STATIC_EXPECTATION_DRIFT
EVIDENCE=tests/fin13-client-case-finances.test.cjs expects `caseId: row.caseId`, while current source uses `caseId: getCaseId(caseRecord)`
SCOPE=pre-existing test expectation mismatch; current case grouping helpers remain present and A2-04 does not change FinanceMiniSummary.tsx
FOLLOWUP=review with FIN13 source-of-truth guard during A3/D1

FINDING=HISTORICAL_R23H_R23I_GUARD_SCOPE_DRIFT
EVIDENCE=R23H/R23I focused guards reject unrelated historical changes in current finance files
SCOPE=pre-existing guard scope drift outside A2-04
FOLLOWUP=legacy guard inventory during A3
```

## Controller closeout

```text
STATUS=PASS_ON_WORK_BRANCH_WITH_REGISTERED_FINDINGS
SOURCE_BASE_SHA=b695965e3540d7f2675be94241b4cd959bf40534
FINAL_SHA=2a0ff8fe280066b857d822b118aaa620ba93d392
FILES_CHANGED=3 implementation files
ROOT_CAUSE_CONFIRMED=YES
WHY_NOT_PATCH=canonical FinanceSummary completion is delegated to the existing source-of-truth calculator
TSC=40->39
FOCUSED_GUARD=PASS
FOCUSED_TEST=4/4_PASS_PLUS_RUNTIME_SMOKE_PASS
FINANCE_TESTS=PASS_WITH_REGISTERED_FINDINGS
BUILD=PASS
DIFF_CHECK=PASS
GUARDIAN_STYLE_AUDIT=PASS
INDEPENDENT_REVIEW=PASS
FREEBUFF_USED=NO_MCP_EXPOSED
OPENCODE_USED=NO_MCP_EXPOSED
NEXT_STAGE=FRESH_A2_MAP_AND_ROOT_CAUSE_SELECTION
```
