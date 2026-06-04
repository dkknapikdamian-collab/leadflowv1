# STAGE220A27B - Payment history modal - 2026-06-04

## Cel

Poprawić UX po A27A:
- usunąć przycisk Koryguj z mini wierszy w prawym panelu,
- dodać główną akcję Koryguj wpłatę pod pozostałymi akcjami finansów sprawy,
- otwierać małe okno historii wpłat i korekt,
- dopiero z tego okna wybierać konkretną wpłatę do korekty.

## Decyzja

Prawy panel finansów ma być czytelny.
Korekta jest akcją drugiego kroku:
Finanse sprawy -> Koryguj wpłatę -> Historia wpłat -> wybór wpłaty.

## Nie ruszano

- SQL
- RLS
- API
- schema danych
- model refund z A27A

## Test ręczny

1. Otwórz sprawę z wpłatą.
2. W prawym panelu nie powinno być przycisku Koryguj w mini wierszu.
3. Pod akcjami finansów ma być Koryguj wpłatę.
4. Kliknięcie otwiera modal Historia wpłat i korekt.
5. W modalu widać wartość, datę, status/notatkę.
6. Kliknięcie Koryguj przy konkretnej wpłacie otwiera modal korekty A27A.
