# LF-UI-SOT-001_CLOSE_VERIFY_AND_SMOKE

Date: 2026-06-28 00:30 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

Status: TECH_DONE / ROUTING_SOT_GUARD_ADDED / CLOSE_VERIFY_GUARD_ADDED / NEEDS_LOCAL_COMMAND_CONFIRMATION / NEEDS_MANUAL_SMOKE / FULL_ALIAS_POLICY_PENDING

## Scan report

- Project: CloseFlow / LeadFlow.
- Read mode: LF-UI-SOT-001 close verify, source scan only przez GitHub connector.
- Files read:
  - `AGENTS.md`
  - `_project/00_AI_START_SPIS_TRESCI.md`
  - `_project/Naprawa_Zrodla_Prawdy/00_START_NAPRAWA_ZRODLA_PRAWDY.md`
  - `_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-001_CANONICAL_ROUTING_MAP.md`
  - `src/lib/routes.ts`
  - `src/App.tsx`
  - `scripts/check-routes-canonical.cjs`
  - `tests/routes-canonical.test.cjs`
  - `package.json` route guard section
- Files intentionally not read:
  - full runtime modules outside route/link source-of-truth
  - CSS/layout files
  - SQL/migrations/Supabase/API
  - legacy historical run reports unrelated to routing SOT
- Current stage: `LF-UI-SOT-001_CLOSE_VERIFY_AND_SMOKE`.
- Active decisions:
  - `src/lib/routes.ts` is route SOT.
  - `src/App.tsx` is route mount SOT.
  - `/cases/:caseId` is canonical CaseDetail.
  - `/case/:caseId` is alias redirect only through `LegacyCaseRedirect` + `Navigate replace`.
- Open risks:
  - local command execution still required on Damian machine.
  - manual smoke still required in app.
  - full alias policy is not closed because `/today`, `/start`, `/support` are not redirect-only aliases.
  - `/dev/funnel` remains DEV/legacy route and must be decided in R2.
- Tests/guards relevant:
  - `npm run guard:routes:canonical`
  - `node scripts/check-lf-ui-sot-001-close-verify-and-smoke.cjs`
  - `node --test tests/routes-canonical.test.cjs tests/lf-ui-sot-001-close-verify-and-smoke.test.cjs`
  - `npm run build`
  - `npm run verify:closeflow:quiet`
  - `git diff --check`
- Next step:
  - run local commands, then Damian manual smoke.

## GitHub source verification

Confirmed from source scan:

- `src/lib/routes.ts` exposes `CLOSEFLOW_ROUTES` and `CLOSEFLOW_ROUTE_MAP`.
- `src/lib/routes.ts` maps `/cases/:caseId` as canonical and `/case/:caseId` as alias for CaseDetail.
- `src/App.tsx` imports `CLOSEFLOW_ROUTES` and route helpers from `src/lib/routes.ts`.
- `LegacyCaseRedirect` returns `Navigate` to `caseDetailPath(caseId)` with `replace`.
- `src/App.tsx` renders CaseDetail under `CLOSEFLOW_ROUTES.caseDetail`.
- `src/App.tsx` renders the legacy alias through `LegacyCaseRedirect`, not through a duplicate `CaseDetail` component.
- `scripts/check-routes-canonical.cjs` and `tests/routes-canonical.test.cjs` already exist.

## What this stage changed

Added technical closeout guard and test:

```txt
scripts/check-lf-ui-sot-001-close-verify-and-smoke.cjs
tests/lf-ui-sot-001-close-verify-and-smoke.test.cjs
```

The new guard protects the honest status:

```txt
TECH_DONE / ROUTING_SOT_GUARD_ADDED / CLOSE_VERIFY_GUARD_ADDED / NEEDS_LOCAL_COMMAND_CONFIRMATION / NEEDS_MANUAL_SMOKE / FULL_ALIAS_POLICY_PENDING
```

It prevents overclaiming full alias policy while `/today`, `/start`, `/support` still render their own components instead of redirect-only aliases.

## Local commands to run

LOCAL_COMMANDS_PENDING until Damian runs:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"

npm run guard:routes:canonical
node scripts/check-lf-ui-sot-001-close-verify-and-smoke.cjs
node --test tests/routes-canonical.test.cjs tests/lf-ui-sot-001-close-verify-and-smoke.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

Do not mark this run as full PASS until these commands are green locally.

## Manual smoke Damiana

Do after local commands:

```txt
[ ] /cases opens Cases
[ ] /cases/:caseId opens CaseDetail
[ ] /case/:caseId redirects replace to /cases/:caseId
[ ] CaseDetail does not render from alias route directly
[ ] /leads opens Leads
[ ] /leads/:leadId opens LeadDetail
[ ] lead-to-case handoff opens /cases/:caseId if available
[ ] / opens Today
[ ] /today opens Today or follows accepted alias decision
[ ] /calendar opens Calendar
[ ] /funnel opens Funnel
```

## Not closed as FULL_ALIAS_POLICY_PASS

Nie zamykac jako `ZAMKNIETE_FULL` / `FULL_ALIAS_POLICY_PASS`, because these known exceptions remain:

```txt
/today -> renders TodayStable instead of redirect-only alias to /
/start -> auth-entry alias/login behavior, not pure redirect-only alias
/support -> renders SupportCenter instead of redirect-only alias to /help
/dev/funnel -> DEV/legacy funnel route
```

## Follow-up

Create small follow-up stage only if Damian wants full alias purity:

```txt
LF-UI-SOT-001R2_ROUTE_ALIAS_POLICY_CLOSEOUT
```

Scope:

- decide whether `/today` redirects to `/` or remains release-candidate smoke alias,
- decide whether `/start` redirects to `/login` or remains auth-entry alias,
- decide whether `/support` redirects to `/help`,
- decide whether `/dev/funnel` remains DEV-only legacy route,
- update route map, guard and smoke accordingly.

## Czego nie ruszono

- CSS/layout.
- UI cards/buttons/icons.
- data/business logic.
- SQL/Supabase/Firebase/API.
- CaseDetail runtime beyond route verification.
- LeadDetail runtime beyond route handoff verification.
- legacy pages cleanup.

## Close criteria

Can move to `TECHNICAL_PASS / MANUAL_SMOKE_PENDING` only after local command log is green.
Can move to `ZAMKNIETE` only after Damian manual smoke confirms the URLs above.
