---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-15_LEAD_ACTION_BUTTON_POINTER_CONTRACT_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 554761c0b4568403c7b9318abbbe97704c330a89
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-15 - Lead action button pointer contract repair

## Objective

Align the local `LeadActionButton` prop contract with its existing
Stage228R16 runtime usage. Preserve the typed `onPointerDown` path, click
fallback, access gate and data attributes; do not remove the event or weaken
it with `any`/casts.

## Evidence and root cause

The fresh TypeScript map at exact base SHA
`554761c0b4568403c7b9318abbbe97704c330a89` contains 18 active error lines.
The first diagnostic is:

```text
src/pages/LeadDetail.tsx(1676,13): error TS2322: LeadActionButton call passes onPointerDown, but its props type only declares children/onClick/disabled
```

Stage228R16 explicitly uses pointerdown plus click for the direct lead Brak
action. The local wrapper accepts only the older subset and drops no runtime
event today because the call cannot typecheck; the correct repair is to add a
typed pointer handler to the wrapper and forward it to the native button.

```text
ROOT_CAUSE=LeadActionButton local prop type drifted behind its existing pointerdown runtime contract
WHY_THIS_IS_NOT_A_PATCH=restore the declared wrapper contract and forward the already-required event without changing action routing
SSOT_IMPACT=LeadActionButton remains the local button owner; Stage228R16 remains the pointerdown/click behavior owner
PREVIOUS_STAGE_IMPACT=A2-14 lead silence field repair remains untouched
SECURITY_IMPACT=preserve hasAccess guard, record scope, context dispatcher and data attributes
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/LeadDetail.tsx`.
2. `scripts/check-lf-prod-sot-g15-r23m-15-lead-action-button-pointer.cjs`.
3. `tests/lf-prod-sot-g15-r23m-15-lead-action-button-pointer.test.cjs`.

Do not remove `onPointerDown`, remove the click fallback, add `any`/casts,
change `openContextQuickAction`, or alter authorization logic.

## Required checks

1. Fail-first evidence records the exact 18-line map and TS2322 call-site.
2. Focused guard/test proves typed pointerdown forwarding and preserved click,
   access gate and direct Brak context routing.
3. Relevant Stage228R16/Stage228R12/lead quick-action tests pass.
4. Fresh TypeScript mapping verifies 18 -> 17 active error lines.
5. `npm run build` passes.
6. AI Code Guardian root-cause/scope/security audit and independent review are
   attempted; unavailable reviews are registered.
7. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
POINTER_HANDLER_TYPED=YES
POINTER_HANDLER_FORWARDED=YES
CLICK_FALLBACK_PRESERVED=YES
ACCESS_GATE_PRESERVED=YES
CONTEXT_SCOPE_PRESERVED=YES
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
SOURCE_BASE_SHA=554761c0b4568403c7b9318abbbe97704c330a89
IMPLEMENTATION_SHA=b7ef166981850620d309f1b4b008f0b701590609
FILES_CHANGED=src/pages/LeadDetail.tsx;scripts/check-lf-prod-sot-g15-r23m-15-lead-action-button-pointer.cjs;tests/lf-prod-sot-g15-r23m-15-lead-action-button-pointer.test.cjs
TSC=18->17
FOCUSED_TESTS=3/3_PASS
RELATED_R23C_AND_STAGE18_TESTS=9/9_PASS
BUILD=PASS
DIFF_CHECK=PASS
ALLOWLIST=3_IMPLEMENTATION_FILES_PASS
GUARDIAN_STYLE_AUDIT=PASS
MAPPER_REVIEW=ROOT_CAUSE_CONFIRMED;RECOMMENDATION_CONFIRMED
INDEPENDENT_REVIEW=TIMEOUT_REGISTERED_NO_PASS_CLAIM
FREEBUFF_USED=NO_MCP_EXPOSED
OPENCODE_USED=NO_MCP_EXPOSED
MARKET_PLUGINS_USED=ai-code-guardian@damian-agent-plugins;agent-efficiency-guardian@damian-agent-plugins;marketplace-router@damian-agent-plugins
NEXT_STAGE=FRESH_A2_MAP_AND_ROOT_CAUSE_SELECTION
```

### Registered findings

1. `INDEPENDENT_SUBAGENT_REVIEW_TIMEOUT`: the bounded reviewer did not return
   before timeout; mapper evidence, focused tests, TSC and build are retained,
   but no independent PASS is claimed.
2. `STAGE228R12_R13_R16R2_GUARD_DRIFT`: three existing guards fail because
   current runtime lacks historical ClientDetail markers or `item_added`; they
   are outside this pointer contract diff and were not restored as a patch.
3. `STAGE227C3A_RUNTIME_GUARD_DRIFT`: three existing tests still expect the
   superseded LeadDetail missing-item modal/payload wiring; outside this diff.
4. The checkpoint findings from A2-01..A2-13 remain active, including
   Supabase/auth/migration/workspace-scope and AI draft-only guard failures.
