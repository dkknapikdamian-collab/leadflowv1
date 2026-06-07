# 2026-06-07 - Stage227C3A Lead Missing Item Runtime Wiring

- data i godzina: 2026-06-07 17:30 Europe/Warsaw
- nazwa / alias wejściowy: Stage227C3A - Lead Missing Item Runtime Wiring
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: quick action runtime wiring
- decyzja: Brak w LeadDetail zapisuje lekki wpis missing_item jako task + activity, bez nowej tabeli
- status zapisu: przygotowane w repo _project/obsidian_updates
- testy: C3A/C2/F6/build/diff-check
- audyt ryzyk po etapie: etap nie podpina jeszcze ClientDetail i CaseDetail; następny etap C3B ma zrobić Client/Case, Case przez case_items
- czego nie ruszano: SQL, Supabase schema, finanse, kalendarz, zapis case_items
- następny krok: manualny test LeadDetail; potem Stage227C3B Client+Case runtime wiring
