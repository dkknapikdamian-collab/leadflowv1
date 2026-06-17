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
last_update: 2026-06-17 Europe/Warsaw
---

# 00_START - CloseFlow Lead App

Ten plik jest wejściem do Obsidian/GitHub project memory dla CloseFlow.

## Zasada

GitHub / repo jest miejscem, w którym trzymamy projektową pamięć Obsidiana dla tego projektu.

Nie szukać etapów w czacie. Nie traktować pojedynczych run reportów ani payloadów jako aktywnej kolejki.

## Główne źródła prawdy

### 04 - Etapy i kierunek

- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` - kanoniczna kolejka etapów aplikacji.
- `_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md` - reguła placementu i sync rozproszonych etapów.
- `_project/04_STAGE232D_R1_CLOSURE_AND_STAGE232I0_NEXT_SYNC_2026_06_17.md` - aktualny queue-sync: STAGE232D_R1 zamknięty, STAGE232I0 następny.
- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md` - kierunek produktu.
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232D_I_OWNER_CONTROL_AND_BRAKI_CASE_CLIENT_SOURCE_OF_TRUTH.md` - dashboard note: kontakt/cisza oraz Braki/Blokady dla sprawy i klienta.
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232J_LEADS_SCROLL_TOP_CUT_SOURCE_OF_TRUTH.md` - dashboard note: bug scrolla na /leads.
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232H_SZABLONY_CHECKLIST_SOURCE_OF_TRUTH.md` - dashboard note: szablony/checklisty.

### 06 - Guardy i testy

- `_project/06_GUARDS_AND_TESTS.md` - rejestr guardów i testów.

### 07 - Ściąga plików

- `10_PROJEKTY/CloseFlow_Lead_App/07_SCIAGA_PLIKOW - CloseFlow Lead App.md` - mapa plików Obsidiana/GitHub dla tego projektu.
- `_project/CODEX_CONTEXT_INDEX.md` - router kontekstu dla Codex/ChatGPT.

### 08 - Historia zmian

- `_project/08_CHANGELOG_AI.md` - historia zmian AI.
- `_project/10_PROJECT_TIMELINE.md` - timeline projektu.

### 09 - Testy i wyniki

- `_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md` - centralny plik testów do wykonania i wyników.
- `_project/13_TEST_HISTORY.md` - historyczny rejestr testów.

### 10 - ZIP / wdrożenia / push

- `_project/runs/` - run reporty etapów.
- `_project/obsidian_updates/` - payloady do synchronizacji Obsidian/GitHub project memory.

### 11 - Ryzyka, bugi i dług techniczny

- `_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md` - centralny rejestr ryzyk, bugów i długu.

### 12 - Archiwum / konflikty / osierocone

- `10_PROJEKTY/CloseFlow_Lead_App/12_ARCHIWUM_MAPA - CloseFlow Lead App.md` - mapa audytu rozproszonych, osieroconych i do-przepięcia plików.

## Aktualna uporządkowana kolejność etapów

### Zamknięte / nie wracać jako następny etap

- `STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX` - wykonany przed STAGE232D_R1; status wg run/docs technicznie OK, smoke ręczny zgodnie z wpisem etapu.
- `STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX` - `PASS_PUSHED / CLOSED`, HEAD `d7b21240`, Damian manual smoke OK.

### Następny aktywny etap

1. `STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT`
2. `STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH`
3. `STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH`
4. `STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME`

Źródło aktualizacji: `_project/04_STAGE232D_R1_CLOSURE_AND_STAGE232I0_NEXT_SYNC_2026_06_17.md`.

## Reguła dopisywania nowych etapów

Nowy etap musi być wpisany w obszarze `04`:

1. `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` albo jawnie oznaczony queue-sync w `_project/04...`,
2. odpowiednia dashboard note w `10_PROJEKTY/CloseFlow_Lead_App/04_...`, jeśli etap wymaga opisu dla człowieka,
3. `_project/obsidian_updates/...` jako payload synchronizacji,
4. guard/test do `_project/06_GUARDS_AND_TESTS.md` i testy do `_project/09...`, jeśli dotyczy,
5. ryzyka do `_project/11...`.

Jeśli etap jest tylko w czacie, run reportcie, payloadzie albo luźnej notatce, oznacz go `DO_PRZENIESIENIA_DO_CENTRALNEGO_04`.

## Następny krok operacyjny

Najbliższy etap: `STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT`.


## 2026-06-17 21:15 Europe/Warsaw - STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME

Status: DO_APPLY_ZIP_R7 / RUNTIME

Zakres:
- CaseDetail Braki/Blokady jako task/work item missing_item z caseId,
- explicit button data-context-action-kind="blocker",
- case_items tylko legacy/checklist compatibility,
- resolve/delete dla missing_item,
- historia: missing_item_created/resolved/deleted,
- bez SQL, bez ClientDetail, bez Owner Control cross-entity.

## 2026-06-17 22:35 Europe/Warsaw - STAGE232I1_R8_MISSING_MODAL_READABLE_VISUAL_SOURCE

Status: DO_APPLY_ZIP / VISUAL_FIX

Zakres:
- poprawa czytelności modala "Dodaj brak" na ciemnym shellu,
- tytuł, labelki, checkbox helper i tekst pól wymuszone na czytelne kolory,
- bez zmian SQL i bez zmian runtime zapisu/odczytu Braków/Blokad.
