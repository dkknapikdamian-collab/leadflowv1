# Stage76 - Today event done manual check

## Cel

W sekcji `Wydarzenia dziś` można oznaczyć wydarzenie jako `Zrobione`, bez tworzenia osobnej logiki tylko dla ekranu Dziś.

## Ręczny test

1. Wejdź na `/`.
2. Znajdź sekcję `Wydarzenia dziś`.
3. Kliknij `Zrobione` przy wydarzeniu.
4. Odśwież stronę.
5. Sprawdź, czy wydarzenie nie wraca jako aktywne na Dziś.
6. Wejdź w `/calendar` i sprawdź ten sam event.

## Kontrakt

- status wykonania: `done`, zgodny z `isClosedStatus`,
- zapis przez `updateEventInSupabase`,
- Today nie ma osobnego storage dla wykonania eventu,
- miesięczny kalendarz nie jest zmieniany wizualnie.
