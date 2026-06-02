# STAGE216M_R10_R4_CLIENT_CENTER_TABS_AND_INTRO_LOCK_20260602

## Cel
Domknac srodek ClientDetail po Stage216M-R10:
- pasek zakladek `Sprawy / Podsumowanie / Historia` ma byc bezposrednio pod kafelkami,
- aktywne sprawy i notatki maja zostac wspolnym obszarem roboczym,
- historia ma byc osobnym trybem,
- usunac opis `Ostatnie 5 zdarzen...` z lewego raila LeadDetail.

## Zakres
- `src/pages/LeadDetail.tsx`
- `src/styles/page-adapters/page-adapters.css`
- `src/styles/stage216m-r10-r4-client-center-tabs-and-intro-lock.css`
- `tests/stage216m-r10-r4-client-center-tabs-and-intro-lock-contract.test.cjs`

## Nie ruszano
- prawa szyna klienta,
- finanse klienta,
- API,
- Supabase,
- platnosci,
- dane produkcyjne,
- Stage216D i lokalne pliki QA.

## Testy
- `node tests/stage216m-r10-r4-client-center-tabs-and-intro-lock-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Next step
Po zatwierdzeniu srodka klienta: Stage216M-R11, czyli prawa szyna ClientDetail hard render z widocznym `Finanse klienta`.
