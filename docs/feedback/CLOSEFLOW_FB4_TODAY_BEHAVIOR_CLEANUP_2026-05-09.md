# CLOSEFLOW_FB4_TODAY_BEHAVIOR_CLEANUP_2026-05-09

## Cel
Today ma działać jak centrum decyzyjne, a nie jako statyczny raport.

## Zakres
- Dotyczy tylko `src/pages/TodayStable.tsx`.
- Nie ruszać Today.tsx, źródeł danych ani routingu.
- Przycisk `Widok` jest porządkowany do action clusteru przy `Odśwież`.
- Kliknięcie kafla decyzyjnego otwiera jedną powiązaną listę, zwija pozostałe i przenosi aktywną listę na górę pod kaflami.
- Na mobile nie ma agresywnego scroll jump.
- Sekcja zadań używa nazwy zależnej od zawartości:
  - `Zadania do wykonania dziś`,
  - `Zadania do obsługi`,
  - `Zaległe zadania`.
- Zadania mają akcję `Zrobione` opartą o istniejący helper aktualizacji zadania.

## Bez zmian
- Brak zmian w `Today.tsx`.
- Brak zmian źródeł danych.
- Brak zmian routingu.
