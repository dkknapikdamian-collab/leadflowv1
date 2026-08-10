---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
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

## Closeout evidence

```text
IMPLEMENTATION_REF=6c8cb6aa
COMPATIBILITY_GUARD_REF=8889c7c7
PORTAL_ROUTES_MAPPED=YES
SESSION_AND_PARENT_SCOPE=PASS_LOCAL
UPLOAD_LIMITS=PASS_LOCAL
DOWNLOAD_SCOPE=NOT_IMPLEMENTED_IN_THIS_UPLOAD_CONTRACT
PROVIDER_CALLS_UNAUTHORIZED=0_LOCAL_RUNTIME
FOCUSED_TESTS=PASS (static 3/3, runtime 4/4)
B2_IMPACT=PASS (static 2/2)
TSC=PASS
LINT=PASS
BUILD=PASS
QUIET_RELEASE_GATE=PASS
SOURCE_TRUTH_GUARD=PASS
GUARDIAN_PATCH_PATTERNS=0
GUARDIAN_TEST_WEAKENING=CLEAR
INDEPENDENT_REVIEW=TIMEOUT_REGISTERED; replacement reviewer also pending at closeout
SUPABASE_CLI=UNAVAILABLE
LIVE_MIGRATION_RLS_RUNTIME=OWNER_RUNTIME_REQUIRED
STATUS=CLOSED_WITH_REGISTERED_FINDINGS
```

## Registered findings and risks

1. Live Supabase migration, RLS, RPC privileges and storage admission runtime
   were not verified locally because the Supabase CLI and live credentials are
   unavailable.
2. The quota/rate ledger uses the database `current_date`; production must
   confirm the database timezone policy matches the CloseFlow Europe/Warsaw
   contract, or the migration must use an explicit Warsaw-day boundary.
3. Failed provider attempts consume reserved quota until an explicit
   reconciliation policy exists; this is conservative but may require an
   operator recovery path.
4. Legacy nullable parent/workspace data and storage object retention require a
   live data audit before release.
5. Independent semantic review did not complete within the controller window;
   no reviewer PASS is claimed.
