# CloseFlow — Calendar Month Light + Selected Day Real Entries Repair2

## Problem

Po poprzednich naprawach pomieszaliśmy dwa różne miejsca:

1. Kafelki miesiąca, czyli miejsca w dniach, gdzie pojawiają się zadania/wydarzenia.
2. Dolną sekcję „Wybrany dzień”.

W kafelkach miesiąca wpisy mają być jasne, z czarnym tekstem.  
W dolnej sekcji mają pojawiać się realne wpisy z danego dnia, a nie sam skrót `Zad`.

## Naprawa

- wymusza jasne wpisy w kafelkach miesiąca,
- wymusza czarny tekst w kafelkach miesiąca,
- zawęża V4 DOM-normalizer tak, żeby nie dotykał prawdziwych kart `ScheduleEntryCard`,
- usuwa szeroki efekt V6, który robił „tylko Zad”,
- przywraca czytelność realnych kart pod kalendarzem.

## Nie rusza

- API,
- Supabase,
- danych,
- tworzenia,
- edycji,
- usuwania,
- sidebaru,
- routingu.
