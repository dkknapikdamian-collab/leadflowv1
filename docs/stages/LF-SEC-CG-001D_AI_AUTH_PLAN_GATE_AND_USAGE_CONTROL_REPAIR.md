---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-SEC-CG-001D_AI_AUTH_PLAN_GATE_AND_USAGE_CONTROL_REPAIR
parent_stage: LF-SEC-CG-001C_WORKSPACE_BILLING_OWNER_ADMIN_AUTHORITY_REPAIR
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: f193256fe202d98f2edb710a6f3d06aa09096990
remediation_ref: cb4c4b6d98bb6be54bf2d8601ab2f8bf4c619370
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

## Closeout evidence

```text
IMPLEMENTATION_SHA=f193256fe202d98f2edb710a6f3d06aa09096990
REMEDIATION_SHA=cb4c4b6d98bb6be54bf2d8601ab2f8bf4c619370
AI_ROUTES_MAPPED=YES
AUTH_BEFORE_READ=YES
PLAN_GATE_BEFORE_PROVIDER=YES
PROVIDER_CALLS_UNAUTHORIZED=0
INPUT_RATE_USAGE_LIMITS=PASS
DRAFT_CONFIRMATION_BOUNDARY=PASS
FOCUSED_STATIC=5/5
FOCUSED_RUNTIME=5/5
REMEDIATION_STATIC=4/4
REMEDIATION_RUNTIME=3/3
TSC=PASS
LINT=PASS
BUILD=PASS
QUIET_RELEASE_GATE=PASS
GUARDIAN=PASS_WITH_REGISTERED_FINDINGS
INDEPENDENT_REVIEW=TIMEOUT_REGISTERED
GUARDIAN_PATCH_PATTERNS=0
GUARDIAN_TEST_WEAKENING=CLEAR
```

The active AI routes now use `src/server/ai-access.ts`, the provider adapter
is reached only after verified request/workspace/plan/usage checks, and draft
confirmation is server-owned by `src/server/ai-draft-confirmation.ts`. Quick
Lead uses the same confirmation endpoint; caller snapshots are ignored; draft
status/expiry and verified user attribution are enforced. Final records carry
an `ai_draft_id` idempotency key and confirmation claims have a recovery TTL
after the remediation migration is applied.

Registered findings:

1. `supabase/migrations/20260810140000_b4_ai_usage_authority.sql` and
   `20260810150000_b4_ai_draft_confirmation_idempotency.sql` have not been
   applied or verified against live Supabase in this local-only run. Owner
   runtime execution is required before production promotion; without the
   second migration, database-level final-record idempotency is not proven.
2. A fresh post-remediation independent reviewer and OpenCode CLI review timed
   out; earlier B4 mapper/security reviews, local Guardian guards and exact
   remediation tests are retained as evidence, but no timeout was treated as
   PASS.
3. Generic non-AI workspace access fallback remains fail-open in the legacy
   write path; the strict AI path is fail-closed. This remains a separate
   security hardening item for the subsequent security/data stages.
4. The server usage ledger counts bounded AI draft/provider attempts, including
   rule-fallback requests, as a conservative cost-control policy.
5. App-level admins bypass plan/usage in the shared boundary by policy; the
   handler-level admin authorization remains authoritative for `ai-config`.
6. AI usage ledger timezone/retention, provider fallback cost accounting and
   stale workspace membership remain registered follow-up risks.

Next stage: `LF-SEC-CG-001E_SUPPORT_ACTOR_AUTHORITY_AND_AUDIT_TRAIL_REPAIR`.
