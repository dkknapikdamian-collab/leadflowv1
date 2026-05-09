# CloseFlow Vercel Hobby Function Limit v1

Status: runtime/deploy repair.

Problem: Vercel Hobby blocks deployments when the project adds more than 12 Serverless Functions.

Fix: move entity conflict detection from standalone `api/entity-conflicts.ts` into existing `api/system.ts?kind=entity-conflicts`.

Why: conflict detection is system/support logic, not a separate deployment function. Keeping it inside `api/system` reduces function count without changing user-facing behavior.

Checks:

```powershell
npm run check:closeflow-entity-conflicts-system-route-v1
npm run check:vercel-hobby-function-limit
npm run check:lead-client-conflict-resolution-v1
npm run build
```

Marker: CLOSEFLOW_VERCEL_HOBBY_FUNCTION_LIMIT_ENTITY_CONFLICTS_V1
