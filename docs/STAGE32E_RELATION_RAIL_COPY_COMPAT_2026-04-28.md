# Stage32e - poprawka opisu prawej listy najcenniejszych relacji

## Cel

Naprawić konflikt po Stage29d/Stage32d: zachować zgodność testu `relation-funnel-value`, ale usunąć stary długi opis z kafelka najcenniejszych relacji.

## Zakres

- `src/pages/Leads.tsx`
- `tests/stage32e-relation-rail-copy-compat.test.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `scripts/closeflow-release-check.cjs`

## Zmieniono

- usunięto stary opis `Suma lejka liczona z aktywnych leadów i klientów`,
- zostawiono kompaktowy prawy panel najcenniejszych relacji,
- zachowano tekst zgodności `Lejek razem: {formatRelationValue(relationFunnelValue)}`,
- dodano test blokujący powrót starego długiego opisu.

## Nie zmieniano

- logiki liczenia wartości lejka,
- filtrowania leadów,
- tras i linków do leadów,
- układu listy Stage31.

## Sprawdzenie

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/stage32-leads-value-right-rail.test.cjs
node tests/relation-funnel-value.test.cjs
node tests/stage32e-relation-rail-copy-compat.test.cjs
```

## Kryterium zakończenia

Wszystkie powyższe komendy przechodzą na zielono.
