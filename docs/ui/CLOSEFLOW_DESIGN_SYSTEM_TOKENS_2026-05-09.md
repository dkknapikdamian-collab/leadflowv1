# CloseFlow Design System Tokens — VS-1

**Data:** 2026-05-09  
**Status:** fundament tokenow, bez migracji ekranow  
**Import:** `src/styles/design-system/index.css` w `src/index.css`

## Cel

VS-1 tworzy jedno miejsce na tokeny UI. To nie jest redesign i nie przepina jeszcze ekranow.

## Dodane pliki

- `src/styles/design-system/closeflow-tokens.css`
- `src/styles/design-system/closeflow-layout.css`
- `src/styles/design-system/closeflow-components.css`
- `src/styles/design-system/closeflow-utilities.css`
- `src/styles/design-system/index.css`
- `scripts/check-closeflow-design-system-tokens.cjs`

## Tokeny minimum

- `--cf-space-*`
- `--cf-radius-*`
- `--cf-shadow-*`
- `--cf-text-*`
- `--cf-surface-*`
- `--cf-border-*`
- `--cf-metric-*`
- `--cf-icon-*`
- `--cf-form-*`
- `--cf-modal-*`
- `--cf-list-*`
- `--cf-status-*`
- `--cf-finance-*`

## Zasada kompatybilnosci

Nowe tokeny odczytuja obecne zmienne `--app-*` tam, gdzie to mozliwe. Dzieki temu stare kontrakty moga stopniowo korzystac z nowych tokenow bez wizualnego big-banga.

## Czego VS-1 nie robi

- Nie przepina ekranow.
- Nie usuwa `visual-stage*`, `hotfix-*`, `eliteflow-*` ani `stage*.css`.
- Nie zmienia routingu.
- Nie robi migracji layoutu.

## Kryterium zakonczenia

- `npm run check:closeflow-design-system-tokens` przechodzi.
- `npm run build` przechodzi.
- `src/index.css` importuje `src/styles/design-system/index.css`.
- Kazda grupa tokenow minimum istnieje w `closeflow-tokens.css`.
