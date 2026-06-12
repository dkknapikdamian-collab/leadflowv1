# 2026-06-12 — STAGE231D0F-R3 Funnel icon source truth + records header fix

Status: READY_TO_APPLY

## Scan report

Repo files read:
- `AGENTS.md`
- `_project/03_CURRENT_STAGE.md`
- `_project/06_GUARDS_AND_TESTS.md`
- `_project/07_NEXT_STEPS.md`
- `_project/08_CHANGELOG_AI.md`
- `_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md`
- `_project/13_TEST_HISTORY.md`
- `_project/UI_DICTIONARY_STAGE231D0A.md`
- `src/pages/SalesFunnel.tsx`
- `src/pages/Clients.tsx`
- `src/styles/closeflow-metric-tiles.css`
- `src/styles/sales-funnel-stage231d0f-visual-alignment.css`

## FAKTY Z KODU

- `SalesFunnel.tsx` already has `FUNNEL_OWNER_TILE_TONE_MAP`.
- Owner tiles render `data-eliteflow-metric-tone` and `cf-top-metric-tile-icon`.
- `closeflow-metric-tiles.css` already contains tone variables for blue, amber, red, green and purple.
- `closeflow-metric-tiles.css` colors `.cf-top-metric-tile-value` and `.cf-top-metric-tile-icon` by `data-eliteflow-metric-tone`.
- `SalesFunnel.tsx` still had a two-line records header: small uppercase visible label and separate `Rekordy w aktywnym widoku`.
- `Clients.tsx` top tiles use `StatShortcutCard` with tone, and client filters use `cf-contact-cadence-strip`, `cf-contact-cadence-pills`, `cf-status-pill`, `pill`, `data-cf-status-tone`.

## DECYZJE DAMIANA

- Funnel concept stays.
- Do not change filter logic or data logic.
- Icon colors must come from one source of truth: `closeflow-metric-tiles.css`.
- Do not locally color funnel tiles with random hex colors.
- Records header should be one row.

## ICON COLOR SOURCE MAP

- shared metric tile source: `src/styles/closeflow-metric-tiles.css`
- Leads top tile icon classes: TO_VERIFY_IN_LOCAL_SCAN if needed
- Clients top tile icon classes: `StatShortcutCard`, `tone`, shared metric tile CSS
- Funnel top tile icon classes: `cf-top-metric-tile`, `data-eliteflow-metric-tone`, `cf-top-metric-tile-icon`
- CSS variable source: `--cf-metric-tone-*-icon`, `--cf-metric-tone-*-icon-bg`
- likely override risk: SVG stroke can ignore parent color unless forced to `currentColor`
- final source of truth: `closeflow-metric-tiles.css`, not local funnel CSS

## Files changed by this package

Runtime:
- `src/pages/SalesFunnel.tsx`
- `src/styles/closeflow-metric-tiles.css`
- `src/styles/sales-funnel-stage231d0f-visual-alignment.css`

Guards/tests:
- `scripts/check-stage231d0f-r3-funnel-icon-source-and-header.cjs`
- `tests/stage231d0f-r3-funnel-icon-source-and-header.test.cjs`

Project memory:
- `_project/UI_DICTIONARY_STAGE231D0A.md`
- `_project/03_CURRENT_STAGE.md`
- `_project/06_GUARDS_AND_TESTS.md`
- `_project/07_NEXT_STEPS.md`
- `_project/08_CHANGELOG_AI.md`
- `_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md`
- `_project/13_TEST_HISTORY.md`
- `_project/runs/2026-06-12_STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER.md`
- `_project/obsidian_updates/2026-06-12_STAGE231D0F_R3_FUNNEL_ICON_SOURCE_AND_HEADER.md`

## Verification

Run:
- `node scripts/check-stage231d0f-r3-funnel-icon-source-and-header.cjs`
- `node --test tests/stage231d0f-r3-funnel-icon-source-and-header.test.cjs`
- `node scripts/check-stage231d0f-r2-funnel-color-filter-parity.cjs`
- `node --test tests/stage231d0f-r2-funnel-color-filter-parity.test.cjs`
- `npm run build`
- `git diff --check`

## Risk audit

- Manual QA is required because CSS cascade/visual color cannot be fully proven by static guard.
- Do not stage unrelated `STAGE231D0E` files.
- Do not create a separate local icon color system in `sales-funnel-stage231d0f-visual-alignment.css`.
