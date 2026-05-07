# Stage22A — ClientDetail feedback UI cleanup

## Źródło

Admin feedback z 2026-05-07 22:09 dla `/clients/e496f3ed-db15-4953-866b-8a34caacbfdb`.

## Cel

Domknąć bezpieczne poprawki UI na karcie klienta bez udawania funkcji, które wymagają zmian w danych.

## Zrobione

- `Ostatnie ruchy` zmienione na `Roadmapa`.
- `Historia pozyskania` usunięta z widocznego języka i zastąpiona kierunkiem `Aktywne sprawy`.
- Pusty tekst `Brak osobnej notatki...` usunięty.
- Poprawiony kontrast notatki, żeby nie było białego tekstu na jasnym tle.
- Kafelki szybkiego podsumowania klienta zmniejszone i wyrównane.
- Ikony w kafelkach ustawione w stałym miejscu.
- Panel acquisition-only ukryty, żeby nie mieszał się ze sprawami.
- Przejście do sprawy dostało mocniejsze copy `Przejdź do sprawy`.
- Sidebar na mobile dostał wymuszenie widocznych napisów przy ikonach.

## Celowo nie zrobione w tej paczce

Nie dodano jeszcze:
- trwałego przypinania notatek pinezką,
- listy wielu notatek z sortowaniem przypięte/najnowsze,
- edycji nazwy sprawy z poziomu klienta,
- usuwania sprawy z poziomu klienta.

Powód: to nie jest czysty CSS. To wymaga jednego z dwóch modeli:
1. osobnej tabeli/obiektu notatek z `pinned`,
2. albo rozszerzenia aktywności/notatek o typ i stan przypięcia.

Robienie tego jako atrapy w UI byłoby błędem produktowym.

## Weryfikacja

```bash
node scripts/check-stage22a-client-detail-feedback-ui-cleanup.cjs
```
