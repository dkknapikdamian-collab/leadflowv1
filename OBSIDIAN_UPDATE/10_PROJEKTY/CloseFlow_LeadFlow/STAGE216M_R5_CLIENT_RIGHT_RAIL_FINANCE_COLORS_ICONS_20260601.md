# CloseFlow / LeadFlow - Stage216M-R5 ClientDetail right rail finance/colors/icons

## FAKTY
- Po Stage216M-R4 prawa szyna klienta idzie w dobrym kierunku względem LeadDetail.
- W UI brakowało widocznej karty finansów klienta w prawym railu.
- Kolory przycisków i ikon różniły się od LeadDetail.

## DECYZJE DAMIANA
- Utrzymać kierunek prawej szyny.
- Dodać/wymusić widoczne finanse.
- Ujednolicić kolory i ikony z LeadDetail.
- Każda ikona w prawym railu ma być czytelna i spójna.

## ZAKRES STAGE216M-R5
- CSS-only polish.
- Widoczność `Finanse klienta` jako trzeciej karty prawej szyny.
- Kolory przycisków i ikon jak w leadzie.
- Bez ruszania Supabase/API/płatności/danych.

## TESTY
- `node tests/stage216m-r5-client-right-rail-finance-colors-icons-contract.test.cjs`
- `git diff --check`
- `npm run build`

## NASTĘPNY KROK
Po deployu porównać prawą szynę klienta i leada na jednym viewportcie. Potem przejść do środkowych top-kafli.
