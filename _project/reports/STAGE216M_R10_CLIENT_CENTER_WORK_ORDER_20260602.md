# STAGE216M_R10_CLIENT_CENTER_WORK_ORDER_20260602

## Cel
Ułożyć środkową kolumnę ClientDetail zgodnie z operacyjną hierarchią klienta:
1. kafelki statusowe,
2. aktywne sprawy,
3. notatki klienta,
4. zakładki/panele dodatkowe.

## Fakty
- LeadDetail pozostaje wzorem wizualnego rytmu.
- Klient jest bytem nadrzędnym wobec spraw, więc centrum klienta powinno pokazywać aktywne sprawy przed notatkami.
- R9 domknął lewą szynę jako osobny etap.

## Decyzje Damiana
- Wdrażamy docelowy kierunek etapami.
- Notatki klienta zostają w środku, ale aktywne sprawy mają być wyżej.

## Hipotezy AI
- CSS order na środkowej kolumnie wystarczy do bezpiecznego przestawienia bez ryzyka w TSX.
- Jeśli to nie wystarczy wizualnie, kolejny etap powinien przenieść bloki strukturalnie w TSX albo wydzielić wspólny komponent.

## Zakres
- `src/styles/stage216m-r10-client-center-work-order.css`
- import w `src/styles/page-adapters/page-adapters.css`
- guard `tests/stage216m-r10-client-center-work-order-contract.test.cjs`

## Czego nie ruszano
- API
- Supabase
- płatności
- prawa szyna
- dane
- Stage216D

## Testy
- `node tests/stage216m-r10-client-center-work-order-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Następny krok
Po deployu porównać ClientDetail:
- kafelki statusowe,
- aktywne sprawy,
- notatki.
Następnie przejść do Stage216M-R11: prawa szyna hard render z finansami klienta.
