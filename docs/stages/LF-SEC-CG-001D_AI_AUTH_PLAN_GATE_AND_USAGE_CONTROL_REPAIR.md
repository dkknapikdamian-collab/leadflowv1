---
typ: implementation_stage
doc_role: active_stage_contract
status: routed
canonical: true
project_id: closeflow_lead_app
stage_id: LF-SEC-CG-001D_AI_AUTH_PLAN_GATE_AND_USAGE_CONTROL_REPAIR
parent_stage: LF-SEC-CG-001C_WORKSPACE_BILLING_OWNER_ADMIN_AUTHORITY_REPAIR
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: f9aee3264a6c69ed848e12d07166e04ad7121430
target_branch: codex/closeflow-v1-e2e-roadmap
---

# B4 - AI auth, plan gate and usage control repair

## Objective

Every AI provider path must establish verified request identity, target
workspace scope and plan entitlement before any provider call. Missing auth,
missing plan or exceeded limits must produce zero provider calls. Input size,
rate and usage budgets must be explicit, bounded and observable. AI may create
drafts, but cannot write or send business data without confirmation.

## Controller contract

```text
ROOT_CAUSE=AI provider paths are not proven to share one auth-plan-usage boundary
WHY_THIS_IS_NOT_A_PATCH=all active provider paths and compatibility routes use one gate and one usage policy
SSOT_IMPACT=plan/access source of truth remains canonical and no second AI entitlement store is introduced
PREVIOUS_STAGE_IMPACT=B3 establishes verified workspace and owner/admin authority for billing state
SECURITY_IMPACT=unauthorized provider calls, cross-tenant reads, quota bypass and unconfirmed writes must fail closed
```

## Required evidence

1. Map every active AI route, provider adapter and compatibility route.
2. Prove auth and workspace scope before data reads and provider calls.
3. Prove plan denial, input limits, rate limits and usage limits with provider
   call count equal to zero.
4. Prove AI output remains a draft until explicit confirmation and cannot send
   or persist business mutations implicitly.
5. Add focused negative and positive runtime tests, then run Guardian,
   independent review, TSC, lint/build and relevant release guards.

## PASS conditions

```text
AI_ROUTES_MAPPED=YES
AUTH_BEFORE_READ=YES
PLAN_GATE_BEFORE_PROVIDER=YES
PROVIDER_CALLS_UNAUTHORIZED=0
INPUT_RATE_USAGE_LIMITS=PASS
DRAFT_CONFIRMATION_BOUNDARY=PASS
FOCUSED_TESTS=PASS
GUARDIAN=PASS_OR_REGISTERED_FINDING
INDEPENDENT_REVIEW=COMPLETED
```

No provider success, mocked environment or UI visibility is sufficient evidence
for a B4 PASS.
