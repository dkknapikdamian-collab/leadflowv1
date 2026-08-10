---
typ: implementation_stage
doc_role: active_stage_contract
status: active
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

Remove the unused `lifecycle` property from the `getCaseOwnerRiskBadges`
call-site in `Cases.tsx`. Keep `OwnerRiskContext` as the canonical public
context contract and preserve the separate lifecycle calculations used by the
Cases row UI.

## Evidence and root cause

The fresh TypeScript map at exact base SHA `34befb167310eb98bcf3437284502645c895a077`
contains 24 active error lines. The first diagnostic is:

```text
src/pages/Cases.tsx(827,25): error TS2353: Object literal may only specify known properties, and 'lifecycle' does not exist in type 'OwnerRiskContext'.
```

`OwnerRiskContext` declares settings, now, relatedRecords, hasNextStep,
nextMove, and activityTruth. `getCaseOwnerRiskBadges` derives its own next
move and activity truth and does not read `context.lifecycle`. The caller's
`lifecycle` value is already used independently for row labels, status and
counts. Widening `OwnerRiskContext` would create an unused, misleading input
contract; removing only the unsupported property restores the existing API.

```text
ROOT_CAUSE=Cases passes an unused lifecycle property outside the canonical OwnerRiskContext contract
WHY_THIS_IS_NOT_A_PATCH=remove dead caller metadata instead of widening the shared context type or duplicating lifecycle ownership
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

1. Fail-first evidence records the exact 24-line map and TS2353 location.
2. Focused guard proves the current source equals the exact base source with
   only the unsupported lifecycle property removed from this call-site.
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
