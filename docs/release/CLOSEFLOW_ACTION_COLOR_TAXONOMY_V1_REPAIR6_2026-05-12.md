# CLOSEFLOW_ACTION_COLOR_TAXONOMY_V1_REPAIR6_2026-05-12

## Cel

Naprawa przerwanego wdrożenia `Action Color Taxonomy V1` po błędach Repair4/Repair5.

## Zakres

Repair6 robi większą, samowystarczalną paczkę:

- czyta `package.json` w trybie BOM-safe,
- usuwa BOM przed `JSON.parse`,
- rejestruje `check:closeflow:action-colors:v1`,
- rejestruje `check:closeflow:action-colors:v1:repair6`,
- tworzy/odświeża `src/lib/action-visual-taxonomy.ts`,
- tworzy/odświeża `src/styles/action-color-taxonomy-v1.css`,
- dopina import CSS w `src/main.tsx`,
- mapuje warstwę wizualną dla: zadania, wydarzenia, notatki, follow-upy, deadline, spotkania, telefony, e-maile, płatności, system/default,
- dopina bezpieczne helpery w najważniejszych widokach aplikacji,
- unika błędu generatora z nested template literal, który wcześniej powodował `Unexpected identifier 'cf'`,
- odpala checki i build przed commitem.

## Pliki krytyczne

- `src/lib/action-visual-taxonomy.ts`
- `src/styles/action-color-taxonomy-v1.css`
- `src/main.tsx`
- `src/pages/Calendar.tsx`
- `src/pages/TasksStable.tsx`
- `src/pages/TodayStable.tsx`
- `src/pages/Activity.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/LeadDetail.tsx`
- `src/pages/CaseDetail.tsx`
- `src/lib/scheduling.ts`
- `src/lib/work-items/normalize.ts`

## Guardy

- `npm run check:closeflow:action-colors:v1`
- `npm run check:closeflow:action-colors:v1:repair6`
- `npm run build`

## Ograniczenie

To jest warstwa wizualnej taksonomii kolorów. Nie zmienia danych biznesowych, statusów, zapisu do Supabase ani logiki deadline/follow-up.
