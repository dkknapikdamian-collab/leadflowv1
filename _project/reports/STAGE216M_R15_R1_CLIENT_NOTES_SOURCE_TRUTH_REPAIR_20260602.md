# STAGE216M-R15-R1 - Client notes source truth repair

## Cel
Naprawić fałszywie zamknięty Stage216M-R15. R15 nie zmienił `ClientDetail.tsx`, bo patch zatrzymał się na brakującym anchorze, a mimo tego zostały wypchnięte pliki testu/raportu/CSS.

## Fakty
- R15 aplikator zgłosił `Missing anchor: client notes section old header`.
- Guard R15 zgłosił brak `data-stage216m-r15-client-notes-source`.
- Build przeszedł, ale bez funkcjonalnej poprawki w `ClientDetail.tsx`.
- Commit `0682d712` nie zawierał zmian w `ClientDetail.tsx`.

## Zakres R15-R1
- Dodać centralny composer notatki klienta.
- Dodać przycisk `Dodaj notatkę`.
- Dyktowanie ma wpisywać do composera, nie do `form.notes`.
- Usunąć pole `Notatka` z edycji danych klienta.
- Zapis notatki ma iść jako aktywność `client_note_added` przez `/api/activities`.

## Czego nie ruszano
- API SQL / migracje Supabase.
- Płatności i finanse klienta.
- Prawa szyna klienta.
- Układ lead detail.

## Testy
- `node tests/stage216m-r15-r1-client-notes-source-truth-repair-contract.test.cjs`
- `git diff --check`
- `npm run build`
