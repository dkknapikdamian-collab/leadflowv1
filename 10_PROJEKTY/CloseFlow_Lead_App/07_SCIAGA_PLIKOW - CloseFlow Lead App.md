---
typ: file_map
status: ACTIVE
scope: CloseFlow / LeadFlow
entity_id: E_CLOSEFLOW_DO_POTWIERDZENIA
workspace_id: W_CLOSEFLOW_DO_POTWIERDZENIA
project_id: CloseFlow_Lead_App
canonical_name: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
last_update: 2026-06-16 Europe/Warsaw
---

# 07_SCIAGA_PLIKOW - CloseFlow Lead App

## Cel

Ten plik odpowiada na pytanie: gdzie szukać aktualnych informacji o projekcie CloseFlow w GitHub/Obsidian project memory.

## Start

- `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md` - główne wejście/TOC.
- `_project/CODEX_CONTEXT_INDEX.md` - router kontekstu dla AI/Codex.
- `_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md` - reguła placementu etapów i aktualna kolejność.

## 04 - etapy, kierunek, decyzje produktowe

| ID | Ścieżka | Status | Rola |
|---|---|---|---|
| CF-04-CANONICAL-QUEUE | `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` | ACTIVE / CANONICAL | Główna kolejka etapów aplikacji. |
| CF-04-QUEUE-SYNC-2026-06-16 | `_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md` | ACTIVE / QUEUE_SYNC | Reguła, gdzie wpisywać etapy; aktualna kolejność rozproszonych etapów. |
| CF-04-DIRECTION | `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md` | ACTIVE | Kierunek rozwoju produktu. |
| CF-04-FOUND-PROBLEMS | `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md` | ACTIVE, jeśli istnieje | Problemy znalezione przez AI/audyt. |
| CF-04-STAGE232D-I | `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232D_I_OWNER_CONTROL_AND_BRAKI_CASE_CLIENT_SOURCE_OF_TRUTH.md` | DASHBOARD_NOTE / MIRROR_TO_04_REQUIRED | Kontakt/cisza oraz Braki/Blokady case/client. |
| CF-04-STAGE232J | `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232J_LEADS_SCROLL_TOP_CUT_SOURCE_OF_TRUTH.md` | DASHBOARD_NOTE / MIRROR_TO_04_REQUIRED | Bug scrolla na /leads. |
| CF-04-STAGE232H | `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232H_SZABLONY_CHECKLIST_SOURCE_OF_TRUTH.md` | DASHBOARD_NOTE / DO_SPRAWDZENIA_SYNC | Szablony/checklisty. |

## 06 - guardy i testy

| ID | Ścieżka | Status | Rola |
|---|---|---|---|
| CF-06-GUARDS | `_project/06_GUARDS_AND_TESTS.md` | ACTIVE | Rejestr guardów/testów. |

## 08 - historia zmian

| ID | Ścieżka | Status | Rola |
|---|---|---|---|
| CF-08-CHANGELOG | `_project/08_CHANGELOG_AI.md` | ACTIVE | Historia zmian AI. |
| CF-08-TIMELINE | `_project/10_PROJECT_TIMELINE.md` | ACTIVE | Timeline projektu. |

## 09 - testy i wyniki

| ID | Ścieżka | Status | Rola |
|---|---|---|---|
| CF-09-TESTS | `_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md` | ACTIVE | Testy do wykonania i wyniki. |
| CF-09-TEST-HISTORY | `_project/13_TEST_HISTORY.md` | HISTORY | Historyczny rejestr testów. |

## 10 - run reports, ZIP, payloady

| ID | Ścieżka | Status | Rola |
|---|---|---|---|
| CF-10-RUNS | `_project/runs/` | EVIDENCE | Run reporty etapów. Nie są kolejką. |
| CF-10-OBSIDIAN-UPDATES | `_project/obsidian_updates/` | SYNC_PAYLOADS | Payloady Obsidiana/GitHub project memory. Nie są kolejką. |
| CF-10-SYNC-LEGACY | `10_PROJEKTY/CloseFlow_Lead_App/99_SYNC/` | SYNC_LEGACY / DO_MAPOWANIA | Stare payloady/sync; czytać tylko konkretny plik wskazany przez etap. |

## 11 - ryzyka, bugi, dług

| ID | Ścieżka | Status | Rola |
|---|---|---|---|
| CF-11-RISKS | `_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md` | ACTIVE | Centralny rejestr ryzyk, bugów i długu. |

## 12 - archiwum, konflikty, pliki osierocone

| ID | Ścieżka | Status | Rola |
|---|---|---|---|
| CF-12-ARCHIVE-MAP | `10_PROJEKTY/CloseFlow_Lead_App/12_ARCHIWUM_MAPA - CloseFlow Lead App.md` | ACTIVE | Audyt plików rozproszonych/osieroconych i decyzje routingowe. |

## Aktualne pliki dashboard note wymagające mirroru do 04

- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232D_I_OWNER_CONTROL_AND_BRAKI_CASE_CLIENT_SOURCE_OF_TRUTH.md`
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232J_LEADS_SCROLL_TOP_CUT_SOURCE_OF_TRUTH.md`
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232H_SZABLONY_CHECKLIST_SOURCE_OF_TRUTH.md`

## Reguła dla nowych plików

Każdy nowy plik dokumentacyjny musi mieć:

- typ,
- status,
- scope,
- entity_id,
- workspace_id,
- project_id,
- canonical_name,
- repo,
- branch,
- last_update,
- wpis w tym pliku albo w `12_ARCHIWUM_MAPA`.

Pliki kodu nie dostają osobnego ID per plik; mapujemy moduły kodu przez stage, guard i ten indeks.
