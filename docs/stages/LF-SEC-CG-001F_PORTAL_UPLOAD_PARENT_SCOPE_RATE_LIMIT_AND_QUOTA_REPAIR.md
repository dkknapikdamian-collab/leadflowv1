---
typ: implementation_stage
doc_role: active_stage_contract
status: routed
canonical: true
project_id: closeflow_lead_app
stage_id: LF-SEC-CG-001F_PORTAL_UPLOAD_PARENT_SCOPE_RATE_LIMIT_AND_QUOTA_REPAIR
parent_stage: LF-SEC-CG-001E_SUPPORT_ACTOR_AUTHORITY_AND_AUDIT_TRAIL_REPAIR
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 7e7365540a850b6ef3b95e8298f36ec46c3cf479
target_branch: codex/closeflow-v1-e2e-roadmap
---

# B6 - portal upload parent scope, rate limit and quota repair

## Objective

Every client-portal upload and download must prove the portal session, parent
workspace/case scope and an explicit size/type/quota/rate contract before a
storage provider call. Client-provided parent IDs, filenames and quotas are
untrusted input.

## Controller contract

```text
ROOT_CAUSE=PORTAL_UPLOAD_PARENT_SCOPE_AND_RESOURCE_LIMITS_REQUIRE_ONE_SERVER_BOUNDARY
WHY_THIS_IS_NOT_A_PATCH=all upload/download paths share verified session, parent scope and bounded resource policy
SSOT_IMPACT=portal session and storage authorization remain server-owned; no second quota/config store
PREVIOUS_STAGE_IMPACT=B5 establishes verified actor and immutable support audit patterns
SECURITY_IMPACT=prevent cross-tenant file access, orphan uploads, abuse, storage cost explosion and content-type confusion
```

## Required evidence

1. Map portal token/session, upload/download, parent relation and storage paths.
2. Prove parent workspace scope before every storage read/write.
3. Enforce file size, allowed type, filename normalization, quota and rate
   limits with provider-call-zero negative tests.
4. Test expired/revoked token, foreign parent, replay and malformed metadata.
5. Run Guardian, independent security review, focused tests, typecheck,
   lint/build and the relevant quiet release guard.

## PASS conditions

```text
PORTAL_ROUTES_MAPPED=YES
SESSION_AND_PARENT_SCOPE=PASS
UPLOAD_LIMITS=PASS
DOWNLOAD_SCOPE=PASS
PROVIDER_CALLS_UNAUTHORIZED=0
FOCUSED_TESTS=PASS
GUARDIAN=PASS_OR_REGISTERED_FINDING
INDEPENDENT_REVIEW=COMPLETED
```
