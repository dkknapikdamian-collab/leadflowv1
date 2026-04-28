# Stage32g - dopięcie testu lejka do pełnego release gate

## Cel
Naprawić kontrakt testów po Stage32e/Stage32f: test `relation-funnel-value` już przechodzi, ale Stage32f sprawdzał również pełny release gate i brakowało tam wpisu tego testu.

## Zmienione
- `scripts/closeflow-release-check.cjs` dopina `tests/relation-funnel-value.test.cjs`.
- `scripts/closeflow-release-check-quiet.cjs` pozostaje zgodny, a gdy wpisu brakuje, patch dopisuje go także tam.
- Dodano test kontrolny `tests/stage32g-relation-funnel-full-gate-contract.test.cjs`.

## Nie zmieniaj
- UI zakładki Leady.
- Kompaktowego prawego panelu Najcenniejsze.
- Logiki liczenia wartości lejka.
- Kafelka Szkice w Dziś.

## Sprawdź
```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/stage32-leads-value-right-rail.test.cjs
node tests/stage32e-relation-rail-copy-compat.test.cjs
node tests/stage32f-relation-funnel-contract.test.cjs
node tests/stage32g-relation-funnel-full-gate-contract.test.cjs
node tests/relation-funnel-value.test.cjs
```

## Kryterium zakończenia
Wszystkie powyższe komendy przechodzą na zielono.
