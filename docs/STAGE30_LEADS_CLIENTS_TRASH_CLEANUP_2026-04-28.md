# Stage30 - kosze leadów i klientów

## Cel

Naprawić widok kosza w leadach oraz usunąć zbędny opis kosza klientów.

## Zmienione obszary

- `src/pages/Leads.tsx`
- `src/pages/Clients.tsx`
- `tests/stage30-leads-clients-trash-contract.test.cjs`
- `scripts/closeflow-release-check-quiet.cjs`
- `scripts/closeflow-release-check.cjs`

## Zakres zmiany

- Kosz leadów klasyfikuje rekord jako usunięty tylko wtedy, gdy `leadVisibility === 'trash'` albo `status === 'archived'`.
- Samo `salesOutcome` nie wrzuca już aktywnego leada do kosza.
- Z widoku kosza klientów usunięto opis: `To jest kosz klientów...`.
- Dodano test kontraktu Stage30 i dopięto go do release gate.

## Nie zmieniono

- Nie zmieniono tworzenia leadów.
- Nie zmieniono przywracania leadów.
- Nie zmieniono schematu bazy danych.
- Nie zmieniono Supabase SQL.

## Komendy sprawdzające

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/stage30-leads-clients-trash-contract.test.cjs
```

## Kryterium zakończenia

- W koszu leadów są tylko rekordy faktycznie przeniesione do kosza.
- W koszu klientów nie ma zbędnego opisu.
- Test Stage30 przechodzi lokalnie i jest częścią quiet gate.
