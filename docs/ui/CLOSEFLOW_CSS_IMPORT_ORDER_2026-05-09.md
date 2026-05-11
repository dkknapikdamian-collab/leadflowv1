# CloseFlow CSS import order cleanup

**Data:** 2026-05-09
**Etap:** VS-3 - CSS import order cleanup
**Status:** import-order foundation, no selector rewrite

## Cel

`src/index.css` ma byc czytelnym punktem wejscia do kaskady CSS, a nie lista starych `visual-stage*`, `stage*`, `eliteflow*` i `hotfix-*` importow.

Ten etap uklada CSS w warstwy. Nie usuwa starych plikow i nie przepina ekranow.

## Docelowe bloki w `src/index.css`

1. `Tailwind/base`
2. `Design system`
3. `Core contracts`
4. `Page adapters`
5. `Legacy imports`
6. `Temporary overrides`
7. `Emergency hotfixes`

## Agregatory

| Warstwa | Plik | Znaczenie |
|---|---|---|
| Core contracts | `src/styles/core/core-contracts.css` | shell, theme, tokeny, kontrakty metryk i akcji |
| Page adapters | `src/styles/page-adapters/page-adapters.css` | stare page-level `visual-stage*` i etapowe adaptery stron |
| Legacy imports | `src/styles/legacy/legacy-imports.css` | historyczne style, ktore nie sa juz standardem |
| Temporary overrides | `src/styles/temporary/temporary-overrides.css` | czasowe naprawy i override'y do usuniecia po migracjach |
| Emergency hotfixes | `src/styles/emergency/emergency-hotfixes.css` | awaryjne, wasko zakresowe hotfixy runtime |

## Decyzje

### 1. Nie usuwamy starych CSS-ow

Pliki `visual-stage*`, `stage*`, `eliteflow*` i `hotfix-*` zostaja w repo. Zmieniamy tylko miejsce importu.

### 2. `src/index.css` nie importuje juz bezposrednio stage/hotfix/eliteflow

`src/index.css` importuje agregatory. Konkretne stare pliki sa sklasyfikowane w agregatorach.

### 3. Temporary i emergency musza miec metadata

Kazdy blok temporary albo emergency ma opis:

```css
/* owner:
   reason:
   scope:
   remove_after_stage:
*/
```

Bez tego check ma pasc.

### 4. Brak migracji ekranow w VS-3

Nie ruszamy JSX, klas Tailwind w ekranach, routingu, danych ani logiki biznesowej.

## Czego nie robic po VS-3

- Nie dodawac nowych `@import './styles/hotfix-...'` bezposrednio do `src/index.css`.
- Nie wrzucac nowego emergency hotfixa bez `owner/reason/scope/remove_after_stage`.
- Nie traktowac `temporary-overrides.css` jako nowego standardu.
- Nie usuwac starego CSS bez osobnego etapu i testu wizualnego.

## Weryfikacja

```bash
npm run check:closeflow-css-import-order
npm run build
```

## Kryterium zakonczenia

VS-3 jest zakonczony, gdy:

1. `src/index.css` ma 7 blokow importow w dobrej kolejnosci,
2. stare `visual-stage*`, `stage*`, `eliteflow*`, `hotfix-*` sa w agregatorach,
3. temporary/hotfix sa opisane metadanymi,
4. `npm run check:closeflow-css-import-order` przechodzi,
5. `npm run build` przechodzi.