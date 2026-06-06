# STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX — aktualizacja Obsidiana

- data i godzina: 2026-06-06 15:05 Europe/Warsaw
- nazwa / alias wejściowy: Stage226R11B — Google Calendar timezone test cross-realm fix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
- report_id: STAGE226R11B_GCAL_TIMEZONE_TEST_CROSS_REALM_FIX_REPORT
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- typ wpisu: test-fix po R11 apply
- docelowa ścieżka: centralne testy/ryzyka/historia/kierunek projektu
- status zapisu: przygotowane w ZIP i _project/obsidian_updates
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: R11 guard/test, regresje R10, build, verify, diff check
- audyt ryzyk po etapie: false negative testu; logika R11 nadal wymaga ręcznego smoke Google Calendar po deployu
- czego nie ruszano: Stage227, finanse, RLS, schema, AI Drafts
- następny krok: push po PASS, potem ręczny smoke Google Calendar
