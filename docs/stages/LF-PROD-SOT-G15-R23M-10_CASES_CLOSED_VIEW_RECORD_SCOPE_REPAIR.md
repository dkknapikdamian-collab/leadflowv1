---
typ: implementation_stage
doc_role: active_stage_contract
status: active
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-10_CASES_CLOSED_VIEW_RECORD_SCOPE_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: c44dd3d0ab01a1fdc67546694900309ae2fbd703
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-10 - Cases closed-view record scope repair

## Objective

Use the existing `record` parameter inside the closed-view contract's
`matches(record, caseView)` function. Remove the stale `caseRecord` reference
without changing the closed/open/all semantics or the canonical
`isClosedCaseStatus` helper.

## Evidence and root cause

The fresh TypeScript map at exact base SHA `c44dd3d0ab01a1fdc67546694900309ae2fbd703`
contains 26 active error lines. The first two diagnostics are the same
undefined-identifier root cause:

```text
src/pages/Cases.tsx(114,53): error TS2304: Cannot find name 'caseRecord'.
src/pages/Cases.tsx(114,82): error TS2304: Cannot find name 'caseRecord'.
```

The containing function declares `matches(record: { status?: unknown },
caseView: CaseView)`. The stale expression references `caseRecord` twice even
though no such binding exists in that scope. The canonical closed-state helper
already accepts the record status. The minimal repair is therefore to use the
existing function parameter directly.

```text
ROOT_CAUSE=closed-view contract references a stale identifier instead of its record parameter
WHY_THIS_IS_NOT_A_PATCH=restore the function's declared input binding and preserve the existing status helper and view semantics
SSOT_IMPACT=none; isClosedCaseStatus remains the canonical closed-state helper
PREVIOUS_STAGE_IMPACT=none; A2-09 case-item API/audit contract remains untouched
SECURITY_IMPACT=none; no authorization, persistence, scope, or trust boundary changes
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/Cases.tsx`.
2. `scripts/check-lf-prod-sot-g15-r23m-10-cases-closed-view-record-scope.cjs`.
3. `tests/lf-prod-sot-g15-r23m-10-cases-closed-view-record-scope.test.cjs`.

Do not change `isClosedCaseStatus`, the route parser, lifecycle helpers,
`OwnerRiskContext`, or any later TypeScript error cluster.

## Required checks

1. Fail-first evidence records the exact 26-line map and both TS2304 columns.
2. Focused guard proves the current `Cases.tsx` equals the exact base source
   with only the stale expression replaced by `isClosedCaseStatus(record?.status)`.
3. Focused Node guard/test pass with positive and negative assertions.
4. Existing Cases lifecycle/archive navigation guards and focused tests pass.
5. Fresh TypeScript mapping verifies 26 -> 24 active error lines.
6. `npm run build` passes.
7. AI Code Guardian root-cause/scope/security audit and an independent review
   are attempted before closeout; unavailable reviews are registered.
8. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
CASES_CLOSED_VIEW_RECORD_SCOPE_REPAIRED=YES
CLOSED_OPEN_ALL_SEMANTICS_UNCHANGED=YES
CANONICAL_STATUS_HELPER_UNCHANGED=YES
NO_ANY_BYPASS=YES
NO_TS_IGNORE_BYPASS=YES
FOCUSED_GUARD=PASS
FOCUSED_TEST=PASS
TSC_ROOT_CAUSE_REMOVED=YES
BUILD=PASS
ALLOWLIST=PASS
```
