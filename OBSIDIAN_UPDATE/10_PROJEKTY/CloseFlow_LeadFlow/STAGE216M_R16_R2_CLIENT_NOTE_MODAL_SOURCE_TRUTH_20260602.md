# STAGE216M-R16-R2 Client note modal source truth

## Cel
Ujednolicić UX notatek klienta z LeadDetail: przycisk Dodaj notatkę i Dyktuj notatkę otwierają ten sam modal. Usunąć inline composer z centrum klienta.

## Fakty
- R15-R5 naprawił zapis notatki jako `client_note_added`.
- UX nadal był inny niż w LeadDetail, bo klient miał inline pole notatki.

## Zakres
- `src/pages/ClientDetail.tsx`
- `src/styles/stage216m-r16-r2-client-note-modal-source-truth.css`
- `src/styles/page-adapters/page-adapters.css`
- guard kontraktowy R16-R2

## Czego nie ruszano
API, Supabase SQL, płatności, prawa szyna finansów, Stage216D.

## Testy
- `node tests/stage216m-r16-r2-client-note-modal-source-truth-contract.test.cjs`
- `git diff --check`
- `npm run build`
