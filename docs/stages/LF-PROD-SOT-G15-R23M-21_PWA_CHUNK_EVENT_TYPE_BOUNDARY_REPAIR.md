---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-21_PWA_CHUNK_EVENT_TYPE_BOUNDARY_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 54bdfd7d7a920d7f7237d733d012cd366844e67f
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-21 - PWA chunk event type boundary repair

## Objective

Align the chunk reload guard with Vite's declared `VitePreloadErrorEvent` and
DOM element narrowing. Preserve one-shot reload protection, deferred reload
behavior and asset URL detection.

## Evidence and root cause

The fresh TypeScript map at exact base SHA
`54bdfd7d7a920d7f7237d733d012cd366844e67f` contains 3 active error lines.
Vite's own declaration says `VitePreloadErrorEvent.payload: Error`, but runtime
code casts the event to `CustomEvent<any>`. The asset error handler narrows only
to `HTMLElement`, although `src` exists only on scripts and `href` on links.

```text
ROOT_CAUSE=PWA guard ignores the Vite event declaration and uses a non-existent union property
WHY_THIS_IS_NOT_A_PATCH=use the platform/provider types and explicit DOM element narrowing
SSOT_IMPACT=Vite and DOM declarations remain the runtime boundary source of truth
PREVIOUS_STAGE_IMPACT=A2-20 Today event boundary remains untouched
SECURITY_IMPACT=preserve reload loop protection and UI-state deferral; no auth/data path change
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pwa/chunk-asset-reload-guard.ts`.
2. `scripts/check-lf-prod-sot-g15-r23m-21-pwa-chunk-event-type.cjs`.
3. `tests/lf-prod-sot-g15-r23m-21-pwa-chunk-event-type.test.cjs`.

Do not add `any`, `@ts-ignore`, broad casts, or alter reload/defer semantics.

## Required checks

1. Fail-first evidence records the exact 3-line map and invalid event/target
   contracts.
2. Focused guard/test proves Vite payload use and script/link narrowing.
3. Relevant PWA stale-chunk and tab-return guards pass.
4. Fresh TypeScript mapping verifies 3 -> 0 active error lines.
5. `npm run build` passes.
6. AI Code Guardian root-cause/scope audit and independent review are
   attempted; unavailable reviews are registered.
7. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
VITE_PAYLOAD_CONTRACT=YES
SCRIPT_LINK_NARROWING=YES
RELOAD_LOOP_GUARD_PRESERVED=YES
TAB_STATE_DEFERRED_RELOAD_PRESERVED=YES
NO_ANY_BYPASS=YES
NO_TS_IGNORE_BYPASS=YES
FOCUSED_GUARD=PASS
FOCUSED_TEST=PASS
ACTIVE_TSC_ERRORS=0
BUILD=PASS
ALLOWLIST=PASS
```

## Closeout evidence

```text
STATUS=PASS_ON_WORK_BRANCH_WITH_REGISTERED_FINDINGS
SOURCE_BASE_SHA=54bdfd7d7a920d7f7237d733d012cd366844e67f
IMPLEMENTATION_SHA=d3731bc1f6014289572ffd1fd7236a352947439f
FILES_CHANGED=src/pwa/chunk-asset-reload-guard.ts;scripts/check-lf-prod-sot-g15-r23m-21-pwa-chunk-event-type.cjs;tests/lf-prod-sot-g15-r23m-21-pwa-chunk-event-type.test.cjs
TSC=3->0
FOCUSED_TESTS=3/3_PASS
RELATED_TESTS=PWA_STALE_CHUNK_AND_TAB_RETURN_GUARD_DRIFT_REGISTERED
BUILD=PASS
DIFF_CHECK=PASS
ALLOWLIST=3_IMPLEMENTATION_FILES_PASS
GUARDIAN_STYLE_AUDIT=PASS_CONTROLLER_AUDIT
MAPPER_REVIEW=TIMEOUT_REGISTERED_NO_PASS_CLAIM
INDEPENDENT_REVIEW=TIMEOUT_REGISTERED_NO_PASS_CLAIM
FREEBUFF_USED=NO_MCP_EXPOSED
OPENCODE_USED=NO_MCP_EXPOSED
NEXT_STAGE=A3_TERMINAL_SOT_CLOSEOUT
```

### Registered findings

1. `MAPPER_SUBAGENT_TIMEOUT`: bounded root-cause mapper did not return before
   timeout; local diagnosis and fail-first evidence remain authoritative.
2. `INDEPENDENT_SUBAGENT_REVIEW_TIMEOUT`: bounded reviewer did not return
   before timeout; no independent PASS is claimed.
3. `PWA_RELATED_GUARD_DRIFT`: existing stale-chunk/tab-return checks fail on
   missing service-worker guard/network-only markers outside this typed event
   repair; this stage did not broaden into service-worker behavior changes.
4. `A2_TSC_ZERO_REACHED`: active TypeScript error count is now zero.
5. Checkpoint findings from A2-01..A2-20 remain active, including
   Supabase/auth/migration/workspace-scope and AI draft-only guard failures.
