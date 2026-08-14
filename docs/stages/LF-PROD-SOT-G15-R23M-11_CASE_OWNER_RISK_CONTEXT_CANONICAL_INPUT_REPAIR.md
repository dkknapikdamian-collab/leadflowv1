---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15-R23M-11_CASE_OWNER_RISK_CONTEXT_CANONICAL_INPUT_REPAIR
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 34befb167310eb98bcf3437284502645c895a077
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A2-11 - Case owner-risk context canonical input repair

## Objective

Remove the complete set of unused UI-only properties from the
`getCaseOwnerRiskBadges` call-site in `Cases.tsx`. Keep `OwnerRiskContext` as
the canonical public context contract and preserve the separate lifecycle
calculations used by the Cases row UI.

## Evidence and root cause

The fresh TypeScript map at exact base SHA `34befb167310eb98bcf3437284502645c895a077`
contains 24 active error lines. The first diagnostic is:

```text
src/pages/Cases.tsx(827,25): error TS2353: Object literal may only specify known properties, and 'lifecycle' does not exist in type 'OwnerRiskContext'.
```

`OwnerRiskContext` declares settings, now, relatedRecords, hasNextStep,
nextMove, and activityTruth. `getCaseOwnerRiskBadges` derives its own next
move and activity truth and does not read the caller's UI-only
`lifecycle`, `nearestCaseAction`, `nextActionLabel`, `statusLabel`,
`compactLifecycleLabel`, `compactLifecyclePill`, `percent`, or `updatedAt`.
The mapper confirmed that removing only `lifecycle` exposes the next member of
the same stale object contract. Widening `OwnerRiskContext` would create an
unused, misleading input contract; removing the complete unsupported batch
restores the existing API. The local `lifecycle` value remains used by the
Cases row itself.

```text
ROOT_CAUSE=Cases passes a stale UI-only metadata batch outside the canonical OwnerRiskContext contract
WHY_THIS_IS_NOT_A_PATCH=remove the complete dead caller metadata batch instead of widening the shared context type or duplicating lifecycle ownership
SSOT_IMPACT=preserve owner-risk-rules.ts as the single OwnerRiskContext owner; Cases lifecycle remains a separate UI derivation
PREVIOUS_STAGE_IMPACT=none; A2-10 closed-view scope repair remains untouched
SECURITY_IMPACT=none; no authorization, persistence, workspace scope, or trust boundary changes
```

## Mutable paths and implementation allowlist

Only these three implementation files may change:

1. `src/pages/Cases.tsx`.
2. `scripts/check-lf-prod-sot-g15-r23m-11-case-owner-risk-context.cjs`.
3. `tests/lf-prod-sot-g15-r23m-11-case-owner-risk-context.test.cjs`.

Do not change `OwnerRiskContext`, `getCaseOwnerRiskBadges`, lifecycle
derivation, or any later TypeScript error cluster.

## Required checks

1. Fail-first evidence records the exact 24-line map, TS2353 location, and
   the follow-up `nearestCaseAction` diagnostic after the first-token trial.
2. Focused guard proves the current source equals the exact base source with
   only the eight unsupported UI-only properties removed from this call-site.
3. Focused Node guard/test pass with positive and negative assertions.
4. Existing Stage222/223 owner-risk contract/runtime tests and Cases lifecycle
   guards pass; unrelated pre-existing guard drift remains registered.
5. Fresh TypeScript mapping verifies 24 -> 23 active error lines.
6. `npm run build` passes.
7. AI Code Guardian root-cause/scope/security audit and independent review are
   attempted before closeout; unavailable reviews are registered.
8. `git diff --check` and exact three-file implementation scope pass.

## PASS conditions

```text
OWNER_RISK_CONTEXT_CANONICAL_INPUT_RESTORED=YES
UNSUPPORTED_UI_METADATA_BATCH_REMOVED=YES
LIFECYCLE_UI_DERIVATION_UNCHANGED=YES
OWNER_RISK_RULES_UNCHANGED=YES
NO_ANY_BYPASS=YES
NO_TS_IGNORE_BYPASS=YES
FOCUSED_GUARD=PASS
FOCUSED_TEST=PASS
TSC_ROOT_CAUSE_REMOVED=YES
BUILD=PASS
ALLOWLIST=PASS
```

## Registered findings

```text
FINDING=STAGE231B0_R13_R6_GUARD_STALE_OWNER_RISK_CONTEXT
SCOPE=pre-existing historical guard requires lifecycle inside OwnerRiskContext; canonical owner-risk type does not support it and A2-11 removes the stale batch
FOLLOWUP=A3/D1 legacy guard inventory and repository-truth reconciliation
FINDING=STAGE231B0_R7_CASE_ARCHIVE_RESTORE_GUARD_DRIFT
SCOPE=pre-existing guard failure: src/lib/cases.ts lacks historical 'completed' token; outside A2-11 diff
FOLLOWUP=A3/D1 guard inventory
```

## Controller closeout

```text
STATUS=PASS_ON_WORK_BRANCH_WITH_REGISTERED_FINDINGS
SOURCE_BASE_SHA=622f34f6ff39d4ff99d232a25c12d569c3ab637d
FINAL_SHA=208f53ecde3143f50e5ba7d7e69053587d0f2ca7
FILES_CHANGED=3 implementation files
ROOT_CAUSE_CONFIRMED=YES
WHY_NOT_PATCH=remove the complete unsupported caller metadata batch and preserve OwnerRiskContext plus the independent lifecycle UI owner
TSC=24->23
FOCUSED_GUARD=PASS
FOCUSED_TEST=3/3_PASS
RELATED_OWNER_RISK_TESTS=9/9_PASS
RELATED_OWNER_RISK_GUARDS=2/2_PASS
STALE_LEGACY_GUARD=REGISTERED_NOT_WEAKENED
BUILD=PASS
DIFF_CHECK=PASS
GUARDIAN_STYLE_AUDIT=PASS
MAPPER_REVIEW=BOUNDED_DIAGNOSIS_COMPLETE_BATCH_REQUIRED
INDEPENDENT_REVIEW=PASS
FREEBUFF_USED=NO_MCP_EXPOSED
OPENCODE_USED=NO_MCP_EXPOSED
MARKET_PLUGINS_USED=ai-code-guardian@damian-agent-plugins,agent-efficiency-guardian@damian-agent-plugins,marketplace-router@damian-agent-plugins
NEXT_STAGE=FRESH_A2_MAP_AND_ROOT_CAUSE_SELECTION
```
