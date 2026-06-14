# STAGE231H_R1D_CASE_DETAIL_NOTE_DICTATION_RESTORE

Data: 2026-06-14 16:55 Europe/Warsaw
Status: PRZYJETE_DO_ETAPU / DO_WDROZENIA_PO_UI_CLOSEOUT
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja Damiana

Damian potwierdzil, ze wylaczenie dyktowania notatek bylo blednym kierunkiem. Funkcja dyktowania notatki dzialala i ma zostac przywrocona.

## Problem

W ramach audytu CaseDetail funkcja opisana jako dyktowanie zostala potraktowana jako fałszywa obietnica i w runtime zostala wyłączona / opisana jako funkcja wkrótce. To jest niezgodne z oczekiwanym zachowaniem produktu, bo dyktowanie notatek ma byc realnym szybkim sposobem zapisu informacji.

## Wymagane zachowanie

1. Uzytkownik klika `Dyktuj notatkę` w widoku sprawy.
2. Aplikacja uruchamia realne dyktowanie przez Web Speech / SpeechRecognition, jeżeli przegladarka wspiera API.
3. Transkrypcja trafia do pola notatki.
4. Po okolo 2 sekundach ciszy notatka zapisuje sie automatycznie.
5. Zapis tworzy realna activity/note powiazana ze sprawa.
6. Po hard refresh notatka zostaje w historii/notatkach sprawy.
7. Jezeli przegladarka nie wspiera dyktowania albo uzytkownik odmowi mikrofonu, UI pokazuje jasny komunikat i nie udaje zapisu.

## Zakres etapu

- Przywrocic dyktowanie notatek w CaseDetail.
- Sprawdzic, czy analogiczna funkcja w LeadDetail nadal dziala i nie zostala zepsuta.
- Nie robic AI Drafts ani automatycznej wysylki.
- Nie ruszac Google Calendar, SQL, billing/trial ani globalnego layoutu.

## Proponowany etap wykonawczy

`STAGE231H_R1D_CASE_DETAIL_NOTE_DICTATION_RESTORE`

## Guard/test wymagany

Dodac:

- `scripts/check-stage231h-r1d-case-detail-note-dictation-restore.cjs`
- `tests/stage231h-r1d-case-detail-note-dictation-restore.test.cjs`

Guard ma blokowac:

- label `Dyktuj notatkę` bez realnej sciezki SpeechRecognition,
- disabled voice-note button jako finalne rozwiazanie,
- tekst `wkrótce` dla funkcji, ktora Damian potwierdzil jako dzialajaca i do przywrocenia,
- brak autosave/debounce po ciszy,
- brak powiazania zapisanej notatki z `caseId`,
- brak wpisu w run report / test history / Obsidian payload.

## Manualny test

1. Otworz istniejaca sprawe.
2. Kliknij `Dyktuj notatkę`.
3. Powiedz jedno zdanie.
4. Przestan mowic na okolo 2 sekundy.
5. Sprawdz, czy notatka zapisuje sie automatycznie.
6. Zrob hard refresh.
7. Sprawdz, czy notatka zostaje w notatkach/historii sprawy.
8. Sprawdz zachowanie po odmowie mikrofonu albo braku wsparcia SpeechRecognition.

## Audyt ryzyk

- Web Speech API moze nie dzialac w kazdej przegladarce.
- Autosave po ciszy musi unikac duplikatow notatki.
- Nie wolno zapisywac pustej transkrypcji.
- Trzeba jasno odroznic `slucham`, `zapisuje`, `zapisano`, `blad mikrofonu`.
- Jezeli dyktowanie dziala juz w LeadDetail, warto uzyc tego samego wzorca zamiast tworzyc drugi mechanizm.

## Zapis do Obsidiana

Docelowo dopisac do:

- `02_AKTUALNY_STAN` - funkcja dyktowania notatki zostala omylkowo wylaczona i jest przyjeta do przywrocenia.
- `04_KIERUNEK_DO_WDROZENIA` - po UI/detail closeout i przed nowymi funkcjami: przywrocic dyktowanie notatek w CaseDetail.
- `08_HISTORIA_ZMIAN` - decyzja Damiana o przywroceniu dyktowania.
- `09_TESTY_DO_WYKONANIA_I_WYNIKI` - manualny test dyktowania i autosave po 2 sekundach ciszy.
- `11_RYZYKA_BUGI_I_DLUG_TECHNICZNY` - ryzyko Web Speech, duplikatow i wylaczonej funkcji.

## R1G2_ID_COLLISION_RESOLUTION

- Future execution ID changed to STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME.
- Reason: R1D is already used by finance correction modal compact guard/stage.
- Scope stays the same: restore real CaseDetail note dictation with SpeechRecognition and autosave after silence.

## R1D2 rename note

Future runtime stage for dictation must use STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME because STAGE231H_R1D is already used by finance modal compact cleanup.
