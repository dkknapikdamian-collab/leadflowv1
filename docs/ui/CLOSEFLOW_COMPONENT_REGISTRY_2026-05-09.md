# CloseFlow Component Registry

**Data:** 2026-05-09  
**Etap:** VS-2 — Component registry  
**Status:** fundament systemu UI, bez masowego przepinania ekranów

## Cel

VS-2 tworzy właściwy rejestr komponentów UI w `src/components/ui-system`. To jest pierwszy stabilny kontrakt po VS-1. Etap nie ma przebudowywać wszystkich ekranów. Ma dać jedno miejsce, z którego kolejne etapy będą brały wrappery, hero, kafelki, karty, wiersze list, statusy, klastry akcji, stopki formularzy i puste stany.

## Zasada główna

Nowy albo migrowany ekran nie powinien tworzyć lokalnego odpowiednika komponentu, jeśli istnieje gotowy komponent w `src/components/ui-system`.

Nie robimy tu wizualnego big-bangu. Rejestr jest kontraktem, a przepinanie ekranów idzie osobnymi etapami.

## Rejestr komponentów

| Komponent | Plik | Minimalne API | Rola |
|---|---|---|---|
| `PageShell` | `src/components/ui-system/PageShell.tsx` | `children`, `className?`, `variant?: 'default' | 'detail' | 'compact'` | Bazowy wrapper strony |
| `PageHero` | `src/components/ui-system/PageHero.tsx` | `kicker?`, `title`, `description?`, `actions?`, `meta?` | Nagłówek strony |
| `MetricTile` | `src/components/ui-system/MetricTile.tsx` | `label`, `value`, `helper?`, `icon?`, `tone?`, `active?`, `onClick?` | Pojedynczy kafelek metryki |
| `MetricGrid` | `src/components/ui-system/MetricGrid.tsx` | `columns?: 2 | 3 | 4`, mobile zawsze 1 kolumna | Siatka metryk |
| `SurfaceCard` | `src/components/ui-system/SurfaceCard.tsx` | `title?`, `description?`, `actions?`, `children` | Standardowa karta / panel |
| `ListRow` | `src/components/ui-system/ListRow.tsx` | `leading?`, `title`, `description?`, `meta?`, `actions?`, `to?`, `onClick?` | Wiersz listy / rekord |
| `StatusPill` | `src/components/ui-system/StatusPill.tsx` | `tone`, `children` | Status / etykieta semantyczna |
| `ActionCluster` | `src/components/ui-system/ActionCluster.tsx` | `primary?`, `secondary?`, `danger?` | Uporządkowane grupowanie akcji |
| `FormFooter` | `src/components/ui-system/FormFooter.tsx` | `cancel`, `submit` | Stopka formularza / modala |
| `EmptyState` | `src/components/ui-system/EmptyState.tsx` | `title`, `description?`, `action?` | Pusty stan listy / sekcji |

## Kompatybilność z tym, co już działa

- `StatShortcutCard` zostaje adapterem dla istniejących ekranów. Aktualnie deleguje rendering do `OperatorMetricTile`, który jest finalnym rendererem kafelków metryk.
- `MetricTile` jest publicznym komponentem rejestru i również korzysta z finalnej warstwy metryk, żeby nie powstały dwa różne style kafelków.
- `ActionCluster` nie zastępuje przycisków. On pilnuje regionu i układu akcji.
- `EntityActionButton` zostaje źródłem prawdy dla akcji encji.
- Legacy CSS, hotfix CSS i stare klasy wizualne zostają do osobnych etapów cleanup. VS-2 ich nie usuwa.

## Gdzie używać

| Obszar | Komponent |
|---|---|
| Wrapper ekranu | `PageShell` |
| Nagłówek ekranu | `PageHero` |
| Top metrics / shortcut metrics | `MetricGrid` + `MetricTile` |
| Panel, sekcja, karta informacji | `SurfaceCard` |
| Lista leadów, klientów, spraw, aktywności | `ListRow` |
| Status leada, sprawy, płatności, integracji | `StatusPill` |
| Akcje w headerze, panelu, danger zone | `ActionCluster` + `EntityActionButton` |
| Stopka formularza / modala | `FormFooter` |
| Brak danych / pusta lista | `EmptyState` |

## Czego nie wolno robić po VS-2

- Nie tworzyć nowych lokalnych `MetricCard`, `TileCard`, `LightMetricCardRow`, `ActivityRow`, jeśli da się użyć rejestru.
- Nie tworzyć nowych lokalnych page hero / screen shell bez powodu.
- Nie przepinać wielu ekranów naraz tylko dlatego, że rejestr już istnieje.
- Nie usuwać `visual-stage*`, `hotfix-*`, `eliteflow-*`, `stage*.css` bez osobnego etapu cleanup.
- Nie mieszać tego etapu z migracją Today, ClientDetail ani CaseDetail.

## Weryfikacja

Obowiązkowe komendy:

```bash
npm run check:closeflow-component-registry
npm run build
```

## Kryterium zakończenia

VS-2 jest zakończony dopiero wtedy, gdy:

1. wszystkie komponenty istnieją w `src/components/ui-system`,
2. są eksportowane z `src/components/ui-system/index.ts`,
3. dokument rejestru opisuje ich minimalne API i użycie,
4. `scripts/check-closeflow-component-registry.cjs` przechodzi,
5. `npm run build` przechodzi.
