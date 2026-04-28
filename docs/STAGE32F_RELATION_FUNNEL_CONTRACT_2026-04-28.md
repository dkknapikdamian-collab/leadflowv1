# Stage32f - kontrakt testu wartości lejka po uproszczeniu prawego panelu

## Cel
Naprawić konflikt między nowym kompaktowym panelem "Najcenniejsze" w zakładce Leady a starszym testem, który nadal wymagał starego długiego opisu UI.

## Zmienione pliki
- tests/relation-funnel-value.test.cjs
- tests/stage32f-relation-funnel-contract.test.cjs
- scripts/closeflow-release-check-quiet.cjs
- scripts/closeflow-release-check.cjs

## Nie zmieniaj
- logiki liczenia wartości lejka
- Stage29d i kafelka Szkice w Dziś
- układu listy leadów
- danych Supabase

## Po wdrożeniu sprawdź
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/stage32-leads-value-right-rail.test.cjs
node tests/stage32e-relation-rail-copy-compat.test.cjs
node tests/stage32f-relation-funnel-contract.test.cjs
node tests/relation-funnel-value.test.cjs

## Kryterium zakończenia
Wszystkie powyższe komendy przechodzą na zielono.
