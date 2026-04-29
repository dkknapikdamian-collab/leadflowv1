# CloseFlow — hotfix Vercel Hobby API budget — 2026-04-28

## Cel

Naprawić czerwony test:

```text
FAILED: tests/vercel-hobby-function-budget.test.cjs
api/*.ts count is 14, expected <= 12
```

## Zakres

Hotfix nie zmienia UI, logiki biznesowej, Supabase, auth ani billingu.

Zmienia tylko sposób rozmieszczenia dwóch handlerów API, żeby liczba funkcji Vercel w katalogu `api/*.ts` wróciła do limitu Free/Hobby.

## Co zmieniono

1. `api/payments.ts` przeniesiono do `src/server/payments.ts`.
2. `api/records.ts` przeniesiono do `src/server/records.ts`.
3. `api/system.ts` dostał routing:
   - `apiRoute=payments` → `paymentsHandler`,
   - `apiRoute=records` → `recordsHandler`.
4. `vercel.json` dostał rewrites:
   - `/api/payments` → `/api/system?apiRoute=payments`,
   - `/api/records` → `/api/system?apiRoute=records`.
5. Stare URL-e zostają zachowane przez rewrite, ale fizyczne pliki w `api/*.ts` spadają z 14 do 12.

## Czego nie zmieniono

- brak zmian w ekranach,
- brak zmian w danych,
- brak zmian w endpointach widzianych przez frontend,
- brak zmian w płatnościach,
- brak zmian w logice aktywności i checklist,
- brak zmian w Stage 01 i Stage 02.

## Kryterium zakończenia

Po hotfixie musi przejść:

```powershell
npm.cmd run build
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
```

## Ręcznie sprawdzić

1. Ekrany finansów/płatności, jeśli korzystają z `/api/payments`.
2. Aktywności i checklisty/case-items, jeśli korzystają z `/api/records`.
3. `git status --short`, czy `api/payments.ts` i `api/records.ts` są pokazane jako usunięte, a `src/server/payments.ts` i `src/server/records.ts` jako nowe.
