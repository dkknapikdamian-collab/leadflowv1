# Stage229C4 - finalize calendar delete sync regression guards

- data i godzina: 2026-06-09 16:15 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: guard repair / final guard consolidation
- status: prepared by ZIP runner

## Powod

Stage229C3 nadal byl zbyt kruchy: wymagal, aby softDeleteTaskInSupabase bezposrednio wolal PATCH task API path. Aktualny kod moze isc przez helpery, a Stage229A/R229B2 guardy juz potwierdzaja runtime kontrakty route/sync. Stage229C4 usuwa shape assertion i zostawia behavior markers.

## Zakres

- Guard zabezpiecza behavior: hidden flags, no-flicker emitter, R25 hard-delete literal, pending_delete remote delete, SQL backfill.
- Guard nie narzuca wewnetrznego ksztaltu softDeleteTaskInSupabase.
- Zachowuje cleanup duplicate savedRecord.

## Testy

- R25/R41/R229A/R229B2/R229C guards.
- R229B2/R229C tests.
- npm run build.
- git diff --check.

## Audyt ryzyk po etapie

- Ryzyko: guard nie lapie kazdego refaktoru wewnetrznej funkcji softDeleteTaskInSupabase, ale chroni publiczne kontrakty i krytyczne markery.
- Ryzyko: jesli hidden flags albo pending_delete remote delete znikna, guard failuje.
