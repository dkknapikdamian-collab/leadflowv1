# OBSIDIAN UPDATE — STAGE220A36-R10 Commission Modal Three-Field Top Row Polish

data i godzina: 2026-06-06 08:55 Europe/Warsaw
nazwa / alias wejsciowy: Stage220A36-R10 — Commission Modal Three-Field Top Row Polish
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
report_id: STAGE220A36_R10_COMMISSION_MODAL_THREE_FIELD_LAYOUT_REPORT
canonical_name: CloseFlow / LeadFlow
folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
typ wpisu: polish UI / logical commission modal layout
status zapisu: NIE ZAPISANO BEZPOSREDNIO — manifest do przeniesienia

## Wpis do decyzji
Modal prowizji w CaseDetail ma byc czytany od gory: Rodzaj prowizji, Stawka procentowa, Wartosc prowizji. Wartosc transakcji/zlecenia jest osobnym polem nizej i sluzy tylko jako podstawa przy procencie.

## Wpis do testow
R10 dodaje guard i test na top row z trzema polami oraz osobne pole wartosci transakcji/zlecenia.

## Wpis do ryzyk
Nie ruszano backendu ani modelu danych. /api/case-items 500 pozostaje osobnym watkiem, jesli nadal wystapi.
