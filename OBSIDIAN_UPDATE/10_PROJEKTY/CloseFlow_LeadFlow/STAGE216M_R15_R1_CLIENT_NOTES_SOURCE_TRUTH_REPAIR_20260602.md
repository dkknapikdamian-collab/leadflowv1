# CloseFlow / LeadFlow - Stage216M-R15-R1 client notes source truth repair

## FAKTY
- Stage216M-R15 był fałszywie zamknięty: aplikator zatrzymał się na brakującym anchorze, guard failował, ale build przeszedł i commit został wypchnięty bez zmian w `ClientDetail.tsx`.
- Problem produktu: notatki klienta były rozdzielone między dane klienta i centrum pracy.
- Dyktowanie wpisywało tekst do `form.notes`, czyli do danych klienta, a nie do listy roboczych notatek.

## DECYZJA DAMIANA
- Notatki klienta mają mieć jedno źródło prawdy w centrum pracy.
- Usunąć duplikat pola `Notatka` z edycji danych klienta.
- Dodać normalne tekstowe dodawanie notatki, nie tylko dyktowanie.

## ZAKRES
- `src/pages/ClientDetail.tsx`
- `src/styles/page-adapters/page-adapters.css`
- `src/styles/stage216m-r15-r1-client-notes-source-truth-repair.css`
- `tests/stage216m-r15-r1-client-notes-source-truth-repair-contract.test.cjs`

## TESTY
- Guard R15-R1.
- `git diff --check`.
- `npm run build`.

## NASTĘPNY KROK
Po deployu sprawdzić: wpis tekstowy notatki, dodanie notatki, dyktowanie do pola notatki, brak otwierania edycji danych klienta.
