# LF-UI-SOT-001 - Canonical routing

Status: TECH_DONE / ROUTING_SOT_GUARD_ADDED / CLOSE_VERIFY_GUARD_ADDED / NEEDS_LOCAL_COMMAND_CONFIRMATION / NEEDS_MANUAL_SMOKE / FULL_ALIAS_POLICY_PENDING
Date: 2026-06-28 00:30 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch checked: dev-rollout-freeze
Scope: canonical route source of truth, alias redirect contract, route guard, close verify guard

## Scan report

- Project: CloseFlow / LeadFlow.
- Read mode: minimalny routing stage, bez pelnego Obsidiana i bez UI refactoru.
- Files read:
  - `AGENTS.md`
  - `_project/00_AI_START_SPIS_TRESCI.md`
  - `_project/audits/LF-UI-SOT-000_PREFLIGHT_ROUTE_UI_MAP.md`
  - `src/App.tsx`
  - `src/lib/routes.ts`
  - `src/components/Layout.tsx`
  - selected route guards/tests touching CaseDetail and lead handoff
  - selected runtime link sources: `src/lib/reminders.ts`, `src/lib/owner-control/*`
- Files intentionally not read:
  - full Obsidian vault and `obsidian_updates`
  - migrations, Supabase/Firebase/API implementation
  - CSS/layout visual layers beyond checking the active layout owner
  - full inactive pages except route string scan
- Current stage: `LF-UI-SOT-001 - Canonical routing`.
- Active decisions:
  - Route SOT is `src/lib/routes.ts`.
  - App route mount SOT is `src/App.tsx`.
  - Main authenticated app layout remains `src/components/Layout.tsx`.
  - CaseDetail canonical route is `/cases/:caseId`.
  - `/case/:caseId` remains alias only and redirects with `Navigate replace`.
- Open risks:
  - Existing dirty repo state from before this stage remains.
  - Inactive `src/pages/Dashboard.tsx` and `src/pages/Today.tsx` still contain legacy `/case/` links.
  - `src/components/Layout.tsx` still treats `/case/` as active for visual highlighting so old shared links do not visually break before redirect. This was not edited because layouts are out of scope.
  - FIN-15 route-adjacent test remains red for an unrelated finance ghost in `LeadDetail`.
  - Full alias policy is still pending because `/today`, `/start`, `/support` and `/dev/funnel` are not all redirect-only aliases.
- Tests/guards relevant:
  - `npm run guard:routes:canonical`
  - `node scripts/check-lf-ui-sot-001-close-verify-and-smoke.cjs`
  - `node --test tests/routes-canonical.test.cjs tests/lf-ui-sot-001-close-verify-and-smoke.test.cjs`
  - `node --test tests/stage233a-route-canonicalization.test.cjs tests/lead-start-service-case-redirect.test.cjs tests/lead-service-mode-v1.test.cjs`
  - `node scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs`
  - `node --test tests/stage232i3-owner-control-missing-blocker-cross-entity-integration.test.cjs`
  - `npm run build`
  - `npm run verify:closeflow:quiet`
  - `git diff --check`
- Next step:
  - Run local commands.
  - Manual Damian smoke on canonical/alias URLs.
  - Separate cleanup stage for inactive Dashboard/Today legacy links and layout route constants.
  - Separate R2 stage for full alias policy if Damian wants redirect-only aliases everywhere.

## Canonical route map

| Screen | Status | Route | Main page | Main layout |
|---|---|---|---|---|
| Today | canonical | `/` | `src/pages/TodayStable.tsx` | `src/components/Layout.tsx` |
| Today | alias | `/today` | `src/pages/TodayStable.tsx` | `src/components/Layout.tsx` |
| Dashboard | legacy | `/dashboard` | `src/pages/Dashboard.tsx` | unknown |
| Leads | canonical | `/leads` | `src/pages/Leads.tsx` | `src/components/Layout.tsx` |
| Lead Detail | canonical | `/leads/:leadId` | `src/pages/LeadDetail.tsx` | `src/components/Layout.tsx` |
| Clients | canonical | `/clients` | `src/pages/Clients.tsx` | `src/components/Layout.tsx` |
| Client Detail | canonical | `/clients/:clientId` | `src/pages/ClientDetail.tsx` | `src/components/Layout.tsx` |
| Cases | canonical | `/cases` | `src/pages/Cases.tsx` | `src/components/Layout.tsx` |
| Case Detail | canonical | `/cases/:caseId` | `src/pages/CaseDetail.tsx` | `src/components/Layout.tsx` |
| Case Detail | alias | `/case/:caseId` | `LegacyCaseRedirect` | `src/components/Layout.tsx` |
| Funnel | canonical | `/funnel` | `src/pages/SalesFunnel.tsx` | `src/components/Layout.tsx` |
| Funnel | legacy/dev | `/dev/funnel` | `src/pages/SalesFunnel.tsx` | `src/components/Layout.tsx` |
| Calendar | canonical | `/calendar` | `src/pages/Calendar.tsx` | `src/components/Layout.tsx` |
| Tasks | canonical | `/tasks` | `src/pages/TasksStable.tsx` | `src/components/Layout.tsx` |
| Settings | canonical | `/settings` | `src/pages/Settings.tsx` | `src/components/Layout.tsx` |
| Billing | canonical | `/billing` | `src/pages/Billing.tsx` | `src/components/Layout.tsx` |
| Activity | canonical | `/activity` | `src/pages/Activity.tsx` | `src/components/Layout.tsx` |
| Templates | canonical | `/templates` | `src/pages/Templates.tsx` | `src/components/Layout.tsx` |
| Templates | alias | `/case-templates` | `Navigate replace` | `src/components/Layout.tsx` |
| Response Templates | canonical | `/response-templates` | `src/pages/ResponseTemplates.tsx` | `src/components/Layout.tsx` |
| Login | canonical | `/login` | `src/pages/Login.tsx` | none |
| Login | alias | `/start` | `src/pages/Login.tsx` | none |
| Client Portal | canonical | `/portal/:caseId/:token` | `src/pages/ClientPortal.tsx` | none |

