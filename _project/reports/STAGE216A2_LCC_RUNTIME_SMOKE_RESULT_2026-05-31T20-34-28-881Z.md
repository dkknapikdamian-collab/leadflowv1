# STAGE216-A2 LCC runtime GET-only smoke result

- generated_at: 2026-05-31T20:34:28.879Z
- app_url: http://localhost:3000
- workspace_header_present: yes
- mode: GET-only, no writes, no SQL/RLS/GRANT changes
- summary: PASS 0, AUTH_REQUIRED 3, NOT_FOUND_OK 0, FAIL 0

| status | http | endpoint | duration | detail |
|---|---:|---|---:|---|
| AUTH_REQUIRED | 401 | /api/leads | 2401ms | Endpoint działa jako JSON, ale wymaga poprawnego auth/workspace context. To nie jest błąd parsowania. |
| AUTH_REQUIRED | 401 | /api/clients | 2606ms | Endpoint działa jako JSON, ale wymaga poprawnego auth/workspace context. To nie jest błąd parsowania. |
| AUTH_REQUIRED | 401 | /api/cases | 2572ms | Endpoint działa jako JSON, ale wymaga poprawnego auth/workspace context. To nie jest błąd parsowania. |

## Interpretacja

- `PASS`: endpoint zwrócił JSON o oczekiwanym kształcie.
- `AUTH_REQUIRED`: endpoint działa jako JSON, ale wymaga prawidłowego auth/workspace context. To jest oczekiwane w wielu lokalnych runach bez sesji.
- `FAIL`: wymaga Stage216-A3 albo ręcznej diagnostyki. Szczególnie ważne są HTML/non-JSON, bo frontend może pokazać `INVALID_API_RESPONSE`.
