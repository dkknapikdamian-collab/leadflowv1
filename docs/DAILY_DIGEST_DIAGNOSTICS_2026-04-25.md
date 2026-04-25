# Daily digest diagnostics + push-ready closeout

Data: 2026-04-25

## Cel

Domknac etap daily digest tak, zeby operator widzial w ustawieniach czy backend jest gotowy do wysylki maili.

## Co dodano

- tryb workspace-diagnostics w /api/daily-digest,
- przycisk Sprawdz konfiguracje w Ustawieniach,
- panel pokazujacy RESEND_API_KEY, DIGEST_FROM_EMAIL, APP_URL, odbiorce, godzine i strefe,
- test tests/daily-digest-diagnostics.test.cjs,
- utrzymano poprawke Today layout v2,
- utrzymano poprawke daily digest cron auth guard.

## Po co

Sam przycisk wysylki testowej nie tlumaczy, czego brakuje. Diagnostyka pokazuje od razu czy problem jest po stronie ENV Vercel, odbiorcy albo workspace.

## Wymagane ENV na Vercel dla darmowego MVP

- RESEND_API_KEY
- DIGEST_FROM_EMAIL = CloseFlow <onboarding@resend.dev>
- NEXT_PUBLIC_APP_URL albo APP_URL

## Kryterium zakonczenia

- npm.cmd run verify:closeflow:quiet przechodzi,
- w ustawieniach digestu widac Sprawdz konfiguracje,
- diagnostyka zwraca canSend=true gdy ENV i odbiorca sa poprawne.
