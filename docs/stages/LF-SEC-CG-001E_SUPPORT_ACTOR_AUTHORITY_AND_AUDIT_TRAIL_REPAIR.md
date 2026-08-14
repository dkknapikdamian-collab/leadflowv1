---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-SEC-CG-001E_SUPPORT_ACTOR_AUTHORITY_AND_AUDIT_TRAIL_REPAIR
parent_stage: LF-SEC-CG-001D_AI_AUTH_PLAN_GATE_AND_USAGE_CONTROL_REPAIR
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: ad35296219f1634579351b5f1ef9b4f4cca21389
implementation_ref: 7e7365540a850b6ef3b95e8298f36ec46c3cf479
target_branch: codex/closeflow-v1-e2e-roadmap
---

# B5 - support actor authority and audit trail repair

## Objective

Support-only actions must use a verified backend support actor, explicit
admin/role authorization and an immutable audit trail. Client-provided actor
identity, workspace scope or audit fields are untrusted input.

## Controller contract

```text
ROOT_CAUSE=SUPPORT_ACTOR_AUTHORITY_AND_AUDIT_TRAIL_REQUIRE_INDEPENDENT_VERIFICATION
WHY_THIS_IS_NOT_A_PATCH=all support mutation paths share one backend actor and audit contract
SSOT_IMPACT=authorization and audit ownership remain server-side
PREVIOUS_STAGE_IMPACT=B4 establishes the shared verified request boundary for AI and support-adjacent routes
SECURITY_IMPACT=prevent privilege escalation, actor spoofing, cross-tenant support access and unaudited mutations
```

## Closeout evidence

```text
IMPLEMENTATION_SHA=7e7365540a850b6ef3b95e8298f36ec46c3cf479
SUPPORT_ROUTES_MAPPED=YES
SERVER_ACTOR_AUTHORITY=YES
WORKSPACE_SCOPE=PASS
AUDIT_TRAIL=PASS_LOCAL_ATOMIC_RPC
FOCUSED_STATIC=3/3
FOCUSED_RUNTIME=7/7
GUARDIAN=PASS_WITH_REGISTERED_FINDINGS
GUARDIAN_PATCH_PATTERNS=0
GUARDIAN_TEST_WEAKENING=CLEAR
TSC=PASS
LINT=PASS
BUILD=PASS
QUIET_RELEASE_GATE=PASS
INDEPENDENT_REVIEW=TIMEOUT_REGISTERED
SUPABASE_CLI=UNAVAILABLE
LIVE_SUPABASE_RLS_AND_MIGRATION=OWNER_RUNTIME_REQUIRED
```

The support handler now resolves actor, role and workspace from the verified
Supabase request context. `includeAll` and status mutation are admin-only;
member replies are limited to owned tickets; caller owner/actor/audit fields
are ignored; and ticket create/reply/status operations use transaction-bound
server-side RPCs that append immutable audit events. Forwarding records a
server-authoritative audit attempt and returns generic provider failures.

Registered findings:

1. The B5 migration has not been applied or verified against live Supabase in
   this local-only run. Supabase CLI is not installed and no production
   migration, RLS, grants or append-only trigger proof exists yet.
2. Two fresh post-implementation independent reviewers timed out; no timeout
   was treated as PASS. Local Guardian checks and exact focused/quiet evidence
   remain valid at the implementation SHA.
3. Forward email has bounded payload size but no distributed rate-limit or
   provider idempotency key; this remains a follow-up before public support
   abuse exposure.
4. Existing `support_requests.workspace_id` remains nullable for legacy rows;
   workspace-scoped routes do not expose rows without verified scope. A live
   data audit/backfill is still required before tightening the constraint.

Next stage: `LF-SEC-CG-001F_PORTAL_UPLOAD_PARENT_SCOPE_RATE_LIMIT_AND_QUOTA_REPAIR`.

## Required evidence

1. Map support routes, actors, roles and workspace scope.
2. Prove admin/support authorization before every read and mutation.
3. Ignore caller-supplied actor/audit identity and stamp server identity.
4. Test unauthorized, cross-workspace, replay and audit-integrity cases.
5. Run Guardian, independent security review, focused tests, typecheck, lint,
   build and the quiet release gate.

## PASS conditions

```text
SUPPORT_ROUTES_MAPPED=YES
SERVER_ACTOR_AUTHORITY=YES
WORKSPACE_SCOPE=PASS
AUDIT_TRAIL=PASS
FOCUSED_TESTS=PASS
GUARDIAN=PASS_OR_REGISTERED_FINDING
INDEPENDENT_REVIEW=COMPLETED
```
