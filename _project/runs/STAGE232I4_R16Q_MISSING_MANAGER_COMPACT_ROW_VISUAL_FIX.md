# STAGE232I4_R16Q_MISSING_MANAGER_COMPACT_ROW_VISUAL_FIX

Date/time: 2026-06-20 02:05 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Scope

Visual-only repair after STAGE232I4_R16O.

Fixes the shared MissingItemsManagerDialog so:
- cards remain stacked one below another,
- each missing item card content is laid out in one compact horizontal row on desktop,
- add form text/input contrast is readable,
- shared manager width is improved,
- ClientDetail/LeadDetail shared manager wiring from R16O is preserved.

## Files touched

- src/components/detail/MissingItemsManagerDialog.tsx
- scripts/check-stage232i4-r16q-missing-manager-compact-row-visual-fix.cjs
- tests/stage232i4-r16q-missing-manager-compact-row-visual-fix.test.cjs
- _project/runs/STAGE232I4_R16Q_MISSING_MANAGER_COMPACT_ROW_VISUAL_FIX.md
- _project/obsidian_updates/2026-06-20_STAGE232I4_R16Q_MISSING_MANAGER_COMPACT_ROW_VISUAL_FIX.md

## Not touched

- ClientDetail source logic
- SQL
- Owner Control
- Finance
- Google Calendar
- Billing/trial
- CaseDetail runtime

## Verification

Run before commit:

```powershell
node scripts/check-stage232i4-r16q-missing-manager-compact-row-visual-fix.cjs
node --test tests/stage232i4-r16q-missing-manager-compact-row-visual-fix.test.cjs
npm run build
git diff --check
```

Expected: PASS.

## Risk audit

Main risk is horizontal row crowding on narrow viewports. The layout uses desktop horizontal grid and stacked gap fallback below desktop widths.

If the visual smoke still looks cramped, next stage should tune column widths and button labels, not touch persistence or ClientDetail wiring.
