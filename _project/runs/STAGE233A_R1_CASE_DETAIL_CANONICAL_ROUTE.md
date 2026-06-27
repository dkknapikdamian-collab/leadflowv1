# STAGE233A_R1_CASE_DETAIL_CANONICAL_ROUTE

Status: TECH_PASS_SCOPE_BLOCKED_BY_UNRELATED_R6E / OWNER_SMOKE_PENDING
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Date: 2026-06-27 Europe/Warsaw

## Canonical Route Decision

- CaseDetail canonical route: `/cases/:caseId`.
- Legacy route: `/case/:caseId`.
- Legacy behavior: `/case/:caseId` redirects with `replace` to `/cases/:caseId`.

## Runtime Changes

- `src/App.tsx`: `/cases/:caseId` keeps rendering `CaseDetail`; `/case/:caseId` now renders `LegacyCaseRedirect`.
- `src/lib/routes.ts`: added `caseDetailPath(caseId)` helper.
- `src/pages/Cases.tsx`: title link, open icon link, and risk rail link now use `caseDetailPath(record.id)`.
- `src/lib/closeflow-runtime-source-truth.ts`: CaseDetail route truth flipped to canonical `/cases` and legacy `/case`.

## Similar Alias Findings Not Changed In R1

- `/help` and `/support` both render `SupportCenter`; recommended R2 decision: `/support -> /help` redirect replace.
- `/` and `/today` both render Today; current comments call `/today` a smoke alias, so leave until Damian decides.
- `/login` and `/start` both render Login for logged-out users; leave until public entry decision.
- `/dev/funnel` and `/funnel` are intentional DEV vs normal routes.
- `/case-templates -> /templates` is already implemented as redirect replace.
- `TodayStable.tsx` contains `/tasks/:id` recognition while router currently exposes `/tasks`; keep as R2 route-contract audit finding.

## Manual Smoke For Damian

1. Open `/cases`.
2. Click any case from the list.
3. URL should be `/cases/<id>`, not `/case/<id>`.
4. Sidebar should still highlight `Sprawy`.
5. Open `/case/<id>` manually.
6. App should redirect to `/cases/<id>`.
7. Browser Back must not loop.
8. `Blokery i ryzyko` right rail link should also open `/cases/<id>`.

## Local Verification

- `node scripts/check-stage233a-route-canonicalization.cjs`: PASS
- `node --test tests/stage233a-route-canonicalization.test.cjs`: PASS, 4/4
- `node --test tests/cf-runtime-00-source-truth.test.cjs`: PASS, 5/5
- `node scripts/check-cf-runtime-00-source-truth.cjs`: FAIL, unrelated out-of-scope R6E files detected:
  - `_project/runs/STAGE232T_R6E_CALENDAR_LEAD_DONE_NO_DUPLICATE.md`
  - `scripts/check-stage232t-r6e-calendar-lead-done-no-duplicate.cjs`
  - `tests/stage232t-r6e-calendar-lead-done-no-duplicate.test.cjs`
- `npm run build`: PASS
- `npm run verify:closeflow:quiet`: FAIL on same CF_RUNTIME_00 out-of-scope R6E files after earlier checks passed.
- `git diff --check`: PASS

## Scope Warning

Current worktree contains unrelated changes outside STAGE233A scope, including `src/pages/Calendar.tsx` and STAGE232T_R6E files. They were not touched by this stage. Per guard policy, do not push STAGE233A until the unrelated scope warning is resolved or explicitly allowlisted in its own stage.

## Not Touched

- SQL/RLS/migrations.
- Env files.
- Google Calendar.
- Finance.
- CaseDetail UI baseline R4.
- `/today`, `/start`, `/support`, `/dev/funnel`, `/case-templates` runtime behavior.
