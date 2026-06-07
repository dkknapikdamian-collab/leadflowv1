# 2026-06-07 - Stage227G1 Today Reschedule Actions

- data i godzina: 2026-06-07 18:05 Europe/Warsaw
- nazwa / alias wejściowy: Stage227G1 — Today Reschedule Actions
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: UI/runtime wiring / Today action source of truth
- status zapisu: ZIP local-only
- testy: G1/F6/C3B/build/diff-check
- audyt ryzyk po etapie: Google Calendar wymaga istniejącego outbound sync; jeśli brak, nie obiecywać synchronizacji z Google
- czego nie ruszano: SQL, RLS, Supabase schema, braki C3, finanse
- następny krok: manualny check Today + Calendar + powiązane rekordy; potem push
