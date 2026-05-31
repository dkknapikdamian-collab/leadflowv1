---
typ: obsidian_project_update
project: CloseFlow / LeadFlow
stage: STAGE216B
status: prepared_qa_smoke
date: 2026-05-31
---

# 2026-05-31 - CloseFlow Stage216-B tasks events calendar QA

## FAKTY

- Stage216-A5 jest traktowany jako OK według ręcznego testu Damiana: start obsługi leada nie blokuje się już na błędzie RPC v_client.
- Aktualny etap to Stage216-B: QA/smoke dla zadań, wydarzeń i kalendarza po migracji Supabase.
- Tryb pracy: ZIP-first, lokalne wdrożenie, testy, potem targetowany commit/push.
- Skan lokalny wykonano: 2026-05-31T21:37:25.625Z.
- Dostępne pliki w skanie: 18/18.

## DECYZJE DAMIANA

- Nie robić push bez PASS testów i wpisu Obsidian/_project.
- Nie używać masowego stage'owania repo.
- Nie ruszać SQL/RLS/GRANT bez wyraźnej decyzji.
- Ten etap ma być najpierw QA/smoke, nie naprawą wszystkiego naraz.

## HIPOTEZY AI

- Największe ryzyko po Stage216-A5 to nie pojedynczy komponent UI, tylko rozjazd route/API/auth JSON dla tasks/events/calendar.
- 401/403 JSON jest lepszym wynikiem niż INVALID_API_RESPONSE, HTML albo Vite source response.
- Jeżeli runtime znajdzie 500, kolejny etap powinien być Stage216-B2 i naprawiać dokładnie ten endpoint/warstwę.

## DO POTWIERDZENIA

- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- faktyczny workspace UUID do runtime smoke
- faktyczny routing produkcyjny tasks/events, jeżeli nie jest jednym z kandydatów smoke

## TESTY

- node scripts/check-stage216b-tasks-events-calendar-qa.cjs
- npm run build
- node tools/stage216b-tasks-events-calendar-runtime-smoke.cjs --write

## RYZYKA

- Runtime bez auth może dać 401/403 i to jest akceptowalne tylko wtedy, gdy odpowiedź jest JSON-em.
- Vite source response oznacza błąd trybu uruchomienia albo rewrite/API, nie błąd danych.
- 500 jest twardym FAIL i nie powinien być przykrywany pustym stanem UI.

## NASTĘPNY KROK

Uruchomić Stage216-B lokalnie. Jeżeli smoke przejdzie, iść do Stage216-C: Notifications / Activity / AI drafts QA. Jeżeli smoke znajdzie konkretny FAIL, przygotować Stage216-B2 jako wąski fix.

## Zapis do Obsidiana

- nazwa / alias wejściowy: CloseFlow / LeadFlow, Stage216-B
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: STAGE216B_TASKS_EVENTS_CALENDAR_QA_2026-05-31
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_LeadFlow
- mapa główna / pulpit: DO_POTWIERDZENIA
- mapa zależności: DO_POTWIERDZENIA
- ściąga plików: DO_POTWIERDZENIA
- typ wpisu: QA/smoke po migracji Supabase
- docelowa ścieżka: 10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage216-B tasks events calendar QA.md
- status zapisu: przygotowano ZIP
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: check Stage216-B, build, runtime smoke GET-only, ręczne QA
- czego nie ruszano: SQL/RLS/GRANT, Google Calendar sync, backupy, dane runtime
- następny krok: apply ZIP i runtime smoke
