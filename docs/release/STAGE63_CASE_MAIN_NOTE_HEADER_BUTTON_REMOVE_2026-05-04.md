# STAGE63_CASE_MAIN_NOTE_HEADER_BUTTON_REMOVE

Data: 2026-05-04

Cel: usunąć widoczny czarny przycisk `Dodaj notatkę` z nagłówka / głównej sekcji `Najważniejsze działania`, bez kasowania właściwego przycisku notatki w panelu akcji sprawy.

Zakres:
- usunięto przyciski notatki wywołujące `openCaseNoteDialog`, które nie są oznaczone jako `data-case-create-action=\"note\"`,
- zachowano dokładnie jeden przycisk notatki w panelu akcji sprawy,
- zachowano helper `openCaseNoteDialog`, modal notatki oraz Stage59 follow-up prompt,
- zaktualizowano verify chain Stage56-63.

Wynik instalatora: usunięte bloki przycisku poza panelem akcji: 2.

Nie zmieniono modelu danych, API ani logiki zapisu notatki.
