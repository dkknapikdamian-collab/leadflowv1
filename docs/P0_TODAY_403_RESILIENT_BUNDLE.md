# P0 — Today 403 resilient bundle

## Problem

Zakładka **Dziś** mogła pokazać tylko Szkice AI, gdy jeden z endpointów czytających dane zwrócił 403.

Najbardziej ryzykowna ścieżka była w `src/lib/calendar-items.ts`:

- `fetchTasksFromSupabase()`
- `fetchEventsFromSupabase()`

Te dwa requesty nie miały lokalnego `.catch(() => [])`, więc jeden błąd 403 potrafił wywrócić cały bundle ekranu Dziś. Leady i sprawy miały już lokalne zabezpieczenie.

## Zmiana

`fetchCalendarBundleFromSupabase()` degraduje teraz każdą kolekcję osobno:

- taski,
- wydarzenia,
- sprawy,
- leady.

Jeśli jeden endpoint zwróci 403, Dziś dalej renderuje pozostałe dane zamiast pustego ekranu z samymi szkicami.

## Czego nie zmieniono

- Nie zmieniono UI.
- Nie zmieniono access gate.
- Nie wyłączono 403 globalnie.
- Nie ukryto błędu zapisu.
- Nie zmieniono modelu danych.

## Weryfikacja

- `npm.cmd run check:p0-today-loader-supabase-api`
- `node scripts/check-p0-today-bundle-resilient.cjs`
- `npm.cmd run check:polish-mojibake`
- `npm.cmd run test:critical`

## Następny krok diagnostyczny

Jeśli po tej poprawce Dziś nadal nie pokazuje danych, trzeba w DevTools → Network sprawdzić dokładny endpoint 403. Ta poprawka nie zastępuje naprawy accessu, tylko blokuje efekt domina na ekranie Dziś.
