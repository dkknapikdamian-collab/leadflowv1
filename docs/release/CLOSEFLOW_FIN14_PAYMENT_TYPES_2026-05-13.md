# CloseFlow FIN-14 — płatności: wpłata, zaliczka, prowizja

Data: 2026-05-13  
Branch: `dev-rollout-freeze`

## Cel

Wpłaty klienta, zaliczki i płatności prowizji mają być widoczne w jednym module, ale liczone osobno.

## Decyzja

- `Dodaj zaliczkę` tworzy `payment.type = deposit`.
- `Dodaj wpłatę` tworzy `payment.type = partial`.
- `Dodaj płatność prowizji` tworzy `payment.type = commission`.
- `deposit` i `partial` zwiększają `Wpłacono od klienta` i zmniejszają `Pozostało`.
- `commission` zwiększa tylko `Prowizja opłacona` i zmniejsza `Prowizja do zapłaty`.
- Każda płatność z widoku klienta musi mieć `caseId`.

## Pliki

- `src/components/finance/CaseFinancePaymentDialog.tsx`
- `src/components/finance/CaseFinanceActionButtons.tsx`
- `src/components/finance/PaymentList.tsx`
- `src/components/finance/CaseSettlementPanel.tsx`
- `src/components/finance/FinanceMiniSummary.tsx`
- `public/service-worker.js`
- `scripts/check-fin14-payment-types.cjs`
- `tests/fin14-payment-types.test.cjs`

## Dodatkowe naprawy kontroli

FIN-13 został wypchnięty z czerwonymi guardami. FIN-14 porządkuje:

- `FinanceMiniSummary.tsx` nie ma już lokalnego `.reduce`, żeby nie łamać FIN-10.
- `public/service-worker.js` ma jawne warunki `url.pathname.startsWith('/api/')` i `url.pathname.startsWith('/supabase/')`, których wymaga obecny test PWA.

## Weryfikacja

```powershell
npm.cmd run check:fin14
npm.cmd run test:fin14
npm.cmd run check:fin13
npm.cmd run test:fin13
npm.cmd run check:fin10
npm.cmd run test:fin10
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```
