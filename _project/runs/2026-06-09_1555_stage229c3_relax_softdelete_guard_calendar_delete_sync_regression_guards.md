# Stage229C3 - relax soft-delete guard and close calendar delete sync guards

- data i godzina: 2026-06-09 15:55 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: guard repair / guard consolidation
- status: prepared by ZIP runner

## Powod

Stage229C2 doszedl do nowego guarda, ale guard byl zbyt kruchy: wymagal dokladnego stringa `status: 'deleted'` w bloku softDeleteTaskInSupabase. Istniejace Stage229A/R229B2 guardy przeszly, wiec to byl problem kontraktu guarda, nie runtime.

## Zakres

- Guard CJS sprawdza zachowanie zamiast dokladnego formatowania object literal.
- Nadal zabezpiecza: hidden flags, no-flicker delete, R25 hard-delete literal, pending_delete remote delete, SQL backfill.
- TSX nadal waliduje Vite build, nie node --check.

## Testy

- R25/R41/R229A/R229B2/R229C guards.
- R229B2/R229C tests.
- npm run build.
- git diff --check.

## Audyt ryzyk po etapie

- Ryzyko: guard behavior-based jest mniej kruchy, ale nadal sprawdza wszystkie krytyczne markery kontraktu.
- Ryzyko: jesli ktos usunie soft delete hidden flags albo pending_delete remote delete, guard nadal failuje.
