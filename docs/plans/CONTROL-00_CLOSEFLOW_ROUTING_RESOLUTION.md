---
typ: control_plane_evidence
doc_role: controller_execution_log
status: resolved_for_working_branch
project_id: closeflow_lead_app
stage_id: CONTROL-00
verified_at: 2026-08-10 Europe/Warsaw
---

# CONTROL-00 — CloseFlow V1 routing resolution

## Decision

The canonical code/workflow base for this run is `origin/dev-rollout-freeze@ab0f5c85f6cb3636c483debd13c04c5e29779c81`.

The single working branch is `codex/closeflow-v1-e2e-roadmap`, created from that exact SHA. The dynamic technical workflow remains exclusively `_project/WORKFLOW_STATE.json`; the active stage is exclusively its `current_workflow.contract_path`.

The historical PR #50 (`787b9e0f5d2172c0fbd399807ee53b2f6e8cde49`) is evidence only. Its R23L diff is not merged or trusted as the implementation for this branch.

## Source claims

| SOURCE | CLAIM | SHA / REF | CANONICAL? | ACTIVE? | CONFLICT? |
|---|---|---|---|---|---|
| Obsidian `00_SYSTEM/PROJECTS.json` on `origin/main` | Project identity `closeflow_lead_app`; `canonical_branch=main` | `obsidian-vault@04d748f046068cc6cb69ae8eb5b4661873b197bc`, blob `1f82a30eba0a153a4377a0aa9a9ab8090b5e0c5d` | YES, identity only | YES | YES — branch claim conflicts with technical router |
| Obsidian CloseFlow router on `origin/main` | `canonical_branch=dev-rollout-freeze`; technical workflow source is the application repository | blob `912f58150c641509c46505080378db783c9d068a` | YES for technical routing | YES | NO with repo manifest; conflicts with registry |
| Obsidian master roadmap on `origin/main` | Active V1 roadmap, app branch `dev-rollout-freeze`, R23L active | blob `a9a9a2b9b3deb216be7b632d213b9409b8e64643` | YES for roadmap | YES | NO with technical routing |
| App `origin/main` | Old application snapshot without repository routing kernel, workflow state or AGENTS entry files | `9d25c59bc8c9e351ed63cb13d6e215bcbbfe88a5` | NO for this current execution | NO | YES if treated as canonical base |
| App `origin/dev-rollout-freeze` | Current application base with manifest, capability registry, workflow state, and active R23L contract | `ab0f5c85f6cb3636c483debd13c04c5e29779c81` | YES for code/workflow | YES | NO with technical router |
| App `AGENTS.override.md` before CONTROL-00 | Temporary `DOCSYS-V1` documentation-only lock | blob `d5591ada69d4dcb9405a2b1c1e96d5dcc1a9259c` | Historical control rule | YES but stale for this mission | YES — it blocks the authorized product roadmap |
| App `WORKFLOW_STATE.json` before CONTROL-00 | R23L routed to historical stage branch and PR #50, exact local/merge pending | blob `789b60b1f5e844496078329f1553ea004d59959a` | Historical state | YES but stale for this run | YES — it points away from the single working branch |
| PR #50 | Historical R23L implementation and reconstructed tests | head `787b9e0f5d2172c0fbd399807ee53b2f6e8cde49`, base `21f27150df059e79e066fa0cba97cbd3483eda76` | NO as current source | NO | YES if merged or used without reexecution |

## Root cause

The repository DocSys migration introduced a valid temporary documentation-only bootstrap override and routed R23L through the historical PR branch. At the same time, the global project registry retained `canonical_branch=main`, while the CloseFlow router, repository manifest, roadmap and workflow state selected `dev-rollout-freeze`. The conflict is therefore a stale identity-level branch claim plus a stale active-branch claim, not an application-code defect.

## CONTROL-00 changes

- `AGENTS.md`, `_project/00_AI_START_SPIS_TRESCI.md` and `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md` now distinguish the canonical base branch from the single working branch instead of routing execution ambiguously.
- `AGENTS.override.md` now explicitly records the committed transition from the temporary DocSys bootstrap lock to controlled product-stage execution on the single working branch; existing fail-closed, one-stage, ownership, Guardian and no-self-acceptance rules remain.
- `_project/WORKFLOW_STATE.json` now routes R23L to `codex/closeflow-v1-e2e-roadmap` from the exact canonical base SHA.
- The R23L contract records the execution handoff and explicitly marks PR #50 as evidence-only.
- The canonical Obsidian vault was not edited or accepted as updated. Its `PROJECTS.json` branch conflict remains an owner-controlled update proposal.

## PASS evidence

```text
PROJECT_RESOLVED=YES
CANONICAL_BASE_RESOLVED=YES
WORKFLOW_SOURCE_RESOLVED=YES
ONE_ACTIVE_WORKFLOW_SOURCE=YES
DOCSYS_CONFLICT_RESOLVED=YES
```

These claims become final only after the post-change JSON/router/branch guards and `git diff --check` pass on the resulting commit. Product code remains untouched by CONTROL-00.

## Risks and recommendations

Problem: the canonical Obsidian registry still says `main`.

Why it matters: future agents that read only the registry can route work to a stale application snapshot and recreate the exact split-brain state.

Risk if ignored: wrong-base changes, duplicated workflow execution, and unsafe merge/release decisions.

Recommended action: owner/memory-controller should update only the CloseFlow entry in canonical `PROJECTS.json` to `canonical_branch=dev-rollout-freeze`, preserving the file's identity-only role, and then record the exact vault commit. Codex does not accept that memory update on the owner's behalf.

## Rollback

`git revert <CONTROL-00_FINAL_SHA>` removes this control-plane transition without touching the canonical branches. The pre-existing `.stversions/` directory remains untracked and preserved.
