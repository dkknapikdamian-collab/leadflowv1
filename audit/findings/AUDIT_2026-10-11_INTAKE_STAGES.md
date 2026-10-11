# CloseFlow / LeadFlow — 2026-10-11 audit intake and proposed stages

STATUS: OPEN_AUDIT_INTAKE / NOT_VERIFIED_ON_CURRENT_SHA / NO_STAGE_ACTIVATION.
OWNER: `closeflow_lead_app`. CANONICAL_BRANCH: `dev-rollout-freeze`, NOT GitHub-default `main`.
SOURCES: user-supplied `AUDYT_ZBIORCZY_2026-10-11-1.md` (round 1) and `AUDYT_ZBIORCZY_2026-10-11.md` (round 1 + round 2); the second extends the first. No audited commit SHA or live runtime proof was supplied. Severity below is the **auditor's reported rating**, not a freshly reproduced result.

## Findings — do not silently mark as fixed
| ID | Reported severity / evidence | File:lines and mechanism | Minimal follow-up |
|---|---|---|---|
| LF-01 | CRITICAL, reported confirmed in scanned handlers | `api/leads.ts:45,94,110`; `api/cases.ts:42,64`; `api/events.ts:44,81,97`; `api/tasks.ts:66,100,116` + `api/_supabase.ts:9-30`. No Authorization/JWT checks reported while using service-role credentials (bypass RLS); cross-tenant read/write risk. Round 2 explicitly checked cases/events/tasks. | Verify canonical SHA, deployed runtime/route and effective auth first; then server-side JWT validation, derive workspace from user membership, deny cross-tenant access; negative tests. |
| LF-02 | HIGH, exposure **risk**, not proven leak | `api/_supabase.ts:14` fallback `VITE_SUPABASE_SERVICE_ROLE_KEY`; service key could be exposed if imported in client bundle. | Remove public-prefixed fallback, inspect actual bundle, rotate keys only if exposure verified. |
| LF-03 | HIGH conditional | `SUPABASE_SQL_STEP_1.sql` lacks RLS-enable statements; actual DB RLS state not checked. | Check deployed RLS and policies first, then migration/policy tests. |
| LF-04 | MEDIUM, conditional on active Firestore | `firestore.rules:44-66`: create allowed by `resource == null` without `request.resource.data.ownerId == uid`. | Check if Firestore still serves clients; enforce create ownerId and test spoofing if active. |
| LF-05 | HIGH (round 2), conditional on active Firestore | `firestore.rules:27-29,57,61`: `isValidClientToken(caseId)` only checks document existence, not secret equality; known caseId may allow subcollection read/update. | Validate actual token and expiry on active path; deny guessed caseId access. |

## Confirmed limits / positive evidence from supplied audits
- No tracked live secrets detected in basic grep (not a historical secrets audit).
- No wildcard CORS seen in `api/*.ts`; NOT mitigation for missing server-side authentication.
- Not examined: remaining application logic, bridge proof-of-concept, full imports/build, runtime deployment or live RLS. Original round-1 assumption about cases/events/tasks is superseded by round 2's inspected evidence.

## Staged proposed intake; **not** independent/new active workflow
- **A0 P0 / immediate evidence:** Map current `dev-rollout-freeze` SHA → live deployments and routes. Inspect every reported auth/tenant boundary; prove current behavior using authorized negative tests; measure blast radius. If P0 live, handle as containment incident within proper owner gate.
- **A1 P0 / API isolation:** Fix auth and tenant/workspace scoping for each active endpoint; include tests anonymous/cross-workspace/read/write, Guardian and independent review.
- **A2 P1 / data and credentials:** Verify RLS in real DB and policies; remove `VITE_` service-role fallback; secrets exposure evidence and conditional rotation.
- **A3 P1 / legacy surface if live:** Verify whether Firestore remains deployed; if yes, fix both create-owner and portal-token authorization with denial regressions. If retired, record decommission proof instead of unnecessary code work.
- **A4 / acceptance:** exact-SHA tests, required Guardian, independent review and deploy/runtime receipts; only controller may close findings and integrate into active stage graph.

HANDOFF GATE: before accepting a future relevant API/auth/SQL/Firestore or release stage, inspect LF-01…LF-05 and record `FIXED_WITH_PROOF` / `NOT_APPLICABLE_WITH_PROOF` / `OPEN_BLOCKER`. Do not infer closure from code intent, plans, or a different branch. This intake does not change the active FRT-036 workflow.
