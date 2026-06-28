# LF-UI-SOT-002R2 UI patch guard widening policy

Date: 2026-06-28 01:35 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

LF-UI-SOT-002R2:
IMPLEMENTED_IN_REPO / POSZERZENIE_GUARDA / BEZ_UI_REFACTORU / NEEDS_LOCAL_VERIFY

## Scope

Expanded existing guard only:

- scripts/check-ui-patch-layers.cjs
- tests/ui-patch-layers-guard.test.cjs
- _project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-002_UI_PATCH_LAYERS_GUARD.md

No runtime UI refactor.
No CSS/layout change.
No SQL/API/Supabase change.

## Policy added

The existing guard now records wider anti-patch policy for:

- raw page button debt
- direct lucide-react import debt
- App global CSS import baseline
- local IconButton/ActionIcon clones
- local status/badge color maps
- manual route literals where route helpers exist
- display:none/z-index/!important workarounds

## Verify locally

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

npm run guard:ui:patch-layers
node --test tests/ui-patch-layers-guard.test.cjs
npm run guard:routes:canonical
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

## Decision

Do not implement UI patch fixes before guard catches the patch class.
Do not create a second guard.
Do not increase allowlists without a scoped stage note.
