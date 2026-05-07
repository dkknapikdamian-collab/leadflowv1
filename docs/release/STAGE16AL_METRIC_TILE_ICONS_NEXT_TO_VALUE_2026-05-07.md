# STAGE16AL - ikony kafelków przy wartości

Cel: dopiąć jeden wizualny kontrakt górnych kafelków w całej aplikacji tak, żeby każdy kafelek miał ikonę obok wartości, zgodnie z kierunkiem z ekranu `Dziś`.

Zakres:

- `src/components/StatShortcutCard.tsx`
  - ikona jest w tym samym rzędzie co wartość,
  - dodany marker `data-metric-icon-next-to-value="true"`,
  - zachowany wspólny styl Stage16AK.
- `src/styles/closeflow-metric-tiles.css`
  - dodany wspólny rząd wartości + ikony,
  - starsze kafelki `.metric`, `.stat-card`, `.summary-card`, `.dashboard-stat-card` dostają fallback ikony, jeśli nie mają własnego `svg`/`.metric-icon`.
- `package.json`
  - dodane skrypty guard/test.
- `scripts/check-metric-tile-icons-next-to-value.cjs`
  - blokuje powrót do kafelków bez ikony przy wartości.
- `tests/metric-tile-icons-next-to-value.test.cjs`
  - smoke test kontraktu UI.

Nie zmienia:

- danych,
- API,
- billing,
- AI,
- logiki liczenia kafelków.

Weryfikacja:

```bash
npm run build
npm run check:metric-tile-icons-next-to-value
npm run test:metric-tile-icons-next-to-value
npm run check:unified-top-metric-tiles
npm run check:polish-mojibake
npm run check:ui-truth-copy
npm run test:critical
npm run verify:closeflow:quiet
```

Kryterium zakończenia: wartości i ikony kafelków są wizualnie spięte w jednym rzędzie, a starsze kafelki bez jawnej ikony nie zostają puste.
