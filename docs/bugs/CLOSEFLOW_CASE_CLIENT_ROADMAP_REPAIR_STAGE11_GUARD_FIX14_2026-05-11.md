# CloseFlow Stage11 Guard Repair14

## Cel
Zamknąć ostatni błąd po wide quiet gate: przywrócić kontrakt `api/support.ts`, ale utrzymać limit Vercel Hobby `api/*.ts <= 12`.

## Naprawa
- Przywrócono `api/support.ts`, bo `tests/request-identity-vercel-api-signature.test.cjs` czyta ten plik jako kontrakt kompatybilności `getRequestIdentity(req, body)`.
- Usunięto osobny wrapper `api/payments.ts`, bo `/api/payments` jest skonsolidowane przez rewrite do `api/system.ts` jako `/api/system?apiRoute=payments`.
- Nie ruszano logiki `Calendar.tsx` ani zmian z repair11/12/13.

## Guardy
npm.cmd run check:closeflow-case-client-roadmap-repair
npm.cmd run build
npm.cmd run verify:closeflow:quiet:wide
npm.cmd run verify:closeflow:quiet
