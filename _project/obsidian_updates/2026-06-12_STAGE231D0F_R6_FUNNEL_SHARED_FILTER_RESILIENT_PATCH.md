# 2026-06-12 — STAGE231D0F-R6 Funnel shared filter resilient patch

## Zapis do Obsidiana

- data i godzina: 2026-06-12 15:00 Europe/Warsaw
- nazwa / alias wejściowy: `STAGE231D0F-R6 — Funnel shared filter resilient patch`
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
- typ wpisu: naprawa paczki UI / wspólne filtry
- status zapisu: payload przygotowany w ZIP-ie
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- decyzja: patchować `FunnelStageFilterChip` po stabilnych markerach, nie po całym JSX przycisku
- testy: R6 guard/test + R3 guard/test jeśli istnieje + build + `git diff --check`
- audyt ryzyk po etapie: local tree ma wcześniejsze ślady failed packages; push tylko selektywny
- czego nie ruszano: SQL, kanban, drag/drop, Supabase, logika filtrów, STAGE231D0E
- następny krok: apply R6, manual QA `/funnel` i `/clients`, potem selektywny push
