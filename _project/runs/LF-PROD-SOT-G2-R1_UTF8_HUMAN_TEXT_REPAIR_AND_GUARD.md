# LF-PROD-SOT-G2-R1 — UTF-8 Human Text Repair and Guard

DATA_I_CZAS: 2026-07-10 16:22 Europe/Warsaw
STAGE: LF-PROD-SOT-G2-R1_UTF8_HUMAN_TEXT_REPAIR_AND_GUARD
STATUS: PASS_UTF8_REPAIR_AND_GUARD

APP_HEAD_BEFORE: 88e80cf16c67ab7613644859bcdaada671be5692
OBSIDIAN_HEAD_BEFORE: dc2acc6d0efe202bd9d1c9c8e06d7b9661ffd8c8

## Problem

Realne pliki G2 zawierały błędnie zdekodowane polskie znaki i znaki typograficzne. Przyczyną było odczytanie skryptu UTF-8 bez BOM przez Windows PowerShell 5.1 jako lokalne kodowanie systemowe, a następnie zapisanie zniekształconego tekstu jako UTF-8.

## Naprawa

- przywrócono poprawny tekst raportu G2,
- przywrócono poprawny tekst mapy G2,
- przywrócono poprawny blok G2 w routerze,
- dodano osobny guard i test G2-R1 blokujący nawrót mojibake,
- dodano alias `verify:lf-prod-sot-g2-r1`,
- nie zmieniono żadnego pliku `src`.

## Weryfikacja

VERIFY_R28: PASS
VERIFY_G2: PASS
VERIFY_G2_R1: PASS
BUILD: PASS
GIT_DIFF_CHECK_APP: PASS
GIT_DIFF_CHECK_OBSIDIAN: PASS
MOJIBAKE_SCAN: PASS

RUNTIME_CHANGED: NO
SRC_CHANGED: NO
UI_CSS_CHANGED: NO
SQL_API_SUPABASE_CHANGED: NO
TASK_GROUPING_CHANGED: NO
G3_CREATED: NO

NEXT_STAGE_SELECTED: LF-PROD-SOT-G3_CASEDETAIL_SOT_GAP_MAP
