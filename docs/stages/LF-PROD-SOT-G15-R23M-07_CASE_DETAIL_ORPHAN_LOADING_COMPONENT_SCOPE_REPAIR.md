---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-07_CASE_DETAIL_ORPHAN_LOADING_COMPONENT_SCOPE_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 5b6203085a3844a775892b92d9c60f06c50e5f09
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-07 - CaseDetail orphan loading component scope repair

## Objective

Remove the unused `CaseDetailLoadingState` declaration from the active
`CaseDetail.tsx` module. Its body references component-local state and a
handler that are not in its lexical scope. The active loading branch already
renders its own loading layout inside `CaseDetail`.

## Evidence and root cause

The fresh TypeScript map at exact base SHA `5b6203085a3844a775892b92d9c60f06c50e5f09`
contains 37 active error lines. The first eight are all unresolved names in
the unreferenced top-level `CaseDetailLoadingState` function:

```text
src/pages/CaseDetail.tsx(1621,15) deleteCaseOpen
src/pages/CaseDetail.tsx(1623,25) deleteCasePending
src/pages/CaseDetail.tsx(1623,44) setDeleteCaseOpen
src/pages/CaseDetail.tsx(1626,60) caseData
src/pages/CaseDetail.tsx(1626,79) caseData
src/pages/CaseDetail.tsx(1627,23) deleteCasePending
src/pages/CaseDetail.tsx(1630,18) deleteCasePending
src/pages/CaseDetail.tsx(1631,20) handleConfirmDeleteCaseRecord
```

Repository search finds no caller for `CaseDetailLoadingState`. The live
component has an independent `if (loading)` branch and renders the delete
confirmation at the bottom of `CaseDetail`, so this declaration is dead code
and does not represent a missing state contract.

```text
ROOT_CAUSE=dead top-level component copied outside the lexical scope of CaseDetail
WHY_THIS_IS_NOT_A_PATCH=remove unreachable code instead of adding duplicate state or broadening scope
SSOT_IMPACT=none; active CaseDetail state, handler, and dialog remain canonical
PREVIOUS_STAGE_IMPACT=none; A2-06 payment fallback contract is untouched
SECURITY_IMPACT=none; no auth, scope, persistence, or trust boundary changes
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/CaseDetail.tsx`.
2. `scripts/check-lf-prod-sot-g15-r23m-07-case-detail-loading-scope.cjs`.
3. `tests/lf-prod-sot-g15-r23m-07-case-detail-loading-scope.test.cjs`.

Do not add state, duplicate the delete handler, change the active loading
branch, change the active dialog, or modify unrelated CaseDetail errors.

## Required checks

1. Fail-first evidence records the exact 37-line map and the eight-error
   orphan-component cluster.
2. Focused guard proves the current source equals the base source with only
   the unused `CaseDetailLoadingState` block removed.
3. Focused Node guard/test pass with positive and negative assertions.
4. Fresh TypeScript mapping verifies 37 -> 29 active error lines and removes
   all eight unresolved names from this cluster.
5. `npm run build` passes.
6. AI Code Guardian architecture/root-cause/diff audit and independent
   subagent review pass before commit.
7. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
ORPHAN_COMPONENT_REMOVED=YES
ACTIVE_LOADING_BRANCH_UNCHANGED=YES
ACTIVE_DELETE_DIALOG_UNCHANGED=YES
NO_DUPLICATE_STATE=YES
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

If a caller or runtime test demonstrates that `CaseDetailLoadingState` is
intended to be active, stop this substage and route a separate component
scope/state contract stage. Static repository evidence currently shows no
caller.

## Registered pre-existing findings

```text
FINDING=R23J_FINANCE_PAYMENT_RECORD_GUARD_SCOPE_DRIFT
SCOPE=pre-existing finance type evolution outside A2-06; carry to A3
FINDING=STAGE227C3_LEGACY_EXPECTATION_DRIFT
SCOPE=pre-existing historical missing-item UI marker drift; carry to A3/D-stage inventory
FINDING=CASE_DETAIL_DELETE_PLACEMENT_LEGACY_GUARD_DRIFT
EVIDENCE=tests/case-detail-delete-placement.test.cjs fails because active delete action lacks historical tooltip/title marker
SCOPE=pre-existing active CaseDetail UI marker drift; no A2-07 active dialog or action code changed
FOLLOWUP=A3/D1 owner-control acceptance and UI guard inventory
FINDING=INDEPENDENT_SUBAGENT_REVIEW_TIMEOUT
EVIDENCE=three bounded mapper/reviewer attempts exceeded wait limit; no reviewer result was used as PASS
SCOPE=review infrastructure finding; controller performed exact staged-scope/Guardian-style audit and recorded this limitation
FOLLOWUP=retry independent review at the next A2 checkpoint

## Controller closeout

```text
STATUS=CLOSED_WITH_REGISTERED_FINDINGS
SOURCE_BASE_SHA=a3b00ffc76a6945cc222997c6a3fd4f1072f7908
FINAL_SHA=852844ccf16df630f14ca72cd4a8be611e125430
FILES_CHANGED=3 implementation files
ROOT_CAUSE_CONFIRMED=YES
WHY_NOT_PATCH=unreachable out-of-scope code was removed; no duplicate state or handler was introduced
TSC=37->29
FOCUSED_GUARD=PASS
FOCUSED_TEST=3/3_PASS
CASE_DETAIL_REGRESSION=17/18_PASS_WITH_PRE_EXISTING_DELETE_PLACEMENT_FINDING
BUILD=PASS
DIFF_CHECK=PASS
GUARDIAN_STYLE_AUDIT=PASS
INDEPENDENT_REVIEW=TIMEOUT_REGISTERED_NO_PASS_CLAIM
FREEBUFF_USED=NO_MCP_EXPOSED
OPENCODE_USED=NO_MCP_EXPOSED
NEXT_STAGE=FRESH_A2_MAP_AND_ROOT_CAUSE_SELECTION
```
```
