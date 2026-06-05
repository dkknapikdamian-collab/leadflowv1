# OBSIDIAN UPDATE — STAGE220A36-R6 Deploy Unblock Mojibake Cleanup

data i godzina: 2026-06-05 22:35 Europe/Warsaw
nazwa / alias wejsciowy: Stage220A36-R6 — Deploy Unblock Mojibake Cleanup
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
report_id: STAGE220A36_R6_DEPLOY_UNBLOCK_MOJIBAKE_CLEANUP_REPORT
canonical_name: CloseFlow / LeadFlow
folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
typ wpisu: hotfix deploy guard / mojibake cleanup
status zapisu: NIE ZAPISANO BEZPOSREDNIO — manifest do recznego przeniesienia

## Wpis do testow
R6 ma przejsc A35, A36, A36-R2, A36-R4, A36-R5, A36-R6, build, quiet gate i git diff --check.

## Wpis do ryzyk
Source already had the requested modal field order, but production can still show old UI while Vercel build is red.
