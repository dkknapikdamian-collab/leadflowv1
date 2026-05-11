# CloseFlow — Page Header Rebuild Light Source Truth

## Cel

Naprawić rozjazd górnych nagłówków zakładek po Stage 1, gdzie tylko `Dziś` wygląda dobrze, a reszta ekranów dostała czarne lub niespójne tła.

## Decyzja

Nie kasujemy całych ekranów i nie ruszamy logiki.

Kasujemy wizualny chaos tylko na warstwie nagłówków:
- jeden light skin jak w `Dziś`,
- jeden plik źródłowy,
- import po lokalnych CSS-ach ekranów, żeby źródło prawdy wygrywało kaskadą,
- zero runtime DOM patchera,
- zero MutationObserver.

## Jedno źródło prawdy

`src/styles/closeflow-page-header-card-source-truth.css`

## Zasady kolorów

- tło nagłówka: białe / bardzo jasne,
- tekst: ciemny slate,
- opis: szary slate,
- kicker: jasny blue,
- CTA: blue/indigo,
- AI: violet/indigo,
- danger: red,
- green tylko dla statusów sukcesu, nie dla głównego CTA.

## Dodatkowo

W `Zadania` dodajemy przycisk `Nowe zadanie` do górnego paska. Używa istniejącej funkcji `openNewTask`, więc nie zmienia API ani formularza.

## Czego nie robić

- Nie dodawać runtime.
- Nie dodawać MutationObserver.
- Nie ruszać modali.
- Nie ruszać pozycji ekranów.
- Nie ruszać zapisu ani endpointów.
