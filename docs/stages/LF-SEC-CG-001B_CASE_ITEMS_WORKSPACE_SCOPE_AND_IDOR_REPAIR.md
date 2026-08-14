---
typ: implementation_stage
doc_role: active_stage_contract
status: closed_with_registered_findings
canonical: true
project_id: closeflow_lead_app
stage_id: LF-SEC-CG-001B_CASE_ITEMS_WORKSPACE_SCOPE_AND_IDOR_REPAIR
parent_stage: LF-SEC-CG-001A_DIGEST_REPORT_AUTHORIZATION_AND_CROSS_TENANT_EXFILTRATION_REPAIR
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 20fd185561dfb6fa8dc9966f0b1608e76135d0ff
target_branch: codex/closeflow-v1-e2e-roadmap
---

# B2 — Case items workspace scope and IDOR repair

## Objective

Prove that every case-item read and mutation derives authorization from the
item → case → workspace relationship. A caller-supplied item, case or
workspace identifier must not allow cross-tenant reads, creates, updates or
deletes.

## Controller contract

```text
ROOT_CAUSE=case-item authorization is not consistently anchored to workspace scope
WHY_THIS_IS_NOT_A_PATCH=all item operations share one server-side relationship boundary
SSOT_IMPACT=workspace scope comes from the canonical request/auth and data model path
PREVIOUS_STAGE_IMPACT=B1 establishes the fail-closed workspace authorization pattern
SECURITY_IMPACT=IDOR and cross-tenant case-item access must fail closed
```

## Required evidence

1. Map every case-item GET/POST/PATCH/DELETE route, service helper and
   compatibility path.
2. Verify the authenticated workspace before reading the case or item and
   enforce item → case → workspace scope in the query/mutation itself.
3. Prove missing, foreign and mismatched parent identifiers fail closed with
   no data mutation and no unintended side effect.
4. Add fail-first focused tests for two workspaces covering GET, POST, PATCH
   and DELETE, including forged body/query identifiers.
5. Run TypeScript/build evidence when affected, AI Code Guardian review,
   independent review and diff/scope guards.

## PASS conditions

```text
ROUTES_MAPPED=YES
GET_SCOPE=item_to_case_to_workspace
POST_SCOPE=item_to_case_to_workspace
PATCH_SCOPE=item_to_case_to_workspace
DELETE_SCOPE=item_to_case_to_workspace
CROSS_TENANT_TEST=PASS
UNAUTHORIZED_MUTATION=0
FOCUSED_TESTS=PASS
GUARDIAN=PASS_OR_REGISTERED_FINDING
INDEPENDENT_REVIEW=COMPLETED
```

Do not claim PASS from client-side filtering, static markers or a single
happy-path workspace test.

## Controller closeout

```text
STATUS=CLOSED_WITH_REGISTERED_FINDINGS
IMPLEMENTATION_SHA=ed38d08ca4ce95619c7a3d8c89fd95f46f4c947c
ROUTES_MAPPED=YES
GET_SCOPE=item_to_case_to_workspace
POST_SCOPE=item_to_case_to_workspace
PATCH_SCOPE=item_to_case_to_workspace
DELETE_SCOPE=item_to_case_to_workspace
PORTAL_UPLOAD_PARENT_SCOPE=PASS
CROSS_TENANT_TEST=PASS
UNAUTHORIZED_MUTATION=0
FOCUSED_TESTS=PASS_STATIC_2_OF_2_RUNTIME_5_OF_5
TSC=PASS
LINT=PASS
BUILD=PASS
QUIET_RELEASE_GATE=PASS
GUARDIAN=PASS_WITH_REGISTERED_FINDINGS
INDEPENDENT_REVIEW=TIMEOUT_REGISTERED_NO_PASS_CLAIM
```

Evidence and limitations:

* The shared `case-item-scope.ts` helper is used by the dedicated
  `/api/case-items` route, the `/api/records?kind=case-items` compatibility
  route and portal storage upload validation. Operator auth is established
  before the parent lookup; parent checks precede all writes and provider or
  storage side effects.
* Mutations use `id + case_id` filters after relationship validation, so a
  relationship change cannot widen an update/delete to another parent.
* `npm run test:b2-case-items-scope`: static 2/2 and runtime 5/5. Runtime
  coverage includes foreign-workspace GET/POST/PATCH/DELETE in both routes,
  zero mutation evidence and foreign-case read denial.
* The real Supabase/RLS and portal Storage smoke tests were not run because no
  owner-controlled tenant/runtime credentials were provided. Do not promote
  this to a live-environment security PASS without that evidence.
* Three independent reviewer attempts timed out or were shut down. The mapper
  report confirmed the root cause and the controller verified the resulting
  diff, tests, TSC, lint, build and quiet release gate; this remains a review
  limitation, not an unrecorded PASS.
* Existing repository guard drift remains registered from prior stages,
  including P0/A22 and the A2-09 legacy marker test. Known bundle warnings are
  unchanged and are not B2 blockers.
