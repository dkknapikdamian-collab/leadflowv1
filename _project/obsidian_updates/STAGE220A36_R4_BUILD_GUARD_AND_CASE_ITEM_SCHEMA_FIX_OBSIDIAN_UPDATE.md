# OBSIDIAN UPDATE — STAGE220A36-R4 Build Guard and Case Item Schema Fix

data i godzina: 2026-06-05 22:15 Europe/Warsaw
nazwa / alias wejsciowy: Stage220A36-R4 — Build Guard and Case Item Schema Fix
entity_id: DO_POTWIERDZENIA
workspace_id: DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
report_id: STAGE220A36_R4_BUILD_GUARD_AND_CASE_ITEM_SCHEMA_FIX_REPORT
canonical_name: CloseFlow / LeadFlow
folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
typ wpisu: hotfix build guard + schema payload
status zapisu: NIE ZAPISANO BEZPOSREDNIO — manifest do recznego przeniesienia

## Wpis do testow
R4 ma przejsc A35, A36, A36-R2, A36-R4, build, quiet gate i git diff --check.

## Wpis do ryzyk
Commit 00b8a95 byl wypchniety mimo czerwonych testow. Przed Stage227 wymagany zielony Vercel po R4.

## Wpis do bugow
Dodanie braku nie moze wysylac approved_at do case_items, bo produkcyjna tabela tej kolumny nie ma.
