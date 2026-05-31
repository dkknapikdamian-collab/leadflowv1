---
typ: runtime_smoke_result
stage: STAGE216B
status: PASS_WITH_AUTH_OK
date: 2026-05-31
---

# STAGE216-B runtime smoke result - tasks/events/calendar

## Kontekst

- base_url: http://localhost:3000
- endpoints: 6
- PASS/PASS_AUTH_REQUIRED: 6
- WARN_CLIENT_ERROR_JSON: 0
- FAIL: 0
- generated_at: 2026-05-31T21:36:25.748Z

## Tabela wyników

| Endpoint | HTTP | Content-Type | Bytes | ms | Verdict | Code | Preview |
|---|---:|---|---:|---:|---|---|---|
| /api/tasks | 401 | application/json; charset=utf-8 | 41 | 2948 | PASS_AUTH_REQUIRED | AUTH_REQUIRED_401 | {"error":"AUTHORIZATION_BEARER_REQUIRED"} |
| /api/events | 401 | application/json; charset=utf-8 | 41 | 2637 | PASS_AUTH_REQUIRED | AUTH_REQUIRED_401 | {"error":"AUTHORIZATION_BEARER_REQUIRED"} |
| /api/work-items?kind=tasks | 401 | application/json; charset=utf-8 | 41 | 1990 | PASS_AUTH_REQUIRED | AUTH_REQUIRED_401 | {"error":"AUTHORIZATION_BEARER_REQUIRED"} |
| /api/work-items?kind=events | 401 | application/json; charset=utf-8 | 41 | 2382 | PASS_AUTH_REQUIRED | AUTH_REQUIRED_401 | {"error":"AUTHORIZATION_BEARER_REQUIRED"} |
| /api/system?apiRoute=tasks | 401 | application/json; charset=utf-8 | 41 | 2054 | PASS_AUTH_REQUIRED | AUTH_REQUIRED_401 | {"error":"AUTHORIZATION_BEARER_REQUIRED"} |
| /api/system?apiRoute=events | 401 | application/json; charset=utf-8 | 41 | 1754 | PASS_AUTH_REQUIRED | AUTH_REQUIRED_401 | {"error":"AUTHORIZATION_BEARER_REQUIRED"} |

## Interpretacja

- PASS JSON: endpoint działa jako JSON.
- AUTH_REQUIRED 401/403 JSON: endpoint żyje, auth/workspace wymagany, to nie jest INVALID_API_RESPONSE.
- NON_JSON_HTML_RESPONSE: twardy FAIL.
- VITE_DEV_API_SOURCE_RESPONSE: prawdopodobnie uruchomiono zwykłe npm run dev zamiast npm run dev:api albo route API zwraca source.
- SERVER_ERROR_500: twardy FAIL i wejście do Stage216-B2.
- FETCH_FAILED: app URL/port nie odpowiada.

## Następny krok

- Wykonać ręczne QA tasks/events/calendar, potem przejść do Stage216-C.
