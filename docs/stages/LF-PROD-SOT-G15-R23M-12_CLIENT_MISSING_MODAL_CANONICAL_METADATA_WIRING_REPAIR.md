---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-12_CLIENT_MISSING_MODAL_CANONICAL_METADATA_WIRING_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: fb578a1ca4bb3cdc2f3a91841eab2a4fd898a652
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-12 - Client missing modal canonical metadata wiring repair

## Objective

Bring the `ClientDetail` use of `MissingItemQuickActionModal` and its save
handler up to the existing shared modal contract. Keep the modal component and
`buildMissingItemModalDraft` as the single owners of missing-item metadata;
persist the explicit kind, blocking flag and block scope through the existing
client task/activity and optimistic local paths.

## Evidence and root cause

The fresh TypeScript map at exact base SHA `fb578a1ca4bb3cdc2f3a91841eab2a4fd898a652`
contains 23 active error lines. The first diagnostic is:

```text
src/pages/ClientDetail.tsx(3227,16): error TS2740: the MissingItemQuickActionModal call is missing missingKindValue, blocksProgressValue, blockScopeValue, onMissingKindChange, onBlocksProgressChange and onBlockScopeChange
```

The shared modal contract already requires these fields and the canonical
`ContextActionDialogs` host already wires them. `ClientDetail` retained an
older local call-site with only title/note props. Its handler also called
`buildMissingItemModalDraft` without the explicit metadata, so the draft's
default `blocksProgress` could disagree with the local UI state and kind/scope
were dropped from persistence.

```text
ROOT_CAUSE=ClientDetail remained on the pre-metadata modal call contract while the shared modal and persistence contract became explicit
WHY_THIS_IS_NOT_A_PATCH=wire the existing canonical state/draft/metadata contract through the local call-site and all existing persistence paths
SSOT_IMPACT=preserve MissingItemQuickActionModal and stage227c2 contract as the sole metadata owners; no duplicate modal or local schema is introduced
PREVIOUS_STAGE_IMPACT=none; A2-11 owner-risk context cleanup remains untouched
SECURITY_IMPACT=preserve existing hasAccess/workspace/client scope and task/activity persistence boundaries
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/ClientDetail.tsx`.
2. `scripts/check-lf-prod-sot-g15-r23m-12-client-missing-modal-metadata.cjs`.
3. `tests/lf-prod-sot-g15-r23m-12-client-missing-modal-metadata.test.cjs`.

Do not make modal props optional, alter the shared modal component, change the
missing-item contract, create a second metadata store, or change auth/scope
logic.

## Required checks

1. Fail-first evidence records the exact 23-line map and TS2740 call-site.
2. Focused guard/test proves ClientDetail owns local state for all explicit
   metadata, passes it to the shared modal, supplies it to the canonical draft,
   and persists it through task/activity/optimistic paths.
3. Existing Stage227C3B and Stage232A missing-item contract/runtime tests pass.
4. Fresh TypeScript mapping verifies 23 -> 22 active error lines.
5. `npm run build` passes.
6. AI Code Guardian root-cause/scope/security audit and independent review are
   attempted before closeout; unavailable reviews are registered.
7. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
CLIENT_MODAL_FULL_CONTRACT_WIRED=YES
MISSING_METADATA_DRAFT_CANONICAL=YES
TASK_ACTIVITY_OPTIMISTIC_METADATA_PRESERVED=YES
BLOCKS_PROGRESS_UI_RUNTIME_ALIGNED=YES
NO_OPTIONAL_PROP_BYPASS=YES
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
SOURCE_BASE_SHA=fb578a1ca4bb3cdc2f3a91841eab2a4fd898a652
IMPLEMENTATION_SHA=961c90b773963c9cccb4bda5626d20de1df9a86c
FILES_CHANGED=src/pages/ClientDetail.tsx;scripts/check-lf-prod-sot-g15-r23m-12-client-missing-modal-metadata.cjs;tests/lf-prod-sot-g15-r23m-12-client-missing-modal-metadata.test.cjs
TSC=23->22
FOCUSED_TESTS=11/11_PASS
RELATED_STAGE232A_TESTS=PASS
BUILD=PASS
DIFF_CHECK=PASS
ALLOWLIST=3_IMPLEMENTATION_FILES_PASS
GUARDIAN_STYLE_AUDIT=PASS
INDEPENDENT_REVIEW=TIMEOUT_REGISTERED_TWICE_NO_PASS_CLAIM
FREEBUFF_USED=NO_MCP_EXPOSED
OPENCODE_USED=NO_MCP_EXPOSED
MARKET_PLUGINS_USED=ai-code-guardian@damian-agent-plugins;agent-efficiency-guardian@damian-agent-plugins;marketplace-router@damian-agent-plugins
NEXT_STAGE=FRESH_A2_MAP_AND_ROOT_CAUSE_SELECTION
```

### Registered findings

1. `INDEPENDENT_SUBAGENT_REVIEW_TIMEOUT`: two bounded reviewer attempts did
   not return before timeout; controller evidence and tests are retained, but
   no independent PASS is claimed.
2. `STAGE227C3B_GUARD_DRIFT`: the existing runtime test expects the removed
   `data-stage227c3b-client-missing-action` marker. It is outside this diff and
   remains a baseline guard mismatch.
3. `STAGE227C3B_CASE_DIALOG_GUARD_DRIFT`: the existing CaseDetail test expects
   the removed `AddCaseMissingItemDialog`, while the current runtime uses the
   shared `ContextActionDialogs` host. It is outside this diff.
4. `STAGE231B0_R7_GUARD_DRIFT` and `STAGE231B0_R13_R6_GUARD_STALE_CONTEXT`
   remain inherited findings from A2-10/A2-11 and require A3 guard inventory;
   they were not weakened here.
