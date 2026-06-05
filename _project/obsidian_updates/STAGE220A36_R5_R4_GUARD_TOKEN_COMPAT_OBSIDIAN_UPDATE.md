# OBSIDIAN UPDATE — STAGE220A36-R5 R4 Guard Token Compat

data i godzina: 2026-06-05 22:30 Europe/Warsaw
nazwa / alias wejściowy: Stage220A36-R5 — R4 Guard Token Compat
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
report_id: STAGE220A36_R5_R4_GUARD_TOKEN_COMPAT_REPORT
canonical_name: CloseFlow / LeadFlow
folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
typ wpisu: hotfix guardu build/Vercel
status zapisu: NIE ZAPISANO BEZPOŚREDNIO — manifest do ręcznego przeniesienia

## Wpis do testów
R5 ma przejść A35, A36, A36-R2, A36-R4, A36-R5, build, quiet gate i git diff --check.

## Wpis do ryzyk
Czerwony Vercel po R4 wynikał z różnicy tokenów "label" vs "field" w guardach, nie z błędu UI. Stage227 nadal zablokowany do zielonego Vercela po R5.
