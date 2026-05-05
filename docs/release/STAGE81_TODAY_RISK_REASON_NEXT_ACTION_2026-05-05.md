# CloseFlow Stage81: TODAY_RISK_REASON_NEXT_ACTION

Data: 2026-05-05

## Cel

Realny etap aplikacji dla ekranu Dziś.

## Zakres

- Stage81 dodaje powód alarmu i sugerowany następny ruch.
- Stage82 dodaje widok najbliższych 7 dni: leady, zadania i wydarzenia.

## Nie zmienia

- Stripe.
- Google Calendar OAuth.
- Resend/digest.
- Supabase schema.

## Weryfikacja

```powershell
npm.cmd run check:stage81-today-risk-reason-next-action
npm.cmd run verify:stage70-82-cumulative
npm.cmd run build
```
