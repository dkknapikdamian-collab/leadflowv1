# Obsidian update — STAGE232I4_R14_R6_RUNTIME_SMOKE_FIX

Data: 2026-06-19 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Status
R5 technicznie przechodził guard/test/build, ale manual smoke użytkownika wykazał błąd runtime: po dodaniu braku klienta otwierał się manager, a brak nie był widoczny.

## R6
Naprawa runtime:
- top tile `Dodaj brak` = quick modal only,
- save braku nie otwiera managera,
- save nie robi natychmiastowego `reload()` kasującego optymistyczny rekord,
- dodany guard runtime smoke.

## Testy
Guard/test/build/diff-check w apply. Manual smoke nadal wymagany.

## Następny krok
Jeśli R6 przejdzie i po F5 brak dalej znika, audytować `/api/tasks` i normalizację `missing_item` persistence.
