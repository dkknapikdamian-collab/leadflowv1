---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-SEC-CG-001A_DIGEST_REPORT_AUTHORIZATION_AND_CROSS_TENANT_EXFILTRATION_REPAIR
parent_stage: LF-PROD-SOT-G15_TERMINAL_CLOSEOUT_AND_REPOSITORY_TRUTH_HANDOFF
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 9c27a2464ebdd238fa8587c924a5b03b99dade21
target_branch: codex/closeflow-v1-e2e-roadmap
---

# B1 — Digest report authorization and cross-tenant exfiltration repair

## Objective

Prove that daily and weekly digest/report reads and sends are authorized for
the authenticated workspace before any tenant-owned data is loaded or passed
to an email provider. A request, recipient, cron token or client-supplied
workspace identifier must not widen the authorized scope.

## Controller contract

```text
ROOT_CAUSE=unverified report authorization and workspace/recipient boundary
WHY_THIS_IS_NOT_A_PATCH=authorization is established before data access and provider calls
SSOT_IMPACT=workspace identity, membership and report recipient policy have one backend source
PREVIOUS_STAGE_IMPACT=A3 exact SHA 9c27a2464ebdd238fa8587c924a5b03b99dade21
SECURITY_IMPACT=cross-tenant report exfiltration must fail closed
```

## Required evidence

1. Map every daily/weekly report endpoint, cron entry point, query and send
   helper, including fallback paths.
2. Establish authenticated identity and workspace membership before reads.
3. Resolve recipients from the authorized workspace; reject body/query
   workspace impersonation and cross-tenant recipient IDs.
4. Verify cron/service authorization separately from user authorization,
   without treating a public or missing cron secret as valid.
5. Ensure unauthorized, missing-workspace and cross-tenant cases make zero
   provider calls and expose no report data.
6. Add focused fail-first tests for two workspaces, unauthorized requests,
   invalid recipient scope, provider failure and duplicate/deduped sends.
7. Run AI Code Guardian security review and an independent reviewer. Findings
   require source, sink, boundary, exploitability, affected scope, test, fix
   and retest evidence.

## PASS conditions

```text
REPORT_ENDPOINTS_MAPPED=YES
AUTH_BEFORE_READ=YES
WORKSPACE_MEMBERSHIP_ENFORCED=YES
RECIPIENT_SCOPE_ENFORCED=YES
CRON_AUTHORIZATION_FAIL_CLOSED=YES
CROSS_TENANT_TEST=PASS
UNAUTHORIZED_PROVIDER_CALLS=0
FOCUSED_TESTS=PASS
GUARDIAN=PASS_OR_REGISTERED_FINDING
INDEPENDENT_REVIEW=COMPLETED
```

Do not claim PASS from static strings alone. Real provider credentials or
owner runtime execution are required whenever the evidence cannot be proved
locally without them.

## Controller closeout

```text
STATUS=CLOSED_WITH_REGISTERED_FINDINGS
IMPLEMENTATION_SHA=20fd185561dfb6fa8dc9966f0b1608e76135d0ff
REPORT_ENDPOINTS_MAPPED=YES
AUTH_BEFORE_READ=PASS
WORKSPACE_MEMBERSHIP_ENFORCED=PASS_WITH_REGISTERED_LIVE_RUNTIME_LIMITATION
RECIPIENT_SCOPE_ENFORCED=PASS
CRON_AUTHORIZATION_FAIL_CLOSED=PASS
CROSS_TENANT_TEST=PASS
UNAUTHORIZED_PROVIDER_CALLS=0
FOCUSED_TESTS=PASS_9_OF_9
TSC=PASS
LINT=PASS_REUSED_FROM_EXACT_CODE_SCOPE
BUILD=PASS_REUSED_FROM_EXACT_CODE_SCOPE
GUARDIAN=PASS_WITH_REGISTERED_FINDINGS
INDEPENDENT_REVIEW=COMPLETED_WITH_LIMITATIONS
MIGRATION_APPLIED=OWNER_RUNTIME_REQUIRED
```

Evidence and limitations:

* `npm run test:b1-digest-authorization`: static 3/3 and runtime 6/6.
* The runtime suite proves unauthenticated and cross-tenant denial, recipient
  tampering denial, fail-closed cron behavior and zero provider calls using
  verified-auth test doubles. A live Supabase/Resend smoke test is not
  available in this environment.
* The migration performs a duplicate preflight before changing indexes. It
  must be preceded by a verified backup and executed in the owner-controlled
  Supabase environment; it is not silently marked applied here.
* Registered repository findings remain outside B1 scope: stale P13/P0 and
  digest-environment guard markers, existing Supabase/auth architecture drift,
  and Vite bundle-size warnings. They are not evidence of a B1 authorization
  bypass.
* FreeBuff and OpenCode MCPs were not exposed. One post-implementation
  reviewer timed out; a replacement review was completed, and its initial
  evidence gap was closed by the authenticated runtime tests and migration
  preflight above. No reviewer self-approval is used as the sole PASS basis.
