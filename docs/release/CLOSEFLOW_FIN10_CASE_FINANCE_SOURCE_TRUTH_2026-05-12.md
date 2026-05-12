# CLOSEFLOW FIN-10 — Case finance source of truth

Data: 2026-05-12
Branch: `dev-rollout-freeze`

## Cel

FIN-10 wymusza jedno źródło prawdy dla finansów sprawy:

- wartość sprawy i konfiguracja prowizji są na sprawie,
- realne wpłaty są w płatnościach,
- klient pokazuje agregat ze spraw,
- `paidAmount` i `remainingAmount` nie są edytowalnym źródłem prawdy, jeśli istnieją rekordy `payments`.

## Pliki

- `src/lib/finance/case-finance-source.ts`
- `src/lib/client-finance.ts`
- `src/components/finance/CaseSettlementPanel.tsx`
- `src/components/finance/CaseSettlementSection.tsx`
- `src/components/finance/FinanceMiniSummary.tsx`
- `src/pages/CaseDetail.tsx`
- `scripts/check-fin10-case-finance-source-truth.cjs`
- `tests/case-finance-source.test.cjs`

## Reguły

- `contractValue` pochodzi ze sprawy.
- `clientPaidAmount` to suma płatności nie-prowizyjnych o statusie płatnym.
- `commissionPaidAmount` to suma płatności typu `commission` o statusie płatnym.
- `remainingAmount = max(contractValue - clientPaidAmount, 0)`.
- `commissionRemainingAmount = max(commissionAmount - commissionPaidAmount, 0)`.
- `buildCaseFinancePatch()` nie wysyła `paidAmount` ani `remainingAmount` jako pól edytowalnych.

## Weryfikacja

```powershell
npm.cmd run check:fin10
npm.cmd run test:fin10
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```

## Manual smoke

1. Otwórz sprawę.
2. Ustaw wartość sprawy `100000` i prowizję `3%`.
3. Dodaj wpłatę klienta `20000` ze statusem `paid`.
4. Dodaj płatność prowizji `1000` ze statusem `paid`.
5. Sprawdź po reloadzie:
   - wartość: `100000`,
   - wpłacono od klienta: `20000`,
   - pozostało: `80000`,
   - prowizja należna: `3000`,
   - prowizja opłacona: `1000`,
   - prowizja do zapłaty: `2000`.
6. Wejdź w klienta i sprawdź agregat finansowy ze spraw.
7. Sprawdź, że nie istnieje aktywny `data-case-finance-panel`.
