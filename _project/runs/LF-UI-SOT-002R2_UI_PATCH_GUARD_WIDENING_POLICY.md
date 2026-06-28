# LF-UI-SOT-002R2 UI patch guard widening policy - run report

Date: 2026-06-28 01:50 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status

IMPLEMENTED_IN_REPO / POSZERZENIE_GUARDA / BEZ_UI_REFACTORU / NEEDS_LOCAL_VERIFY

## Scope executed

Changed only guard/docs/test files:

- scripts/check-ui-patch-layers.cjs
- tests/ui-patch-layers-guard.test.cjs
- _project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-002_UI_PATCH_LAYERS_GUARD.md
- _project/obsidian_updates/2026-06-28_LF-UI-SOT-002R2_UI_PATCH_GUARD_WIDENING_POLICY.md

No runtime UI files changed.
No src/pages refactor.
No src/components refactor.
No src/styles changes.
No SQL/API/Supabase changes.

## Guard widened

The existing guard now includes policy/checks for:

- raw <button> in src/pages and src/components outside explicit debt allowlist
- direct lucide-react imports outside explicit debt allowlist
- broad style={{ scan in pages/components
- CSS scan for display:none, z-index, !important, position fixed/absolute
- App.tsx global CSS import baseline
- local IconButton/ActionIcon/ActionButton/DangerButton clones
- local status/badge/status-label/color helpers
- manual case/lead/client route literals where helpers exist

## Allowlist rule

Allowlists freeze existing debt only.
Do not increase allowlists without a scoped stage note with file, pattern, reason, and cleanup target.

## Local verify required

Run locally:

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

## Known risk

verify:closeflow:quiet may still be red because local workspace has unrelated dirty files. Do not mix that with this guard-only stage.
