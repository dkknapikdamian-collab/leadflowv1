# Stage 22 - Billing error label fix

Cel: domknac konflikt kontraktu tekstowego w Billingu po skroceniu opisow planu.

Zmiana:
- komunikat bledu checkoutu wraca do formy `Stripe/BLIK`, ktorej wymagaja istniejace testy release gate,
- widoczna etykieta `Platnosc karta lub BLIK` pozostaje zachowana,
- logika platnosci i integracja Stripe nie sa ruszane.

Po wdrozeniu sprawdz:
- `npm.cmd run lint`
- `npm.cmd run verify:closeflow:quiet`
- `npm.cmd run build`
- `node tests/billing-error-label-fix-stage22.test.cjs`
