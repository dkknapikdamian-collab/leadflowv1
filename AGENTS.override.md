# DOCSYS-V1 — CloseFlow / LeadFlow bootstrap override

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

## DOCSYS-V1 lock
Documentation only. Product code, tests, Supabase/SQL, runtime configuration, dependencies and deployment are forbidden during DOCSYS-V1.
