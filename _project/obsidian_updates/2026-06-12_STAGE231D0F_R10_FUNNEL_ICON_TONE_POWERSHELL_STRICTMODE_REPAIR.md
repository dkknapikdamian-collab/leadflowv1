# 2026-06-12 — STAGE231D0F-R10 Funnel icon tone PowerShell StrictMode repair

## Zapis do Obsidiana

- data i godzina: 2026-06-12 15:00 Europe/Warsaw
- nazwa / alias wejściowy: `STAGE231D0F-R10 — Funnel icon tone PowerShell StrictMode repair`
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
- typ wpisu: naprawa apply-scriptu / StrictMode
- status zapisu: payload przygotowany w ZIP-ie
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- decyzja: R8 runtime jest poprawiony; R10 naprawia wyłącznie PowerShell StrictMode/package script add
- testy: R10/R9/R8 guard/test + R6 guard jeśli istnieje + build + `git diff --check`
- audyt ryzyk po etapie: local tree ma wcześniejsze ślady failed packages; push tylko selektywny
- czego nie ruszano: SQL, kanban, drag/drop, Supabase, logika filtrów, layout Lejka
- następny krok: apply R10, manual QA `/funnel`, potem selektywny push
