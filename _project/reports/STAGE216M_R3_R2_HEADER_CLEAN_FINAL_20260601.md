# STAGE216M_R3_R2_HEADER_CLEAN_FINAL_20260601

## Cel
Naprawa po nieudanym Stage216M-R3 i po częściowym R3-R1: finalne uporządkowanie headerów LeadDetail i ClientDetail.

## Fakty
- R3 zepsuł JSX ClientDetail i build nie przeszedł.
- R3-R1 cofnął uszkodzone pliki, ale patch LeadDetail nie znalazł oczekiwanego bloku i nie wprowadził zmian.
- Build po R3-R1 przeszedł, ale commit nie miał zmian, więc push był `Everything up-to-date`.

## Decyzje Damiana
- Edycja nie ma być w headerze w LeadDetail ani ClientDetail.
- W obu headerach ma być `Zapytaj AI`.
- W ClientDetail zostaje tylko akcja głównej sprawy.
- Dane klienta w headerze są zbędne, bo dane są niżej w karcie, tak jak w LeadDetail.

## Zakres
- `src/pages/LeadDetail.tsx`
- `src/pages/ClientDetail.tsx`
- `src/styles/page-adapters/page-adapters.css`
- `src/styles/stage216m-r3-r2-header-clean-final.css`
- `tests/stage216m-r3-r2-header-clean-final-contract.test.cjs`

## Czego nie ruszano
- Supabase
- API
- dane
- płatności
- sprawy
- Stage216D

## Testy
- `node tests/stage216m-r3-r2-header-clean-final-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Następny krok
Po deployu porównać header LeadDetail i ClientDetail na tym samym viewportcie, potem wrócić do karty `Dane klienta` vs `Dane leada`.
