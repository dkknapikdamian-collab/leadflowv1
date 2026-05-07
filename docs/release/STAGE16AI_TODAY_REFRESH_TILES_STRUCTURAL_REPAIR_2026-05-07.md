# STAGE16AI Today refresh + tiles structural repair

Cel: naprawić przycisk `Odśwież dane` w panelu `/today` oraz doprowadzić kafelki do tego samego źródła prawdy co listy rozwijane poniżej.

Zakres:
- `src/pages/TodayStable.tsx`
- `scripts/check-today-refresh-tiles-match-lists.cjs`
- `tests/today-refresh-tiles-match-lists.test.cjs`
- `package.json`

Zmiany:
- ręczny refresh ma osobny stan `manualRefreshing`, blokuje ponowne kliknięcie i pokazuje `Odświeżanie...`,
- kafelki są renderowane z `todayTiles`,
- nazwy kafelków i nagłówków list idą z `todaySectionLabels`,
- liczniki kafelków używają dokładnie tych samych tablic co listy rozwijane,
- stare nieudane helpery Stage16AG/AH są usuwane przed commitem.

Checki:
- `npm run build`
- `npm run check:today-refresh-tiles-match-lists`
- `npm run test:today-refresh-tiles-match-lists`
- `npm run check:polish-mojibake`
- `npm run check:ui-truth-copy`
- `npm run test:critical`
- `npm run verify:closeflow:quiet`
