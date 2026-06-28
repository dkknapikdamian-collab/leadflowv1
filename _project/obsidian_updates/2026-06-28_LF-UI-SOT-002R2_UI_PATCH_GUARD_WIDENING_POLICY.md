# LF-UI-SOT-002R2 UI patch guard widening policy

Date: 2026-06-28 02:30 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

LF-UI-SOT-002R2:
LOCAL_R2_VERIFY_PASS / GUARD_PASS / TEST_PASS / ROUTES_GUARD_PASS / BUILD_PASS / VERIFY_QUIET_BLOCKED_BY_UNRELATED_DIRTY_WORKSPACE

## Scope

Expanded existing guard only:

- scripts/check-ui-patch-layers.cjs
- tests/ui-patch-layers-guard.test.cjs
- _project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-002_UI_PATCH_LAYERS_GUARD.md
- _project/runs/LF-UI-SOT-002R2_UI_PATCH_GUARD_WIDENING_POLICY.md

No runtime UI refactor.
No CSS/layout change.
No SQL/API/Supabase change.

## Local verify from Damian

PASS:

```txt
npm run guard:ui:patch-layers
node --test tests/ui-patch-layers-guard.test.cjs
npm run guard:routes:canonical
npm run build
```

Blocked outside this stage:

```txt
npm run verify:closeflow:quiet
```

Reason: CF-RUNTIME-00 found unrelated local dirty files outside this guard-only stage.

## Guard known debt after pass

```txt
domPatchFiles: 16
directTrash2Files: 15
styleLayerFiles: 32
stageClassFiles: 35
rawButtonFiles: 40
lucideImportFiles: 56
inlineStyleFiles: 12
displayStackImportantFiles: 8
cssPatchFiles: 238
appStyleImportFiles: 0
localIconButtonCloneFiles: 5
localColorMapFiles: 0
routeLiteralFiles: 9
```

Known debt is frozen baseline only. It is not approval for new patches.

## Decision

Do not implement UI patch fixes before guard catches the patch class.
Do not create a second guard.
Do not increase allowlists without a scoped stage note.
Do not continue UI work while local dirty workspace is unresolved.

Next safe stage:

```txt
LF-LOCAL-DIRTY-WORKTREE-SEGREGATION
```
