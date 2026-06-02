---
typ: runtime_smoke_result
stage: STAGE216D
project: CloseFlow / LeadFlow
app_url: http://localhost:3000
created_at: 2026-06-01T10:36:27.858Z
mode: local-only
---

# Stage216-D runtime smoke result

## Endpointy GET-only

| Endpoint | Status | Content-Type | Klasyfikacja | Próbka |
|---|---:|---|---|---|
| /api/storage-upload-health | 500 | application/json; charset=utf-8 | CONFIG_REQUIRED_500 | {"ok":false,"error":"PORTAL_STORAGE_HEALTH_SECRET_MISSING"} |
| /api/storage-upload | 500 | application/json; charset=utf-8 | CONFIG_REQUIRED_500 | {"ok":false,"error":"PORTAL_STORAGE_HEALTH_SECRET_MISSING"} |
| /api/client-portal-session | 404 | application/json | JSON_STATUS_404 | {"error":{"code":404,"message":"The page could not be found."}} |
| /api/client-portal-tokens?caseId=__stage216d_smoke__ | 404 | application/json | JSON_STATUS_404 | {"error":{"code":404,"message":"The page could not be found."}} |
| /api/portal?route=session | 400 | application/json; charset=utf-8 | CONTROLLED_400_JSON | {"error":"SYSTEM_KIND_REQUIRED"} |
| /api/cases?id=__stage216d_smoke__&portalSession=__stage216d_smoke__ | 403 | application/json; charset=utf-8 | AUTH_OR_SESSION_REQUIRED_403 | {"error":"PORTAL_SESSION_INVALID"} |
| /api/case-items?caseId=__stage216d_smoke__&portalSession=__stage216d_smoke__ | 403 | application/json; charset=utf-8 | AUTH_OR_SESSION_REQUIRED_403 | {"error":"PORTAL_SESSION_INVALID"} |

## Interpretacja

- GET-only: test nie wykonuje uploadu i nie tworzy tokenów/sesji.
- CONFIG_REQUIRED_500 oznacza kontrolowany brak konfiguracji lokalnej storage health, nie zmianę SQL.
- HTML/Vite/source albo niekontrolowany 500 oznacza kandydat Stage216-D2.

## Config findings

- /api/storage-upload-health: {"ok":false,"error":"PORTAL_STORAGE_HEALTH_SECRET_MISSING"}
- /api/storage-upload: {"ok":false,"error":"PORTAL_STORAGE_HEALTH_SECRET_MISSING"}

## Werdykt

- PASS/CONTROLLED: brak twardego runtime FAIL w GET-only smoke.
