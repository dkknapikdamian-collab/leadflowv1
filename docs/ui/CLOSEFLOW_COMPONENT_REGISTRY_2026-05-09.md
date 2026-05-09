# CloseFlow Component Registry

**Data:** 2026-05-09  
**Etap:** VS-2 — Component registry  
**Tryb:** fundament komponentow, bez przepinania ekranow masowo

## Werdykt

Ten etap tworzy jedno miejsce, z ktorego nowe i migrowane ekrany maja brac podstawowe elementy UI. Nie usuwa legacy CSS i nie robi wizualnego big-banga.

## Zasada

Ekran nie powinien tworzyc nowego lokalnego kafelka, list row, page hero, pill ani footer formularza, jesli istnieje komponent w `src/components/ui-system`.

## Rejestr komponentow

| Komponent | Plik | Uzycie | Status |
|---|---|---|---|
| PageShell | `src/components/ui-system/PageShell.tsx` | Bazowy wrapper strony / ekranow aplikacji | zrodlo prawdy dla nowych ekranow |
| PageHero | `src/components/ui-system/PageHero.tsx` | Tytul strony, opis, akcje naglowka | zrodlo prawdy dla page hero |
| MetricTile | `src/components/ui-system/MetricTile.tsx` | Kafelki liczbowe / shortcut metrics | zrodlo prawdy dla metryk |
| MetricGrid | `src/components/ui-system/MetricGrid.tsx` | Siatka kafelkow metryk | zrodlo prawdy dla ukladu kafelkow |
| SurfaceCard | `src/components/ui-system/SurfaceCard.tsx` | Standardowa karta / panel / sekcja | zrodlo prawdy dla powierzchni |
| ListRow | `src/components/ui-system/ListRow.tsx` | Wiersze list, rekordy, entry rows | zrodlo prawdy dla list rows |
| StatusPill | `src/components/ui-system/StatusPill.tsx` | Statusy, male etykiety semantyczne | zrodlo prawdy dla statusow |
| ActionCluster | `src/components/ui-system/ActionCluster.tsx` | Polozenie akcji: header, panel, danger zone | zrodlo prawdy dla ukladu akcji |
| FormFooter | `src/components/ui-system/FormFooter.tsx` | Stopka formularza / modala z akcjami | zrodlo prawdy dla form actions |
| EmptyState | `src/components/ui-system/EmptyState.tsx` | Puste stany list i paneli | zrodlo prawdy dla empty states |

## Adaptery i kompatybilnosc

- `StatShortcutCard` zostaje publicznym adapterem dla istniejacych ekranow i deleguje rendering do `MetricTile`.
- `EntityActionButton` zostaje, bo jest juz uzywany jako kontrakt akcji encji.
- `ActionCluster` nie zastępuje przyciskow, tylko pilnuje regionu i polozenia akcji przez `data-cf-action-region`.
- Legacy CSS zostaje do czasu osobnych etapow migracyjnych.

## Gdzie wolno uzywac

| Obszar | Komponent |
|---|---|
| Naglowek ekranu | PageHero |
| Wrapper ekranu | PageShell |
| Kafelki top metrics | MetricGrid + MetricTile |
| Panel boczny / karta informacji | SurfaceCard |
| Lista leadow / klientow / spraw | ListRow |
| Status leada / sprawy / platnosci | StatusPill |
| Akcje naglowka lub panelu | ActionCluster + EntityActionButton |
| Stopka modala/formularza | FormFooter |
| Pusta lista / brak danych | EmptyState |

## Czego nie wolno robic po VS-2

- Nie tworzyc nowych lokalnych `MetricCard`, `TileCard`, `LightMetricCardRow`, `ActivityRow` bez powodu.
- Nie dodawac nowych lokalnych page hero/head bez wpisania powodu w inventory.
- Nie przepinac wielu ekranow naraz.
- Nie usuwac `visual-stage*`, `hotfix-*`, `eliteflow-*` ani `stage*.css` bez osobnego etapu cleanup.

## Kolejny sensowny krok

VS-3 powinien przepiac jeden maly ekran na `PageShell`, `PageHero`, `MetricGrid`, `MetricTile`, `SurfaceCard` i `ListRow`, a potem porownac wizualnie regresje. Nie zaczynac od Today ani ClientDetail, bo to sa najbardziej ryzykowne ekrany.
