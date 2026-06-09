# Stage228R61 - restore literal api system tasks contract

- data i godzina: 2026-06-09 12:55 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: compatibility repair / prebuild guard repair
- status: prepared by ZIP runner

## Powod

Lokalny guard R25 wymaga literalnego stringa /api/system?apiRoute=tasks&id= oraz method DELETE w src/lib/supabase-fallback.ts. R60B uzywal helpera apiRoute('tasks'), wiec guard nadal failowal.

## Zakres

- hardDeleteTaskFromSupabase uzywa literalnego /api/system?apiRoute=tasks&id=
- hardDeleteTaskFromSupabase zachowuje const requestInit: RequestInit i method DELETE
- softDeleteTaskInSupabase i deleteTaskFromSupabase zostaja bez cofania no-flicker
- dodany guard/test R61 na dokladny kontrakt R25

## Audyt ryzyk po etapie

- Ryzyko: literal R25 jest kruchy, ale jest obecnym prebuild source-truth i trzeba go zachowac do czasu kontrolowanej zmiany guardu.
- Ryzyko: hard delete i soft delete sa dwiema sciezkami; domyslna sciezka deleteTaskFromSupabase nadal idzie soft-delete.
