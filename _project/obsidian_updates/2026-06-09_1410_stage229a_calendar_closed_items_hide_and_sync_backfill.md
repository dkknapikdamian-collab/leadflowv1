# Obsidian update - Stage229A

- data i godzina: 2026-06-09 14:10 Europe/Warsaw
- nazwa / alias wejsciowy: Stage229A / calendar closed items hide and sync backfill
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow / LeadFlow
- idea_id: nie dotyczy
- report_id: stage229a
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: DO_POTWIERDZENIA
- typ wpisu: Google Calendar sync repair / SQL backfill / risk audit
- status zapisu: przygotowane w repo przez ZIP, bez bezposredniego dostepu do lokalnego Obsidiana
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: Stage229A guard/test + build + diff-check; test reczny GCAL_REMOTE_DELETE_TASK_229B po deploy
- audyt ryzyk po etapie: done/deleted taski musza znikac z kalendarza; jesli Google nadal trzyma eventy, potrzebny Stage229B remote events.delete
- czego nie ruszano: AGENTS.md, _LOCAL_CHECKS, _project/GLOBAL_STAGE_PROBLEM_AUDIT_RULE.md
- nastepny krok: po wdrozeniu uruchomic SQL backfill i przetestowac task done/delete oraz event done/delete
