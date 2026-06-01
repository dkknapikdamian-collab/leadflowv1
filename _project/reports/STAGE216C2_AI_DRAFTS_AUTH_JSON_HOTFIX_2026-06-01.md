---
typ: project_report
stage: STAGE216C2
status: prepared_hotfix
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-C2 - AI drafts auth JSON hotfix

## Routing

- canonical_name: CloseFlow / LeadFlow
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian vault: C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT
- Obsidian folder: 10_PROJEKTY/CloseFlow_LeadFlow

## FAKTY

- Stage216-C guard i build przeszły.
- Runtime smoke przy żywym `npm run dev:api` wykazał twardy FAIL tylko na `/api/system?kind=ai-drafts&limit=5`.
- Odpowiedź była JSON, ale status wynosił 500 i próbka zawierała `AUTHORIZATION_BEARER_REQUIRED`.
- `/api/activities?limit=5` zwraca kontrolowane `401 JSON`.

## DIAGNOZA

`src/server/ai-drafts.ts` łapie błąd auth w ogólnym `catch` i zwraca `500`, mimo że brak Bearer tokena powinien być kontrolowanym `401 JSON`.

## ZMIANA

- Dodać import `writeAuthErrorResponse` z `./_supabase-auth.js`.
- W `catch` handlera AI drafts obsłużyć błędy z `error.code` albo `error.status` przez `writeAuthErrorResponse(res, error)`.
- Nie ruszać logiki GET/POST/PATCH/DELETE poza mapowaniem błędu auth.

## TESTY

- `node scripts/check-stage216c2-ai-drafts-auth-json-hotfix.cjs`
- `npm run build`
- `node tools/stage216c-notifications-activity-ai-drafts-runtime-smoke.cjs --write`

## OCZEKIWANY WYNIK RUNTIME

`/api/system?kind=ai-drafts&limit=5` powinien zwrócić `AUTH_REQUIRED_401` albo inny kontrolowany auth JSON, nie `SERVER_ERROR_500`.

## CZEGO NIE RUSZANO

- SQL/RLS/GRANT
- Google Calendar sync
- dane runtime
- backupy
- Node_RED_Kabelki

## NASTĘPNY KROK

Po PASS runtime smoke zacommitować hotfix i poprawiony wynik smoke. Potem skopiować notatkę do Obsidiana i wrócić do decyzji: Stage216-D Portal / Storage / Uploads QA albo dodatkowy wąski fix, jeśli smoke nadal pokaże 500.
