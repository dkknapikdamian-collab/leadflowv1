# STAGE220A31F - guard syntaxfix

## Cel
Naprawić błędnie wygenerowany guard `scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs` po A31E.

## Fakt
A31E zastosował patch aplikacji, ale guard miał uszkodzony string JS i zatrzymał skrypt na `SyntaxError: Invalid or unexpected token`.

## Zakres
- Nadpisano guard STAGE220A31 poprawnym CJS.
- Nie ruszano logiki aplikacji.
- Nie ruszano Supabase ani API.

## Testy
- `node scripts/check-stage220a31-finance-modal-margin-commission-basis.cjs`
- `npm run build`

## Status
Do potwierdzenia po buildzie i ręcznym teście UI.
