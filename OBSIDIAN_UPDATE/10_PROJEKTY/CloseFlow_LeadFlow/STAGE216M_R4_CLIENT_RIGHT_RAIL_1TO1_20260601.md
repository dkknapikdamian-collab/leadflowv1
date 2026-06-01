# CloseFlow Stage216M-R4 - ClientDetail prawa szyna jak LeadDetail

## FAKTY

- Stage216M-R4 porządkuje tylko prawą szynę `ClientDetail`.
- Wzorem jest prawa szyna `LeadDetail`: najbliższe działania, powiązana/główna sprawa, finanse.
- Akcje klienta są podpinane do klienta, źródłowego leada i głównej sprawy, jeżeli istnieje.

## DECYZJE DAMIANA

- Prawa strona klienta ma być taka sama rytmem jak prawa strona leada.
- Elementy muszą być odpowiednio podpięte, nie tylko ostylowane.

## ZAKRES

- `ClientDetail.tsx`
- `src/styles/stage216m-r4-client-right-rail-1to1.css`
- `tests/stage216m-r4-client-right-rail-1to1-contract.test.cjs`
- `_project/reports/STAGE216M_R4_CLIENT_RIGHT_RAIL_1TO1_20260601.md`

## TESTY

- Stage216M-R4 guard
- `git diff --check`
- `npm run build`

## CZEGO NIE RUSZANO

- Supabase
- API
- Dane
- Płatności
- Header
- Lewa karta danych

## NASTĘPNY KROK

Po wdrożeniu porównać prawą szynę klienta i leada na tym samym viewportcie. Jeżeli osie i karty są zgodne, przejść do kolejnego kafelka.
