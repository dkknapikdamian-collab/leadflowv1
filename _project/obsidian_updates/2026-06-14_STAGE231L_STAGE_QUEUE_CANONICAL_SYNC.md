# Obsidian update - STAGE231L_STAGE_QUEUE_CANONICAL_SYNC

Data: 2026-06-14 20:05 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: PASS / DOCS_ONLY / CENTRAL_QUEUE_UPDATED

## 02_AKTUALNY_STAN

Uregulowano kolejkę etapów. Aktywne źródło prawdy dla kolejności to teraz:

`_project/04_ETAPY_ROZWOJU_APLIKACJI.md`

Run reporty i payloady Obsidiana pozostają szczegółami etapów, ale nie zastępują centralnej kolejki.

## 04_KIERUNEK_DO_WDROZENIA

Aktualna kolejka:

1. `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`
2. `STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING`
3. `STAGE231J2_QUICK_DRAFT_RAW_NOTE_AND_AI_DRAFT_PIPELINE_SPLIT`
4. `STAGE231F_R2_GOOGLE_CALENDAR_MULTI_USER_OWNERSHIP_AND_SYNC_CLOSEOUT`
5. `STAGE231K1_DOMAIN_AND_EMAIL_FOUNDATION`
6. `STAGE231K2_TRANSACTIONAL_EMAIL_TEMPLATES_AND_AUTH_NOTIFICATIONS`
7. `STAGE231K3_OWNER_DIGEST_EMAILS_DAILY_AND_WEEKLY`
8. `STAGE231K4_SUPPORT_HELP_PRODUCTION_TAB_AND_EMAIL_ROUTING`
9. `CODEX-AUTO-CONTEXT-001`

## 08_HISTORIA_ZMIAN

- Zmieniono `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` na uporządkowany centralny plik kolejki.
- Doprecyzowano, że etap nie może być uznany za aktywny, jeśli istnieje tylko w czacie, run report albo payloadzie.

## 09_TESTY_DO_WYKONANIA_I_WYNIKI

- Testy runtime: SKIP — docs-only stage.
- Weryfikacja: centralna kolejka została zapisana w jednym pliku.

## 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

Ryzyko: przyszłe etapy mogą znowu ginąć, jeśli developer zapisze je tylko w `_project/runs` albo `_project/obsidian_updates`.

Decyzja: każdy nowy etap musi trafić do `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.

## 15_SQL_LEDGER_AND_TESTED_SQL

SQL nie ruszany.
