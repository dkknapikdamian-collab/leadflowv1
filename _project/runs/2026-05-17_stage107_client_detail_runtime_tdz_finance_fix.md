# Stage107 - ClientDetail runtime TDZ finance fix

## Status
PRZYGOTOWANE DO WDROZENIA LOKALNEGO.

## FAKTY Z KODU / PLIKOW
- Runtime z przegladarki pokazal: `ReferenceError: Cannot access 'R' before initialization` w bundle `ClientDetail-*.js`.
- W `src/pages/ClientDetail.tsx` `clientFinance` czytal `clientFinanceSummary` przed deklaracja tego consta.
- `ClientTopTiles` czytal `clientFinanceSummary` z zewnetrznego zakresu zamiast przez props.
- `getClientCasesFinanceSummary` w aktywnym helperze przyjmuje obiekt `{ client, cases, payments }`, nie dwa argumenty.

## DECYZJE DAMIANA
- Log runtime ze screena jest lokalnym faktem uzytkownika.
- Naprawa ma isc przez maly runtime hotfix, bez refaktoru widoku klienta.

## HIPOTEZY / PROPOZYCJE AI
- Glowna przyczyna bledu to TDZ po minifikacji, gdzie `clientFinanceSummary` zostal zminifikowany jako `R`.
- Warning Radix `Missing Description` jest osobny i nie blokuje renderu. Nie powinien byc mieszany z tym hotfixem.
- DeprecationWarning `url.parse()` pochodzi z backend/runtime Node i nie jest przyczyna crasha ClientDetail.

## ZMIENIONE PLIKI
- `src/pages/ClientDetail.tsx`
- `scripts/check-stage107-client-detail-runtime-tdz-finance.cjs`
- `tests/stage107-client-detail-runtime-tdz-finance.test.cjs`
- `_project/runs/2026-05-17_stage107_client_detail_runtime_tdz_finance_fix.md`

## TESTY AUTOMATYCZNE / GUARDY
- `node scripts/check-stage107-client-detail-runtime-tdz-finance.cjs`
- `node --test tests/stage107-client-detail-runtime-tdz-finance.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet` jezeli lokalny runtime/limity pozwola.

## TESTY RECZNE
TEST RECZNY DO WYKONANIA:
1. Wejdz w liste klientow.
2. Otworz szczegoly dowolnego klienta.
3. Potwierdz brak bialego ekranu / crasha trasy.
4. Sprawdz kafle finansow i panel finansow po prawej.
5. Sprawdz konsole: brak `APP_ROUTE_RENDER_FAILED ReferenceError: Cannot access ... before initialization`.

## BRAKI I RYZYKA
- Ten etap nie naprawia warningu Radix Dialog Description.
- Ten etap nie naprawia Node `DEP0169 url.parse`.
- Jesli lokalny plik `ClientDetail.tsx` ma niecommitowane zmiany z innego okna, apply script powinien przerwac prace przed modyfikacja targetu.

## WPŁYW NA OBSIDIANA
- Dodac notatke: `10_PROJEKTY/CloseFlow_Lead_App/2026-05-17 - CloseFlow Stage107 ClientDetail runtime TDZ finance fix.md`.

## NASTĘPNY KROK
- Po wdrozeniu: test reczny ClientDetail i osobny etap na Radix Dialog aria warning, jesli dalej wystepuje.
