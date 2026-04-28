# Stage 21 - Billing label compatibility

Cel: domkniecie konfliktu testow po czyszczeniu copy w Billingu.

Zakres:
- przywraca widoczna fraze `Płatność kartą lub BLIK`, ktorej wymaga starszy test UI,
- zachowuje znaczenie `BLIK przez Stripe`,
- zachowuje ukryty kontrakt `Stripe/BLIK` dla starszych testow technicznych,
- nie zmienia logiki platnosci, Stripe ani planow.

Po wdrozeniu sprawdz:
- `npm.cmd run lint`
- `npm.cmd run verify:closeflow:quiet`
- `npm.cmd run build`
- `node tests/billing-label-compat-stage21.test.cjs`
