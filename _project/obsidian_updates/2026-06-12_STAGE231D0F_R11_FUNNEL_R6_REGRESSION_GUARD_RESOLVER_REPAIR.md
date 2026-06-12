# 2026-06-12 — STAGE231D0F-R11 Funnel R6 regression guard resolver repair

## Zapis do Obsidiana

- data i godzina: 2026-06-12 15:00 Europe/Warsaw
- nazwa / alias wejściowy: `STAGE231D0F-R11 — Funnel R6 regression guard resolver repair`
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
- typ wpisu: naprawa guarda regresji
- status zapisu: payload przygotowany w ZIP-ie
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- decyzja: po R8 kolorystyka idzie przez `resolveCloseflowMetricIconTone`; R6 guard nie może wymagać starych literalów `tone: '...'`
- testy: R11/R10/R9/R8/R6 guard/test + build + `git diff --check`
- audyt ryzyk po etapie: local tree ma wcześniejsze ślady failed packages; push tylko selektywny
- czego nie ruszano: SQL, kanban, drag/drop, Supabase, logika filtrów, layout Lejka
- następny krok: apply R11, manual QA `/funnel`, potem selektywny push
