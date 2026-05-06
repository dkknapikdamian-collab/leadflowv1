# STAGE18_CONTEXT_ACTION_RUNTIME_SMOKE_V1

Data: 2026-05-06
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Cel

Dodac runtime smoke dla akcji kontekstowych bez zmiany wizualizacji.

## Zakres

Stage18 sprawdza, czy akcje `task`, `event` i `note` ida przez jeden rejestr, jeden host dialogow i jeden tor zapisu.

## Co sprawdza

- `src/lib/context-action-contract.ts` mapuje task/event/note na oficjalne dialogi i persistence targety.
- `ContextActionDialogs.tsx` obsluguje jawne `data-context-action-kind`.
- Fallback tekstowy zostaje dla istniejacych przyciskow.
- `TaskCreateDialog` zapisuje relacje do taskow.
- `EventCreateDialog` zapisuje relacje do eventow i uzywa `scheduledAt` z `startAt`.
- `ContextNoteDialog` zapisuje relacje do activities.
- Liczba fizycznych funkcji API nadal miesci sie w Vercel Hobby `<= 12`.
- `api/assistant/query.ts` nie wraca jako osobna funkcja.

## Pliki

- `scripts/smoke-stage18-context-action-runtime-contract.cjs`
- `scripts/check-stage18-context-action-runtime-smoke.cjs`
- `tests/stage18-context-action-runtime-smoke.test.cjs`
- `docs/release/STAGE18_CONTEXT_ACTION_RUNTIME_SMOKE_V1_2026-05-06.md`

## Kryterium zakonczenia

- `npm.cmd run audit:stage18-context-action-runtime-smoke` przechodzi.
- `npm.cmd run check:stage18-context-action-runtime-smoke-v1` przechodzi.
- `npm.cmd run test:stage18-context-action-runtime-smoke-v1` przechodzi.
- `npm.cmd run build` przechodzi.

## Decyzja

To jest etap QA i stabilizacji. Nie dodaje nowego API, nie zmienia layoutu i nie tworzy nowych okienek. Ma wykryc regresje typu: jeden przycisk wydarzenia idzie przez wspolny dialog, a drugi bokiem.
