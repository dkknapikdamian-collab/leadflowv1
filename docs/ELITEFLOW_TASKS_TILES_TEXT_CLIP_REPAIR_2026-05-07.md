# EliteFlow / CloseFlow — Tasks tiles + metric text clipping repair — 2026-05-07

## Problem

Po kolor/font parity zostały dwa problemy wizualne:

- na części metryk wartość lub tekst był przycinany przez `truncate`, niskie `line-height` i `overflow`;
- zakładka `Zadania` nadal renderowała własne hardcoded kafelki, więc CSS musiał walczyć z innym DOM-em zamiast używać wspólnego komponentu.

## Fix

- `TasksStable.tsx` używa teraz `StatShortcutCard` dla górnych kafelków.
- Kafelki zadań dostały `data-eliteflow-task-stat-grid="true"`.
- `StatShortcutCard` nie używa już klas `truncate` na label/helper/value.
- Dodano finalną warstwę CSS:
  `src/styles/eliteflow-metric-text-clip-tasks-repair.css`.
- Dodano guard:
  `scripts/check-eliteflow-tasks-tiles-text-clip-repair.cjs`.

## Verification

```powershell
node scripts/check-eliteflow-tasks-tiles-text-clip-repair.cjs
node scripts/check-eliteflow-final-metric-tiles.cjs
node scripts/check-eliteflow-metric-color-font-parity.cjs
npm run build
```

## Manual smoke

Sprawdź:

- `/leads` — czy `3 PLN` i podobne wartości nie są przycięte;
- `/tasks` — czy górne kafelki wyglądają jak kafelki z `Dziś`, nie jak stare wyśrodkowane karty.
