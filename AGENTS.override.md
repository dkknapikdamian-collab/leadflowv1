# CONTROL-00 — CloseFlow / LeadFlow execution routing

## READ_FIRST
1. `_project/PROJECT_MANIFEST.json`
2. `_project/AGENT_CAPABILITIES.json`
3. `_project/WORKFLOW_STATE.json`
4. `AGENTS.md` for preserved project-specific stable rules
5. exactly one active workflow contract only when `WORKFLOW_STATE.json` resolves it unambiguously

## Rules
- `ONE_STAGE_ONLY: YES` means one mutating product stage at a time; it does not end the overall approved mission after one stage.
- A blocked or legacy-pending workflow state fails closed and forbids product-stage execution.
- Resolve documentation writes through `_project/DOCUMENT_OWNERSHIP.json`.
- Resolve plugins and skills through `_project/AGENT_CAPABILITIES.json`.
- `_project/WORKFLOW_STATE.json` remains the single technical workflow SOT; do not create a second workflow or stage registry.
- The repository executor proposes Obsidian updates; it does not directly change canonical memory.
- A primary writer subagent cannot accept its own work or start the next stage.
- The Codex parent controller may independently accept a subagent implementation only after diff review, Visual SOT review, targeted tests, Guardian, browser/runtime proof and required documentation are complete.
- After an explicit Codex parent PASS, automatic next-stage activation is allowed only when the workflow state and exact contract permit it; future stages remain locked until then.
- Execution fails closed when the resolved workflow has any non-empty blocker, a `LOCKED` contract, an active-stage count other than one, or a mismatch between the workflow and exact contract.
- Acceptance is not complete until the exact contract's full criteria are met, including its receipt, commit and remote-verification requirements; a status field alone never authorizes PASS or activation.

## Resolved execution mode

`CONTROL-00` is aligned with the approved Forteca program branch. Dynamic stage, SHA, PR, deployment and test status remain owned by `_project/WORKFLOW_STATE.json` and stage evidence, not by this stable override.

- canonical code/workflow base: `dev-rollout-freeze`
- approved Forteca working branch: `codex/forteca-ui-001-040-clean`
- dynamic workflow source: `_project/WORKFLOW_STATE.json`
- active contract source: `current_workflow.contract_path`
- canonical Obsidian memory remains owner-controlled; this repository only emits update proposals

Product-stage execution is allowed only when all of the following hold:

1. the executor is on the approved Forteca working branch `codex/forteca-ui-001-040-clean`;
2. `_project/WORKFLOW_STATE.json` resolves exactly one active contract with no blocker, an executable non-`LOCKED` contract status and `active_stage_count=1`;
3. the exact stage contract permits the requested scope;
4. AI Code Guardian is loaded for code, security, bugfix and release work;
5. named-path staging, scoped tests, guards, Visual SOT review, browser/runtime proof and exact evidence are complete;
6. acceptance is performed by the Codex parent controller, never by the primary writer.

This reconciliation does not weaken the one-stage rule, fail-closed workflow states, ownership rules, Guardian requirement, root-cause-only policy or no-self-acceptance rule. It only removes the stale branch pin and makes the parent-controller acceptance boundary explicit.
