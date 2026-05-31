---
typ: runtime_smoke_result
stage: STAGE216C
project: CloseFlow / LeadFlow
app_url: http://localhost:3000
created_at: 2026-05-31T21:50:23.440Z
---

# STAGE216-C runtime smoke result

## Wyniki

| Endpoint | Status | Content-Type | Klasyfikacja | Próbka |
|---|---:|---|---|---|
| /api/activities?limit=5 | 0 | - | FETCH_FAILED | fetch failed |
| /api/system?kind=ai-drafts&limit=5 | 0 | - | FETCH_FAILED | fetch failed |
| /api/system?kind=assistant-context | 0 | - | FETCH_FAILED | fetch failed |
| /api/system?kind=profile-settings | 0 | - | FETCH_FAILED | fetch failed |
| /api/system?kind=workspace-settings | 0 | - | FETCH_FAILED | fetch failed |
| /api/me | 0 | - | FETCH_FAILED | fetch failed |

## Interpretacja

- AUTH_REQUIRED_401 / AUTH_REQUIRED_403 JSON: endpoint żyje i kontroluje auth.
- CONTROLLED_400_JSON: endpoint żyje, ale wymaga parametru albo walidacji.
- PASS_JSON_2xx: endpoint zwraca JSON poprawnie.
- SERVER_ERROR_5xx, NON_JSON_HTML_RESPONSE, VITE_DEV_API_SOURCE_RESPONSE, FETCH_FAILED: FAIL do Stage216-C2.

## Werdykt

- FAIL: wymaga Stage216-C2.