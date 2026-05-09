# CloseFlow Vercel Hobby Function Limit Entity Conflicts v2 Finalizer

Status: repair finalizer.

Problem: after moving entity conflict detection away from standalone `api/entity-conflicts.ts`, the old lead/client conflict check still tried to read the deleted file.

Fix: `scripts/check-lead-client-conflict-resolution-v1.cjs` now accepts the consolidated source path:

- `src/server/entity-conflicts-handler.ts` when the Vercel Hobby consolidation is active,
- fallback to `api/entity-conflicts.ts` only in older local states.

Required checks:

```powershell
npm run check:closeflow-entity-conflicts-system-route-v1
npm run check:vercel-hobby-function-limit
npm run check:lead-client-conflict-resolution-v1
npm run build
```

Marker: CLOSEFLOW_VERCEL_HOBBY_FUNCTION_LIMIT_ENTITY_CONFLICTS_V2_FINALIZER
