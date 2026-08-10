---
typ: implementation_stage
doc_role: active_stage_contract
status: routed
canonical: true
project_id: closeflow_lead_app
stage_id: LF-PROD-SOT-G15_TERMINAL_CLOSEOUT_AND_REPOSITORY_TRUTH_HANDOFF
parent_stage: LF-PROD-SOT-G15-R23M_PLUS_ACTIVE_TSC_DEBT_TO_ZERO
source_repo: dkknapikdamian-collab/leadflowv1
source_branch: codex/closeflow-v1-e2e-roadmap
base_branch: dev-rollout-freeze
base_ref: 4e602f4b0ebd31e2f6f75c47d18514c8ace7c5e3
target_branch: codex/closeflow-v1-e2e-roadmap
---

# A3 - Terminal SOT closeout and repository truth handoff

## Objective

Close the TypeScript debt program and prove that the working branch has one
technical workflow source, one active contract, one roadmap, and an auditable
handoff to the next product/security phase. This stage does not merge to the
canonical branch and does not rewrite the Obsidian vault.

## Required evidence

1. Full lint.
2. Full typecheck with `ACTIVE_TSC_ERRORS=0`.
3. Build.
4. Relevant A2 and checkpoint tests.
5. AI Code Guardian closeout audit and independent review attempt.
6. Router audit: `WORKFLOW_STATE.json` is the only dynamic technical state
   source; current contract path resolves to this active A3 contract.
7. Duplicate-SOT audit across `_project`, `docs/stages`, and repository root.
8. Legacy PR #50/branch assessment and stale workflow assessment.
9. `git diff --check`, exact SHA and clean scoped worktree (except preserved
   local `.stversions/`).

## Controller invariants

```text
ROOT_CAUSE=A2 type debt and historical routing drift required a terminal truth handoff
WHY_THIS_IS_NOT_A_PATCH=closeout validates repository truth instead of adding another status document
SSOT_IMPACT=WORKFLOW_STATE.json is the only dynamic technical workflow source
PREVIOUS_STAGE_IMPACT=A2 reached ACTIVE_TSC_ERRORS=0 at 4e602f4b
SECURITY_IMPACT=existing checkpoint security failures remain registered and block B/C PASS
```

## PASS conditions

```text
FULL_LINT=PASS
ACTIVE_TSC_ERRORS=0
GLOBAL_TSC_ERRORS=0
BUILD=PASS
ONE_DYNAMIC_WORKFLOW_SOURCE=YES
ONE_ACTIVE_CONTRACT=YES
ONE_ROADMAP=YES
DUPLICATE_SOT_AUDIT=PASS
LEGACY_PR_ASSESSED=YES
STALE_WORKFLOW_ASSESSED=YES
GUARDIAN_CLOSEOUT=PASS_OR_REGISTERED_LIMITATION
WORKTREE_SCOPED=YES
```

## Closeout evidence

```text
STATUS=ROUTED
SOURCE_BASE_SHA=4e602f4b0ebd31e2f6f75c47d18514c8ace7c5e3
FINAL_SHA=PENDING
LINT=PENDING
TSC=PENDING
BUILD=PENDING
ROUTER_AUDIT=PENDING
DUPLICATE_SOT_AUDIT=PENDING
LEGACY_PR_ASSESSMENT=PENDING
GUARDIAN_CLOSEOUT=PENDING
INDEPENDENT_REVIEW=PENDING
FREEBUFF_USED=NO_MCP_EXPOSED
OPENCODE_USED=NO_MCP_EXPOSED
NEXT_STAGE=PHASE_B_SECURITY
```
