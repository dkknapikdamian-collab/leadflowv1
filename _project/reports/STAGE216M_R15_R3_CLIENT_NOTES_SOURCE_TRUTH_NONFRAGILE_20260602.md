# STAGE216M-R15-R3 - Client notes source truth non-fragile repair

## Cel
Naprawić notatki klienta po nieudanych R15/R15-R1/R15-R2. Notatki klienta mają mieć jedno źródło prawdy w centrum pracy klienta.

## Fakty
- R15 nie zmienił `ClientDetail.tsx`.
- R15-R1 i R15-R2 zatrzymały się na kruchych anchorach.
- Aktualny kod miał dyktowanie podpięte pod `form.notes`, czyli dane klienta, a nie robocze notatki.

## Zakres
- Dodano `clientNoteDraft`.
- Dodano tekstowy composer notatki w centrum klienta.
- Dodano `Dodaj notatkę`.
- Dyktowanie wpisuje do composera.
- Usunięto pole `Notatka` z edycji danych klienta.
- Zapis notatki idzie jako aktywność `client_note_added`.

## Czego nie ruszano
- API i SQL Supabase.
- Płatności.
- Prawa szyna finansów.
- Stage216D.

## Testy
- `node tests/stage216m-r15-r3-client-notes-source-truth-nonfragile-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Test ręczny
1. Wejdź w kartotekę klienta.
2. Wpisz notatkę w centrum w sekcji `Notatki`.
3. Kliknij `Dodaj notatkę`.
4. Sprawdź, czy wpis pojawił się na liście.
5. Kliknij `Dyktuj notatkę` i sprawdź, czy tekst trafia do pola notatki, nie do danych klienta.
6. Kliknij `Edytuj dane` i sprawdź, że nie ma pola `Notatka`.
