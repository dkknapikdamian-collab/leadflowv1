# STAGE216-A3 Vite API source response guard

- date: 2026-05-31
- canonical_name: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- repo: dkknapikdamian-collab/leadflowv1
- local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- mode: runtime smoke diagnostics, no SQL/RLS/GRANT changes

## FAKTY

Stage216-A2 runtime smoke returned HTTP 200 for `/api/leads`, `/api/clients`, and `/api/cases`, but the body started with JavaScript/TypeScript source such as `import { ...` instead of JSON.

This is not a Supabase table/RLS/GRANT proof yet. It means the local run used Vite UI-only dev server for API paths. Vite can serve the route source file as a module instead of running Vercel API functions.

`package.json` keeps `dev` as UI-only Vite and adds:

```json
"dev:ui": "vite --port=3000 --host=0.0.0.0",
"dev:api": "vercel dev --listen 3000"
```

`tools/stage216a2-lcc-runtime-smoke.cjs` now classifies this pattern as `VITE_DEV_API_SOURCE_RESPONSE`, with a hint to use `npm run dev:api` / Vercel runtime for API smoke.

## DECYZJE DAMIANA

- Continue Supabase migration validation through staged QA.
- Do not change SQL/RLS/GRANT in this stage.
- Preserve Obsidian update for every meaningful stage.

## HIPOTEZY AI

- The prior `NON_JSON_RESPONSE: Unexpected token 'i', "import { i"...` was caused by running API smoke against Vite UI-only dev server, not by Supabase data corruption.
- Real API verification must use Vercel runtime locally (`npm run dev:api`) or deployed Vercel URL.

## TESTY

- `node scripts/check-stage216a3-vite-api-source-response-guard.cjs`
- `npm run build`
- Runtime follow-up: `npm run dev:api`, then `node tools/stage216a2-lcc-runtime-smoke.cjs --write`

## CZEGO NIE RUSZANO

- SQL
- RLS
- GRANT
- Supabase data
- API handlers logic
- UI pages
- Tasks/Events/Calendar

## NASTĘPNY KROK

Run the app through Vercel runtime:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
npm run dev:api
```

In another PowerShell window:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$env:CLOSEFLOW_APP_URL="http://localhost:3000"
$env:CLOSEFLOW_WORKSPACE_ID="PRAWDZIWY_WORKSPACE_UUID"
node tools/stage216a2-lcc-runtime-smoke.cjs --write
```

If the result is still non-JSON after `dev:api`, create Stage216-A4 for real runtime API fix.
