# CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_CHECK_FINAL_FIX_2026-05-11

Cel: naprawić fałszywie negatywny guard `check:case-detail-no-partial-loading` po usunięciu runtime crasha `loading is not defined`.

Zakres:
- nie rusza `src/pages/CaseDetail.tsx`,
- nie rusza finansów sprawy,
- nie rusza `package.json`,
- nadpisuje tylko `scripts/check-closeflow-case-detail-no-partial-loading.cjs`.

Nowy check sprawdza:
- `loading` jest lokalnym stanem w `CaseDetail`,
- `if (loading)` istnieje tylko w komponencie i przed głównym return JSX,
- po głównym return nie ma drugiego `if (loading)`,
- komponent `CaseDetailLoadingState` nie zawiera paneli finansowych ani wartości biznesowych,
- `verify:closeflow:quiet` zachowuje kontrakt `node scripts/closeflow-release-check-quiet.cjs`.

Powód poprawki: poprzedni check skanował za duży fragment kodu po `if (loading)` i dochodził do legalnego głównego renderu z `CaseSettlementPanel`, przez co fałszywie blokował release gate.
