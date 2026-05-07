# Stage24A — ClientDetail actions, cases and roadmap

## Źródło

Admin feedback z 2026-05-07 22:50 dla commita `37aad2ec10ba5394ce29ca35aa3eb918f051ad21`.

## Cel

Naprawić kolejne problemy w widoku klienta:

- usunąć dodatkowy panel `Aktywne sprawy` z podsumowania, który dalej pokazywał lead źródłowy,
- usunąć opis w zakładce `Sprawy`,
- poprawić czytelność listy spraw,
- dodać w prawym panelu kafel `Szybkie akcje` nad notatkami,
- poprawić roadmapę tak, żeby wyglądała jak przepływ działań, ale bez powiększania kafelka,
- jeszcze mocniej wymusić ciemny tekst na przyciskach notatki.

## Zrobione

- Dodano `data-client-summary-source-lead-panel="true"` i ukryto ten panel.
- Dodano boczny kafel `Szybkie akcje`.
- `Dodaj zadanie` oraz `Dodaj wydarzenie` idą przez `openContextQuickAction`.
- Przy zadaniu/wydarzeniu przekazywany jest kontekst klienta oraz, jeśli istnieje, `leadId` i `caseId`.
- `Finanse w sprawie` prowadzi do sprawy, bo finansów nie ma jeszcze w `ContextActionKind`.
- Roadmapa dostała kompaktowy timeline z linią i punktami.
- Opis w panelu spraw został usunięty.
- Tytuł sprawy ma lepszy fallback, gdy tytuł był tylko nazwą klienta.

## Decyzja produktowa

Finanse nie zostały udane jako czwarty typ `ContextActionKind`, bo wspólny host obecnie obsługuje tylko `task`, `event`, `note`.

Pełne dodawanie finansów z tego samego źródła prawdy powinno wejść jako Stage24B po rozszerzeniu kontraktu akcji kontekstowych.
