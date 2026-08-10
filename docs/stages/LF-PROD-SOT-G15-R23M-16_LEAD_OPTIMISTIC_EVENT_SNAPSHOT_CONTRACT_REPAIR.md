---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-16_LEAD_OPTIMISTIC_EVENT_SNAPSHOT_CONTRACT_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 046dc10730033e13a1570ff31d11d621904b9002
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-16 - Lead optimistic event snapshot contract repair

## Objective

Keep the existing optimistic event-delete rollback contract type-safe by
declaring the snapshot in the shared scope of `handleDeleteLinkedEvent`.
Preserve the optimistic removal, backend delete, activity record, silent
refresh and catch rollback behavior.

## Evidence and root cause

The fresh TypeScript map at exact base SHA `046dc10730033e13a1570ff31d11d621904b9002`
contains 17 active error lines. The first diagnostic is:

```text
src/pages/LeadDetail.tsx(2209,23): error TS2304: Cannot find name 'optimisticEventSnapshot'
```

`optimisticEventSnapshot` is declared inside the `try` block and consumed by
the sibling `catch` block. The rollback is required by the existing optimistic
delete contract; removing it would trade a compile error for a user-visible
data-loss/recovery regression.

```text
ROOT_CAUSE=optimisticEventSnapshot is scoped to try but consumed by catch
WHY_THIS_IS_NOT_A_PATCH=restore the existing rollback contract at its correct lexical scope
SSOT_IMPACT=linkedEvents remains the single local event-list state owner
PREVIOUS_STAGE_IMPACT=preserve A2-15 LeadActionButton pointer contract
SECURITY_IMPACT=preserve existing event delete authorization and backend boundary; no new trust path
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/LeadDetail.tsx`.
2. `scripts/check-lf-prod-sot-g15-r23m-16-lead-optimistic-event-snapshot.cjs`.
3. `tests/lf-prod-sot-g15-r23m-16-lead-optimistic-event-snapshot.test.cjs`.

Do not remove the rollback, change event-delete semantics, add casts or
TypeScript bypasses, or create a second event store.

## Required checks

1. Fail-first evidence records the exact 17-line map and out-of-scope snapshot
   declaration.
2. Focused guard/test proves shared snapshot scope and preserved optimistic
   delete/rollback flow.
3. Relevant event-delete/no-flicker tests pass.
4. Fresh TypeScript mapping verifies 17 -> 16 active error lines.
5. `npm run build` passes.
6. AI Code Guardian root-cause/scope/security audit and independent review are
   attempted; unavailable reviews are registered.
7. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
SNAPSHOT_SHARED_SCOPE=YES
OPTIMISTIC_REMOVE_PRESERVED=YES
BACKEND_DELETE_PRESERVED=YES
ROLLBACK_PRESERVED=YES
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
SOURCE_BASE_SHA=046dc10730033e13a1570ff31d11d621904b9002
IMPLEMENTATION_SHA=b6df0edea54e48d422a36abd76274270186e4e0e
FILES_CHANGED=src/pages/LeadDetail.tsx;scripts/check-lf-prod-sot-g15-r23m-16-lead-optimistic-event-snapshot.cjs;tests/lf-prod-sot-g15-r23m-16-lead-optimistic-event-snapshot.test.cjs
TSC=17->16
FOCUSED_TESTS=3/3_PASS
RELATED_TESTS=STAGE228R50_AND_R53_GUARDS_TESTS_PASS
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
   timeout; local evidence and fail-first map remain authoritative.
2. `INDEPENDENT_SUBAGENT_REVIEW_TIMEOUT`: bounded reviewer did not return
   before timeout; no independent PASS is claimed.
3. `A2_TSC_REMAINING_DEBT`: 16 independent active error lines remain in
   LeadDetail callback return types, Leads, Tasks, Today, TodayStable and PWA.
4. Checkpoint findings from A2-01..A2-15 remain active, including
   Supabase/auth/migration/workspace-scope and AI draft-only guard failures.
