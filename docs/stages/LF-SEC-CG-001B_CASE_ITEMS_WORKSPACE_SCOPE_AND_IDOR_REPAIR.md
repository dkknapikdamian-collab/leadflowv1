---
typ: implementation_stage
doc_role: active_stage_contract
status: routed
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
