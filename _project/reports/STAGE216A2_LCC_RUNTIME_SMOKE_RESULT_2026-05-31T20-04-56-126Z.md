# STAGE216-A2 LCC runtime GET-only smoke result

- generated_at: 2026-05-31T20:04:56.125Z
- app_url: http://localhost:3000
- workspace_header_present: yes
- mode: GET-only, no writes, no SQL/RLS/GRANT changes
- summary: PASS 0, AUTH_REQUIRED 0, NOT_FOUND_OK 0, FAIL 3

| status | http | endpoint | duration | detail |
|---|---:|---|---:|---|
| FAIL | 0 | /api/leads | 44ms | FETCH_FAILED:fetch failed |
| FAIL | 0 | /api/clients | 1ms | FETCH_FAILED:fetch failed |
| FAIL | 0 | /api/cases | 2ms | FETCH_FAILED:fetch failed |

## Interpretacja

- `PASS`: endpoint zwrócił JSON o oczekiwanym kształcie.
- `AUTH_REQUIRED`: endpoint działa jako JSON, ale wymaga prawidłowego auth/workspace context. To jest oczekiwane w wielu lokalnych runach bez sesji.
- `FAIL`: wymaga Stage216-A3 albo ręcznej diagnostyki. Szczególnie ważne są HTML/non-JSON, bo frontend może pokazać `INVALID_API_RESPONSE`.
