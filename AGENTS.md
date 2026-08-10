# DOCSYS-V1 repository bootstrap router — CLOSEFLOW_LEAD_APP branch gate

Repo: dkknapikdamian-collab/leadflowv1
Repository default branch: main
Application canonical branch evidence: dev-rollout-freeze
Preliminary class: STANDALONE_APPLICATION
Status: OWNER_DECISION_REQUIRED / FAIL-CLOSED_BRANCH_SOT_CONFLICT

`main` is the GitHub default branch and carries the DOCSYS bootstrap kernel. The current application repository contract, Obsidian router and active R23L workflow point to `dev-rollout-freeze`. This branch-role distinction is now explicit; it is not permission to silently choose a canonical branch. The owner must record `A_MAIN_CANONICAL`, `B_DEV_ROLLOUT_FREEZE_CANONICAL` or `C_EXPLICIT_SPLIT_WITH_SEPARATE_BOUNDARIES` before product work, merge, deployment or next-stage activation.

## READ_FIRST

1. AGENTS.md
2. _project/PROJECT_MANIFEST.json
3. _project/AGENT_CAPABILITIES.json
4. _project/WORKFLOW_STATE.json
5. _project/DOCUMENT_OWNERSHIP.json
6. Existing repository README and project-specific instructions only when the workflow state routes them.

## DOCSYS-V1 lock

- ONE_STAGE_ONLY: YES.
- This bootstrap is documentation/control-plane only.
- Product code, runtime, tests, dependencies, secrets and deployment are out of scope.
- AI_CODE_GUARDIAN_REQUIRED=YES for every code change, audit, security review or release.
- If the canonical AI Code Guardian capability is unavailable, status is BLOCKED_FAIL_CLOSED.
- The evidenced project identity is `closeflow_lead_app`; the canonical Obsidian route is `10_PROJEKTY/CloseFlow_Lead_App/00_AI_START.md`.
- No new project identity, workflow, Obsidian path or next stage may be invented.
- Canonical Obsidian writes require the global router and documented ownership; this repository may propose updates but may not self-accept them.

## Routing

The current repository is deliberately blocked for dependent work until the global DOCSYS router and owner decision reconcile `main` versus `dev-rollout-freeze`.
