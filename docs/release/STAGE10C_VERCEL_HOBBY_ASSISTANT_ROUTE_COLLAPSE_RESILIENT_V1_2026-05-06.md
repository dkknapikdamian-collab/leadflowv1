# STAGE10C_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_RESILIENT_V1

Data: 2026-05-06  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`

## Cel

Naprawić blokadę deploya Vercel Hobby: `No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan`.

## Decyzja

No separate api/assistant/query.ts function.

Publiczny kontrakt `/api/assistant/query` zostaje, ale fizyczna funkcja serverless nie. Ruch idzie przez rewrite:

```text
/api/assistant/query -> /api/system?kind=assistant-query
```

`api/system.ts` obsługuje `kind=assistant-query` przez `src/server/assistant-query-handler.ts`.

## Kryterium zakończenia

- `api/assistant/query.ts` nie istnieje.
- `vercel.json` ma rewrite do `/api/system?kind=assistant-query`.
- `api/system.ts` ma route `assistant-query`.
- `src/server/assistant-query-handler.ts` zachowuje structured API contract.
- Vercel Hobby <= 12 Serverless Functions.
- Stage7, Stage8, Stage9 i Stage10C check/test przechodzą.
- Build przechodzi przed commitem i pushem.

## Ryzyko

Największe ryzyko to utrata kompatybilności frontu. Ograniczenie: frontend dalej woła `/api/assistant/query`, więc kontrakt z UI nie zmienia się.
