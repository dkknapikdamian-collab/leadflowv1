# Obsidian payload — STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR

- data i godzina: 2026-06-14 HH:mm Europe/Warsaw
- nazwa / alias wejściowy: STAGE231H_R1B CaseDetail runtime repair
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow / LeadFlow
- idea_id: nie dotyczy
- report_id: STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- mapa główna / pulpit: DO_POTWIERDZENIA
- mapa zależności: DO_POTWIERDZENIA
- ściąga plików: DO_POTWIERDZENIA
- typ wpisu: runtime repair po audycie CaseDetail
- docelowa ścieżka: _project/obsidian_updates/2026-06-14_STAGE231H_R1B_CASE_DETAIL_RUNTIME_REPAIR.md
- status zapisu: payload w ZIP, do zapisu po lokalnym PASS
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: R1 guard/test, R1B guard/test, build, git diff --check
- audyt ryzyk po etapie: naprawiono fałszywe dyktowanie, nextAction missing fallback, contractValue percent-only, nieuczciwy tytuł historii wpłat; koszty i dual case_item zostają jako R1C/R1D
- czego nie ruszano: LeadDetail runtime, SQL, Google Calendar, billing/trial, AI Drafts, globalny sidebar/layout
- następny krok: lokalny apply, testy, manualny test, push po PASS

## Wpis do 02_AKTUALNY_STAN

STAGE231H_R1B przygotowany jako lokalny runtime repair dla CaseDetail. Etap nie używa SQL i nie dotyka LeadDetail. Naprawia najwyżej pewne problemy z R1: fałszywe dyktowanie, missing w nextAction, wartość transakcji zależną od trybu prowizji, copy historii wpłat oraz historię sprawy z pełnym źródłem płatności.

## Wpis do 09_TESTY_DO_WYKONANIA_I_WYNIKI

Do wykonania:
- R1 guard/test
- R1B guard/test
- npm run build
- manualny test wartości transakcji przy `Brak` i `Kwota stała`
- manualny test braku jako blocker, nie next action
- manualny test disabled `Notatka głosowa — wkrótce`

## Wpis do 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

Pozostaje R1C/R1D:
- dual path `case_item` quick blocker vs checklist/local dialog
- pełny lifecycle kosztów: lista, edycja, usuwanie, korekty
- shared finance components mogą nadal mieć założenia percent-only poza lokalnym CaseDetail modalem


Guard tokens: R1B_RUNTIME_REPAIR; cost lifecycle left as R1C.

## Local PASS before push

- R1 audit guard: PASS
- R1 audit test: PASS
- R1B runtime guard: PASS
- R1B runtime test: PASS
- build: PASS
- git diff --check: PASS
- Manual UI verification: REQUIRED_BY_DAMIAN before final closeout
