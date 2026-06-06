# OBSIDIAN UPDATE — STAGE220A36-R7 CaseDetail Legacy Finance Modal Wiring Fix

data i godzina: 2026-06-06 07:55 Europe/Warsaw
nazwa / alias wejsciowy: Stage220A36-R7 — CaseDetail Legacy Finance Modal Wiring Fix
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
report_id: STAGE220A36_R7_CASE_DETAIL_LEGACY_FINANCE_MODAL_WIRING_FIX_REPORT
canonical_name: CloseFlow / LeadFlow
folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
typ wpisu: hotfix UI / legacy modal wiring
status zapisu: NIE ZAPISANO BEZPOSREDNIO — manifest do przeniesienia

## Wpis do decyzji
Wlasciwy widoczny modal finansow sprawy jest inline w CaseDetail, nie tylko we wspolnym CaseFinanceEditorDialog. Guardy musza pilnowac obu miejsc albo w przyszlosci usunac duplikat.

## Wpis do testow
R7 dodaje guard i test na brak starego tytulu oraz wymagana kolejnosc pol w CaseDetail.

## Wpis do ryzyk
Jesli /api/case-items nadal zwraca 500, wymagany jest Response z Network, bo approved_at zostal usuniety z POST payloadu.
