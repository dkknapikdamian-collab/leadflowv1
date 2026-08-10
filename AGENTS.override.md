# CONTROL-00 — CloseFlow / LeadFlow execution routing

## READ_FIRST
1. `_project/PROJECT_MANIFEST.json`
2. `_project/AGENT_CAPABILITIES.json`
3. `_project/WORKFLOW_STATE.json`
4. `AGENTS.md` for preserved project-specific stable rules
5. exactly one active workflow contract only when `WORKFLOW_STATE.json` resolves it unambiguously

## Rules
- `ONE_STAGE_ONLY: YES`
- blocked or legacy-pending workflow state forbids product-stage execution
- resolve documentation writes through `_project/DOCUMENT_OWNERSHIP.json`
- resolve plugins/skills through `_project/AGENT_CAPABILITIES.json`
- do not create a second source of truth
- repository executor proposes Obsidian updates; it does not directly change canonical memory
- no self-acceptance or automatic next-stage activation

## Resolved execution mode

`CONTROL-00` has resolved the bootstrap routing conflict on the single working branch:

- canonical code/workflow base: `dev-rollout-freeze`
- canonical base SHA: `ab0f5c85f6cb3636c483debd13c04c5e29779c81`
- working branch: `codex/closeflow-v1-e2e-roadmap`
- dynamic workflow source: `_project/WORKFLOW_STATE.json`
- active contract source: `current_workflow.contract_path`
- canonical Obsidian memory remains owner-controlled; this repository only emits update proposals

Product-stage execution is allowed only when all of the following hold:

1. the executor is on `codex/closeflow-v1-e2e-roadmap`;
2. `_project/WORKFLOW_STATE.json` resolves exactly one active contract;
3. the stage contract permits the requested scope;
4. AI Code Guardian is loaded for code, security, bugfix and release work;
5. named-path staging, scoped tests, guards, review and exact evidence are complete.

The former `DOCSYS-V1` documentation-only bootstrap lock is superseded by this explicit, committed control-plane transition. It is not a bypass: the one-stage rule, fail-closed workflow states, ownership rules, Guardian requirement and no-self-acceptance rules remain active.
