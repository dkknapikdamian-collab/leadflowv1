# CloseFlow — Page Header Copy Left Only Packet 4

## Cel

Poprawić tylko to, co zostało: pozycję tekstu w głównym headerze/kafelku.

Nie ruszać:
- logiki,
- modali,
- list,
- metryk,
- akcji,
- API,
- kolorów przycisków.

## Problem

Na screenie `Lista zadań` nadal zaczyna się za bardzo w środku.

Przyczyna nie jest w samym `h1`, tylko w wrapperach:
- `cf-page-header-row`,
- `cf-page-hero-layout`,
- stare source-of-truth traktowały część wrapperów jak copy albo actions,
- jeden wrapper mógł dostać `max-width` albo złe `justify-self`.

## Co robi pakiet

Dodaje nowy, wąski lock:

`src/styles/closeflow-page-header-copy-left-only.css`

Ten plik robi tylko:
- wrapper row/header ma pełną szerokość,
- prawdziwe copy idzie w lewo,
- kicker jest dokładnie nad tytułem,
- tytuł jest pod kickerem,
- opis jest pod tytułem,
- actions są po prawej tylko, jeśli mają jawny marker actions,
- nie ma żadnego `:last-child` jako zgadywania akcji.

## Dodatkowo

Usuwa błędny marker:
`data-cf-page-header-part="copy"`
z listy zadań w `TasksStable.tsx`, bo lista zadań nie jest copy głównego headera.

## Kryterium ręczne

Po deployu:
- `/tasks`: `ZADANIA`, `Lista zadań`, opis mają być po lewej jak `Dziś`.
- `/activity`: `AKTYWNOŚĆ`, `Aktywność` mają być po lewej.
- `/templates`: `SZABLONY SPRAW`, tytuł i opis mają być po lewej.
- `/today`: nie może się pogorszyć.
