# 2026-06-07 - Stage227C3B Client Case Missing Item Runtime Wiring

- data i godzina: 2026-06-07 17:45 Europe/Warsaw
- nazwa / alias wejściowy: Stage227C3B — Client + Case Missing Item Runtime Wiring
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: runtime wiring / quick action
- status zapisu: ZIP local-only
- testy: C3B/C3A/C2/F6/build/diff-check
- audyt ryzyk po etapie: Client zapisuje lekko do task/activity, Case zostaje przy case_items; brak wspólnej tabeli SQL jest decyzją zakresu, nie przeoczeniem
- czego nie ruszano: SQL, RLS, Supabase schema, finanse, kalendarz
- następny krok: manualny check ClientDetail i CaseDetail; potem push
