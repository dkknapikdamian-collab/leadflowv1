# 2026-06-12 — STAGE231D0F-R2 Funnel color/icon/filter parity

## Zapis do Obsidiana

- data i godzina: 2026-06-12 15:00 Europe/Warsaw
- nazwa / alias wejściowy: `STAGE231D0F-R2 — Funnel color/icon/filter parity`
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
- typ wpisu: kontrakt etapu UI / Lejek visual parity
- status zapisu: payload przygotowany w ZIP-ie
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- decyzja: Lejek zachowuje koncepcję owner decision list, ale dostaje jawny color/icon map i filter strip zgodny z Klientami
- testy: R2 guard/test + D0F regression guard/test + build + `git diff --check`
- audyt ryzyk po etapie: nie tworzyć drugiego systemu filtrów; nie zmienić Lejka w kanban
- czego nie ruszano: SQL, drag/drop, kanban, Supabase, logika filtrów
- następny krok: manual QA `/funnel`, potem selektywny push bez STAGE231D0E
