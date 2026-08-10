---
typ: implementation_stage
doc_role: active_stage_contract
status: routed
canonical: true
project_id: closeflow_lead_app
stage_id: LF-SEC-CG-001E_SUPPORT_ACTOR_AUTHORITY_AND_AUDIT_TRAIL_REPAIR
parent_stage: LF-SEC-CG-001D_AI_AUTH_PLAN_GATE_AND_USAGE_CONTROL_REPAIR
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: f193256fe202d98f2edb710a6f3d06aa09096990
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
