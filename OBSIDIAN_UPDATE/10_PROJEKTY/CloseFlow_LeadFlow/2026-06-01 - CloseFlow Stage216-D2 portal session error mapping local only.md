---
typ: obsidian_project_update
project: CloseFlow / LeadFlow
stage: STAGE216D2
status: local_only_hotfix_prepared
date: 2026-06-01
---

# 2026-06-01 - CloseFlow Stage216-D2 portal session error mapping local only

## FAKTY

- Stage216-D produkcyjny smoke wykazał 500 na cases/case-items z fałszywym portalSession.
- Storage i portal session/token routes zwracały kontrolowany JSON.
- Stage216-D2 jest lokalnym hotfixem mapowania błędów, bez commita i bez pusha.

## DECYZJE DAMIANA

- Wdrażamy lokalnie.
- Na razie nie dajemy do gita.
- Nie używać git add .
- Nie ruszać SQL/RLS/GRANT.

## HIPOTEZY AI

- Przyczyną 500 jest brak mapowania PORTAL_SESSION_* na 403 w catch endpointów cases i case-items.
- Po fixie fałszywa sesja portalowa powinna dawać 403 JSON.

## TESTY

- node scripts/check-stage216d2-portal-session-error-mapping-local-only.cjs
- npm run build
- node tools/stage216d-portal-storage-uploads-runtime-smoke.cjs --write

## RYZYKA

- Efekt produkcyjny będzie widoczny dopiero po późniejszym batchowym commicie/pushu/deployu.
- Lokalny Vercel dev na Windows może nadal zgłaszać watcher EPERM, ale endpointy można sprawdzać curl/smoke.

## NASTĘPNY KROK

Uruchomić lokalny smoke i potwierdzić, że cases/case-items przechodzą z SERVER_ERROR_500 na 403 JSON.