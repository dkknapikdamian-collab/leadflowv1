# STAGE216-A5 - Lead service RPC fallback hotfix

- generated_at: 2026-05-31
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- scope: `api/leads.ts`, guard, _project report, Obsidian update
- mode: runtime bugfix, no SQL/RLS/GRANT mutation, no data mutation during apply

## FAKTY

- During logged-in L/C/C smoke, starting service from a lead failed with HTTP 500 and Supabase error code `55000`.
- Error message: `record "v_client" is not assigned yet` / `The tuple structure of a not-yet-assigned record is indeterminate`.
- `api/leads.ts` first tries `rpc/closeflow_start_lead_service` before using the existing JS fallback path.
- The current JS fallback path already ensures/creates client, inserts case, updates lead, and records activity.
- The bug indicates the Supabase RPC function can fail internally before returning a valid result.

## DECYZJE

- Do not change SQL/RLS/GRANT in this stage.
- Do not attempt live database surgery from the application patch.
- Treat SQLSTATE `55000`, `v_client`, `tuple structure`, and `not-yet-assigned record` from `closeflow_start_lead_service` as RPC fallback-eligible errors.
- Keep the RPC path as preferred when healthy, but allow fallback to the already implemented JS path when this known RPC bug appears.

## HIPOTEZY AI

- The production Supabase function `closeflow_start_lead_service` likely references a PL/pgSQL `record` variable named `v_client` before it is assigned in one branch.
- The safest application-level repair is to bypass only this known broken RPC failure mode and use the existing JS fallback.
- A later SQL-stage can inspect and repair the database function itself, but it is not required to unblock the user flow now.

## DO POTWIERDZENIA

- Confirm after apply that clicking “rozpocznij obsługę” no longer returns `500:55000 v_client`.
- Confirm the created/linked case appears in `/cases` and lead no longer stays as an active sales lead.
- Confirm no duplicate case is created when repeating the action for the same lead.

## TESTY

- `node scripts/check-stage216a5-lead-service-rpc-fallback-hotfix.cjs`
- `npm run build`
- Manual logged-in test: start service from the same kind of lead that caused the error.
- Optional runtime smoke: `node tools/stage216a2-lcc-runtime-smoke.cjs --write` with `npm run dev:api` already running.

## CZEGO NIE RUSZANO

- SQL/RLS/GRANT
- Supabase live data
- UI pages
- `api/clients.ts` Stage216-A4 auth hotfix
- tasks/events/calendar/notifications

## NASTĘPNY KROK

- Apply Stage216-A5, commit/push only the four listed files, then repeat the logged-in start-service action.
