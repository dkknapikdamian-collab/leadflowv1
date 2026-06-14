# Obsidian update — STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

Data: 2026-06-14 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: DO_APPLY / SERVER_UI_REQUIRED

## Do dopisania w Obsidianie

### 02_AKTUALNY_STAN

- R1G2/R1G3: CaseDetail koszty/wpłaty mają PRODUCT_PASS po ręcznym teście Damiana.
- R1D2: rozpoczęty etap przywrócenia realnego dyktowania notatki w CaseDetail.

### 04_KIERUNEK_DO_WDROZENIA

- Po closeout CaseDetail finance/cost kolejny etap to R1D2: dyktowanie notatki.
- Po R1D2: R1E oznaczanie kosztu jako zwrócony / częściowo zwrócony.

### 08_HISTORIA_ZMIAN

- R1D2 przywraca Web Speech / SpeechRecognition w CaseDetail, autosave po ok. 2 sekundach ciszy i zapis jako `operator_note` z `caseId`.

### 09_TESTY_DO_WYKONANIA_I_WYNIKI

- Automatyczne: R1G2 regression, R1D2 guard/test, build, diff-check.
- Manualne: dyktowanie zdania, autosave po ciszy, hard refresh, brak duplikatów, komunikat przy braku mikrofonu/wsparcia.

### 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

- Web Speech API zależy od przeglądarki.
- Autosave może tworzyć duplikaty, dlatego R1D2 ma guard `lastSavedCaseNoteDictationStage231H_R1D2`.
- Nie wolno zapisywać pustej transkrypcji.

### 15_SQL_LEDGER_AND_TESTED_SQL

- SQL nie ruszany.
