# STAGE216M_R6_R1_CLIENT_DATA_CARD_POLISH_20260601

## Cel

Doprecyzować kartę `Dane klienta`, żeby była bliżej karty `Dane leada`.

## Zakres

- usunięto opisowe wstawki z kart danych:
  - `Status, źródło, kontakt, wartość i ostatnia aktywność w jednym miejscu.`
  - `Status, źródło, kontakt, wartość i ostatni kontakt w jednym miejscu.`
- dodano marker TSX `data-stage216m-r6-client-data-card-marker="true"` do ClientDetail, żeby poprzedni guard nie wisiał jako fałszywy brak markera,
- dodano marker R6-R1,
- dopięto CSS przycisku `Edytuj dane` w `Dane klienta`: stała wysokość 32px, inline-flex, szerokość auto, bez pełnego pasa.

## Czego nie ruszano

- prawa szyna,
- API,
- Supabase,
- płatności,
- dane runtime,
- Stage216D.

## Testy

- `node tests/stage216m-r6-r1-client-data-card-polish-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Następny krok

Porównać screenshot `Dane klienta` i `Dane leada` na tym samym viewportcie.
