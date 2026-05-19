# CloseFlow Stage124F V3 - Vercel API function consolidation

## Status
Prepared by local ZIP package. Commit only after guard, tests and build are green.

## Facts
- Supabase egress spike is PostgREST-heavy, so lightweight data routes remain required.
- Vercel Hobby deployment failed because the app exceeded the 12 Serverless Functions limit.
- Standalone api/tasks.ts and api/events.ts are removed as Vercel functions.
- Task/event logic is kept in src/server/task-route-stage124f.ts and src/server/event-route-stage124f.ts.
- api/system.ts routes apiRoute=tasks and apiRoute=events.
- Frontend task/event reads use /api/system?apiRoute=tasks/events and preserve Stage124E from/to/limit query params.

## Guards
- npm run check:stage124f-vercel-api-function-consolidation
- npm run check:stage124d-task-event-routes
- npm run check:stage124e-calendar-range-params
- npm run check:stage124-supabase-egress-contract
- npm run build

## Next step
If green, selectively commit only Stage124F V3 files. Do not use git add .
