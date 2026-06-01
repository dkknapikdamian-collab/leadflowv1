# CloseFlow Stage216M - ClientDetail dimensions sync do LeadDetail

## FAKTY

Stage216L-R1 został wypchnięty do repo i poprawił ogólny kierunek ClientDetail. Damian ocenił, że nadal nie jest to finalny wzorzec: widok jest lepszy, ale wielkość, ułożenie i styl mają być takie same jak w LeadDetail.

## DECYZJE DAMIANA

- LeadDetail zostaje wzorem dla ClientDetail.
- Priorytet Stage216M: wymiary, ułożenie, spacing, szerokości kolumn i styl kart.
- Nazewnictwo, ikonki i kolory będą później.

## HIPOTEZY AI

Najbezpieczniejszy następny krok to etap CSS-only, bez ruszania logiki ClientDetail. Problem dotyczy głównie wymiarów i nadpisywania przez starsze style, więc Stage216M wzmacnia kontrakt przez bardziej konkretne reguły CSS.

## ZAKRES

- Nowy CSS: `src/styles/stage216m-client-detail-lead-dimensions-sync.css`.
- Import w `src/styles/page-adapters/page-adapters.css`.
- Guard: `tests/stage216m-client-detail-lead-dimensions-sync-contract.test.cjs`.
- Raport: `_project/reports/STAGE216M_CLIENT_DETAIL_LEAD_DIMENSIONS_SYNC_20260601.md`.

## TESTY

- Guard Stage216M.
- `git diff --check`.
- `npm run build`.

## CZEGO NIE RUSZANO

- Supabase.
- API.
- Dane.
- Płatności.
- Sprawy.
- Stage216D i wcześniejsze niepowiązane pliki.

## NASTĘPNY KROK

Po wdrożeniu porównać `/leads/:id` i `/clients/:clientId` na tym samym viewportcie. Jeżeli układ jest zgodny, przejść do Stage216N: słownik nazw, ikon i kolorów.
