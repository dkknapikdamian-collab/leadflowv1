# OBSIDIAN UPDATE — STAGE220A36 Commission Input Model Split

data i godzina: 2026-06-05 21:45 Europe/Warsaw
nazwa / alias wejściowy: Stage220A36 — Commission Input Model Split
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
report_id: STAGE220A36_COMMISSION_INPUT_MODEL_SPLIT_REPORT
canonical_name: CloseFlow / LeadFlow
folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
typ wpisu: korekta modelu finansów / prowizja jako wartość właściciela
status zapisu: NIE ZAPISANO BEZPOŚREDNIO — manifest do ręcznego przeniesienia

## Wpis do kierunku
Prowizja jest operacyjną wartością właściciela. Cena transakcji jest tylko podstawą procentu, jeśli wybrano model procentowy.

## Wpis do testów
Sprawdzić fixed: wartość prowizji 3000 PLN => klient/lista pokazuje 3000 PLN. Sprawdzić percent: podstawa 100000 PLN, stawka 2% => prowizja 2000 PLN, pole prowizji nieedytowalne.

## Wpis do ryzyk
Stage227 / Sales Funnel Movement View nie może dziedziczyć ceny transakcji jako wartości do zarobienia.
