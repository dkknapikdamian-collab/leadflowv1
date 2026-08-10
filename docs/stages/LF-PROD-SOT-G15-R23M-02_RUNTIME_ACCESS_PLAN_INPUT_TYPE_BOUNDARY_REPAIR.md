---
typ: implementation_stage
doc_role: active_stage_contract
status: active
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-02_RUNTIME_ACCESS_PLAN_INPUT_TYPE_BOUNDARY_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: d075c76292eee3ce263c8045c3f164c3fd446fab
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-02 — Runtime access-plan input type boundary repair

## Objective

Give `buildRuntimeAccessPlanTruth` an explicit read-only input contract for the
two properties it consumes: `planId` and `subscriptionStatus`. Preserve every
normalization, fallback, plan decision, and returned field.

## Evidence and root cause

The fresh TypeScript map at the exact pre-routing code SHA reported 46 active
error lines; the routing commit changed only workflow documentation. A fresh
map is rerun at the exact route SHA before implementation.
The first root-cause group is:

```text
src/lib/closeflow-runtime-source-truth.ts(238,46) TS2339 Property 'planId' does not exist on type '{}'
src/lib/closeflow-runtime-source-truth.ts(239,62) TS2339 Property 'subscriptionStatus' does not exist on type '{}'
```

The default parameter `input = {}` infers the parameter as `{}`. The function
then reads two properties from that empty-object type. This is a static input
boundary defect, not a runtime access-plan defect.

```text
ROOT_CAUSE=default object parameter inferred as {}, while implementation reads planId and subscriptionStatus
WHY_THIS_IS_NOT_A_PATCH=declare the actual input contract at the function boundary; keep the existing algorithm unchanged
SSOT_IMPACT=none; closeflow-runtime-source-truth.ts remains the runtime access-plan source
PREVIOUS_STAGE_IMPACT=none; A2-01 Firebase import repair remains unchanged
SECURITY_IMPACT=none; no authorization decision or billing authority changes
```

The selected signature is:

```ts
export function buildRuntimeAccessPlanTruth(
  input: Readonly<{
    planId?: string | null;
    subscriptionStatus?: string | null;
  }> = {},
) {
```

The function is read-only with respect to its input and all current callers
provide these string-like fields or omit them. No caller, dependency, or
runtime source of truth is changed.

## Bounded read set

Read before implementation:

1. `src/lib/closeflow-runtime-source-truth.ts` around the input helpers and
   `buildRuntimeAccessPlanTruth`.
2. `tests/cf-runtime-00-source-truth.test.cjs`.
3. `scripts/check-cf-runtime-00-source-truth.cjs`.
4. the fresh TypeScript map at `d075c76292eee3ce263c8045c3f164c3fd446fab`.

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/lib/closeflow-runtime-source-truth.ts`
2. `scripts/check-lf-prod-sot-g15-r23m-02-runtime-access-plan-input.cjs`
3. `tests/lf-prod-sot-g15-r23m-02-runtime-access-plan-input.test.cjs`

The contract and workflow are controller metadata and are not part of the
implementation commit's three-file allowlist. Do not change dependency
manifests, runtime callers, or access/billing behavior.

## Required checks

1. Fail-first evidence: exact base `npx tsc --noEmit --pretty false` reports the two
   listed errors and 46 total error lines.
2. The focused guard proves the current source equals the base source with only
   the explicit input signature replacement.
3. The focused Node test passes positive, negative, and behavior-preservation
   assertions.
4. Existing `tests/cf-runtime-00-source-truth.test.cjs` passes; the existing
   source-truth guard is also run in a clean checkout. The dirty worktree's
   preserved untracked `.stversions/` may cause that guard's working-tree
   allowlist to fail; such failure must remain registered, not hidden.
5. Fresh TypeScript mapping reports 46 -> 44 active error lines, with no error
   suppression or excluded active file.
6. `npm run build` passes.
7. AI Code Guardian and an independent subagent review pass before commit.
8. `git diff --check` and exact three-file scope pass.

## PASS conditions

```text
ACTIVE_TSC_DELTA=46->44
RUNTIME_ACCESS_PLAN_BEHAVIOR_UNCHANGED=YES
NO_ANY_BYPASS=YES
NO_TS_IGNORE_BYPASS=YES
FOCUSED_GUARD=PASS
FOCUSED_TEST=PASS
CF_RUNTIME_TEST=PASS
BUILD=PASS
ALLOWLIST=PASS
INDEPENDENT_REVIEW=PASS
```

## Recovery boundary

The executor may change only the three implementation files and must stop
before A2-03. If the expected two-error reduction does not occur, preserve the
branch and remap the root cause rather than broadening this stage. Rollback is
the single implementation commit revert; controller metadata remains as
evidence.
