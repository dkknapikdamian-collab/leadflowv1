# 2026-06-12 — STAGE231D0F-R6 Funnel UI Dictionary guard repair

## Zapis do Obsidiana

- data i godzina: 2026-06-12 15:00 Europe/Warsaw
- nazwa / alias wejściowy: `STAGE231D0F-R6 — Funnel UI Dictionary guard repair`
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
- typ wpisu: naprawa guardu/pamięci projektu
- status zapisu: payload przygotowany w ZIP-ie
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- decyzja: R5 runtime jest poprawiony; R6 naprawia tylko UI Dictionary / guard scope
- testy: R6 guard/test + R5/R4/R3 guard/test + R2 guard/test jeśli istnieją + build + `git diff --check`
- audyt ryzyk po etapie: local tree ma wcześniejsze ślady failed packages; push tylko selektywny
- czego nie ruszano: logika filtrów, SQL, kanban, drag/drop, Supabase, STAGE231D0E
- następny krok: apply R6, manual QA `/funnel`, potem selektywny push
