---
typ: implementation_stage
doc_role: active_stage_contract
status: routed
canonical: true
project_id: closeflow_lead_app
stage_id: LF-SEC-CG-001C_WORKSPACE_BILLING_OWNER_ADMIN_AUTHORITY_REPAIR
parent_stage: LF-SEC-CG-001B_CASE_ITEMS_WORKSPACE_SCOPE_AND_IDOR_REPAIR
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: ed38d08ca4ce95619c7a3d8c89fd95f46f4c947c
target_branch: codex/closeflow-v1-e2e-roadmap
---

# B3 — Workspace billing owner/admin authority repair

## Objective

Prove that workspace billing and Stripe mutations are authorized by verified
owner/admin authority for the target workspace. A member, forged workspace
identifier, client-side role, or arbitrary Stripe customer/subscription ID
must not change billing state. Webhooks remain the billing authority for
provider-driven state.

## Controller contract

```text
ROOT_CAUSE=billing mutation authority and workspace scope are not proven as one backend boundary
WHY_THIS_IS_NOT_A_PATCH=all billing writes share verified role, workspace and provider-state contracts
SSOT_IMPACT=plan/access/billing nomenclature must remain aligned with the canonical billing source
PREVIOUS_STAGE_IMPACT=B2 establishes the item-to-case-to-workspace fail-closed pattern
SECURITY_IMPACT=member escalation, cross-tenant billing mutation and forged Stripe references must fail closed
```

## Required evidence

1. Map checkout, customer portal, cancel, resume, plan-change, manual billing
   and webhook routes, including compatibility and diagnostic paths.
2. Verify authenticated identity, target workspace membership and owner/admin
   authority before any billing mutation or provider call.
3. Prove member, foreign-workspace, forged customer and forged subscription
   identifiers cannot mutate another workspace.
4. Prove webhook signature/idempotency handling is the authority for provider
   events and cannot be replaced by client claims.
5. Preserve one billing plan/price source and register nomenclature drift
   rather than silently renaming production identifiers.
6. Add fail-first tests for owner/admin/member matrix, two workspaces,
   provider-call count and webhook replay/invalid signature cases.
7. Run AI Code Guardian review, independent review, focused tests, TSC/build
   and relevant release/security guards.

## PASS conditions

```text
BILLING_ROUTES_MAPPED=YES
OWNER_AUTHORITY=PASS
ADMIN_AUTHORITY=PASS
MEMBER_MUTATION=0
CROSS_TENANT_BILLING_MUTATION=0
PROVIDER_CALLS_UNAUTHORIZED=0
WEBHOOK_AUTHORITY=PASS
PLAN_SOURCE_OF_TRUTH=PASS_OR_REGISTERED_FINDING
FOCUSED_TESTS=PASS
GUARDIAN=PASS_OR_REGISTERED_FINDING
INDEPENDENT_REVIEW=COMPLETED
```

Do not claim billing PASS from UI visibility, role strings, mocked provider
responses or a checkout happy path without the owner/admin/member matrix.
