# STAGE216M-R7 - Entity data card source truth

## Cel

Utworzyc jedno wizualne zrodlo prawdy dla kart `Dane leada` i `Dane klienta`.

## Fakty

- Stage216M-R6/R6-R1/R6-R2/R6-R3 poprawialy karte klienta fragmentami.
- Po screenach nadal widac rozjazd wysokosci, szerokosci i pozycjonowania wzgledem lewego raila.
- R7 nie rusza danych, API, Supabase, platnosci ani prawej szyny.

## Zakres

- Dodano `src/styles/stage216m-r7-entity-data-card-source-truth.css`.
- Podpieto import w `src/styles/page-adapters/page-adapters.css`.
- Guard: `tests/stage216m-r7-entity-data-card-source-truth-contract.test.cjs`.

## Decyzja

Karty danych leada i klienta maja korzystac z jednego kontraktu CSS:

- szerokosc raila/karty: 300px,
- wysokosc wiersza: 52px,
- 7 wierszy danych,
- ten sam header: tytul po lewej, niebieski przycisk po prawej,
- ukryte opisy pod tytulem,
- te same promienie, paddingi, shadow i border.

## Testy

- `node tests/stage216m-r7-entity-data-card-source-truth-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Czego nie ruszano

- prawa szyna,
- API,
- Supabase,
- platnosci,
- Stage216D,
- dane runtime.
