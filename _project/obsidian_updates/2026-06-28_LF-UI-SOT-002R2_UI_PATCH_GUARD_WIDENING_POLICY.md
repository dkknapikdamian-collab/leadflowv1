# LF-UI-SOT-002R2 UI patch guard widening policy

Date: 2026-06-28 01:50 Europe/Warsaw
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
- _project/runs/LF-UI-SOT-002R2_UI_PATCH_GUARD_WIDENING_POLICY.md

No runtime UI refactor.
No CSS/layout change.
No SQL/API/Supabase change.

## Policy added

The existing guard now records wider anti-patch policy for:

- raw button debt in pages/components
- direct lucide-react import debt
- broad inline style scan in pages/components
- CSS scan for display:none, z-index, !important, fixed/absolute positioning
- App global CSS import baseline
- local IconButton/ActionIcon/ActionButton/DangerButton clones
- local status/badge/status-label/color helpers
- manual route literals where route helpers exist
- display:none/z-index/!important TSX workarounds

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
