---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
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

## Controller closeout

```text
IMPLEMENTATION_SHA=f9aee3264a6c69ed848e12d07166e04ad7121430
STATUS=CLOSED_WITH_REGISTERED_FINDINGS
BILLING_ROUTES_MAPPED=YES
OWNER_AUTHORITY=PASS_ON_LOCAL_FIXTURES
ADMIN_AUTHORITY=PASS_ON_LOCAL_FIXTURES
MEMBER_MUTATION=0
CROSS_TENANT_BILLING_MUTATION=0_ON_PROVIDER_BINDING_FIXTURES
PROVIDER_CALLS_UNAUTHORIZED=0
WEBHOOK_AUTHORITY=PASS_WITH_CANONICAL_LEDGER_AND_RETRY_STATE
PLAN_SOURCE_OF_TRUTH=PASS_WITH_REGISTERED_PRICE_AND_ALIAS_DRIFT
FOCUSED_TESTS=PASS_STATIC_2_OF_2_RUNTIME_6_OF_6
TSC=PASS
LINT=PASS
BUILD=PASS_WITH_KNOWN_BUNDLE_WARNINGS
QUIET_RELEASE_GATE=PASS
AI_CODE_GUARDIAN=PASS_WITH_REGISTERED_FINDINGS
INDEPENDENT_REVIEW=COMPLETED_WITH_FINDINGS_RETESTED_BY_CONTROLLER
LIVE_SUPABASE_STRIPE_RUNTIME=OWNER_RUNTIME_REQUIRED
MIGRATION_APPLY_AND_BACKUP=OWNER_RUNTIME_REQUIRED
FINAL_REVIEWER_TIMEOUT=REGISTERED
NEXT_STAGE=LF-SEC-CG-001D_AI_AUTH_PLAN_GATE_AND_USAGE_CONTROL_REPAIR
```

### Registered findings and risks

1. Live Supabase schema, backup, migration apply and Stripe provider binding
   were not available locally. The B3 migration must be applied and verified
   before production promotion.
2. `app_metadata.role=admin` is treated as a global application-admin claim;
   workspace `owner` claims are workspace-scoped. This policy must remain
   explicit in the auth contract.
3. Plan prices and legacy aliases still exist in more than one registry. The
   current identifiers were preserved; central price catalog consolidation is
   deferred to a dedicated billing contract rather than silently renamed.
4. Generic workspace settings now rejects all webhook-owned billing fields.
   A separate audited manual-invoice operation is required if manual billing
   pilots need to change paid state.
5. The final independent reviewer timed out after the last local changes;
   earlier independent HIGH findings were addressed and re-tested by the
   controller. No independent PASS is claimed.
