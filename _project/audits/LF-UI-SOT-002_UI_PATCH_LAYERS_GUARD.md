# LF-UI-SOT-002 - Guard na plastry UI

Status: DONE / GUARD_ADDED / NO_UI_REFACTOR
Date: 2026-06-27 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch checked: dev-rollout-freeze
Scope: guard przeciw dokladaniu kolejnych runtime/CSS/UI plastrów

## Scan report

- Project: CloseFlow / LeadFlow.
- Read mode: minimalny guard stage po canonical routing.
- Files read:
  - `AGENTS.md`
  - `_project/00_AI_START_SPIS_TRESCI.md`
  - selected existing guard/test examples
  - scan of `querySelector`, `replaceChildren`, `Trash2`, `style={{`, stage/source-truth CSS imports
- Files intentionally not read:
  - Obsidian and `obsidian_updates`
  - migrations, Supabase/Firebase/API
  - full UI refactor targets
- Current stage: `LF-UI-SOT-002 - Guard na plastry UI`.
- Active decisions:
  - guard ma blokowac nowe plastry, nie udawac, ze stary dlug nie istnieje;
  - delete action contract: `EntityTrashButton` albo `EntityActionButton tone="danger"`;
  - runtime DOM patches wymagaja jawnej allowlisty jako dlug, nie sa wzorcem dla nowych zmian.
- Open risks:
  - baseline zawiera juz duzo historycznych warstw i runtime patchy;
  - future cleanup musi usuwac allowlisty po realnym uporzadkowaniu, nie zwiekszac limity.
- Tests/guards relevant:
  - `npm run guard:ui:patch-layers`
  - `node --test tests/ui-patch-layers-guard.test.cjs`
- Next step:
  - przy kazdej naprawie UI uruchamiac `guard:ui:patch-layers`;
  - jesli guard czerwony, naprawiac zrodlo albo dodac jawna decyzje etapu z uzasadnieniem, nie dokladac cichego obejscia.

## Guard

New npm script:

```txt
npm run guard:ui:patch-layers
```

Files:

```txt
scripts/check-ui-patch-layers.cjs
tests/ui-patch-layers-guard.test.cjs
```

Guard catches:

- `querySelector` / `querySelectorAll` runtime UI patches outside explicit debt allowlist;
- `replaceChildren` DOM rewrites above current baseline;
- inline `style={{ ... }}` on action/icon/delete controls;
- inline `display:none` / `z-index` workarounds outside allowed runtime debt;
- local delete button/action components instead of shared delete primitives;
- direct `Trash2` usage in new page/component files;
- new stacked `stage` / `source-truth` / `legacy` / `temporary` / `emergency` CSS imports beyond baseline;
- new `stage` / `source-truth` className usage beyond baseline.

## Delete action contract

Allowed:

```txt
EntityTrashButton
EntityActionButton tone="danger"
```

Forbidden for new production list actions:

```txt
<Button><Trash2 /></Button>
<button><Trash2 /></button>
local DeleteButton / TrashButton component clones
inline styles on delete/action icons
```

## Current explicit debt baseline

The guard currently passes with explicit known debt counts:

```txt
domPatchFiles: 16
directTrash2Files: 15
styleLayerFiles: 32
stageClassFiles: 35
```

Interpretation:

- This is not approval to keep adding patches.
- These are existing files that must be cleaned in later scoped stages.
- Raising an allowlist number should require a stage note and concrete reason.

## Verification

PASS:

```txt
npm run guard:ui:patch-layers
node --test tests/ui-patch-layers-guard.test.cjs
```

No UI/CSS/runtime behavior was changed in this guard stage.