## Route SOT changes

- `src/lib/routes.ts` now contains:
  - `CLOSEFLOW_ROUTES`
  - `CLOSEFLOW_ROUTE_MAP`
  - route statuses: `canonical`, `alias`, `legacy`, `unknown`
  - helpers: `todayPath`, `leadsPath`, `leadDetailPath`, `clientsPath`, `clientDetailPath`, `casesPath`, `caseDetailPath`, `calendarPath`, `funnelPath`
- `src/App.tsx` now uses `CLOSEFLOW_ROUTES` for route declarations.
- `/case/:caseId` is still present only as `LegacyCaseRedirect`.
- `LeadDetail` lead-to-case handoff now uses `caseDetailPath(startServiceSuccess.caseId)`.
- Owner-control/reminder runtime hrefs now use route helpers for case/lead/client detail paths.

## Guard

New npm script:

```txt
npm run guard:routes:canonical
```

Guard file:

```txt
scripts/check-routes-canonical.cjs
```

Test file:

```txt
tests/routes-canonical.test.cjs
```

The guard checks:

- required route helpers exist,
- required screens have route map entries,
- CaseDetail canonical route renders only under `/cases/:caseId`,
- `/case/:caseId` is redirect-only with `replace`,
- `Cases.tsx` uses `caseDetailPath`,
- `LeadDetail` handoff uses `caseDetailPath`,
- active owner-control/reminder link builders no longer manually build `/case/` links.

## Close verify guard

Added for the closeout stage:

```txt
scripts/check-lf-ui-sot-001-close-verify-and-smoke.cjs
tests/lf-ui-sot-001-close-verify-and-smoke.test.cjs
_project/runs/LF-UI-SOT-001_CLOSE_VERIFY_AND_SMOKE.md
```

This guard protects the honest status of the stage:

```txt
TECH_DONE / ROUTING_SOT_GUARD_ADDED / CLOSE_VERIFY_GUARD_ADDED / NEEDS_LOCAL_COMMAND_CONFIRMATION / NEEDS_MANUAL_SMOKE / FULL_ALIAS_POLICY_PENDING
```

It checks that the core `/case/:caseId` vs `/cases/:caseId` problem is closed, while `/today`, `/start`, `/support` and `/dev/funnel` remain explicit follow-up policy decisions.

Nie zamykac jako `ZAMKNIETE_FULL` or `FULL_ALIAS_POLICY_PASS` until the full alias policy is decided and guarded.

## Known legacy left intentionally

- `src/pages/Dashboard.tsx` still has legacy `/case/` links, but Dashboard is not mounted in `src/App.tsx`.
- `src/pages/Today.tsx` still has legacy `/case/` links, but Today route uses `TodayStable`.
- `src/components/Layout.tsx` still recognizes `/case/` for nav highlighting because alias URLs can exist before redirect.
- Old repair scripts may still mention `/case/` in historical strings. They are not active route SOT.

## Verification

Previously recorded PASS:

```txt
npm run guard:routes:canonical
node --test tests/routes-canonical.test.cjs tests/stage233a-route-canonicalization.test.cjs tests/lead-start-service-case-redirect.test.cjs tests/lead-service-mode-v1.test.cjs
node scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs
node --test tests/stage232i3-owner-control-missing-blocker-cross-entity-integration.test.cjs
```

Closeout verification added in this stage:

```txt
node scripts/check-lf-ui-sot-001-close-verify-and-smoke.cjs
node --test tests/routes-canonical.test.cjs tests/lf-ui-sot-001-close-verify-and-smoke.test.cjs
```

LOCAL_COMMANDS_PENDING:

```txt
npm run guard:routes:canonical
node scripts/check-lf-ui-sot-001-close-verify-and-smoke.cjs
node --test tests/routes-canonical.test.cjs tests/lf-ui-sot-001-close-verify-and-smoke.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

Known unrelated red:

```txt
tests/fin15-lead-finance-ghosts.test.cjs
```

Reason: existing `LeadDetail.tsx` still contains FIN-15 forbidden finance tokens such as `createPaymentInSupabase`. This is outside canonical routing and was not fixed in this stage.

## Manual test for Damian

Open:

- `/cases`
- `/cases/:caseId`
- `/case/:caseId`
- `/leads`
- `/leads/:leadId`
- `/`
- `/today`
- `/calendar`
- `/funnel`

Expected:

- `/cases/:caseId` renders CaseDetail.
- `/case/:caseId` redirects with replace to `/cases/:caseId`.
- Lead service handoff opens canonical CaseDetail.
- No duplicate CaseDetail component route renders from alias.

## Follow-up

If Damian wants full alias purity, use a separate small stage:

```txt
LF-UI-SOT-001R2_ROUTE_ALIAS_POLICY_CLOSEOUT
```

Questions for R2:

- should `/today` redirect replace to `/`, or remain a release-candidate smoke alias?
- should `/start` redirect replace to `/login`, or remain auth-entry alias behavior?
- should `/support` redirect replace to `/help`?
- should `/dev/funnel` remain DEV-only legacy route?

Do not mix R2 with CSS, layout, cards, icons, business data or runtime refactor.
