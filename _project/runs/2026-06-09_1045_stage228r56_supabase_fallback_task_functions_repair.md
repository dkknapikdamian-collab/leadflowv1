# Stage228R56 — supabase-fallback task function syntax repair

- data i godzina: 2026-06-09 10:45 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow
- typ wpisu: run report / build repair / guard stack continuation

## Cel

Naprawić drugi uszkodzony fragment składni w src/lib/supabase-fallback.ts po częściowych etapach R50-R55.

## Zakres

- Przepisano cały blok funkcji:
  - updateTaskInSupabase
  - hardDeleteTaskFromSupabase
  - softDeleteTaskInSupabase
  - deleteTaskFromSupabase
- Zachowano updateEventInSupabase jako anchor za blokiem.
- Dodano guard R56 sprawdzający pełny porządek funkcji, brak ogonów typu `}) {`, poprawne `taskId` i `node --check src/lib/supabase-fallback.ts`.

## Testy

Do wykonania w runnerze:
- node --check src/lib/supabase-fallback.ts
- R47-R56 guard stack
- R47-R56 tests
- npm run build
- git diff --check
- git diff --cached --check

## Audyt ryzyk

- Ryzyko: endpoint hard delete musi pozostać zgodny z /api/work-items.
- Ryzyko: soft delete emituje lokalny no-flicker event przed potwierdzeniem API; rollback obsługuje TasksStable, LeadDetail wymaga testu ręcznego.
- Test ręczny po deployu: CF_DEL_TEST_4 → dodaj → usuń → refresh.
