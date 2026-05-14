# CloseFlow right rail source truth - stage70

Date: 2026-05-14

## Scope

P1 admin feedback from /leads, /clients and /cases reported dark right rail cards. This stage creates one shared visual source of truth for side rail cards.

## Changed files

- src/styles/closeflow-right-rail-source-truth.css
- src/App.tsx
- scripts/check-right-rail-source-truth.cjs
- package.json

## Rules

- Right rail cards on /leads, /clients and /cases use light surfaces.
- The fix is CSS-only in stage70.
- Data semantics are not changed here. The /clients feedback about lead-only content belongs to the next stage.
- The lead value rail is aligned to the content/search row by removing right rail top offsets.

## Manual checks

1. Open /leads and check Najcenniejsze leady. It should be light and aligned with the search/content row.
2. Open /clients and check Filtry proste and Klienci do uwagi. They should be light.
3. Open /cases and check Operacyjne skroty plus Blokery i ryzyko. They should be light.
4. Confirm that status pills still keep their own colors.
