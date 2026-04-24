# Today priority reasons runtime fix

Data: 2026-04-24

## Problem

Na ekranie Dziś aplikacja wysypywała się błędem:

```text
ReferenceError: getTodayEntryPriorityReasons is not defined
```

To nie jest błąd bazy ani Supabase. To błąd frontendu: komponent Today używa helpera priorytetu, ale funkcja nie była bezpiecznie podpięta w module.

## Decyzja

Naprawa robi dwie rzeczy:

1. Today.tsx importuje getTodayEntryPriorityReasons z src/lib/today-v1-final.ts.
2. src/lib/today-v1-final.ts eksportuje getTodayEntryPriorityReasons, jeśli brakowało eksportu.

## Efekt

- ekran Dziś nie wywala całej aplikacji,
- szybkie priorytety na kafelkach dalej działają,
- release gate ma osobny test pilnujący tego błędu runtime.

## Ważne

Ten etap nie rusza SQL, nie zmienia danych i nie zmienia logiki Supabase.
