# Polish mojibake full audit and Stripe URL fix

Data: 2026-04-25

## Zakres

- skan repo po plikach tekstowych
- automatyczna naprawa typowych krzakow polskich znakow
- test regresyjny blokujacy powrot krzakow
- lokalny skaner scripts/scan-polish-mojibake.cjs
- twarda normalizacja URL dla Stripe Checkout

## Pomijane katalogi

- .git
- .vercel
- node_modules
- dist
- build
- coverage
- .next
- out

## Kryterium zakonczenia

- npm.cmd run verify:closeflow:quiet przechodzi
- node scripts/scan-polish-mojibake.cjs przechodzi
- Stripe Checkout nie wyrzuca bledu Invalid URL
