# STAGE231D2-R5 — CaseDetail cost summary render crash hotfix

- generated_at: 2026-06-10T17:17:44.069Z
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: LOCAL_ONLY_HOTFIX_PREPARED

## Problem

Production CaseDetail route crashed with ReferenceError: caseCostsSummaryStage231D2 is not defined.

## Fix

Define caseCostsSummaryStage231D2 with useMemo before JSX uses the D2 cost summary panel. The fix does not add API functions and does not touch SQL.

## Tests / guards

- check:stage231d2r5-case-detail-render-crash
- test:stage231d2r5-case-detail-render-crash
- check:stage231d2-case-costs-in-case
- test:stage231d2-case-costs-in-case
- check:stage231d2r3-vercel-function-budget
- test:stage231d2r3-vercel-function-budget
- D1/D0/D0A/Polish/build regressions

## Audyt ryzyk

- Crash renderu sprawy blokuje produkcyjne otwieranie karty sprawy.
- Hotfix dotyka tylko definicji summary i guarda; nie zmienia SQL ani endpointów.
- Po deployu trzeba sprawdzić produkcyjnie otwarcie karty sprawy i brak APP_ROUTE_RENDER_FAILED.

## Następny krok

Push po PASS, deploy, produkcyjny test karty sprawy.
