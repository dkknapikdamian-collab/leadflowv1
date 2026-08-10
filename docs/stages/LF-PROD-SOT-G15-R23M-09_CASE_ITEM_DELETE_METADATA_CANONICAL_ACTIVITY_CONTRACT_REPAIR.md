---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-09_CASE_ITEM_DELETE_METADATA_CANONICAL_ACTIVITY_CONTRACT_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 94a00369c65f13075275c96017b0bd7b4d69f5e4
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-09 - Case item delete metadata canonical activity contract repair

## Objective

Remove unsupported `payload` fields from the two legacy `case_items` PATCH
calls in `CaseDetail`. Preserve the delete-mode audit marker in the existing
`recordActivity` payload, whose API contract already supports arbitrary object
metadata.

## Evidence and root cause

The fresh TypeScript map at exact base SHA `94a00369c65f13075275c96017b0bd7b4d69f5e4`
contains 28 active error lines. The first two are identical contract errors:

```text
src/pages/CaseDetail.tsx(3316,9) TS2353 payload is not in CaseItemInput & { id: string }
src/pages/CaseDetail.tsx(3415,9) TS2353 payload is not in CaseItemInput & { id: string }
```

`CaseItemInput` intentionally models the public `/api/case-items` PATCH
contract. The API handler updates title/description/type/status/response/file
fields and approved date, but ignores `body.payload`; the response normalizer
also does not expose a payload field. The database has a payload column, but
that does not make it an active application contract. The existing activity
API explicitly supports `payload` and is already used for the legacy delete
audit event. Therefore extending the input type would create a second, false
contract, while dropping the marker would lose audit evidence.

```text
ROOT_CAUSE=legacy case-item delete metadata is sent through an unsupported API input field
WHY_THIS_IS_NOT_A_PATCH=route metadata to the existing canonical activity audit contract instead of widening a server-ignored type
SSOT_IMPACT=preserve CaseItemInput and /api/case-items as the single item contract; activity payload remains the audit SOT
PREVIOUS_STAGE_IMPACT=none; A2-08 local task scope repair is untouched
SECURITY_IMPACT=preserve existing workspace-scoped case-item PATCH and activity authorization; no new write surface
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/CaseDetail.tsx`.
2. `scripts/check-lf-prod-sot-g15-r23m-09-case-item-delete-metadata.cjs`.
3. `tests/lf-prod-sot-g15-r23m-09-case-item-delete-metadata.test.cjs`.

Do not change `CaseItemInput`, `/api/case-items`, migrations, RLS, delete
semantics, or the active task/missing-item delete branch.

## Required checks

1. Fail-first evidence records the exact 28-line map and both TS2353 sites.
2. Focused guard proves both item PATCH calls contain only supported fields
   and both corresponding activity payloads retain the delete-mode marker.
3. Focused Node guard/test pass with positive and negative assertions.
4. Stage232K/M/O/P/Q and delete-flow tests pass.
5. Fresh TypeScript mapping verifies 28 -> 26 active error lines.
6. `npm run build` passes.
7. AI Code Guardian contract/SSOT/security audit and independent review pass
   before commit, or an unavailable review is registered.
8. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
NO_UNSUPPORTED_CASE_ITEM_PAYLOAD=YES
DELETE_MODE_AUDIT_PRESERVED=YES
CASE_ITEM_API_UNCHANGED=YES
ACTIVITY_AUDIT_CONTRACT_USED=YES
NO_ANY_BYPASS=YES
NO_TS_IGNORE_BYPASS=YES
FOCUSED_GUARD=PASS
FOCUSED_TEST=PASS
TSC_ROOT_CAUSE_REMOVED=YES
BUILD=PASS
ALLOWLIST=PASS
```

## Registered inherited findings

```text
FINDING=CASE_DETAIL_DELETE_PLACEMENT_LEGACY_GUARD_DRIFT
SCOPE=pre-existing CaseDetail UI marker drift; outside A2-09 API-contract repair
FOLLOWUP=A3/D1 UI guard inventory
FINDING=R23J_FINANCE_PAYMENT_RECORD_GUARD_SCOPE_DRIFT
SCOPE=pre-existing finance historical guard drift; carry to A3
FINDING=STAGE227C3_LEGACY_EXPECTATION_DRIFT
SCOPE=pre-existing historical expectation drift; outside A2-09 scope
FOLLOWUP=A3 repository truth handoff
FINDING=INDEPENDENT_SUBAGENT_REVIEW_TIMEOUT
SCOPE=two bounded A2-09 reviewer attempts did not return a complete report
FOLLOWUP=retain controller evidence and require independent review at the next checkpoint
```

## Controller closeout

```text
STATUS=PASS_ON_WORK_BRANCH_WITH_REGISTERED_FINDINGS
SOURCE_BASE_SHA=94a00369c65f13075275c96017b0bd7b4d69f5e4
FINAL_SHA=7d612c4b118b291e9059552f4eb9edbfce2e9685
FILES_CHANGED=3 implementation files
ROOT_CAUSE_CONFIRMED=YES
WHY_NOT_PATCH=preserve the CaseItemInput and API contract; move existing audit metadata to the canonical activity payload
TSC=28->26
FOCUSED_GUARD=PASS
FOCUSED_TEST=3/3_PASS
RELATED_STAGE232_TESTS=16/16_PASS
BUILD=PASS
DIFF_CHECK=PASS
GUARDIAN_STYLE_AUDIT=PASS
INDEPENDENT_REVIEW=TIMEOUT_REGISTERED_NO_PASS_CLAIM
FREEBUFF_USED=NO_MCP_EXPOSED
OPENCODE_USED=NO_MCP_EXPOSED
MARKET_PLUGINS_USED=ai-code-guardian@damian-agent-plugins,agent-efficiency-guardian@damian-agent-plugins,marketplace-router@damian-agent-plugins
NEXT_STAGE=FRESH_A2_MAP_AND_ROOT_CAUSE_SELECTION
```
