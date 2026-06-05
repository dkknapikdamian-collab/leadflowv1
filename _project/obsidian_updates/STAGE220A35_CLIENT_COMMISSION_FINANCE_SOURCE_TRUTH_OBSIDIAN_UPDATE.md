# OBSIDIAN UPDATE — STAGE220A35 Client Commission Finance Source Truth

data i godzina: 2026-06-05 21:05 Europe/Warsaw
nazwa / alias wejściowy: Stage220A35 — Client Commission Finance Source Truth
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
report_id: STAGE220A35_CLIENT_COMMISSION_FINANCE_SOURCE_TRUTH_REPORT
canonical_name: CloseFlow / LeadFlow
folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
typ wpisu: bug finansów / source of truth / blokada przed Stage227
status zapisu: NIE ZAPISANO BEZPOŚREDNIO — manifest do ręcznego przeniesienia

## Wpis do testów
Stage220A35 ma przejść: guard Stage220A35, runtime test Stage220A35, guardy finansowe Stage220A31 i Stage220A26B, build, quiet release gate, git diff --check.

## Wpis do ryzyk
Wartość transakcji nie może być traktowana jako prowizja właściciela. Dla przykładu 69 000 PLN i 2% oznacza 1 380 PLN prowizji należnej. Stage227 nie może startować, jeśli ClientDetail i karta sprawy pokazują 0 PLN albo 69 000 PLN w miejscu prowizji.

## Następny krok
Po PASS i ręcznym teście klienta/sprawy można wrócić do Stage227 — Sales Funnel Movement View.
