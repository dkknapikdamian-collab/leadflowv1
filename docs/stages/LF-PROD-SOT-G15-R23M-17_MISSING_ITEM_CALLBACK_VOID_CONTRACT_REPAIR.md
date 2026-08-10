---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-17_MISSING_ITEM_CALLBACK_VOID_CONTRACT_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: b94f069f2ec553cab6d2db449158f48173632dea
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-17 - Missing-item callback void contract repair

## Objective

Align the four `MissingItemsManagerDialog` callbacks with their declared
`void | Promise<void>` contract. Preserve authorization checks, validation
messages, persistence, activity writes, refreshes and delete confirmation.

## Evidence and root cause

The fresh TypeScript map at exact base SHA `b94f069f2ec553cab6d2db449158f48173632dea`
contains 16 active error lines. The first four diagnostics are the callback
cluster in `LeadDetail.tsx(2999-3002)`. The handlers use `return toast.error(...)`;
the toast API returns `string | number`, which leaks into the async callback
return type even though the dialog contract expects `void`.

```text
ROOT_CAUSE=toast return values leak through async MissingItemsManager callbacks
WHY_THIS_IS_NOT_A_PATCH=make the existing callback contract explicit without changing behavior
SSOT_IMPACT=MissingItemsManagerDialog remains the single callback contract owner
PREVIOUS_STAGE_IMPACT=A2-16 optimistic event rollback remains untouched
SECURITY_IMPACT=preserve hasAccess gates and validation before all mutations
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/LeadDetail.tsx`.
2. `scripts/check-lf-prod-sot-g15-r23m-17-missing-item-callback-void.cjs`.
3. `tests/lf-prod-sot-g15-r23m-17-missing-item-callback-void.test.cjs`.

Do not change the dialog prop types, suppress diagnostics, remove auth gates,
or alter persistence and activity behavior.

## Required checks

1. Fail-first evidence records the exact 16-line map and toast-return drift.
2. Focused guard/test proves explicit void returns in all four callbacks and
   preserved mutation/auth tokens.
3. Relevant MissingItemsManager and Stage228 missing-item tests pass.
4. Fresh TypeScript mapping verifies 16 -> 12 active error lines.
5. `npm run build` passes.
6. AI Code Guardian root-cause/scope/security audit and independent review are
   attempted; unavailable reviews are registered.
7. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
CALLBACK_RETURN_CONTRACT_ALIGNED=YES
AUTH_GATES_PRESERVED=YES
VALIDATION_PRESERVED=YES
MUTATION_PATHS_PRESERVED=YES
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
SOURCE_BASE_SHA=b94f069f2ec553cab6d2db449158f48173632dea
IMPLEMENTATION_SHA=5dae45edd52a4772e7e6fd4d56cb6342e841fd76
FILES_CHANGED=src/pages/LeadDetail.tsx;scripts/check-lf-prod-sot-g15-r23m-17-missing-item-callback-void.cjs;tests/lf-prod-sot-g15-r23m-17-missing-item-callback-void.test.cjs
TSC=16->12
FOCUSED_TESTS=3/3_PASS
RELATED_TESTS=STAGE228R13_AND_R17_BASELINE_DRIFT_REGISTERED
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
3. `STAGE228R13_R17_GUARD_DRIFT`: existing checks fail on superseded
   ClientDetail marker and missing-item soft-delete expectations outside this
   callback contract; restoring those historical markers would be a patch.
4. `A2_TSC_REMAINING_DEBT`: 12 independent active error lines remain in Leads,
   Tasks, Today, TodayStable and PWA.
5. Checkpoint findings from A2-01..A2-16 remain active, including
   Supabase/auth/migration/workspace-scope and AI draft-only guard failures.
