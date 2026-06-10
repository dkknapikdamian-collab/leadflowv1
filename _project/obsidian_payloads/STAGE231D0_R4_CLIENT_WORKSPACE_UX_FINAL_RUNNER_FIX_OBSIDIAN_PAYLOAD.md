# Zapis do Obsidiana — STAGE231D0-R4

- data i godzina: 2026-06-10 18:55 Europe/Warsaw
- nazwa / alias wejściowy: STAGE231D0-R4 — Client workspace UX final runner fix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: STAGE231D0_R4_CLIENT_WORKSPACE_UX_FINAL_RUNNER_FIX_RUN
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- mapa główna / pulpit: DO_POTWIERDZENIA
- mapa zależności: _project/VISUAL_SOURCE_OF_TRUTH.md
- ściąga plików: _project/VISUAL_SOURCE_OF_TRUTH.md
- typ wpisu: etap UI / rescue runner / mojibake guard
- docelowa ścieżka: _project/obsidian_payloads/STAGE231D0_R4_CLIENT_WORKSPACE_UX_FINAL_RUNNER_FIX_OBSIDIAN_PAYLOAD.md
- status zapisu: przygotowane w repo i kopiowane do lokalnego vaulta, jeśli folder istnieje
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: D0 guard/test, D0A regression, Polish guard, build, git diff --check
- audyt ryzyk po etapie: ryzyko fallback rename dla duplikatu aria-label; brak zmian SQL/danych
- czego nie ruszano: SQL, Supabase, Google Calendar, koszty, delete/restore, model prowizji
- następny krok: STAGE231D1 — model kosztów

## VISUAL SOURCE OF TRUTH

- D0 korzysta z D0A Visual Source of Truth.
- Ikona finansów klienta ma pochodzić z centralnego mapowania EntityIcon jako payment, nie z lokalnej ikony sprawy.
- Kafle klienta, sprawy, finanse, badge i akcje muszą pozostać spójne z _project/VISUAL_SOURCE_OF_TRUTH.md.
