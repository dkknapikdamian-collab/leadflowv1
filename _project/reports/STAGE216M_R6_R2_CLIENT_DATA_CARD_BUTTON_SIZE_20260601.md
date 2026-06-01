# STAGE216M-R6-R2 - ClientDetail data card button and size polish

## Cel
Dopasować kartę `Dane klienta` do wzoru `Dane leada` po screenach: pozycja przycisku, niebieski przycisk i stabilny rozmiar karty/pól.

## Fakty
- Stage216M-R6-R1 został wdrożony i wypchnięty.
- Screeny pokazały, że `Dane klienta` nadal różni się od `Dane leada`: przycisk nie trzyma właściwego miejsca, ma zły kolor i karta wymaga dopasowania wymiarów.

## Zakres
- CSS-only patch dla `ClientDetail` data card.
- Import CSS w `page-adapters.css`.
- Guard kontraktowy Stage216M-R6-R2.

## Czego nie ruszano
- API.
- Supabase.
- Płatności.
- Dane runtime.
- Prawa szyna.
- Notatki.
- Sprawy.

## Testy
- `node tests/stage216m-r6-r2-client-data-card-button-size-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Następny krok
Po deployu porównać tylko `Dane klienta` i `Dane leada` na tym samym viewportcie.
