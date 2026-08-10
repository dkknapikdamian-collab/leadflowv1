---
typ: implementation_stage
doc_role: active_stage_contract
status: routed
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-20_TODAY_NATIVE_MOUSE_EVENT_BOUNDARY_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: bdabf65c56612bb1c4dc4fa7768735de9bcc1c5d
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-20 - Today native mouse event boundary repair

## Objective

Use the DOM `MouseEvent` type for native `addEventListener` handlers in the
legacy Today surface and active TodayStable surface. Preserve click capture,
cleanup, propagation control and metric-tile behavior.

## Evidence and root cause

The fresh TypeScript map at exact base SHA
`bdabf65c56612bb1c4dc4fa7768735de9bcc1c5d` contains 10 active error lines.
Seven are caused by importing React's `MouseEvent` type and passing those
handlers to native DOM event listeners:

```text
src/pages/Today.tsx(1594,13): stopImmediatePropagation missing on React MouseEvent
src/pages/Today.tsx(1599-1621): native listener overload mismatch
src/pages/TodayStable.tsx(1030-1031): native listener overload mismatch
```

Both files use `MouseEvent` only for native listener callbacks, so removing the
unused React type import restores the global DOM event contract.

```text
ROOT_CAUSE=React MouseEvent imported at a native DOM event boundary
WHY_THIS_IS_NOT_A_PATCH=restore the platform event type at the actual listener boundary
SSOT_IMPACT=browser DOM event contract remains the single event source
PREVIOUS_STAGE_IMPACT=A2-19 task client relation lifecycle remains untouched
SECURITY_IMPACT=preserve event interception and propagation behavior; no auth/data path change
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/Today.tsx`.
2. `src/pages/TodayStable.tsx`.
3. `scripts/check-lf-prod-sot-g15-r23m-20-today-native-mouse-event.cjs`.
4. `tests/lf-prod-sot-g15-r23m-20-today-native-mouse-event.test.cjs`.

The four paths above are the exact implementation/test allowlist for this
two-surface event-boundary repair. Do not replace native events with React
handlers, remove propagation control, or add casts.

## Required checks

1. Fail-first evidence records the exact 10-line map and React/DOM type drift.
2. Focused guard/test proves both native surfaces use the DOM event boundary
   and preserve listener registration/cleanup.
3. Relevant Today visual/source guards pass.
4. Fresh TypeScript mapping verifies 10 -> 3 active error lines.
5. `npm run build` passes.
6. AI Code Guardian root-cause/scope audit and independent review are
   attempted; unavailable reviews are registered.
7. `git diff --check` and exact allowlist scope pass.

## PASS conditions

```text
DOM_MOUSE_EVENT_BOUNDARY=YES
REACT_MOUSE_EVENT_IMPORT_REMOVED=YES
PROPAGATION_CONTROL_PRESERVED=YES
LISTENER_CLEANUP_PRESERVED=YES
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
SOURCE_BASE_SHA=bdabf65c56612bb1c4dc4fa7768735de9bcc1c5d
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
