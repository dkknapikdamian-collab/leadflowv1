# STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1

Data: 2026-05-06  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`

## Cel

Utrzymać publiczny kontrakt `/api/assistant/query` jako structured API contract dla UI asystenta.

Po Stage10C kontrakt działa without separate Vercel function: publiczna ścieżka `/api/assistant/query` jest rewrite'owana do `/api/system?kind=assistant-query`, a fizyczny handler mieszka w `src/server/assistant-query-handler.ts`.

## Chronione zachowania

- empty prompt zwraca structured response, nie pusty błąd.
- `payload_too_large` zwraca 413.
- odpowiedź niesie `dataPolicy: app_data_only`.
- write intent nadal daje szkic do sprawdzenia, nie finalny rekord.
- `/api/assistant/query` nie dodaje osobnej funkcji serverless na Vercel Hobby.

## Kryterium zakończenia

- `api/assistant/query.ts` nie istnieje.
- `vercel.json` ma rewrite `/api/assistant/query` -> `/api/system?kind=assistant-query`.
- `api/system.ts` route'uje `kind=assistant-query` do `assistant-query-handler`.
- Stage7 check/test przechodzą.
