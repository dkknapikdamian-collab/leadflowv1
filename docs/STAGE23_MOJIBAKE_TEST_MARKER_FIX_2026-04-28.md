# Stage 23 - mojibake marker fix w testach

## Cel

Po Stage 22 aplikacja przechodzila build i test Stage 22, ale `verify:closeflow:quiet` zatrzymywal sie na audycie kodowania. Problem nie byl w UI ani logice aplikacji. Czesc testow zawierala literalne znaki-marker uzywane do wykrywania blednego kodowania, a globalny audyt repozytorium wykrywal je jako realne naruszenie.

## Zmieniono

- Patch przechodzi po plikach `tests/*.cjs` i zamienia literalne markery na zapisy Unicode escape.
- Dodano lekki test Stage 23, ktory sprawdza, czy testy nie zawieraja literalnych markerow.

## Nie zmieniono

- Brak zmian w dzialaniu aplikacji.
- Brak zmian w formularzach, billing logic, AI drafts i Supabase sync.
- Brak zmian w SQL Stage 19.

## Po wdrozeniu sprawdz

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/mojibake-test-marker-fix-stage23.test.cjs
```

## SQL

Do recznego uruchomienia w Supabase nadal pozostaje:

```text
sql/2026-04-28_ai_drafts_supabase_ready.sql
```
