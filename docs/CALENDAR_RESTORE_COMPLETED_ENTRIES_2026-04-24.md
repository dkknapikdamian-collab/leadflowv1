# Calendar restore completed entries

Data: 2026-04-24

## Problem

Po oznaczeniu wpisu jako wykonanego w kalendarzu wpis był już poprawnie przekreślony i przesunięty na dół dnia, ale akcja dalej wyglądała jednostronnie jako „Zrobione”.

## Decyzja

Przycisk w kalendarzu działa jako przełącznik:

```text
aktywny task -> done
done task -> todo

aktywne wydarzenie -> completed
completed event -> scheduled
```

## Efekt w UI

- Aktywny wpis pokazuje akcję „Zrobione”.
- Wykonany wpis pokazuje akcję „Przywróć”.
- Użytkownik może odwrócić przypadkowe oznaczenie wpisu.
- Zachowanie jest spójne z ekranem Dziś.
