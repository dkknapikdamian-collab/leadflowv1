# Obsidian update - STAGE231H_R1D_CASE_DETAIL_NOTE_DICTATION_RESTORE

Data: 2026-06-14 16:55 Europe/Warsaw
Status: DO_SYNC_TO_OBSIDIAN
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App

## 02_AKTUALNY_STAN

- 2026-06-14 16:55 Europe/Warsaw - CaseDetail: dyktowanie notatek zostalo omylkowo wylaczone/opisane jako funkcja w przyszlosci. Damian potwierdzil, ze dyktowanie dzialalo i ma zostac przywrocone jako realna funkcja.

## 04_KIERUNEK_DO_WDROZENIA

- Po domknieciu porzadkowania UI/detail mapping trzeba przywrocic `Dyktuj notatkę` w CaseDetail.
- Wymagany kontrakt: klik `Dyktuj notatkę` -> realne SpeechRecognition -> transkrypcja -> autosave po okolo 2 sekundach ciszy -> activity/note powiazana z caseId -> notatka zostaje po hard refresh.
- Nie mieszac tego z AI Drafts, Google Calendar, SQL, billing/trial ani globalnym layoutem.

## 08_HISTORIA_ZMIAN

- 2026-06-14 16:55 Europe/Warsaw - Dodano decyzje Damiana: przywrocic dyktowanie notatek w CaseDetail, bo funkcja dzialala i nie powinna byc wylaczona jako `wkrótce`.

## 09_TESTY_DO_WYKONANIA_I_WYNIKI

Planowany test manualny:

1. Otworzyc istniejaca sprawe.
2. Kliknac `Dyktuj notatkę`.
3. Powiedziec jedno zdanie.
4. Przestac mowic na okolo 2 sekundy.
5. Sprawdzic, czy notatka zapisuje sie automatycznie.
6. Zrobic hard refresh.
7. Sprawdzic, czy notatka zostaje w notatkach/historii sprawy.
8. Sprawdzic odmowe mikrofonu/brak wsparcia SpeechRecognition.

Status testu: DO_WYKONANIA przy etapie STAGE231H_R1D.

## 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

- Ryzyko: Web Speech API nie dziala w kazdej przegladarce.
- Ryzyko: autosave po ciszy moze zapisac duplikat, jesli debounce/lock nie jest poprawny.
- Ryzyko: brak mikrofonu albo odmowa uprawnien musi pokazac czytelny komunikat.
- Ryzyko: nie wolno zapisywac pustej transkrypcji.
- Ryzyko: jezeli LeadDetail ma juz dzialajacy wzorzec dyktowania, CaseDetail powinien uzyc tego samego kontraktu zamiast tworzyc drugi mechanizm.

## 15_SQL_LEDGER_AND_TESTED_SQL

SQL: NOT_TOUCHED. Ten etap nie wymaga SQL na starcie.

## Powiazany run report

- `_project/runs/STAGE231H_R1D_CASE_DETAIL_NOTE_DICTATION_RESTORE.md`
