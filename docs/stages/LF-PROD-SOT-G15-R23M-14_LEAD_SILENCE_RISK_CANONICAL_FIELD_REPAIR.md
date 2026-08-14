---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-14_LEAD_SILENCE_RISK_CANONICAL_FIELD_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: e6658f6cbc6018f9997e7449a36a45d7fd5b5fa3
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-14 - Lead silence risk canonical field repair

## Objective

Align the `LeadDetail` sales-signal consumer with the existing
`getLeadSilenceRisk` return contract. Use `label` and `details` as the sole
canonical silence-risk fields; do not add aliases or widen the helper return
type.

## Evidence and root cause

The fresh TypeScript map at exact base SHA
`e6658f6cbc6018f9997e7449a36a45d7fd5b5fa3` contains 20 active error lines.
The first two are one contract-drift root cause:

```text
src/pages/LeadDetail.tsx(1606,34): error TS2339: Property 'riskLabel' does not exist on getLeadSilenceRisk result
src/pages/LeadDetail.tsx(1607,61): error TS2339: Property 'riskReason' does not exist on getLeadSilenceRisk result
```

`getLeadSilenceRisk` already returns `label`, `headline`, `details` and
`toneClass`; the same component uses `label/details` elsewhere. The consumer
retained stale aliases while composing sales-signal input.

```text
ROOT_CAUSE=LeadDetail consumer uses stale riskLabel/riskReason aliases instead of the existing getLeadSilenceRisk label/details contract
WHY_THIS_IS_NOT_A_PATCH=align the consumer with the canonical helper fields; do not add compatibility aliases or duplicate risk derivation
SSOT_IMPACT=getLeadSilenceRisk remains the sole silence-risk owner
PREVIOUS_STAGE_IMPACT=A2-13 ContextActionButton contract repair remains untouched
SECURITY_IMPACT=no auth, workspace scope, persistence or trust-boundary changes
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/LeadDetail.tsx`.
2. `scripts/check-lf-prod-sot-g15-r23m-14-lead-silence-risk.cjs`.
3. `tests/lf-prod-sot-g15-r23m-14-lead-silence-risk.test.cjs`.

Do not add `riskLabel`/`riskReason` to `getLeadSilenceRisk`, create a second
risk helper, or alter owner-risk thresholds and UI labels.

## Required checks

1. Fail-first evidence records the exact 20-line map and two TS2339 lines.
2. Focused guard/test proves the consumer uses `label/details` and the helper
   remains the single field owner.
3. Relevant LeadDetail risk/sales-signal tests pass.
4. Fresh TypeScript mapping verifies 20 -> 18 active error lines.
5. `npm run build` passes.
6. AI Code Guardian root-cause/scope/security audit and independent review are
   attempted; unavailable reviews are registered.
7. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
LEAD_SILENCE_RISK_CONSUMER_ALIGNED=YES
CANONICAL_HELPER_PRESERVED=YES
NO_RISK_ALIAS_DUPLICATION=YES
NO_THRESHOLD_CHANGE=YES
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
SOURCE_BASE_SHA=e6658f6cbc6018f9997e7449a36a45d7fd5b5fa3
IMPLEMENTATION_SHA=b3691a7949039d0afef1be4f558522af12e6a4d0
FILES_CHANGED=src/pages/LeadDetail.tsx;scripts/check-lf-prod-sot-g15-r23m-14-lead-silence-risk.cjs;tests/lf-prod-sot-g15-r23m-14-lead-silence-risk.test.cjs
TSC=20->18
FOCUSED_TESTS=3/3_PASS
RELATED_STAGE227E_TESTS=24/25_PASS
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
   before timeout; mapper evidence, focused tests, related tests, TSC and build
   are retained, but no independent PASS is claimed.
2. `STAGE227E6_NOTES_HISTORY_GUARD_DRIFT`: one related historical test expects
   `data-stage227e6-notes-history-separation`, which is absent from the current
   runtime and outside this diff. The other 24 related Stage227E tests passed.
3. The checkpoint findings from A2-01..A2-13 remain active, including
   Supabase/auth/migration/workspace-scope and AI draft-only guard failures.
