---
typ: obsidian_project_update
project: CloseFlow / LeadFlow
stage: STAGE216C2
status: prepared_hotfix
date: 2026-06-01
---

# 2026-06-01 - CloseFlow Stage216-C2 AI drafts auth JSON hotfix

## FAKTY

- Stage216-C został zacommitowany i wypchnięty.
- Poprawiony runtime smoke przy działającym localhost wykazał jeden twardy FAIL: `/api/system?kind=ai-drafts&limit=5` zwrócił `500` z próbką `AUTHORIZATION_BEARER_REQUIRED`.
- Pozostałe endpointy Stage216-C były kontrolowane: `activities` 401 JSON, `assistant-context` 200 JSON, `profile-settings` i `workspace-settings` 405 JSON, `/api/me` 401 JSON.

## DECYZJE DAMIANA

- Nie używać `git add .`.
- Nie ruszać SQL/RLS/GRANT bez wyraźnej decyzji.
- Runtime 500 traktować jako wąski fix Stage216-C2.

## HIPOTEZY AI

- Przyczyna to nie Supabase schema ani dane, tylko mapowanie błędu auth w `src/server/ai-drafts.ts`.
- Handler powinien zachowywać się jak inne endpointy: brak Bearer tokena ma dawać kontrolowany 401 JSON, nie 500.

## TESTY

- `node scripts/check-stage216c2-ai-drafts-auth-json-hotfix.cjs`
- `npm run build`
- `node tools/stage216c-notifications-activity-ai-drafts-runtime-smoke.cjs --write`

## RYZYKA

- Jeżeli po hotfixie `ai-drafts` nadal daje 500, trzeba sprawdzić dokładny błąd w konsoli `vercel dev`.
- Nie mieszać tego z pełnym testem write AI Drafts, bo zatwierdzanie szkiców może tworzyć realne rekordy.

## NASTĘPNY KROK

Zastosować Stage216-C2, powtórzyć runtime smoke, zacommitować tylko hotfix + poprawiony runtime result, potem skopiować notatkę do Obsidiana.

## Zapis do Obsidiana

- nazwa / alias wejściowy: CloseFlow / LeadFlow, Stage216-C2
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: STAGE216C2_AI_DRAFTS_AUTH_JSON_HOTFIX_2026-06-01
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_LeadFlow
- typ wpisu: hotfix runtime auth JSON po Stage216-C
- docelowa ścieżka: 10_PROJEKTY/CloseFlow_LeadFlow/2026-06-01 - CloseFlow Stage216-C2 AI drafts auth JSON hotfix.md
- status zapisu: przygotowano ZIP
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- testy: guard, build, runtime smoke po hotfixie
- czego nie ruszano: SQL/RLS/GRANT, Google Calendar sync, backupy, Node_RED_Kabelki
- następny krok: apply ZIP i runtime smoke
