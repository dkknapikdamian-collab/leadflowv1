# P0 — Tasks stable rebuild

## Problem

Zakładka `Zadania` potrafiła ładować dane dopiero po odświeżeniu. Przyczyną był stary ekran `Tasks.tsx`, który nadal miał warstwę legacy opartą o Firebase `auth.currentUser` jako bramkę pierwszego loadera.

Po przejściu na Supabase auth dane z `/api/tasks` były dostępne, ale ekran mógł nie odpalić loadera przy pierwszym wejściu w zakładkę.

## Decyzja

Dodano stabilny ekran `TasksStable.tsx` i przełączono route `/tasks` na nowy ekran.

## Zakres

- `src/pages/TasksStable.tsx`
- `src/App.tsx`
- `scripts/check-p0-tasks-stable-rebuild.cjs`

## Czego nie ruszono

- Nie usunięto starego `Tasks.tsx`, aby rollback był prosty.
- Nie zmieniono API.
- Nie zmieniono Supabase.
- Nie zmieniono migracji.

## Reguły widoku

- Ekran czyta zadania przez `fetchTasksFromSupabase()` bez bramki Firebase.
- Dane odświeżają się przy wejściu, focusie i powrocie karty.
- Dostępne są podstawowe operacje: dodanie, edycja, oznaczenie jako zrobione/przywrócenie i usunięcie.
