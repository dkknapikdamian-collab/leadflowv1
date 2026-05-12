# CloseFlow FIN-10 REPAIR1 — case finance source truth

Data: 2026-05-12
Branch: dev-rollout-freeze

## Cel

Naprawa paczki FIN-10 po pierwszym uruchomieniu:

1. test `buildCaseFinancePatch` był za szeroki i łapał `remainingAmount` z agregatu klienta poza funkcją patcha,
2. `CaseDetail.tsx` nadal zawierał stary marker `data-case-finance-panel`,
3. guard `check-closeflow-case-detail-loading-reference.cjs` oczekiwał tylko `<CaseSettlementPanel`, mimo że aktualny ekran renderuje wrapper `<CaseSettlementSection`,
4. lokalny workspace miał zmiany spoza FIN-10, więc commit musi dodawać tylko pliki z whitelisty FIN-10.

## Decyzja

Nie rozluźniamy FIN-10. Naprawiamy guardy tak, żeby sprawdzały właściwy zakres, a nie przypadkowe stringi z dalszej części pliku.

## Zmienione elementy

- `scripts/check-fin10-case-finance-source-truth.cjs`
- `tests/case-finance-source.test.cjs`
- `tools/apply-fin10-case-finance-source-truth-repair1.cjs`
- `scripts/check-closeflow-case-detail-loading-reference.cjs`
- `src/pages/CaseDetail.tsx`

## Kryterium

- brak starego `data-case-finance-panel` w aktywnym UI,
- `check:fin10` przechodzi,
- `test:fin10` przechodzi,
- `build` przechodzi,
- `verify:closeflow:quiet` przechodzi,
- commit obejmuje tylko pliki FIN-10.
