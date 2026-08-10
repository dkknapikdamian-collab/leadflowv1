---
typ: implementation_stage
doc_role: active_stage_contract
status: ready_for_execution
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-05_MISSING_ITEM_VALIDATION_DISCRIMINATED_UNION_NARROWING_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 52b19a73959a1524f0708a0ae43c6805810d6175
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-05 — Missing-item validation discriminated-union narrowing repair

## Objective

Make the active missing-item draft builder narrow its validation result with an
explicit discriminant check. Preserve validation messages, draft fields,
persistence routing, and all caller behavior.

## Evidence and root cause

The fresh map at the exact base SHA reports 39 active TypeScript error lines.
The first error is:

```text
src/lib/missing-items/stage227c2-missing-item-modal-contract.ts(120,28) TS2339
Property 'error' does not exist on the success branch of the validation union
```

`validateMissingItemTitle` returns a discriminated union on `ok`, but the
active compiler configuration does not narrow the property access reliably
through the negated boolean check `if (!result.ok)`. The runtime contract is
already correct; the bounded repair states the false discriminant explicitly.

Active callers are `src/pages/ClientDetail.tsx` and
`src/components/ContextActionDialogs.tsx`. Existing Stage227C2/Stage227C3
guards cover the modal and persistence wiring, so no caller change is needed.

```text
ROOT_CAUSE=implicit negated boolean check does not narrow the validation union under the active compiler configuration
WHY_THIS_IS_NOT_A_PATCH=the existing discriminated-union contract is made explicit at its only unsafe property access
SSOT_IMPACT=none; validation and missing-item persistence contracts remain unchanged
PREVIOUS_STAGE_IMPACT=none; A2-04 finance contract repair is untouched
SECURITY_IMPACT=none; no authorization, workspace, persistence-target, or provider boundary changes
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/lib/missing-items/stage227c2-missing-item-modal-contract.ts`.
2. `scripts/check-lf-prod-sot-g15-r23m-05-missing-item-union.cjs`.
3. `tests/lf-prod-sot-g15-r23m-05-missing-item-union.test.cjs`.

Do not change callers, modal copy, persistence targets, dependencies, or
TypeScript configuration.

## Required checks

1. Fail-first evidence records the exact 39-line map and TS2339 location.
2. The focused guard proves the current source equals the base source with
   only the explicit discriminant narrowing change.
3. Focused Node guard/test pass with positive and negative assertions.
4. Existing Stage227C2 modal and Stage227C3 runtime-wiring tests pass.
5. Fresh TypeScript mapping verifies 39 -> 38 active errors and removal of
   this union-narrowing error.
6. `npm run build` passes.
7. AI Code Guardian audit and independent subagent review pass before commit.
8. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
VALIDATION_UNION_NARROWING=EXPLICIT
MISSING_ITEM_RUNTIME_SEMANTICS_UNCHANGED=YES
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

If the explicit discriminant does not remove the first error, remap the actual
compiler behavior before changing the union type or callers. Do not weaken the
result type or add a cast.

## Controller closeout

```text
STATUS=OPEN
SOURCE_BASE_SHA=52b19a73959a1524f0708a0ae43c6805810d6175
FINAL_SHA=
FILES_CHANGED=
ROOT_CAUSE_CONFIRMED=YES
WHY_NOT_PATCH=the existing union discriminant is used explicitly without changing runtime semantics
TSC=
FOCUSED_GUARD=
FOCUSED_TEST=
MISSING_ITEM_TESTS=
BUILD=
DIFF_CHECK=
GUARDIAN_STYLE_AUDIT=
INDEPENDENT_REVIEW=
FREEBUFF_USED=NO_MCP_EXPOSED
OPENCODE_USED=NO_MCP_EXPOSED
NEXT_STAGE=
```
