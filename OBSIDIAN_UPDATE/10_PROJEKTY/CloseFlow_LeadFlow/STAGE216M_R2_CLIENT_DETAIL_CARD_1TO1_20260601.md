# STAGE216M-R2 - ClientDetail karta 1:1 do LeadDetail

## FAKTY

- Projekt: CloseFlow / LeadFlow
- Repo: `dkknapikdamian-collab/leadflowv1`
- Branch: `dev-rollout-freeze`
- Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Poprzedni etap: Stage216M-R1, grid lock klienta do leada.

## DECYZJE DAMIANA

- Układ jest trochę lepszy, ale nadal różnice są duże.
- Pracujemy kafelek po kafelku.
- Zaczynamy od poprawienia karty i stylu 1:1.
- Nazwy, ikonki i kolory zostają na później.

## HIPOTEZY AI

- Największy obecny problem to mieszanie stylu `ClientDetail` z dawnym profilem klienta.
- Pierwszy stabilny krok to nie przebudowa całego TSX, tylko CSS lock dla headera i karty danych.

## ZAKRES

- Header klienta dopasowany do headera leada.
- Karta `Dane klienta` dopasowana do `Dane leada`.
- Pełny niebieski przycisk edycji w karcie zmieniony wizualnie na mały outline.
- Ikony w wierszach danych klienta ukryte.
- Avatar/profilowy charakter karty danych wyciszony.

## TESTY

- `node tests/stage216m-r2-client-detail-card-1to1-contract.test.cjs`
- `git diff --check`
- `npm run build`

## CZEGO NIE RUSZANO

- Supabase
- API
- płatności
- sprawy
- dane
- logika notatek
- routing

## NASTĘPNY KROK

Po deployu porównać `/clients/:id` i `/leads/:id` na tym samym viewportcie. Jeżeli karta jest zaakceptowana, przejść do top-kafli i prawej szyny.
