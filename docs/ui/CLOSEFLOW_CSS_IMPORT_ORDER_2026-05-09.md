# CloseFlow CSS import order cleanup

**Data:** 2026-05-09
**Etap:** VS-3 - CSS import order cleanup
**Status:** import-order foundation, no selector rewrite

## Cel

`src/index.css` ma byc czytelnym punktem wejscia do kaskady CSS, a nie lista starych `visual-stage*`, `stage*`, `eliteflow*` i `hotfix-*` importow.

Ten etap uklada CSS w warstwy. Nie usuwa starych plikow i nie przepina ekranow.

## Aktualna granica importu w `src/index.css`

1. `Tailwind/base`
2. `Design system`
3. `Core contracts`
4. `Page adapters`

The retired legacy, temporary, and emergency aggregators are not runtime
imports. Import order is verified from the actual import statements; comments
or historical marker tokens are not required evidence.

## Agregatory

| Warstwa | Plik | Znaczenie |
|---|---|---|
| Core contracts | `src/styles/core/core-contracts.css` | shell, theme, tokeny, kontrakty metryk i akcji |
| Page adapters | `src/styles/page-adapters/page-adapters.css` | stare page-level `visual-stage*` i etapowe adaptery stron |
| Legacy/temporary/emergency | retired from runtime | historical runtime owners are not active imports |

## Decyzje

### 1. Runtime does not reactivate historical CSS owners

Historical files may remain in preserved backups, but they are not runtime
owners and are not imported by the active entrypoint.

### 2. `src/index.css` nie importuje juz bezposrednio stage/hotfix/eliteflow

`src/index.css` importuje agregatory. Konkretne stare pliki sa sklasyfikowane w agregatorach.

### 3. Brak migracji ekranow w VS-3

Nie ruszamy JSX, klas Tailwind w ekranach, routingu, danych ani logiki biznesowej.

## Czego nie robic po VS-3

- Nie dodawać nowych stage/hotfix/temporary imports do `src/index.css`.
- Nie traktować historycznego CSS jako standardu runtime.
- Nie dodawać komentarzowych markerów jako substytutu rzeczywistego import graph.

## Weryfikacja

```bash
npm run check:closeflow-css-import-order
npm run build
```

## Kryterium zakonczenia

VS-3 jest zakonczony, gdy:

1. `src/index.css` ma 4 aktywne importy w dobrej kolejności,
2. historyczne stage/hotfix/temporary CSS nie jest aktywnym importem,
3. `npm run check:closeflow-css-import-order` przechodzi,
4. `npm run build` przechodzi.
