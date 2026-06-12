# 2026-06-12 — STAGE231D0F-R5 Funnel records header line repair

## Zapis do Obsidiana

- data i godzina: 2026-06-12 15:00 Europe/Warsaw
- nazwa / alias wejściowy: `STAGE231D0F-R5 — Funnel records header line repair`
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
- typ wpisu: naprawa paczki wdrożeniowej / Lejek records header
- status zapisu: payload przygotowany w ZIP-ie
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- decyzja: stary dwuliniowy nagłówek rekordów Lejka usunąć liniowo; zostaje jeden wiersz
- testy: R5 guard/test + R4/R3 guard/test + R2 guard/test jeśli istnieją + build + `git diff --check`
- audyt ryzyk po etapie: local tree ma wcześniejsze ślady failed packages; push tylko selektywny
- czego nie ruszano: logika filtrów, SQL, kanban, drag/drop, Supabase, STAGE231D0E
- następny krok: apply R5, manual QA `/funnel`, potem selektywny push
