# CLOSEFLOW FIN-9 — Finance duplicate safety — 2026-05-10

Marker: CLOSEFLOW_FIN9_FINANCE_DUPLICATE_SAFETY_V1

## Cel

Przed dopisaniem wpłaty lub prowizji aplikacja ma ostrzec użytkownika, jeżeli rekord może mieć duplikat.

## UX

Treść ostrzeżenia:

> Ten klient może mieć duplikat. Upewnij się, że dodajesz wpłatę do właściwego rekordu.

## Zasada

Nie blokować. Ostrzegać.

Użytkownik może dalej zapisać wpłatę, bo to jest safety rail, a nie twardy gate.

## Zakres

- `src/lib/finance/finance-duplicate-safety.ts`
- `src/components/EntityConflictDialog.tsx`
- `src/components/finance/PaymentFormDialog.tsx`
- `src/components/finance/CaseSettlementPanel.tsx`
- `src/pages/CaseDetail.tsx`
- `src/pages/ClientDetail.tsx`
- `api/system.ts`
- `src/styles/finance/closeflow-finance.css`

## Bramki

- FIN-9 duplicate safety
- FIN-8 visual integration
- FIN-7 client finance summary
- FIN-6 payment types
- FIN-5 settlement panel
- API-0 Vercel Hobby limit
- API runtime data-contract
- import boundaries
- TypeScript
- build
