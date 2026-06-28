# LF-UI-SOT-002R2 UI patch guard widening policy

Date: 2026-06-28 02:05 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

LF-UI-SOT-002R2:
IMPLEMENTED_IN_REPO / BASELINE_REPAIR_AFTER_LOCAL_RED_GUARD / BEZ_UI_REFACTORU / NEEDS_LOCAL_VERIFY

## Scope

Expanded existing guard only:

- scripts/check-ui-patch-layers.cjs
- tests/ui-patch-layers-guard.test.cjs
- _project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-002_UI_PATCH_LAYERS_GUARD.md
- _project/runs/LF-UI-SOT-002R2_UI_PATCH_GUARD_WIDENING_POLICY.md

No runtime UI refactor.
No CSS/layout change.
No SQL/API/Supabase change.

## Local red guard from Damian

Damian pulled commit 80be0aa0 and ran:

```powershell
npm run guard:ui:patch-layers
node --test tests/ui-patch-layers-guard.test.cjs
```

Result: red.

Reason: R2 policy was valid, but allowlists were too narrow and caught existing debt instead of only blocking new patch growth.

## Baseline repair added

The existing guard now freezes current baseline debt for:

- raw button debt in existing pages/components/dev preview/admin tools
- direct lucide-react import debt in existing pages/components/lib
- broad inline style debt in existing pages/components
- CSS scan debt for display:none, z-index, !important, fixed/absolute positioning
- App/global/stage CSS import baseline
- local IconButton/ActionIcon/ActionButton/DangerButton debt
- local status/badge/status-label/color helpers
- manual route literals where route helpers exist
- visual runtime !important debt
- legal public page CSS debt

## Verify locally again

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

git pull --ff-only origin dev-rollout-freeze
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
