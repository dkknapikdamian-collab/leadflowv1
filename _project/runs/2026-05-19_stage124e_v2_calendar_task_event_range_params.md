# Stage124E V2 - calendar task/event range params

Date: 2026-05-19
Branch: dev-rollout-freeze
Mode: ZIP/local-only, manual commit after green guards.

## FACTS
- Stage124D restored lightweight API routes for /api/tasks and /api/events.
- Stage124E V2 forwards optional calendar range params from frontend fetchers to those routes.
- UI and frozen calendar visuals are not changed.
- The change is backward-compatible because all new params are optional.

## DECISION
Use optional `from`, `to`, and `limit` params instead of changing calendar UI behavior.

## TESTS
- npm run check:stage124e-calendar-range-params
- node --test tests/stage124e-calendar-range-params.test.cjs
- npm run check:stage124d-task-event-routes
- npm run check:stage124-supabase-egress-contract
- npm run build

## RISK
Calendar callers that do not provide a range still behave like before. Full egress reduction requires a following stage to pass visible month/week/day ranges from Calendar UI callers.

## NEXT
Stage124F should wire visible calendar range from Calendar page/sidebar callers into fetchCalendarBundleFromSupabase(options).
