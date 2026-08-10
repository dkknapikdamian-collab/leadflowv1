---
typ: implementation_stage
doc_role: active_stage_contract
status: routed
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
STATUS=ROUTED
SOURCE_BASE_SHA=b94f069f2ec553cab6d2db449158f48173632dea
IMPLEMENTATION_SHA=PENDING
FILES_CHANGED=PENDING
TSC=PENDING
FOCUSED_TESTS=PENDING
RELATED_TESTS=PENDING
BUILD=PENDING
DIFF_CHECK=PENDING
ALLOWLIST=PENDING
GUARDIAN_STYLE_AUDIT=PENDING
MAPPER_REVIEW=PENDING
INDEPENDENT_REVIEW=PENDING
FREEBUFF_USED=NO_MCP_EXPOSED
OPENCODE_USED=NO_MCP_EXPOSED
NEXT_STAGE=FRESH_A2_MAP_AND_ROOT_CAUSE_SELECTION
```
