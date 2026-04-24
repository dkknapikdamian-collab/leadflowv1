# Today restore completed label

Data: 2026-04-24

## Problem

Ekran Dziś miał już logikę przywracania wykonanych zadań i wydarzeń, ale przycisk wykonania nie musiał jasno pokazywać, że wpis można przywrócić.

## Decyzja

Na ekranie Dziś przycisk wykonania działa czytelnie:

```text
aktywny wpis -> Zrobione
wykonany wpis -> Przywróć
```

## Efekt w UI

- Aktywne zadanie pokazuje „Zrobione”.
- Wykonane zadanie pokazuje „Przywróć”.
- Aktywne wydarzenie pokazuje „Zrobione”.
- Wykonane wydarzenie pokazuje „Przywróć”.
- Logika pozostaje spójna z kalendarzem.
