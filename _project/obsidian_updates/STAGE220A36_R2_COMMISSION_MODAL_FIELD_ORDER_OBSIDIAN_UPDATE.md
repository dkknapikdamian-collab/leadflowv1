# OBSIDIAN UPDATE — STAGE220A36-R2 Commission Modal Field Order

data i godzina: 2026-06-05 22:00 Europe/Warsaw
nazwa / alias wejściowy: Stage220A36-R2 — Commission Modal Field Order
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
report_id: STAGE220A36_R2_COMMISSION_MODAL_FIELD_ORDER_REPORT
canonical_name: CloseFlow / LeadFlow
folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
typ wpisu: polish UI / korekta kolejności pól prowizji
status zapisu: NIE ZAPISANO BEZPOŚREDNIO — manifest do ręcznego przeniesienia

## Wpis do kierunku
Modal prowizji ma prowadzić użytkownika kolejnością: jak liczymy prowizję → procent/kwota prowizji → podstawa procentu.

## Wpis do testów
Sprawdzić fixed: można wpisać wartość prowizji, stawka i podstawa procentu są nieaktywne. Sprawdzić percent: podstawa i stawka są aktywne, wartość prowizji jest wyliczona i nieedytowalna.

## Wpis do ryzyk
Błędna kolejność pól powoduje wpisywanie ceny transakcji w miejsce prowizji. To zafałszuje listę klientów i przyszły Stage227.
