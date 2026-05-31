# 2026-05-31 - CloseFlow Stage216-A5 lead service RPC fallback hotfix

## FAKTY

- Stage216-A5 addresses logged-in manual smoke failure during lead → service/case transition.
- Runtime error: `500`, Supabase code `55000`, `record "v_client" is not assigned yet`.
- Current application path tries `closeflow_start_lead_service` RPC first, then existing JS fallback.
- The hotfix keeps RPC as preferred path but falls back when the known `v_client`/`55000` RPC bug appears.

## DECYZJE

- No SQL/RLS/GRANT changes in this stage.
- No live Supabase data changes during apply.
- Unblock the operator flow by using existing JS fallback for this known RPC failure mode.
- Defer direct database function repair to a later SQL-specific stage if needed.

## HIPOTEZY AI

- The Supabase RPC function probably references unassigned PL/pgSQL record variable `v_client` in one branch.
- JS fallback should avoid this broken RPC path and complete lead → client/case transition using API-level inserts/updates.

## TESTY

- Guard: `node scripts/check-stage216a5-lead-service-rpc-fallback-hotfix.cjs`
- Build: `npm run build`
- Manual: repeat “rozpocznij obsługę” on a lead.

## RYZYKA

- If the JS fallback encounters a separate schema/RLS issue, another Stage216-A6 may be required.
- If duplicate records exist from earlier attempts, manual verification is needed before cleanup.

## NASTĘPNY KROK

- Apply ZIP, commit/push four files, then repeat the logged-in start-service action.
