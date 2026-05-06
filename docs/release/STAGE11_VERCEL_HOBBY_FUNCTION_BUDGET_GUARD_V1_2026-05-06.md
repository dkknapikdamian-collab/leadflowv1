# STAGE11_VERCEL_HOBBY_FUNCTION_BUDGET_GUARD_V1

Data: 2026-05-06
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Cel

Utrzymac wdrozenie Vercel Hobby pod limitem fizycznych Serverless Functions.

## Zasada

- api function count <= 12
- `api/assistant/query.ts` nie moze wrocic jako osobna funkcja.
- Publiczny endpoint `/api/assistant/query` zostaje obslugiwany przez rewrite do `/api/system?kind=assistant-query`.
- Handler realnie dziala w `src/server/assistant-query-handler.ts` przez route w `api/system.ts`.

## Pliki

- `scripts/check-stage11-vercel-hobby-function-budget-guard.cjs`
- `tests/stage11-vercel-hobby-function-budget-guard.test.cjs`
- `docs/release/STAGE11_VERCEL_HOBBY_FUNCTION_BUDGET_GUARD_V1_2026-05-06.md`

## Kryterium zakonczenia

- `node scripts/check-stage11-vercel-hobby-function-budget-guard.cjs` przechodzi.
- `node --test tests/stage11-vercel-hobby-function-budget-guard.test.cjs` przechodzi.
- `npm run build` przechodzi.

## Decyzja

To jest guard deployu, nie feature. Jest potrzebny, bo po Stage10C repo jest dokladnie na limicie 12 funkcji API. Kazdy nowy plik w `api/` musi byc swiadoma decyzja, a nie przypadkowy efekt uboczny paczki.
