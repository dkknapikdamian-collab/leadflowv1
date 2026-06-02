# STAGE216M-R14 - Clean copy and finance mojibake

## Cel
- Naprawic polskie znaki w inline finansach klienta po R13.
- Usunac opisowe mikro-copy z LeadDetail i ClientDetail.
- Zostawic aktualny kierunek: klient ma sprawy + notatki w centrum, finanse widoczne po prawej.

## Zakres
- `src/pages/ClientDetail.tsx`
- `src/pages/LeadDetail.tsx`
- `src/styles/page-adapters/page-adapters.css`
- `src/styles/stage216m-r14-clean-copy-and-finance-mojibake.css`
- `tests/stage216m-r14-clean-copy-and-finance-mojibake-contract.test.cjs`

## Czego nie ruszano
- API
- Supabase
- backend platnosci
- dane runtime
- Stage216D

## Testy
- `node tests/stage216m-r14-clean-copy-and-finance-mojibake-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Status
Do wykonania lokalnie przez paczke ZIP i selektywny commit.
