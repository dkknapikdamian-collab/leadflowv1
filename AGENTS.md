# AGENTS.md — CloseFlow / LeadFlow

```text
PROJECT_ID=closeflow_lead_app
REPOSITORY=dkknapikdamian-collab/leadflowv1
CANONICAL_APPLICATION_BRANCH=dev-rollout-freeze
GITHUB_DEFAULT_BRANCH=main
OBSIDIAN_PROJECT_ENTRY=10_PROJEKTY/CloseFlow_Lead_App/00_AI_START_SPIS_TRESCI.md
```

This is the minimal repository bootstrap. Do not store current stage, SHA, PR, deployment or test result here.

## Stable routing flow

1. Read `_project/PROJECT_MANIFEST.json`.
2. Classify the task.
3. Read `_project/AGENT_CAPABILITIES.json` and load only capabilities required for that task class.
4. Read `_project/WORKFLOW_STATE.json` only when the task needs the current technical workflow.
5. If a workflow is active, read exactly `current_workflow.contract_path` plus bounded dependencies/evidence.
6. Read the canonical Obsidian router only for project memory, owner decisions, direction or source routing.

## Task classification

Code-changing or technical review classes include `CODE_CHANGE`, `BUG_REPAIR`, `CODE_AUDIT`, `SECURITY_REVIEW`, `RELEASE`, `TECHNICAL_REFACTOR`, `PERFORMANCE_REPAIR`, `API_ARCHITECTURE_CHANGE`, `DATABASE_CODE_CHANGE`, `TECHNICAL_IMPLEMENTATION_STAGE_DESIGN`.

For those classes: `AI_CODE_GUARDIAN_REQUIRED=YES`. If the required capability cannot be loaded: `BLOCKED_REQUIRED_CAPABILITY_UNAVAILABLE`.

`BUSINESS_ANALYSIS`, `MARKET_RESEARCH`, `OWNER_DECISION`, `PRODUCT_DIRECTION`, `COPYWRITING` and pure wiki maintenance do not require Guardian by default.

## CloseFlow branch ownership

- `dev-rollout-freeze` is the canonical application/product branch.
- `main` is the GitHub default/control-plane branch and is not the canonical application branch.
- Do not merge `dev-rollout-freeze` into `main` merely to make those roles equal.
- Autonomous product work must use a bounded non-production work branch created from a verified `dev-rollout-freeze` base unless an accepted stage contract says otherwise.
- Executor self-merge, rebase or force-push into `dev-rollout-freeze` is forbidden.

## Scope and quality guards

- Code/runtime/config/tests/executable migrations belong to the repository; product memory, owner decisions, direction and coordination belong to Obsidian.
- Fix evidenced root causes; do not use `any`, `ts-ignore`, disabled tests/files, random retry/timeout/catch/cache, duplicate stores/config/helpers/SOTs, or weakened tests as patches without a bounded accepted exception.
- No `git add .`, `git add -A`, `git commit -a`, force-push, reset/clean/stash/rebase as a shortcut.
- One commit must not mix unrelated project scope.
- If exact SHA/log/runtime/evidence is required and unavailable, return `INSUFFICIENT_EVIDENCE` or `OWNER_RUNTIME_EXECUTION_REQUIRED`, never fabricated PASS.

## Project boundaries

CloseFlow is an owner control system for leads, clients, cases, tasks, calendar, follow-ups and finances. Do not rewrite accepted visual baselines or change SQL, cost, Google Calendar, LeadListCard, ClientDetail or finance behavior outside the accepted stage scope.

For SQL/migrations use the canonical project SQL ledger and concrete executable migrations. For historical evidence, read only the specific linked report/receipt required by the current task.
