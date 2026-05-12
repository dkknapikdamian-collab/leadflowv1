# CloseFlow — Calendar Month Chip Overlap Fix V1

## Problem

W miesięcznym widoku kalendarza tekst wpisu potrafi wpadać pod etykietę tego samego wpisu, np. `Zad` / `Wyd`.

Efekt:
- tekst nakłada się na typ wpisu,
- chip wygląda jak dwie warstwy,
- przy wielu wpisach robi się kasza.

## Decyzja

Nie ruszamy logiki kalendarza. Robimy poprawkę layoutu chipów:

- każdy wpis w kafelku miesiąca jest jednym poziomym wierszem,
- etykieta typu ma stałe miejsce,
- tekst dostaje resztę miejsca,
- tekst nie schodzi pod spód,
- za długi tekst dostaje ellipsis,
- pełny tekst nadal jest dostępny przez hover tooltip z poprzedniego etapu.

## Zakres

Dodaje:

```text
src/styles/closeflow-calendar-month-chip-overlap-fix-v1.css
```

i import w:

```text
src/pages/Calendar.tsx
```

## Nie zmienia

- API,
- Supabase,
- handlerów,
- sidebaru,
- danych,
- struktury aplikacji.

## Kryterium zakończenia

Po wdrożeniu:
- w kafelku miesiąca `Zad/Wyd/Tel` nie nachodzi na tytuł,
- tytuł jest w jednej linii,
- za długi tytuł ucina się przez `...`,
- po najechaniu dalej działa pełny tekst.
