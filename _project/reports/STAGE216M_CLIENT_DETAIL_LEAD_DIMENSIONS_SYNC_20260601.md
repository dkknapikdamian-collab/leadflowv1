# STAGE216M_CLIENT_DETAIL_LEAD_DIMENSIONS_SYNC_20260601

## Cel

Dociągnąć ClientDetail do rytmu LeadDetail po Stage216L-R1: podobna szerokość strony, układ trzech kolumn, wymiary kart, odstępy, wysokość headera, rozmiar przycisków i kompresja prawej szyny.

## Fakty

- Stage216L-R1 został wypchnięty na branch `dev-rollout-freeze`.
- R1 poprawił kierunek, ale widok klienta nadal nie jest wystarczająco zgodny z kartą leada.
- Damian potwierdził: „wielkość, ułożenie, styl ten sam”.
- Ten etap jest CSS-only.

## Decyzje Damiana

- ClientDetail ma iść wizualnie za LeadDetail.
- Nie finalizujemy jeszcze nazw, ikon i kolorów. To osobny etap po wyrównaniu layoutu.

## Zakres

- Dodano `src/styles/stage216m-client-detail-lead-dimensions-sync.css`.
- Dopisano import po Stage216L w `src/styles/page-adapters/page-adapters.css`.
- Dodano guard `tests/stage216m-client-detail-lead-dimensions-sync-contract.test.cjs`.

## Czego nie ruszano

- Supabase.
- API.
- Logiki spraw, płatności, notatek i aktywności.
- Plików Stage216D i wcześniejszych niepowiązanych zmian.

## Testy

- `node tests/stage216m-client-detail-lead-dimensions-sync-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Następny krok

Porównać `/leads/:id` i `/clients/:clientId` na tym samym viewportcie. Jeśli wymiarowo jest dobrze, Stage216N powinien ujednolicić słownik UI: nazwy, ikony, kolory statusów i kafli.
