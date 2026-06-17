---
typ: project_toc
status: ACTIVE
scope: CloseFlow / LeadFlow
entity_id: E_CLOSEFLOW_DO_POTWIERDZENIA
workspace_id: W_CLOSEFLOW_DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
last_update: 2026-06-17 22:55 Europe/Warsaw
---

# 00_START - CloseFlow Lead App

Ten plik jest wejsciem do Obsidian/GitHub project memory dla CloseFlow.

## Zasada

GitHub / repo jest miejscem, w ktorym trzymamy projektowa pamiec Obsidiana dla tego projektu.

Nie szukac etapow w czacie. Nie traktowac pojedynczych run reportow ani payloadow jako aktywnej kolejki.

## Glowne zrodla prawdy

### 04 - Etapy i kierunek

- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` - kanoniczna kolejka etapow aplikacji.
- `_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md` - regula placementu i sync rozproszonych etapow.
- `_project/04_STAGE232D_R1_CLOSURE_AND_STAGE232I0_NEXT_SYNC_2026_06_17.md` - historyczny queue-sync: STAGE232D_R1 zamkniety, STAGE232I0 nastepny.
- `_project/04_STAGE232I1_R8_SKIPPED_STAGE232I2_NEXT_SYNC_2026_06_17.md` - decyzja: R8 pomijamy, bo modal jest OK; nastepny aktywny etap to STAGE232I2.
- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md` - kierunek produktu.
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232D_I_OWNER_CONTROL_AND_BRAKI_CASE_CLIENT_SOURCE_OF_TRUTH.md` - dashboard note: kontakt/cisza oraz Braki/Blokady dla sprawy i klienta.
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232J_LEADS_SCROLL_TOP_CUT_SOURCE_OF_TRUTH.md` - dashboard note: bug scrolla na /leads.
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232H_SZABLONY_CHECKLIST_SOURCE_OF_TRUTH.md` - dashboard note: szablony/checklisty.

### 06 - Guardy i testy

- `_project/06_GUARDS_AND_TESTS.md` - rejestr guardow i testow.

### 07 - Sciaga plikow

- `10_PROJEKTY/CloseFlow_Lead_App/07_SCIAGA_PLIKOW - CloseFlow Lead App.md` - mapa plikow Obsidiana/GitHub dla tego projektu.
- `_project/CODEX_CONTEXT_INDEX.md` - router kontekstu dla Codex/ChatGPT.

### 08 - Historia zmian

- `_project/08_CHANGELOG_AI.md` - historia zmian AI.
- `_project/10_PROJECT_TIMELINE.md` - timeline projektu.

### 09 - Testy i wyniki

- `_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md` - centralny plik testow do wykonania i wynikow.
- `_project/13_TEST_HISTORY.md` - historyczny rejestr testow.

### 10 - ZIP / wdrozenia / push

- `_project/runs/` - run reporty etapow.
- `_project/obsidian_updates/` - payloady do synchronizacji Obsidian/GitHub project memory.

### 11 - Ryzyka, bugi i dlug techniczny

- `_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md` - centralny rejestr ryzyk, bugow i dlugu.

### 12 - Archiwum / konflikty / osierocone

- `10_PROJEKTY/CloseFlow_Lead_App/12_ARCHIWUM_MAPA - CloseFlow Lead App.md` - mapa audytu rozproszonych, osieroconych i do-przepiecia plikow.

## Aktualna uporzadkowana kolejnosc etapow

### Zamkniete / nie wracac jako nastepny etap

- `STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX` - wykonany przed STAGE232D_R1; status wg run/docs technicznie OK, smoke reczny zgodnie z wpisem etapu.
- `STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX` - `PASS_PUSHED / CLOSED`, HEAD `d7b21240`, Damian manual smoke OK.
- `STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT` - `PASS_PUSHED / CLOSED`, HEAD `532c5f04`, kontrakt/audyt bez runtime.
- `STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME` - `PASS_PUSHED / CLOSED / MANUAL_SMOKE_OK`, CaseDetail Braki/Blokady jako `missing_item` z `caseId`.
- `STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE` - `SKIPPED_BY_DAMIAN / NIE WDRAZAC`, Damian potwierdzil, ze modal jest OK.

### Nastepny aktywny etap

1. `STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME` - runtime klienta po I1; R8 zostal pominiety, bo modal jest wizualnie OK.
2. `STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH`
3. `STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH`
4. `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`

Zrodlo aktualizacji: `_project/runs/STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME.md`, `_project/obsidian_updates/2026-06-17_STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME.md`, `_project/04_STAGE232I1_R8_SKIPPED_STAGE232I2_NEXT_SYNC_2026_06_17.md`.

## Regula dopisywania nowych etapow

Nowy etap musi byc wpisany w obszarze `04`:

1. `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` albo jawnie oznaczony queue-sync w `_project/04...`,
2. odpowiednia dashboard note w `10_PROJEKTY/CloseFlow_Lead_App/04_...`, jesli etap wymaga opisu dla czlowieka,
3. `_project/obsidian_updates/...` jako payload synchronizacji,
4. guard/test do `_project/06_GUARDS_AND_TESTS.md` i testy do `_project/09...`, jesli dotyczy,
5. ryzyka do `_project/11...`.

Jesli etap jest tylko w czacie, run reportcie, payloadzie albo luznej notatce, oznacz go `DO_PRZENIESIENIA_DO_CENTRALNEGO_04`.

## Nastepny krok operacyjny

Najblizszy etap: `STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME`.
