# STAGE216M-R9 Client left rail final lock

## Cel
Domknąć lewą szynę `ClientDetail` po Stage216M-R8:
- przesunąć lewą szynę klienta o jeden dodatkowy takt w górę,
- utrzymać `Dane klienta` i `Historia aktywności` jako jeden lewy rail,
- zostawić własne dane klienta i własną historię klienta,
- nie ruszać prawej szyny, środka, API ani Supabase.

## Zakres
- `src/styles/stage216m-r9-client-left-rail-final-lock.css`
- import w `src/styles/page-adapters/page-adapters.css`
- guard `tests/stage216m-r9-client-left-rail-final-lock-contract.test.cjs`

## Testy
- `node tests/stage216m-r9-client-left-rail-final-lock-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Czego nie ruszano
- API
- Supabase
- płatności
- prawa szyna
- środek klienta
- Stage216D/API brudne pliki

## Następny krok
Po wizualnej akceptacji lewej szyny przejść do Stage216M-R10: środek klienta, czyli aktywne sprawy nad notatkami.
