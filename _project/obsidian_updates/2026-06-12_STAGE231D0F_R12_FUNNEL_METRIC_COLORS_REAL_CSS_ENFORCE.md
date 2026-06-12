# 2026-06-12 — STAGE231D0F-R12 Funnel metric colors real CSS enforce

## Zapis do Obsidiana

- data i godzina: 2026-06-12 18:30 Europe/Warsaw
- nazwa / alias wejściowy: `STAGE231D0F-R12 — Funnel metric colors real CSS enforce`
- entity_id: E_CLOSEFLOW_DO_POTWIERDZENIA
- workspace_id: W_CLOSEFLOW_DO_POTWIERDZENIA
- project_id: P_CLOSEFLOW_DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: nie dotyczy
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
- mapa główna / pulpit: DO_POTWIERDZENIA
- mapa zależności: `_project/06_GUARDS_AND_TESTS.md` + UI Dictionary
- ściąga plików: `_project/UI_DICTIONARY_STAGE231D0A.md`
- typ wpisu: bugfix UI / real CSS color enforcement
- docelowa ścieżka: `_project/obsidian_updates/2026-06-12_STAGE231D0F_R12_FUNNEL_METRIC_COLORS_REAL_CSS_ENFORCE.md`
- status zapisu: payload przygotowany w ZIP-ie
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- testy: R12 guard/test + build + `git diff --check`
- audyt ryzyk po etapie: visual QA required; CSS cascade can still mask icon colors
- czego nie ruszano: SQL, kanban, drag/drop, Supabase, logika filtrów, layout Lejka
- następny krok: apply R12, manual QA `/funnel`, push po akceptacji
