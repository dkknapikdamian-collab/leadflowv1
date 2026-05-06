# STAGE16H — Daily Digest Copy Gate Repair — 2026-05-06

## Cel
Naprawić czerwony gate `tests/daily-digest-email-runtime.test.cjs`, który wymaga dokładnego copy:

`Na darmowym Vercel cron działa raz dziennie`

## Zakres
- `src/pages/Settings.tsx`
- naprawa literówki `dzieńnie` -> `dziennie`
- bez zmian funkcji produktowych
- bez zmian backendu
- bez commita
- bez pusha

## Dlaczego
Final QA nie może przejść z czerwonym `verify:closeflow:quiet`. To jest kontrakt copy dla ustawień daily digest i Vercel Hobby cron.

## Runtime 500
Błędy runtime 500 z `/api/system?kind=ai-drafts`, `/api/system?kind=google-calendar&route=sync-inbound` i `/api/payments` są osobnym P0 runtime/debug tematem. Ten etap nie maskuje tych błędów i nie zmienia endpointów bez logów funkcji.
