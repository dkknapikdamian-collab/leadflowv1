# CloseFlow — Calendar Selected Day Full Labels V6

## Cel

W dolnym panelu wybranego dnia nie może być samego `Zad` albo `Wy`.

Ma być pełny typ i konkret wpisu:

```txt
Zadanie     11:00 wystawić działki...
Wydarzenie  01:00 oglądać wiz...
```

## Zakres

Zmienia:
- `src/pages/Calendar.tsx`
- `src/styles/closeflow-calendar-selected-day-full-labels-v6.css`

Nie zmienia:
- API,
- Supabase,
- danych,
- handlerów,
- sidebaru,
- routingu.

## Zasady

- typ = pełne słowo: Zadanie / Wydarzenie / Telefon / Lead,
- po typie jest treść wpisu,
- długi tekst ma `...`,
- hover pokazuje pełny tekst.
