# CloseFlow — Calendar Month Rows No Overlap Repair2

## Problem

Poprzednia poprawka dalej nie naprawiła kafelków miesiąca.

Na screenie widać:
- tekst jednego wpisu wchodzi pod etykietę `Zad/Wyd`,
- wpisy wizualnie nakładają się na siebie,
- przekreślony tekst potrafi leżeć na kolejnej pozycji.

## Decyzja

Naprawiamy to mocniej CSS-em:

1. Lista wpisów w kafelku miesiąca staje się zwykłym pionowym stackiem.
2. Każdy wpis jest osobnym wierszem.
3. Wiersz ma `display:flex`, `nowrap`, stałą wysokość i odstęp pod spodem.
4. Badge typu ma stałą szerokość.
5. Tekst ma elastyczną kolumnę i `ellipsis`.
6. Pełny tekst dalej jest pod hover tooltipem.

## Ważne

To dalej nie zmienia logiki kalendarza, API ani danych.

## Nie ruszamy

- Supabase,
- tworzenia/edycji/usuwania,
- handlerów,
- lewego globalnego sidebaru,
- danych,
- routingu.

## Kryterium

Po wdrożeniu:
- każdy wpis zaczyna się od nowej linijki,
- wpis nie wchodzi w inny wpis,
- tekst nie wchodzi pod badge,
- tekst jest ucięty `...`,
- po najechaniu widać pełny tekst.
