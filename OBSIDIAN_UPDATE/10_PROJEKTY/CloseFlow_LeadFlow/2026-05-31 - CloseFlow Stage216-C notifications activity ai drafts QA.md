---
typ: obsidian_project_update
project: CloseFlow / LeadFlow
stage: STAGE216C
status: prepared_qa_smoke
date: 2026-05-31
---

# 2026-05-31 - CloseFlow Stage216-C notifications activity ai drafts QA

## FAKTY

- Stage216-B jest zamknięty: guard PASS, build PASS, runtime smoke JSON/auth controlled, commit 380707a0.
- Aktualny etap to Stage216-C: QA/smoke dla NotificationsCenter, Activity i AiDrafts po migracji Supabase.
- Skan lokalny: 17/19 oczekiwanych plików dostępnych.
- Braki: _project/reports/STAGE213C_A_NOTIFICATIONS_QUERY_BUDGET_2026-05-31.md, _project/reports/STAGE213C_C_TODAY_STABLE_FOCUS_VISIBILITY_THROTTLE_2026-05-31.md.

## DECYZJE DAMIANA

- Nie używać git add .
- Nie robić push bez PASS testów i wpisu Obsidian/_project.
- Nie ruszać zmian bazodanowych/polityk dostępu bez wyraźnej decyzji.
- Etap ma być najpierw QA/smoke, nie naprawą wszystkiego naraz.

## HIPOTEZY AI

- Największe ryzyko w Stage216-C to rozjazd auth/workspace/JSON na /api/activities i /api/system?kind=ai-drafts oraz powrót nadmiarowego odświeżania NotificationsCenter.
- 401/403 JSON jest akceptowalne w runtime smoke bez sesji, bo potwierdza endpoint JSON i kontrolowany auth.
- 500, HTML albo Vite source response powinny uruchomić Stage216-C2.

## DO POTWIERDZENIA

- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- czy fizyczny Obsidian vault ma osobny commit po skopiowaniu notatki
- czy AI Drafts mają być testowane tylko GET-only, czy później osobnym kontrolowanym testem write sandbox

## TESTY

- node scripts/check-stage216c-notifications-activity-ai-drafts-qa.cjs
- npm run build
- node tools/stage216c-notifications-activity-ai-drafts-runtime-smoke.cjs --write

## RYZYKA

- Repo ma dużo lokalnych backupów i plików .bak. Nie wolno ich przypadkiem dodać.
- Vault Obsidiana ma niezależne zmiany Node_RED_Kabelki. Nie commitować vaulta globalnie przy CloseFlow.
- Zatwierdzanie szkiców AI może tworzyć realne rekordy lead/task/event/note, więc Stage216-C jest GET-only/QA-first.

## NASTĘPNY KROK

Uruchomić Stage216-C lokalnie. Jeżeli smoke przejdzie, iść do Stage216-D Portal / Storage / Uploads QA. Jeżeli smoke znajdzie konkretny FAIL, przygotować Stage216-C2 jako wąski fix.

## Zapis do Obsidiana

- nazwa / alias wejściowy: CloseFlow / LeadFlow, Stage216-C
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: STAGE216C_NOTIFICATIONS_ACTIVITY_AI_DRAFTS_QA_2026-05-31
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_LeadFlow
- mapa główna / pulpit: DO_POTWIERDZENIA
- mapa zależności: DO_POTWIERDZENIA
- ściąga plików: DO_POTWIERDZENIA
- typ wpisu: QA/smoke po migracji Supabase
- docelowa ścieżka: 10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage216-C notifications activity ai drafts QA.md
- status zapisu: przygotowano ZIP
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: check Stage216-C, build, runtime smoke GET-only, ręczne QA
- czego nie ruszano: zmiany bazodanowe/polityki dostępu, Google Calendar sync, backupy, dane runtime
- następny krok: apply ZIP i runtime smoke
