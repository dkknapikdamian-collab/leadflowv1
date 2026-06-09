# Stage228R60B - runner quote repair and R25 contract

- data i godzina: 2026-06-09 12:35 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: runner repair / compatibility repair
- status: prepared by ZIP runner

## Powod

R60 zatrzymal sie w patcherze przez blad cytowania w lokalnym run-report string. R60B usuwa problem cytowania i przywraca kontrakt R25 dla hardDeleteTaskFromSupabase.

## Zakres

- hardDeleteTaskFromSupabase: const requestInit: RequestInit
- hardDeleteTaskFromSupabase: method DELETE
- hardDeleteTaskFromSupabase: apiRoute tasks
- no-flicker local delete emit zostaje
- softDeleteTaskInSupabase pozostaje domyslna sciezka deleteTaskFromSupabase

## Audyt ryzyk po etapie

- R25/R41 sa prebuild source-truth guardami i musza przejsc przed buildem.
- TSX nie jest sprawdzany przez node --check; sprawdza go Vite build.
