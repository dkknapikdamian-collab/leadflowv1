# 04_ETAPY_DO_ZATWIERDZENIA_Z_AUDYTU_DIRTY_WORKTREE_2026_06_28

Date: 2026-06-28 03:30 Europe/Warsaw
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Canonical queue target: `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
Source: `LF-LOCAL-DIRTY-WORKTREE-SEGREGATION`

## Status

DO_SCALENIA_Z_CENTRALNA_KOLEJKA / DO_ZATWIERDZENIA_PRZEZ_DAMIANA / WYMAGA_AUDYTU_PLIKOW_PRZED_WDROZENIEM

## Why this file exists

The central queue file `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` is the canonical stage queue. This file is a controlled intake/addendum created from dirty-worktree audit findings. It must be merged into the canonical queue before any implementation starts.

Do not implement anything from this file directly without:

1. confirming whether the stage is already implemented or partially implemented,
2. auditing listed files,
3. isolating local dirty files or creating a clean stage branch,
4. adding/confirming guards and tests,
5. updating Obsidian.

## Global rule for all findings below

Status for every item below:

```txt
DO_ZATWIERDZENIA / DO_WERYFIKACJI_PRZED_WDROZENIEM / WYMAGA_AUDYTU_PLIKOW
```

None of these findings belongs to closed `LF-UI-SOT-002R2`.
No dirty local file is approved for discard from current logs alone.
No dirty local file is approved for push as a mixed commit.

---

## 1. A24_LEAD_TO_CASE_ROUTE_HELPER_CONTRACT

Status:

```txt
DO_ZATWIERDZENIA / DO_WERYFIKACJI_PRZED_WDROZENIEM / WYMAGA_AUDYTU_PLIKOW
```

Source finding:

- `scripts/check-a24-lead-to-case-flow.cjs` local diff expects `caseDetailPath(startServiceSuccess.caseId)` instead of manual `/case/...` evidence.
- `tests/lead-service-mode-v1.test.cjs` expects canonical helper navigation.
- `tests/lead-start-service-case-redirect.test.cjs` is dirty and must be inspected.

Files to audit before implementation:

```txt
scripts/check-a24-lead-to-case-flow.cjs
tests/lead-service-mode-v1.test.cjs
tests/lead-start-service-case-redirect.test.cjs
src/pages/LeadDetail.tsx
src/lib/routes.ts
src/App.tsx
```

Do not touch:

- UI layout/CSS,
- finance ghosts,
- status/config source of truth,
- Today/STAGE233B.

Required pre-implementation audit:

- confirm current `LeadDetail` navigation after start service,
- confirm canonical helper used or missing,
- confirm whether tests already pass on clean branch,
- confirm no manual `/case/:id` or `/cases/:id` construction remains in this path.

---

## 2. FIN15_LEAD_FINANCE_GHOSTS_CANONICAL_ROUTE_HELPER

Status:

```txt
DO_ZATWIERDZENIA / DO_WERYFIKACJI_PRZED_WDROZENIEM / WYMAGA_AUDYTU_PLIKOW
```

Source finding:

- `scripts/check-fin15-lead-finance-ghosts.cjs` local diff expects `navigate(caseDetailPath(startServiceSuccess.caseId));`.
- The guard rejects manual `/case/:id` and `/cases/:id` route construction.
- `tests/fin15-lead-finance-ghosts.test.cjs` aligns with helper navigation and rejects manual route literals.

Files to audit before implementation:

```txt
scripts/check-fin15-lead-finance-ghosts.cjs
tests/fin15-lead-finance-ghosts.test.cjs
src/pages/LeadDetail.tsx
src/lib/routes.ts
src/lib/cases.ts
```

Do not touch:

- payment model beyond existing FIN15 contract,
- status/config SOT,
- Today/STAGE233B,
- unrelated finance UI.

Required pre-implementation audit:

- confirm FIN15 current failure/success state on clean branch,
- confirm route helper behavior is actually implemented in `LeadDetail`,
- confirm no financial ghost regression is hidden behind route cleanup.

---

## 3. LF_UI_SOT_003_CONFIG_STATUS_SOURCE_OF_TRUTH_RECONCILIATION

Status:

```txt
DO_ZATWIERDZENIA / KONFLIKT_DO_REKONSYLIACJI / WYMAGA_AUDYTU_PLIKOW_PRZED_JAKIMKOLWIEK_WDROZENIEM
```

Important note:

`_project/04_ETAPY_ROZWOJU_APLIKACJI.md` already contains `LF-UI-SOT-003_CONFIG_STATUS_SOURCE_OF_TRUTH` as `DONE / CONFIG_SOT_GUARD_ADDED / NO_LAYOUT_CSS_REFACTOR`. Dirty local diffs still show `src/lib/cases.ts` and `src/lib/options.ts` moving toward config files. This must be reconciled before treating SOT-003 as active or finished.

Source finding:

- `src/lib/cases.ts` imports `CASE_CLOSED_STATUSES` and `getCaseStatusLabel` from `./config/case-status`.
- `src/lib/options.ts` imports `LEAD_STATUS_OPTIONS` from `./config/lead-status` instead of `./domain-statuses`.

Files to audit before decision:

```txt
_project/04_ETAPY_ROZWOJU_APLIKACJI.md
_project/Naprawa_Zrodla_Prawdy/LF-UI-SOT-003_CONFIG_STATUS_SOURCE_OF_TRUTH.md
scripts/check-config-status-source-of-truth.cjs
tests/config-status-source-of-truth.test.cjs
src/lib/config/case-status.ts
src/lib/config/lead-status.ts
src/lib/cases.ts
src/lib/options.ts
src/pages/Leads.tsx
src/pages/LeadDetail.tsx
src/pages/Cases.tsx
src/pages/CaseDetail.tsx
src/pages/ClientDetail.tsx
src/pages/SalesFunnel.tsx
```

Required pre-implementation audit:

- check if SOT-003 is already fully implemented on branch,
- check whether local dirty files are obsolete drift after remote implementation,
- check guard/test output on clean workspace,
- decide whether to discard/stash local drift or create a small reconciliation stage.

Do not start this as a new implementation until the above audit is complete.

---

## 4. CF_RUNTIME_00_STAGE233B_SCOPE_COMPATIBILITY

Status:

```txt
DO_ZATWIERDZENIA / DO_WERYFIKACJI_PRZED_WDROZENIEM / WYMAGA_AUDYTU_PLIKOW
```

Source finding:

- `scripts/check-cf-runtime-00-source-truth.cjs` local diff adds `CF_RUNTIME_00_STAGE233B_TODAY_WORK_ITEM_READABILITY_ZOOM_FIX_SCOPE_COMPAT`.
- The allowlist is extended for TodayStable, canvas CSS, work-item-card CSS, Today cleanup guard/test and STAGE116 work item card test.

Files to audit before implementation:

```txt
scripts/check-cf-runtime-00-source-truth.cjs
src/pages/TodayStable.tsx
src/styles/closeflow-canvas-runtime-source-truth-stage211j.css
src/styles/work-item-card.css
scripts/check-stage232t-r1c-today-production-ui-cleanup-and-source-truth.cjs
tests/stage232t-r1c-today-production-ui-cleanup-and-source-truth.test.cjs
tests/stage116-today-work-item-card-source-truth.test.cjs
```

Required pre-implementation audit:

- confirm whether STAGE233B is approved as a separate visual/source-truth stage,
- confirm CF-RUNTIME-00 allowlist is not silently hiding unrelated files,
- confirm exact UI/CSS diff before any scope authorization.

---

## 5. STAGE233B_TODAY_WORK_ITEM_READABILITY_ZOOM_FIX

Status:

```txt
DO_ZATWIERDZENIA / DO_WERYFIKACJI_PRZED_WDROZENIEM / WYMAGA_AUDYTU_PLIKOW
```

Source finding:

- `src/pages/TodayStable.tsx` local diff changes Today section grid from `xl:grid-cols-3` to `2xl:grid-cols-3`.
- `src/styles/closeflow-canvas-runtime-source-truth-stage211j.css` comments STAGE233B readability/zoom goal.
- `src/styles/work-item-card.css` and related tests are dirty but need complete diff inspection.

Files to audit before implementation:

```txt
src/pages/TodayStable.tsx
src/styles/closeflow-canvas-runtime-source-truth-stage211j.css
src/styles/work-item-card.css
tests/stage116-today-work-item-card-source-truth.test.cjs
scripts/check-stage232t-r1c-today-production-ui-cleanup-and-source-truth.cjs
tests/stage232t-r1c-today-production-ui-cleanup-and-source-truth.test.cjs
```

Do not touch:

- routes,
- config/status SOT,
- finance ghosts,
- owner-control I3.

Required pre-implementation audit:

- screenshot/visual check at 100 percent and 120 percent zoom,
- confirm active route is `TodayStable`,
- confirm no CSS plaster or extra layer is being added,
- confirm guard/test detects readability contract.

---

## 6. STAGE232I3_OWNER_CONTROL_ROUTE_HELPER_FOLLOWUP

Status:

```txt
DO_ZATWIERDZENIA / DO_WERYFIKACJI_PRZED_WDROZENIEM / WYMAGA_AUDYTU_PLIKOW
```

Source finding:

- `scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs` local diff changes route expectations from manual `/leads`, `/case`, `/clients` strings to helper calls.
- Test file aligns with `leadDetailPath(sourceEntityId)`, `caseDetailPath(sourceEntityId)`, `clientDetailPath(sourceEntityId)`.

Files to audit before implementation:

```txt
scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs
tests/stage232i3-owner-control-missing-blocker-cross-entity-integration.test.cjs
src/lib/owner-control/owner-control-missing-blockers.ts
src/lib/routes.ts
```

Required pre-implementation audit:

- confirm helper import/use in owner-control missing blockers,
- confirm canonical route guard already covers this or needs I3-specific follow-up,
- confirm no data/business logic changes are mixed in.

---

## 7. STAGE233A_ROUTE_CANONICALIZATION_GUARD_ALIGNMENT

Status:

```txt
DO_ZATWIERDZENIA / DO_WERYFIKACJI_PRZED_WDROZENIEM / WYMAGA_AUDYTU_PLIKOW
```

Source finding:

- `scripts/check-stage233a-route-canonicalization.cjs` local diff makes route helper evidence stricter around `CLOSEFLOW_ROUTES.cases` and `encodeRouteId`.
- App route evidence moves from hardcoded JSX route strings to `CLOSEFLOW_ROUTES.caseDetail`, `CLOSEFLOW_ROUTES.legacyCaseDetail`, and `loginPath()`.

Files to audit before implementation:

```txt
scripts/check-stage233a-route-canonicalization.cjs
tests/stage233a-route-canonicalization.test.cjs
src/App.tsx
src/lib/routes.ts
src/pages/Cases.tsx
src/pages/LeadDetail.tsx
```

Required pre-implementation audit:

- confirm current canonical route contract after LF-UI-SOT-001,
- confirm if this is already covered by `guard:routes:canonical`,
- confirm stricter guard does not conflict with existing accepted alias policy.

---

## Next operational decision

Recommended order:

1. Rescue stash dirty workspace if Damian wants a clean start.
2. Reconcile whether `LF-UI-SOT-003` is already done or only partially represented by local drift.
3. If not stashing, finish exactly one small bucket first; best candidate is `STAGE233A_ROUTE_CANONICALIZATION_GUARD_ALIGNMENT` because it is guard/test-oriented and supports Route SOT.

No implementation should start from this intake file without a fresh file audit.
