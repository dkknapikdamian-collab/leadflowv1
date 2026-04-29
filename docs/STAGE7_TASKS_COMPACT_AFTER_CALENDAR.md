# Stage 7 — Zadania: kompaktowy widok operacyjny + spójność z kalendarzem

## Cel
Doprowadzić zakładkę `Zadania` do poziomu nowego kalendarza: kompaktowe wpisy, małe akcje, czytelny typ/status/termin/powiązanie i brak szerokich belek.

## Zmienione obszary
- `src/pages/Tasks.tsx`
- `src/index.css`
- `src/styles/visual-stage30-tasks-compact-after-calendar.css`
- `tests/stage7_tasks_compact_after_calendar.test.cjs`

## Zakres zmian
- Widoki operacyjne: `Aktywne`, `Dziś`, `Ten tydzień`, `Zaległe`, `Zrobione`.
- Kompaktowy wiersz zadania w układzie: typ, tytuł/meta, termin, status, akcje.
- Powiązania w wierszu: lead, sprawa, klient albo brak powiązań.
- Małe akcje: `Edytuj`, `+1H`, `+1D`, `+1W`, `Zrobione`, `Usuń`.
- Sortowanie aktywnych wpisów: zaległe, dziś, wysoki priorytet, najbliższy termin, bez terminu, reszta.
- Przesuwanie terminów przez `+1H`, `+1D`, `+1W` używa istniejącego `updateTaskInSupabase`, więc zmiany są widoczne w `Calendar` i `Today` po odświeżeniu danych.

## Poza zakresem
- Brak zmian w Supabase schema.
- Brak zmian w auth, billing, sidebarze i routingu.
- Brak zmian w logice lead -> sprawa.
- Brak zmian w kalendarzu poza regresją przez wspólny model tasków.

## Test ręczny
1. Wejdź na `/tasks` desktop.
2. Wejdź na `/tasks` mobile.
3. Kliknij `Edytuj`.
4. Kliknij `+1H`, `+1D`, `+1W`.
5. Kliknij `Zrobione`.
6. Kliknij `Usuń`.
7. Sprawdź, czy zmiany widać w `/calendar`.
8. Sprawdź, czy zmiany widać w `/today`.
