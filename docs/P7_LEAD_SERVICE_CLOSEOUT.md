# P7 — domknięcie lead → sprawa

## Cel

Po kliknięciu **Rozpocznij obsługę** lead nie może dalej wyglądać jak aktywne miejsce sprzedaży.

## Co zmieniono

- poprawiono copy `obsluga` → `obsługa`,
- po stanie `moved_to_service` zamykane są modale sprzedażowe na leadzie,
- otwieranie szybkiego zadania, wydarzenia i tworzenia sprawy z leada jest blokowane komunikatem:
  `Ten temat jest już w obsłudze. Dalszą pracę prowadź w sprawie.`,
- pomocnicze AI akcje sprzedażowe przy leadzie są ukrywane, jeśli komponenty są renderowane jako self-closing JSX,
- dodano guard `check:p7-lead-service-closeout`.

## Ręczna ścieżka testowa

1. Wejdź w aktywnego leada.
2. Kliknij **Rozpocznij obsługę**.
3. Sprawdź, czy powstała sprawa i czy aplikacja przechodzi do sprawy.
4. Wróć do leada.
5. Lead ma pokazać **Ten temat jest już w obsłudze** i przycisk **Otwórz sprawę**.
6. Lead nie powinien być miejscem dodawania nowych działań sprzedażowych.

## Zakres

Nie ruszano głównej architektury klienta ani historii leada.
