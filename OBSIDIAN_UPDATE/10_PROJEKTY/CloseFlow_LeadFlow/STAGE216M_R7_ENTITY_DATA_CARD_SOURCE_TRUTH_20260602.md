# CloseFlow - Stage216M-R7 Entity data card source truth

## FAKTY

- Stage216M-R7 wprowadza jedno wizualne zrodlo prawdy dla kart `Dane leada` i `Dane klienta`.
- Zakres jest ograniczony do lewych kart danych.
- Nie ruszano prawej szyny, API, Supabase, platnosci ani danych.

## DECYZJE DAMIANA

- Karty `Dane leada` i `Dane klienta` maja byc 1:1 pod wzgledem szerokosci, wysokosci, pozycji przycisku i zakonczenia kafelka wzgledem lewego panelu.
- Obie karty maja korzystac z jednego wizualnego zrodla prawdy.

## TESTY

- `node tests/stage216m-r7-entity-data-card-source-truth-contract.test.cjs`
- `git diff --check`
- `npm run build`

## NASTEPNY KROK

Po deployu porownac na tym samym viewportcie tylko `Dane klienta` i `Dane leada`.
