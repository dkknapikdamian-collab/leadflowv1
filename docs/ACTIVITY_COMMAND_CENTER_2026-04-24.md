# Activity command center

Data: 2026-04-24

## Problem

Po dodaniu activity logów z ekranu Dziś i Kalendarza ekran Aktywność nie mógł zostać prostą listą. Operator potrzebuje szybko odsiać wykonane, przywrócone, usunięte oraz znaleźć wpis po leadzie, sprawie albo tytule.

## Decyzja

Ekran Aktywność działa jako panel historii operacyjnej.

## Zakres wdrożenia

Dodano:

- wyszukiwarkę,
- filtr źródła: wszystko / Dziś / Kalendarz / Lead / Sprawa / Inne,
- filtr typu: wykonane / przywrócone / usunięte / utworzone / aktualizacje,
- filtr relacji: z leadem / ze sprawą / bez relacji,
- liczniki wszystkich, wykonanych, przywróconych i usuniętych wpisów,
- czytelne etykiety dla nowych eventów z Dziś i Kalendarza,
- podgląd payload JSON,
- poprawny link do sprawy przez /cases/:id.

## Nowe zdarzenia rozpoznawane czytelnie

```text
calendar_entry_completed
calendar_entry_restored
calendar_entry_deleted
today_task_completed
today_task_restored
today_task_deleted
today_event_completed
today_event_restored
today_event_deleted
```

## Efekt

Aktywność przestaje być martwą listą techniczną. Staje się miejscem, gdzie użytkownik widzi, co realnie wydarzyło się w systemie i może szybko przejść do powiązanego leada albo sprawy.