---
typ: implementation_stage
doc_role: active_stage_contract
status: active
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-08_CASE_DETAIL_NOTE_FOLLOWUP_LOCAL_TASK_SCOPE_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: ddab9c5d869a892effadea59fea4026dfc6e1dcb
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-08 - CaseDetail note follow-up local task scope repair

## Objective

Use the function-local `task` argument when resolving a note follow-up
preview in `findCaseNoteForFollowUpTaskStage231H_R1D2_R15C`. Do not move the
missing-activity bridge variable out of its existing `openTasks` memo scope.

## Evidence and root cause

The fresh TypeScript map at exact base SHA `ddab9c5d869a892effadea59fea4026dfc6e1dcb`
contains 29 active error lines. The first error is:

```text
src/pages/CaseDetail.tsx(3021,52) TS2304
Cannot find name 'taskWithMissingBridgeStage232O'
```

The identifier is created only inside the `openTasksWithNoteFollowUpPreview`
memo. The failing call is inside a separate function that already receives
the required `task` argument. The active delete flow calls that function with
the task being deleted. The correct repair is one argument substitution; the
two later `CaseItemInput` payload errors are a separate input-contract stage.

```text
ROOT_CAUSE=out-of-scope bridge variable referenced inside note follow-up helper
WHY_THIS_IS_NOT_A_PATCH=use the existing function-local input; do not widen lexical scope or duplicate bridge state
SSOT_IMPACT=none; existing note follow-up preview helper remains canonical
PREVIOUS_STAGE_IMPACT=none; A2-07 only removed an unrelated orphan component
SECURITY_IMPACT=none; no auth, scope, persistence, or trust boundary changes
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/CaseDetail.tsx`.
2. `scripts/check-lf-prod-sot-g15-r23m-08-case-detail-note-followup-scope.cjs`.
3. `tests/lf-prod-sot-g15-r23m-08-case-detail-note-followup-scope.test.cjs`.

Do not change `buildWorkItems`, `openTasksWithNoteFollowUpPreview`, the
missing-activity bridge helper, task API contracts, or CaseItemInput types.

## Required checks

1. Fail-first evidence records the exact 29-line map and TS2304 location.
2. Focused guard proves the source equals the base source with only the
   out-of-scope preview argument changed from the bridge variable to `task`.
3. Focused Node guard/test pass with positive and negative assertions.
4. Existing Stage232P/O and CaseDetail delete/follow-up tests pass.
5. Fresh TypeScript mapping verifies 29 -> 28 active error lines.
6. `npm run build` passes.
7. AI Code Guardian root-cause/scope/diff audit and independent subagent
   review are attempted before closeout; any unavailable review is registered.
8. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
LOCAL_TASK_ARGUMENT_USED=YES
BRIDGE_MEMO_SCOPE_UNCHANGED=YES
NO_DUPLICATE_BRIDGE_STATE=YES
NO_ANY_BYPASS=YES
NO_TS_IGNORE_BYPASS=YES
FOCUSED_GUARD=PASS
FOCUSED_TEST=PASS
TSC_ROOT_CAUSE_REMOVED=YES
BUILD=PASS
ALLOWLIST=PASS
```
