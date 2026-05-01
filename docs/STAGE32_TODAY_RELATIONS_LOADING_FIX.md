# Stage 32 — Dziś: relacje i loading

## Cel

Lokalna poprawka widoku `Dziś`:

- wyrównać tekst w sekcji `Najcenniejsze relacje`,
- ustawić nazwę rekordu i typ `Lead / Klient / Sprawa` w stałym układzie,
- dodać kolorowe znaczniki typu relacji,
- poprawić stan ładowania, żeby zamiast gołego napisu `Dziś w skrócie` był czytelny loading.

## Zakres

Dodane / zmienione lokalnie:

- `src/lib/stage32-today-relations-loading-polish.ts`
- `tests/today-stage32-relations-loading-polish.test.cjs`
- `docs/STAGE32_TODAY_RELATIONS_LOADING_FIX.md`
- `src/pages/Today.tsx`
- `tests/today-stage31-tiles-interaction.test.cjs` — tylko naprawa testu po wadliwym regexie z v5.

## Nie zmieniono

- API,
- Supabase,
- auth,
- billing,
- danych,
- routingu,
- pushowania do GitHub.

## Weryfikacja

Skrypt lokalny odpala:

```powershell
node --test tests/today-stage31-tiles-interaction.test.cjs tests/today-stage32-relations-loading-polish.test.cjs
npm.cmd run build
```

## Kryterium zakończenia

- Build przechodzi.
- Testy Stage31/Stage32 przechodzą.
- W UI sekcja relacji wygląda czytelniej.
- Stan ładowania `Dziś` nie pokazuje surowego, pustego napisu.
