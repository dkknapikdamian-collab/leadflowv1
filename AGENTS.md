# DOCSYS-V1 repository bootstrap router — CLOSEFLOW_LEAD_APP

Repo: dkknapikdamian-collab/leadflowv1
Repository default branch: main
Canonical product branch: dev-rollout-freeze
Production branch: dev-rollout-freeze
Preliminary class: STANDALONE_APPLICATION
Status: OWNER_DECISION_RESOLVED / CODE_TASKS_REQUIRE_AI_CODE_GUARDIAN

Owner decision 2026-08-10: `dev-rollout-freeze` is the canonical product and production branch for CloseFlow. `main` remains the repository default/control-plane branch and must not be treated as the application production branch.

Autonomous executors must not perform multi-stage product work directly on `dev-rollout-freeze`. They must create/use a separate work branch from the verified current `dev-rollout-freeze` SHA (for the current program: `codex/closeflow-v1-e2e-roadmap`). They may commit and push there, but may not merge, rebase or force-push into `dev-rollout-freeze`. Promotion to production requires independent verification plus an explicit controller/owner decision.

## READ_FIRST

1. AGENTS.md
2. _project/PROJECT_MANIFEST.json
3. _project/AGENT_CAPABILITIES.json
4. _project/WORKFLOW_STATE.json
5. _project/DOCUMENT_OWNERSHIP.json
6. Canonical Obsidian router: `10_PROJEKTY/CloseFlow_Lead_App/00_AI_START.md` when available.
7. Existing repository README and project-specific instructions only when the canonical product workflow routes them.

## DOCSYS-V1 lock on `main`

- `main` is documentation/control-plane/default-branch context, not the CloseFlow production branch.
- Product code, runtime, tests, dependencies, secrets and deployment changes must not be executed directly on `main` through this bootstrap.
- Product execution starts from the verified canonical product branch `dev-rollout-freeze`, then moves to a separate non-production work branch.
- AI_CODE_GUARDIAN_REQUIRED=YES for every code change, audit, security review or release.
- If the canonical AI Code Guardian capability is unavailable for a required code gate, status is BLOCKED_FAIL_CLOSED.
- The project identity is `closeflow_lead_app`; canonical Obsidian route is `10_PROJEKTY/CloseFlow_Lead_App/00_AI_START.md`.
- No new project identity, workflow, Obsidian path or next stage may be invented.
- Canonical Obsidian writes require the global router and documented ownership; repository executors propose memory updates and do not self-accept them.

## Routing

`main` redirects product execution to the canonical product branch. Product work must resolve the active technical workflow from `_project/WORKFLOW_STATE.json` on `dev-rollout-freeze` (or from the controller-approved non-production work branch derived from its exact SHA). No autonomous executor may promote its own work into production.
