# STAGE227G1 — Today Reschedule Actions

## Cel
Zakładka Dziś ma używać tego samego wzorca szybkiego przesuwania terminów co Kalendarz.

## Zakres
- TodayStable:
  - dodać +1D, +3D, +1W do kart zadań i wydarzeń,
  - przesuwać terminy przez istniejące updateTaskInSupabase / updateEventInSupabase,
  - odświeżać dane przez mutation bus i refreshData,
  - usunąć teksty "Powód: ..." z Najbliższe 7 dni.
- WorkItemCard:
  - przyjąć shared shiftActions,
  - użyć klas wizualnych z Calendar selected-day action source.

## Poza zakresem
- Brak nowego SQL.
- Brak nowej integracji Google Calendar.
- Brak przebudowy modelu zadań/wydarzeń.

## Testy
- npm run check:stage227g1-today-reschedule-actions
- npm run test:stage227g1-today-reschedule-actions
- F6/C3B regression
- npm run build
- git diff --check

## Manual
- Dziś: przesunąć zadanie o +1D/+3D/+1W.
- Dziś: przesunąć wydarzenie o +1D/+3D/+1W.
- Sprawdzić Kalendarz, LeadDetail/ClientDetail/CaseDetail powiązane dane.
- Sprawdzić, czy tekst "Powód:" z Najbliższe 7 dni zniknął.
