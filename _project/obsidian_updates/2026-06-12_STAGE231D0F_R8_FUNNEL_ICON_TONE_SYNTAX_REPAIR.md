# 2026-06-12 — STAGE231D0F-R8 Funnel icon tone syntax repair

## Zapis do Obsidiana

- data i godzina: 2026-06-12 15:00 Europe/Warsaw
- nazwa / alias wejściowy: `STAGE231D0F-R8 — Funnel icon tone syntax repair`
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: `10_PROJEKTY/CloseFlow_Lead_App`
- typ wpisu: naprawa ZIP-a / etap kolorystyki ikon
- status zapisu: payload przygotowany w ZIP-ie
- repo: `dkknapikdamian-collab/leadflowv1`
- branch: `dev-rollout-freeze`
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- decyzja: układ Lejka zamrożony; zmieniamy wyłącznie kolorystykę ikon/kafelków przez source of truth
- testy: R8 syntax preflight + R8 guard/test + R6 guard jeśli istnieje + build + `git diff --check`
- audyt ryzyk po etapie: R7 padł przez błąd składni paczki; R8 dodaje `node --check`
- czego nie ruszano: SQL, kanban, drag/drop, Supabase, logika filtrów, układ Lejka
- następny krok: apply R8, manual QA `/funnel`, potem selektywny push
