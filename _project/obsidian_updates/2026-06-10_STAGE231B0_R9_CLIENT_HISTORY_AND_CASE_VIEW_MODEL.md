# 2026-06-10 — STAGE231B0-R9 — Client history and case view model

canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
type: etap naprawczy po R8 / UX archiwum spraw
status: DO_WDROZENIA_LOCAL_ONLY

## Wpis do Obsidiana
Zamknięte sprawy klienta są archiwum/historyczną częścią relacji klienta i nie mogą być w głównym panelu aktywnych spraw. Zakładka Sprawy pokazuje aktywne sprawy. Zakładka Historia pokazuje zamknięte sprawy oraz aktywność. Widok /cases ma jawny model: Otwarte, Zamknięte, Wszystkie.

## Testy
- R9 guard/test
- R8 regression
- Stage231B0 regression
- delete-flow regression
- build
- git diff --check

## Czego nie ruszano
- koszty
- wykresy
- Google Calendar
- SQL
- płatności/prowizje
