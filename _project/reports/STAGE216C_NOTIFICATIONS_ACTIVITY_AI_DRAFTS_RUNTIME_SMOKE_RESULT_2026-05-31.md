---
typ: runtime_smoke_result
stage: STAGE216C
project: CloseFlow / LeadFlow
app_url: http://localhost:3000
created_at: 2026-06-01T06:38:39.375Z
---

# STAGE216-C runtime smoke result

## Wyniki

| Endpoint | Status | Content-Type | Klasyfikacja | Próbka |
|---|---:|---|---|---|
| /api/activities?limit=5 | 401 | application/json; charset=utf-8 | AUTH_REQUIRED_401 | {"error":"AUTHORIZATION_BEARER_REQUIRED"} |
| /api/system?kind=ai-drafts&limit=5 | 500 | application/json; charset=utf-8 | SERVER_ERROR_500 | {"error":"AUTHORIZATION_BEARER_REQUIRED"} |
| /api/system?kind=assistant-context | 200 | application/json; charset=utf-8 | PASS_JSON_200 | {"generatedAt":"2026-06-01T06:38:27.387Z","timezone":"Europe/Warsaw","stats":{"totalItems":0,"leads":0,"clients":0,"cases":0,"tasks":0,"events":0,"activities":0,"drafts":0},"snapshot":{"leads":[],"clients":[],"cases":[],"tasks":[],"events":[],"drafts":[],"activities":[],"items":[]}} |
| /api/system?kind=profile-settings | 405 | application/json; charset=utf-8 | JSON_STATUS_405 | {"error":"METHOD_NOT_ALLOWED"} |
| /api/system?kind=workspace-settings | 405 | application/json; charset=utf-8 | JSON_STATUS_405 | {"error":"METHOD_NOT_ALLOWED"} |
| /api/me | 401 | application/json; charset=utf-8 | AUTH_REQUIRED_401 | {"error":"AUTHORIZATION_BEARER_REQUIRED"} |

## Interpretacja

- AUTH_REQUIRED_401 / AUTH_REQUIRED_403 JSON: endpoint żyje i kontroluje auth.
- CONTROLLED_400_JSON: endpoint żyje, ale wymaga parametru albo walidacji.
- PASS_JSON_2xx: endpoint zwraca JSON poprawnie.
- SERVER_ERROR_5xx, NON_JSON_HTML_RESPONSE, VITE_DEV_API_SOURCE_RESPONSE, FETCH_FAILED: FAIL do Stage216-C2.

## Werdykt

- FAIL: wymaga Stage216-C2.