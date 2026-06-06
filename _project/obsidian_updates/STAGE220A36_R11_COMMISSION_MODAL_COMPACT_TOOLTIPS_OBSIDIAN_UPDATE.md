# OBSIDIAN UPDATE — STAGE220A36-R11 Commission Modal Compact Tooltips + Alignment

data i godzina: 2026-06-06 09:10 Europe/Warsaw
nazwa / alias wejściowy: Stage220A36-R11 — Commission Modal Compact Tooltips + Alignment
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
report_id: STAGE220A36_R11_COMMISSION_MODAL_COMPACT_TOOLTIPS_REPORT
canonical_name: CloseFlow / LeadFlow
folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
typ wpisu: polish UI / compact commission modal UX
status zapisu: NIE ZAPISANO BEZPOSREDNIO — manifest do przeniesienia

## Wpis do decyzji
Modal prowizji ma być czytelny bez długich opisów pod każdym polem. Wyjaśnienia idą do tooltipów „?”, pola są niższe, a środkowe pole Stawka (%) wyrównane.

## Wpis do testów
R11 dodaje guard i test na compact tooltip UX, brak starych opisów pod polami, skrócony label Stawka (%) i CSS zmniejszający wysokość pól.

## Wpis do ryzyk
Native title tooltip jest wystarczający na desktop jako szybki polish. Jeśli mobile będzie słaby, następny etap powinien zrobić własny popover.
