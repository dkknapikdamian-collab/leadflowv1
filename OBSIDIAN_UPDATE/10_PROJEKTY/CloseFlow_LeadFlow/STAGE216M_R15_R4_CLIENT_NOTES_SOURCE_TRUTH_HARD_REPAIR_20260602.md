# CloseFlow / LeadFlow — Stage216M-R15-R4 client notes source truth hard repair

## FAKTY
- R15/R15-R1/R15-R2/R15-R3 nie zmieniły skutecznie `ClientDetail.tsx`, bo patche trafiały w nieaktualne anchory.
- Notatki klienta miały duplikat: centrum pracy oraz pole `Notatka` w edycji danych klienta.
- Dyktowanie klienta trafiało do `form.notes`, czyli do danych klienta.

## DECYZJA DAMIANA
- Notatki klienta mają być w centrum pracy.
- Brak osobnego pola `Notatka` w danych klienta.
- Dyktowanie ma trafiać do pola notatki, nie do danych klienta.

## ZMIANA
- Centralny composer notatki klienta.
- Przycisk `Dodaj notatkę`.
- Dyktowanie do `clientNoteDraft`.
- Zapis jako aktywność `client_note_added`.
- Usunięcie pola `Notatka` z edycji danych klienta.

## TESTY
- Guard R15-R4.
- `git diff --check`.
- `npm run build`.

## NASTĘPNY KROK
Po deployu screen sekcji Notatki klienta oraz test ręcznej i głosowej notatki.
