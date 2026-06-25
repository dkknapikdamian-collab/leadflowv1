# STAGE232T_R1B_TODAY_EQUAL_TILE_GRID_3UP

Date/time: 2026-06-25 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze

## Status

PUSHED / NEEDS_LOCAL_GUARDS_BUILD_VERIFY / MANUAL_SMOKE_PENDING

## Scope

Small runtime/UI layout fix for `/today` after owner screenshot showed a moat/fosa and oversized `Najblizsze 7 dni` card.

Implemented:
- Today section grids are forced to 3 equal columns on desktop, 2 on tablet, 1 on mobile.
- The separate `Najblizsze 7 dni` wrapper is constrained to one desktop column instead of full width.
- Cards get a common minimum height and stretch contract.
- Fix is scoped to Today root only: `data-p0-today-stable-rebuild="true"`.

## Files changed

- `src/styles/closeflow-canvas-runtime-source-truth-stage211j.css`
- `scripts/check-stage232t-r1b-today-equal-tile-grid-3up.cjs`
- `tests/stage232t-r1b-today-equal-tile-grid-3up.test.cjs`
- `_project/runs/STAGE232T_R1B_TODAY_EQUAL_TILE_GRID_3UP.md`

## Not touched

- finance / commission
- SQL / RLS / migrations
- Calendar runtime
- billing / trial
- data logic in TodayStable
- R1A refresh and view visibility logic

## Required local verification

```powershell
node scripts/check-stage232t-r1b-today-equal-tile-grid-3up.cjs
node --test tests/stage232t-r1b-today-equal-tile-grid-3up.test.cjs
node scripts/check-cf-runtime-00-source-truth.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

## Manual smoke

1. Open `/today` on desktop.
2. Verify cards are equal width and 3 per row.
3. Verify no visual moat/fosa between groups.
4. Verify `Najblizsze 7 dni` is not full width.
5. Toggle `Widok` sections on/off and verify the grid stays equal.
6. F5 and verify layout remains stable.

## Risk audit

This is a CSS-scoped layout fix, not a data fix. It is intentionally bounded to the Today root. Main risk: if Today later changes the DOM nesting of section wrappers, the CSS selector for the separate upcoming wrapper may need adjustment.
