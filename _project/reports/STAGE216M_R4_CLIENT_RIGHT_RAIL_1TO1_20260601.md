# STAGE216M-R4 - ClientDetail prawa szyna 1:1 do LeadDetail

## Cel

Ujednolicić prawą szynę `ClientDetail` z wzorcem `LeadDetail`.

## Fakty

- LeadDetail ma prawą szynę z kartami: najbliższe działania, powiązana sprawa, finanse.
- ClientDetail miał kartę `Szybkie akcje`, krótkie liczniki i finanse, ale układ nie odpowiadał LeadDetail.
- Po Stage216M-R3-R2 header został uporządkowany i wypchnięty na `dev-rollout-freeze`.

## Decyzje Damiana

- Prawa strona klienta ma iść tym samym wzorem co prawa strona leada.
- Elementy mają być podpięte do właściwego kontekstu klienta i głównej sprawy.

## Zakres

- `ClientDetail.tsx`: prawa szyna dostaje karty `Najbliższe działania`, `Główna sprawa`, `Finanse klienta`.
- `ContextActionButton` zostaje podpięty do `recordType: client`, `clientId`, `leadId` źródłowego i `caseId` głównej sprawy.
- Nowy CSS dopasowuje wygląd prawej szyny do LeadDetail.

## Czego nie ruszano

- Supabase
- API
- Dane produkcyjne
- Płatności
- Lewa karta danych
- Header

## Testy

- `node tests/stage216m-r4-client-right-rail-1to1-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Następny krok

Po deployu porównać prawą szynę klienta z prawą szyną leada na tym samym viewportcie.
