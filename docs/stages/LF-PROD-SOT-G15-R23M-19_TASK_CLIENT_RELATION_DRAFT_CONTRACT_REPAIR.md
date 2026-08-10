---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-19_TASK_CLIENT_RELATION_DRAFT_CONTRACT_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 9d9ef57c96130414c993a95c35b0c97b51840bb0
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-19 - Task client relation draft contract repair

## Objective

Keep the task creation draft's `clientId` field consistent across initial
state, reset state and relation-picker memo dependencies. Preserve task save
payloads and the existing topic/contact source of truth.

## Evidence and root cause

The fresh TypeScript map at exact base SHA
`9d9ef57c96130414c993a95c35b0c97b51840bb0` contains 11 active error lines.
The first diagnostic is `src/pages/Tasks.tsx(470,16)`: the reset object omits
`clientId` even though the inferred draft state and save path require it.
Inspection also found both relation-picker memo dependency lists omit the same
field, allowing stale selected-client UI after a client-only relation change.

```text
ROOT_CAUSE=task draft clientId contract is incomplete in reset and memo dependencies
WHY_THIS_IS_NOT_A_PATCH=restore one existing relation field across all local draft lifecycle paths
SSOT_IMPACT=topic-contact resolver remains the single relation source of truth
PREVIOUS_STAGE_IMPACT=A2-18 Leads rescue display scope remains untouched
SECURITY_IMPACT=preserve existing workspace-scoped task save path; no new access path
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/Tasks.tsx`.
2. `scripts/check-lf-prod-sot-g15-r23m-19-task-client-relation.cjs`.
3. `tests/lf-prod-sot-g15-r23m-19-task-client-relation.test.cjs`.

Do not remove `clientId` from the type, picker, or persistence payloads, and
do not add casts or bypasses.

## Required checks

1. Fail-first evidence records the exact 11-line map and missing reset field.
2. Focused guard/test proves initial/reset state and both memo dependency lists
   include `clientId`.
3. Relevant task relation and client/task edit tests pass.
4. Fresh TypeScript mapping verifies 11 -> 10 active error lines.
5. `npm run build` passes.
6. AI Code Guardian root-cause/scope audit and independent review are
   attempted; unavailable reviews are registered.
7. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
INITIAL_CLIENT_ID=YES
RESET_CLIENT_ID=YES
NEW_PICKER_DEPENDENCY_CLIENT_ID=YES
EDIT_PICKER_DEPENDENCY_CLIENT_ID=YES
TASK_SAVE_CLIENT_ID_PRESERVED=YES
NO_ANY_BYPASS=YES
NO_TS_IGNORE_BYPASS=YES
FOCUSED_GUARD=PASS
FOCUSED_TEST=PASS
TSC_ROOT_CAUSE_REMOVED=YES
BUILD=PASS
ALLOWLIST=PASS
```

## Closeout evidence

```text
STATUS=PASS_ON_WORK_BRANCH_WITH_REGISTERED_FINDINGS
SOURCE_BASE_SHA=9d9ef57c96130414c993a95c35b0c97b51840bb0
IMPLEMENTATION_SHA=0a3035353a62051a6bab6b85bc2d693304bc7c93
FILES_CHANGED=src/pages/Tasks.tsx;scripts/check-lf-prod-sot-g15-r23m-19-task-client-relation.cjs;tests/lf-prod-sot-g15-r23m-19-task-client-relation.test.cjs
TSC=11->10
FOCUSED_TESTS=3/3_PASS
RELATED_TESTS=CLIENT_TASK_RELATION_REGRESSION_6/6_PASS
BUILD=PASS
DIFF_CHECK=PASS
ALLOWLIST=3_IMPLEMENTATION_FILES_PASS
GUARDIAN_STYLE_AUDIT=PASS_CONTROLLER_AUDIT
MAPPER_REVIEW=TIMEOUT_REGISTERED_NO_PASS_CLAIM
INDEPENDENT_REVIEW=TIMEOUT_REGISTERED_NO_PASS_CLAIM
FREEBUFF_USED=NO_MCP_EXPOSED
OPENCODE_USED=NO_MCP_EXPOSED
NEXT_STAGE=FRESH_A2_MAP_AND_ROOT_CAUSE_SELECTION
```

### Registered findings

1. `MAPPER_SUBAGENT_TIMEOUT`: bounded root-cause mapper did not return before
   timeout; local diagnosis and fail-first evidence remain authoritative.
2. `INDEPENDENT_SUBAGENT_REVIEW_TIMEOUT`: bounded reviewer did not return
   before timeout; no independent PASS is claimed.
3. `A2_TSC_REMAINING_DEBT`: 10 independent active error lines remain in
   Today, TodayStable and PWA.
4. Checkpoint findings from A2-01..A2-18 remain active, including
   Supabase/auth/migration/workspace-scope and AI draft-only guard failures.
