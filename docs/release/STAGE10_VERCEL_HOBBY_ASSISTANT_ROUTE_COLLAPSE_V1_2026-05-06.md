# STAGE10_VERCEL_HOBBY_ASSISTANT_ROUTE_COLLAPSE_V1

Data: 2026-05-06  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`

## Cel

Naprawić deploy na Vercel Hobby po komunikacie:

```text
No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan.
```

Stage7 dodał fizyczny plik `api/assistant/query.ts`, czyli osobną Serverless Function. To było poprawne kontraktowo, ale złe dla limitu Hobby.

## Zmiana

- Publiczny URL `/api/assistant/query` zostaje dla frontendu.
- Fizyczny plik `api/assistant/query.ts` zostaje usunięty.
- `vercel.json` mapuje `/api/assistant/query` do `/api/system?kind=assistant-query`.
- `api/system.ts` obsługuje `kind === 'assistant-query'` i deleguje do `src/server/assistant-query-handler.ts`.
- `src/lib/assistant-query-client.ts` nadal wywołuje `/api/assistant/query`, więc UI nie zna wewnętrznej konsolidacji.

## Nie zmieniać

- Nie tworzyć nowego pliku w `api/`.
- Nie usuwać publicznego kontraktu `/api/assistant/query`.
- Nie pozwalać AI tworzyć finalnych rekordów bez zatwierdzenia.

## Kryterium zakończenia

- `api/assistant/query.ts` nie istnieje.
- `/api/assistant/query` ma rewrite do `/api/system?kind=assistant-query`.
- `api/system.ts` ma route `assistant-query`.
- `src/server/assistant-query-handler.ts` zachowuje structured API contract.
- Liczba fizycznych plików funkcji w `api/` mieści się w limicie Hobby, czyli `<= 12`.
- `npm.cmd run check:stage10-vercel-hobby-assistant-route-collapse-v1` przechodzi.
- `npm.cmd run test:stage10-vercel-hobby-assistant-route-collapse-v1` przechodzi.
- `npm.cmd run build` przechodzi przed commit/push.

## Gate

FAIL w checku blokuje commit/push. Każdy check/test/build musi przejść przed buildem, commitem i pushem.
