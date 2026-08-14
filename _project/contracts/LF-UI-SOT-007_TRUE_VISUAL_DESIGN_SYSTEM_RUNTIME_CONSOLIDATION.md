# LF-UI-SOT-007 — TRUE VISUAL DESIGN SYSTEM RUNTIME CONSOLIDATION

Status: ACCEPTED_AND_CLOSED
Project: CloseFlow / LeadFlow / CaseFlow
Project ID: closeflow_lead_app
Repository: dkknapikdamian-collab/leadflowv1
Branch: codex/closeflow-v1-e2e-roadmap
Canonical base branch: dev-rollout-freeze
Base SHA: 1c14ff31b4c3e65ed101bb037eadfcc883cde599
Stage ID: LF-UI-SOT-007

## Objective

Consolidate the active CloseFlow visual runtime around the existing visual
source-of-truth owners. Preserve the current product language and behavior
while removing competing visual ownership, duplicated semantic icon/color/
typography/action definitions, and active CSS patch layers that are proven
redundant after migration.

This is one visual architecture stage. It does not redesign the product,
change business behavior, or create a second design system.

## Entry conditions

- The work branch is `codex/closeflow-v1-e2e-roadmap`.
- The executor is bound to this exact base SHA or a newer verified descendant;
  newer valid work must be preserved.
- The remote work branch is checked before implementation.
- Existing unrelated dirty paths are preserved and never staged.
- `current_workflow` resolves this contract as the only active stage.
- `closeflow-ui-designer` and `ai-code-guardian` are loaded.
- Open Design review is attempted through the already registered local MCP;
  an unavailable/unsupported review is recorded truthfully and is not faked.

## READ_FIRST

- `AGENTS.md`
- `_project/00_AI_START_SPIS_TRESCI.md`
- `_project/AGENT_CAPABILITIES.json`
- `_project/WORKFLOW_STATE.json`
- `_project/Naprawa_Zrodla_Prawdy/00_START_NAPRAWA_ZRODLA_PRAWDY.md`
- `_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md`
- `_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-002_UI_PATCH_LAYERS_GUARD.md`
- `docs/ui/CLOSEFLOW_UI_PREMAP_2026-05-08.md`
- `docs/ui/CLOSEFLOW_UI_MAP.generated.md`
- `docs/ui/CLOSEFLOW_STYLE_MAP.generated.md`
- `.agents/skills/closeflow-ui-designer/SKILL.md`
- `.agents/skills/closeflow-ui-designer/references/global-style-token-contract.md`
- `.agents/skills/closeflow-ui-designer/references/action-icon-style-map.seed.md`
- `.agents/skills/closeflow-ui-designer/references/entity-detail-action-map.seed.md`
- `src/App.tsx`
- `src/components/ui-system/`
- `src/components/ui/button.tsx`
- `src/components/confirm-dialog.tsx`
- `src/components/entity-actions.tsx`
- `src/lib/source-of-truth/visual-repository.ts`
- `src/styles/design-system/`
- active route consumers in `src/pages/`
- existing UI guards and their direct tests in `scripts/` and `tests/`

## Mutable paths

Only these path classes may be changed by this stage:

- the stage contract and `_project/WORKFLOW_STATE.json`;
- active visual source-of-truth files under `src/ui-system/`,
  `src/components/ui-system/`, `src/components/ui/`,
  `src/components/entity-actions.tsx`, and
  `src/lib/source-of-truth/visual-repository.ts`;
- existing active token/owner CSS under `src/styles/design-system/` and
  `src/styles/`, plus `src/App.tsx` only for verified import ownership;
- active visual consumers in `src/pages/` and `src/components/` only when
  directly migrated to a canonical owner;
- deterministic UI guard scripts/tests and their package scripts;
- generated UI maps and stage-bound evidence under `docs/ui/` and
  `_project/runs/`;
- no other application, database, auth, provider, billing, integration,
  production, `.codex/`, `.stversions/`, or unrelated evidence paths.

No new `design-system-v2`, `new-ui`, `final-ui`, stage/hotfix/final-lock CSS,
or page-local visual ownership may be created.

## Implementation order

1. Refresh runtime UI/CSS maps and record before metrics.
2. Complete pre-implementation Guardian and Open Design review.
3. Consolidate destructive/delete action ownership.
4. Migrate critical semantic icons and action-icon geometry.
5. Consolidate semantic visual tones, typography roles, spacing, cards/tiles,
   forms, modals, rows, page shell, right rail and responsive rules using
   existing owners.
6. Remove or merge only proven dead/duplicate patch layers after consumer
   migration.
7. Add deterministic SSOT guards and negative tests.
8. Run targeted runtime/browser verification, final Guardian and final design
   review.

## Non-goals and hard boundaries

- no SQL, schema, RLS, Supabase, auth, billing, AI safety or provider changes;
- no route semantic changes or data mutation changes;
- no CaseDetail rewrite; preserve the frozen R4 direction;
- no deletion based only on a filename or a passing test;
- no self-acceptance or automatic next-stage activation;
- no staging of unrelated dirty paths.

## Required checks

Before changes:

```text
npm run audit:closeflow-ui-map
npm run audit:closeflow-style-map
npm run check:closeflow-ui-skill-pack
npm run check:closeflow-ui-premap-contract
```

During and after changes, run the applicable existing and stage-owned checks:

```text
npm run guard:ui:patch-layers
npm run guard:ui:css-owner-before-cleanup
npm run check:closeflow-ui-semantic-contract-v1
npm run check:closeflow-ui-semantic-icon-v1
npm run check:stage231d0a-visual-source-truth-consistency
npm run tsc -- --noEmit
npm run lint
npm run build
git diff --check
```

The exact stage-owned guard names are recorded when their deterministic
contracts are added; missing or failed guards block terminal PASS.

## PASS conditions

- active runtime has one owner per visual concern;
- semantic icon, color, typography, card/tile and action contracts are adopted;
- no active duplicate or unknown visual owner remains within stage scope;
- active patch-layer count reaches zero or every retained layer has an
  explicit canonical responsibility and evidence;
- negative SSOT tests pass;
- no behavior/data/provider drift is detected;
- TSC, lint, build, targeted tests and browser desktop/mobile proof pass;
- final Guardian coverage is complete and SHA-bound;
- final diff contains only stage-owned paths;
- commit/push evidence and remote SHA verification are available.

## Recovery and rollback

Preserve newer valid work. Never use `git reset --hard`, `git clean`, `git
stash`, `git rebase` or force push. Every logical checkpoint is selectively
staged. Rollback is by `git revert <stage-commit-sha>` after verifying the
exact commit and scope.

## Closeout boundary

The executor produces evidence and a proposed Obsidian update. It does not
close this stage, write Vault state, or activate a next product stage.
