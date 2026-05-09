# CloseFlow System Route Conflicts Runtime Repair v2

Status: runtime/deploy repair.

Naprawia dwa problemy po konsolidacji entity conflicts pod /api/system:

- TS2451 w api/system.ts przez zdublowane const body / const kind w default handlerze.
- Brak runtime exportu findEntityConflictsInSupabase w frontendowym supabase-fallback.

Kontrakt:

- entity conflicts zostaje pod /api/system?kind=entity-conflicts.
- Nie wracamy do api/entity-conflicts.ts, bo Vercel Hobby ma limit 12 serverless functions.
- Nowe endpointy nie mogą być dodawane jako osobne api/*.ts bez sprawdzenia limitu.

Check:

```powershell
npm run check:closeflow-system-route-conflicts-runtime-repair-v2
npm run check:vercel-hobby-function-limit
npm run check:lead-client-conflict-resolution-v1
npm run build
```
