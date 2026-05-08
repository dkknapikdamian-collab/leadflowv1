# CLOSEFLOW_METRIC_VISUAL_PARITY_STAGE16A

## Cel

Stage16A domyka faktyczna parzystosc wizualna kafelkow metryk i gornego hero strony.
Ten etap nie zmienia danych, API, Supabase, auth, billingu, AI, routingu ani zachowania klikniec.

## Zakres

- `src/styles/closeflow-metric-tiles.css`
- `src/styles/closeflow-page-header.css`
- `src/pages/TasksStable.tsx`
- `scripts/check-closeflow-metric-visual-parity-contract.cjs`
- `package.json`

## Decyzje

1. `StatShortcutCard` zostaje glownym zrodlem top metryk.
2. Label kafelka ma `white-space: nowrap`, `overflow-wrap: normal`, `word-break: keep-all`, `hyphens: none` i `text-overflow: ellipsis`.
3. `AKTYWNE` i `ZROBIONE` nie moga lamac sie w polowie slowa.
4. `TasksStable` nie moze byc nadpisywany starym fallbackiem CSS dla zwyklych buttonow.
5. Page hero/header ma korzystac z jednego kontraktu `cf-page-hero`, `cf-page-hero-title`, `cf-page-hero-kicker`.
6. Kafelki maja jeden rytm: label po lewej, value + icon po prawej, ta sama wysokosc, radius, padding, cien, rozmiar liczby i rozmiar ikony.

## Nie zmieniono

- logiki zadan,
- filtrow,
- API,
- Supabase,
- auth,
- billing,
- AI,
- routingu,
- Today.tsx,
- TodayStable logic,
- kontraktow danger/status/progress.

## Weryfikacja

Wymagane po wdrozeniu:

```bash
npm run check:closeflow-metric-visual-parity-contract
npm run check:closeflow-legacy-today-route-contract
npm run check:closeflow-metric-icon-tone-contract
npm run check:closeflow-page-header-copy-contract
npm run check:closeflow-surface-contract
npm run check:polish-mojibake
npm run check:closeflow-danger-style-contract
npm run audit:closeflow-ui-map
npm run audit:closeflow-style-map
npm run build
```

## Kryterium zakonczenia

- check Stage16A przechodzi,
- build przechodzi,
- commit i push ida na `dev-rollout-freeze`,
- remote GitHub jest potwierdzony,
- screenshotowo kafelki w Zadaniach i Sprawach nie wygladaja jak dwa rozne systemy,
- `AKTYWNE` nie lamie sie jako `AKTYW / NE`.
