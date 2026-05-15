# CaseDetail Stage 7 — delete placement

## Cel

Przenieść akcję `Usuń sprawę` z pływającego/top-level skrótu do logicznego miejsca w głównym nagłówku/kafelku sprawy.

## Zakres

- Usunięcie `cf-case-detail-delete-shortcut`.
- Dodanie `EntityTrashButton` z `data-case-detail-delete-action`.
- Zachowanie istniejącego `onClick`, żeby nie ruszać confirm dialogu ani routingu po usunięciu.
- Dodanie minimalnego CSS dla ikony destrukcyjnej akcji.

## Poza zakresem

- Bez zmian w `deleteCaseWithRelations`.
- Bez zmian w confirm dialogu.
- Bez zmian w routingu po usunięciu.
- Bez zmian w API.

## Test ręczny po deployu

1. Wejdź w szczegóły sprawy.
2. Sprawdź, że nie ma pływającego przycisku `Usuń sprawę`.
3. Sprawdź, że ikona usuwania jest w rogu głównego nagłówka/kafelka sprawy.
4. Najedź na ikonę: tooltip/label ma brzmieć `Usuń sprawę`.
5. Kliknij ikonę.
6. Oczekiwane: otwiera się confirm dialog.
7. Kliknij anuluj.
8. Oczekiwane: sprawa nie zostaje usunięta.
9. Powtórz i potwierdź usunięcie na rekordzie testowym.
10. Oczekiwane: sprawa znika i aplikacja wraca do `/cases`.
