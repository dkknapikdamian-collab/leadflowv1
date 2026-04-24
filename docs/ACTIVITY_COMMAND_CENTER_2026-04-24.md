# Activity command center

Data: 2026-04-24

## Problem

Po dodaniu activity logĂłw z ekranu DziĹ› i Kalendarza ekran AktywnoĹ›Ä‡ nie mĂłgĹ‚ zostaÄ‡ prostÄ… listÄ…. Operator potrzebuje szybko odsiaÄ‡ wykonane, przywrĂłcone, usuniÄ™te oraz znaleĹşÄ‡ wpis po leadzie, sprawie albo tytule.

## Decyzja

Ekran AktywnoĹ›Ä‡ dziaĹ‚a jako panel historii operacyjnej.

## Zakres wdroĹĽenia

Dodano:

- wyszukiwarkÄ™,
- filtr ĹşrĂłdĹ‚a: wszystko / DziĹ› / Kalendarz / Lead / Sprawa / Inne,
- filtr typu: wykonane / przywrĂłcone / usuniÄ™te / utworzone / aktualizacje,
- filtr relacji: z leadem / ze sprawÄ… / bez relacji,
- liczniki wszystkich, wykonanych, przywrĂłconych i usuniÄ™tych wpisĂłw,
- czytelne etykiety dla nowych eventĂłw z DziĹ› i Kalendarza,
- podglÄ…d payload JSON,
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

AktywnoĹ›Ä‡ przestaje byÄ‡ martwÄ… listÄ… technicznÄ…. Staje siÄ™ miejscem, gdzie uĹĽytkownik widzi, co realnie wydarzyĹ‚o siÄ™ w systemie i moĹĽe szybko przejĹ›Ä‡ do powiÄ…zanego leada albo sprawy.