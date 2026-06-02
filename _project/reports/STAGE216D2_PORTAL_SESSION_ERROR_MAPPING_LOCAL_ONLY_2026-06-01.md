---
typ: project_report
stage: STAGE216D2
status: local_only_hotfix_prepared
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-D2 - Portal session error mapping local-only

## Routing

- canonical_name: CloseFlow / LeadFlow
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- tryb: local-only, bez git add, bez commit, bez push

## FAKTY

- Stage216-D smoke na Vercel wykazał kontrolowane JSON dla storage/portal routes.
- Twardy FAIL pozostał na:
  - /api/cases?id=__stage216d_smoke__&portalSession=__stage216d_smoke__
  - /api/case-items?caseId=__stage216d_smoke__&portalSession=__stage216d_smoke__
- Oba endpointy zwracały 500 zamiast kontrolowanego 403 dla błędnej sesji portalowej.

## DIAGNOZA

- api/cases.ts i api/case-items.ts wywołują requirePortalSessionContext.
- requirePortalSessionContext rzuca błędy PORTAL_SESSION_*.
- Catch w cases i case-items nie mapował PORTAL_SESSION_* na 403, więc fałszywy portalSession kończył jako 500.

## ZMIANA

- api/cases.ts: PORTAL_SESSION albo PORTAL_TOKEN -> 403 JSON.
- api/case-items.ts: PORTAL_SESSION albo PORTAL_TOKEN -> 403 JSON.
- CASE_NOT_FOUND zostaje 404.
- Reszta błędów zostaje 500.

## TESTY

- node scripts/check-stage216d2-portal-session-error-mapping-local-only.cjs
- npm run build
- lokalny runtime smoke Stage216-D po starcie npm run dev:api

## CZEGO NIE RUSZANO

- SQL/RLS/GRANT
- Google Calendar sync
- storage upload write
- dane runtime
- Node_RED_Kabelki
- git commit/push

## NASTĘPNY KROK

Uruchomić lokalny smoke. Oczekiwane: cases i case-items z fałszywym portalSession zwracają kontrolowane 403 JSON, nie 500.