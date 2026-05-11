# CloseFlow — Page Header Source Truth Rebuild Stage 2

## Cel

Naprawić problem, że tylko `Dziś` wygląda dobrze, a reszta górnych kafelków/nagłówków ma inny kolor albo ciemne tło.

## Diagnoza

Poprzednie źródło prawdy było za słabe technicznie:
- używało `:where(...)`, czyli selektorów o zerowej specyficzności,
- stare pliki CSS mają reguły `!important` i dużo mocniejsze selektory,
- część CSS jest ładowana przez page chunks, więc sam globalny import nie wystarcza.

## Stare aktywne źródła konfliktu

Przykłady:
- `src/styles/page-adapters/page-adapters.css` nadal importuje stare visual-stage i stage37-40.
- `stage37-unified-page-head-and-metrics.css` styluje `.cf-html-view .page-head`.
- `stage39-page-headers-copy-visual-system.css` styluje `.cf-html-view .page-head` i `.head-actions`.
- `visual-stage25-leads-full-jsx-html-rebuild.css` i `visual-stage26-leads-visual-alignment-fix.css` mają lokalne style dla `Leady`.
- podobne lokalne style są w ekranach klientów, spraw, kalendarza itd.

Nie usuwamy ich teraz, bo te pliki dotykają też list, kafli metryk i układów stron. Zamiast tego izolujemy top header przez `data-cf-page-header="true"` i finalny CSS o wyższej specyficzności.

## Jedno źródło prawdy

`src/styles/closeflow-page-header-card-source-truth.css`

Plik ma osobne sekcje:
1. Background source of truth
2. Text source of truth
3. Kicker source of truth
4. Button source of truth

## Zasada

Każdy top header dostaje:
- `data-cf-page-header="true"`
- klasę `cf-page-header`

Dopiero ten oznaczony element jest stylowany. Nie ma runtime, MutationObserver ani przepisywania DOM po renderze.

## Dodatkowo

W `Zadania` dochodzi przycisk `Nowe zadanie` w górnym pasku. Używa istniejącej funkcji `openNewTask`.

## Czego nie zmieniać

- Nie ruszać modali.
- Nie ruszać list.
- Nie ruszać API.
- Nie ruszać zapisu.
- Nie ruszać routingu.
- Nie dodawać runtime patchera.
