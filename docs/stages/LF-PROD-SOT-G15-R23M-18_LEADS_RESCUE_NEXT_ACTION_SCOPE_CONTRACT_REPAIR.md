---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-18_LEADS_RESCUE_NEXT_ACTION_SCOPE_CONTRACT_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 638e64f87160ff615113fb54428ac81cd54f91b4
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-18 - Leads rescue next-action scope repair

## Objective

Use the rescue-row contract already present in the rescue branch and remove a
stale reference to `nextActionMeta`, which belongs to the ordinary lead-row
branch. Preserve the rescue row's title and schedule display.

## Evidence and root cause

The fresh TypeScript map at exact base SHA
`638e64f87160ff615113fb54428ac81cd54f91b4` contains 12 active error lines.
The first diagnostic is:

```text
src/pages/Leads.tsx(1115,65): error TS2304: Cannot find name 'nextActionMeta'
```

The rescue branch already renders `row.nextMoveTitle` and `row.nextMoveAt`;
`nextActionMeta` is declared only inside the later ordinary lead-row callback.

```text
ROOT_CAUSE=ordinary lead-row local variable referenced from the separate rescue-row branch
WHY_THIS_IS_NOT_A_PATCH=use the rescue row's existing canonical display fields
SSOT_IMPACT=preserve row data as the rescue branch source of truth; do not duplicate the builder
PREVIOUS_STAGE_IMPACT=A2-17 callback return contracts remain untouched
SECURITY_IMPACT=display-only change; no authorization, mutation or data boundary change
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/Leads.tsx`.
2. `scripts/check-lf-prod-sot-g15-r23m-18-leads-rescue-next-action.cjs`.
3. `tests/lf-prod-sot-g15-r23m-18-leads-rescue-next-action.test.cjs`.

Do not move `nextActionMeta` across render scopes, create a duplicate builder,
or change ordinary lead-row behavior.

## Required checks

1. Fail-first evidence records the exact 12-line map and rescue branch scope
   error.
2. Focused guard/test proves rescue rows use their existing next-move fields
   and ordinary rows retain `nextActionMeta`.
3. Relevant Leads and next-action tests pass.
4. Fresh TypeScript mapping verifies 12 -> 11 active error lines.
5. `npm run build` passes.
6. AI Code Guardian root-cause/scope audit and independent review are
   attempted; unavailable reviews are registered.
7. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
RESCUE_SCOPE_CORRECT=YES
ORDINARY_ROW_CONTRACT_PRESERVED=YES
NO_DUPLICATE_BUILDER=YES
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
SOURCE_BASE_SHA=638e64f87160ff615113fb54428ac81cd54f91b4
IMPLEMENTATION_SHA=1de50be0da1670c5220dbc7423377a31ac62e835
FILES_CHANGED=src/pages/Leads.tsx;scripts/check-lf-prod-sot-g15-r23m-18-leads-rescue-next-action.cjs;tests/lf-prod-sot-g15-r23m-18-leads-rescue-next-action.test.cjs
TSC=12->11
FOCUSED_TESTS=3/3_PASS
RELATED_TESTS=A25_GUARDS_BASELINE_DRIFT_REGISTERED
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
3. `A25_RELATED_GUARD_DRIFT`: existing nearest-action checks fail on a stale
   LeadDetail label/import expectation and a missing extensionless runtime
   module; outside this display-only rescue scope.
4. `A2_TSC_REMAINING_DEBT`: 11 independent active error lines remain in Tasks,
   Today, TodayStable and PWA.
5. Checkpoint findings from A2-01..A2-17 remain active, including
   Supabase/auth/migration/workspace-scope and AI draft-only guard failures.
