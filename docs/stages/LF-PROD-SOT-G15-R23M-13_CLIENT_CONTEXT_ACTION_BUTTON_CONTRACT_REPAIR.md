---
typ: implementation_stage
doc_role: active_stage_contract
status: active
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-13_CLIENT_CONTEXT_ACTION_BUTTON_CONTRACT_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 02bf7cef499953d000fca78db2d49785fb70837c
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-13 - Client context action button contract repair

## Objective

Remove unsupported `variant` and `size` props from the two `ClientDetail`
`ContextActionButton` call-sites. Keep `ContextActionButton` as the visual and
interaction source of truth; do not widen its API or replace it with another
button component.

## Evidence and root cause

The fresh TypeScript map at exact base SHA `02bf7cef499953d000fca78db2d49785fb70837c`
contains 22 active error lines. The first two are the same root cause:

```text
src/pages/ClientDetail.tsx(3651,19): error TS2322: ContextActionButton props include unsupported variant
src/pages/ClientDetail.tsx(3672,19): error TS2322: ContextActionButton props include unsupported variant
```

The call-sites also pass unsupported `size`. The canonical component accepts
native button attributes plus context metadata and its stylesheet already
provides task/event visual styling. Removing only the unsupported props keeps
the existing runtime action routing and visual source of truth intact.

```text
ROOT_CAUSE=ClientDetail passed Button-style variant/size props to ContextActionButton, whose contract intentionally exposes native button attributes and context metadata only
WHY_THIS_IS_NOT_A_PATCH=align the two call-sites with the existing component contract instead of widening the shared API or duplicating styling
SSOT_IMPACT=ContextActionButton and context-action-button-source-truth.css remain the sole owner of these action buttons
PREVIOUS_STAGE_IMPACT=A2-12 client missing metadata wiring remains untouched
SECURITY_IMPACT=no auth, record scope, mutation handler or trust boundary changes
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/ClientDetail.tsx`.
2. `scripts/check-lf-prod-sot-g15-r23m-13-client-context-action-button.cjs`.
3. `tests/lf-prod-sot-g15-r23m-13-client-context-action-button.test.cjs`.

Do not add `variant` or `size` to `ContextActionButtonProps`, change the
shared stylesheet, alter action routing, or replace the component.

## Required checks

1. Fail-first evidence records the exact two ClientDetail TS2322 lines.
2. Focused guard/test proves both call-sites keep kind/record type and handlers
   while removing only unsupported props.
3. Fresh TypeScript mapping verifies 22 -> 20 active error lines.
4. `npm run build` passes.
5. AI Code Guardian root-cause/scope/security audit and independent review are
   attempted; unavailable reviews are registered.
6. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
CONTEXT_ACTION_BUTTON_CONTRACT_ALIGNED=YES
VISUAL_SOT_PRESERVED=YES
ACTION_ROUTING_PRESERVED=YES
NO_SHARED_API_WIDENING=YES
NO_ANY_BYPASS=YES
NO_TS_IGNORE_BYPASS=YES
FOCUSED_GUARD=PASS
FOCUSED_TEST=PASS
TSC_ROOT_CAUSE_REMOVED=YES
BUILD=PASS
ALLOWLIST=PASS
```
