# STAGE216M_R15_R4_CLIENT_NOTES_SOURCE_TRUTH_HARD_REPAIR_20260602

## Cel
Naprawa notatek klienta po nieudanych R15/R15-R1/R15-R2/R15-R3.

## Fakty
- Poprzednie patche nie trafiały w aktualne anchory `ClientDetail.tsx`.
- Dyktowanie klienta zapisywało tekst w `form.notes`, czyli w danych klienta.
- Centralna sekcja Notatki nie miała tekstowego composera.
- Edycja danych klienta miała osobne pole `Notatka`, co tworzyło duplikat.

## Zmiana
- Dodano centralny composer notatki klienta.
- Dodano `Dodaj notatkę`.
- Dyktowanie wpisuje do `clientNoteDraft`.
- Notatka zapisuje się jako aktywność `client_note_added`.
- Usunięto pole `Notatka` z edycji danych klienta.
- Usunięto importy CSS z nieudanych prób R15 z `page-adapters.css`.

## Testy
- `tests/stage216m-r15-r4-client-notes-source-truth-hard-repair-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Czego nie ruszano
- API
- Supabase SQL
- płatności
- prawa szyna finansów
- Stage216D

## Następny krok
Sprawdzić UI:
1. ręczne dodanie notatki,
2. dyktowanie do pola notatki,
3. brak pola `Notatka` w `Edytuj dane`.
