# 2026-05-31 - CloseFlow Stage216-A3 Vite API source response guard

## FAKTY

- Stage216-A2 runtime smoke against `http://localhost:3000` returned HTTP 200 but non-JSON body beginning with API source (`import { ...`).
- This indicates local Vite UI-only dev mode, not confirmed Supabase/RLS failure.
- Stage216-A3 adds `dev:ui` and `dev:api` scripts and updates the runtime smoke probe to classify this exact local misconfiguration as `VITE_DEV_API_SOURCE_RESPONSE`.
- No SQL/RLS/GRANT changes.

## DECYZJE DAMIANA

- Continue validating Supabase after migration using explicit staged QA.
- Keep Obsidian documentation with every meaningful stage.
- Do not use `git add .`.

## HIPOTEZY AI

- The current non-JSON response is caused by testing `/api/...` through Vite instead of Vercel runtime.
- `npm run dev:api` should be used for local API smoke.

## TESTY

- `node scripts/check-stage216a3-vite-api-source-response-guard.cjs`
- `npm run build`

## RYZYKA

- If `vercel` CLI is not installed or not authenticated locally, `npm run dev:api` may require setup.
- If `dev:api` still returns non-JSON, then Stage216-A4 should inspect API runtime routing/environment.

## NASTĘPNY KROK

1. Apply Stage216-A3 REPAIR1.
2. Commit only 5 listed files.
3. Run `npm run dev:api`.
4. Re-run `node tools/stage216a2-lcc-runtime-smoke.cjs --write` with real workspace UUID.
