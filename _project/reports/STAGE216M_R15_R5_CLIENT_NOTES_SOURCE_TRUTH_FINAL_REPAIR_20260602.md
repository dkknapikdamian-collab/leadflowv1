# STAGE216M-R15-R5 CLIENT NOTES SOURCE TRUTH FINAL REPAIR

## Cel
Naprawić błędny model notatek klienta po R15/R15-R4.

## Fakty
- Poprzednie paczki R15-R1/R15-R2/R15-R3/R15-R4 nie weszły z powodu kruchych anchorów.
- Notatki klienta powinny mieć jedno źródło prawdy w centrum pracy klienta.
- Dyktowanie nie może otwierać edycji danych klienta ani zapisywać do `client.notes`.

## Zakres
- `src/pages/ClientDetail.tsx`
- `src/styles/page-adapters/page-adapters.css`
- `src/styles/stage216m-r15-r5-client-notes-source-truth-final-repair.css`
- `tests/stage216m-r15-r5-client-notes-source-truth-final-repair-contract.test.cjs`

## Zmiany
- Dodano composer tekstowy notatki klienta w centrum.
- Dodano `Dodaj notatkę`.
- Dyktowanie wpisuje do composer textarea.
- Zapis notatki idzie jako aktywność `client_note_added` przez `insertActivityToSupabase`.
- Usunięto pole `Notatka` z edycji danych klienta.

## Testy
- `node tests/stage216m-r15-r5-client-notes-source-truth-final-repair-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Czego nie ruszano
- API
- Supabase SQL
- płatności
- prawa szyna finansów
- Stage216D
