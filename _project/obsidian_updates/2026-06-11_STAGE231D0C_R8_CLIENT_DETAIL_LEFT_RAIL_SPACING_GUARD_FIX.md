# 2026-06-11 20:05 Europe/Warsaw - STAGE231D0C/R8 ClientDetail left rail spacing guard fix

## Routing
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Co poprawiono
R7 zastosował spacing CSS, ale guard miał błędny regex. R8 naprawia guard/test i domyka etap spacingu.

## Czego nie ruszano
- SQL
- koszty
- wykresy
- Google Calendar
- LeadListCard runtime
- CaseDetail
- dane klienta/sprawy

## Manual QA
Po deployu sprawdzić /clients/<id>:
- lewy rail zaczyna się na rytmie prawego raila,
- odstęp między kartami po lewej jest spójny z prawą stroną,
- górne kafelki zostają bez zmian.
