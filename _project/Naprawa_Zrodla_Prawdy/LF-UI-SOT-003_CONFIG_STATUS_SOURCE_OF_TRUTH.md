# LF-UI-SOT-003 - Centralny config danych, statusow i contentu

Status: DONE / CONFIG_SOT_GUARD_ADDED / NO_LAYOUT_CSS_REFACTOR
Date: 2026-06-28 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch checked: dev-rollout-freeze
Scope: status labels, tones, badge/risk/funnel/work-item config source of truth

## Scan report

- Project: CloseFlow / LeadFlow.
- Read mode: minimalny stage source-of-truth, bez pelnego Obsidiana i bez UI/CSS refactoru.
- Files read:
  - `AGENTS.md`
  - `_project/00_AI_START_SPIS_TRESCI.md`
  - `_project/Naprawa_Zrodla_Prawdy/00_START_NAPRAWA_ZRODLA_PRAWDY.md`
  - `src/lib/domain-statuses.ts`
  - `src/lib/cases.ts`
  - `src/lib/lead-health.ts`
  - `src/lib/record-operational-badges.ts`
  - `src/lib/owner-control/owner-control-baseline.ts`
  - `src/lib/owner-control/owner-risk-rules.ts`
  - `src/lib/owner-control/sales-funnel-movement.ts`
  - selected active pages: `Leads`, `LeadDetail`, `Cases`, `ClientDetail`, `CaseDetail`, `SalesFunnel`
- Files intentionally not read:
  - full Obsidian vault and `obsidian_updates`
  - migrations, SQL, Supabase/Firebase/API implementation
  - layout/CSS visual refactor targets
  - inactive preview HTML and historical stage files
- Current stage: `LF-UI-SOT-003 - Centralny config danych, statusow i contentu`.
- Active decisions:
  - canonical config folder is `src/lib/config/`;
  - existing `src/lib/domain-statuses.ts` remains domain normalizer source;
  - pages consume config wrappers instead of local status maps;
  - no visual/CSS semantics are edited in this stage.
- Open risks:
  - repo has pre-existing dirty worktree outside this stage;
  - some finance-specific labels remain in finance components and are re-exported through config instead of rewritten;
  - `ClientDetail` and `CaseDetail` still need later modular cleanup, but their status labels/classes now point at config.

## Canonical config files

- `src/lib/config/lead-status.ts`
- `src/lib/config/case-status.ts`
- `src/lib/config/client-status.ts`
- `src/lib/config/funnel-stages.ts`
- `src/lib/config/badges.ts`
- `src/lib/config/owner-risk.ts`
- `src/lib/config/calendar-status.ts`
- `src/lib/config/finance.ts`
- `src/lib/config/index.ts`

## Runtime files updated

- `src/pages/Leads.tsx`
- `src/pages/LeadDetail.tsx`
- `src/pages/Cases.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/CaseDetail.tsx`
- `src/pages/SalesFunnel.tsx`
- `src/lib/cases.ts`
- `src/lib/options.ts`

## Guard

Npm script:

```txt
npm run guard:config:status-source-of-truth
```

Guard file:

```txt
scripts/check-config-status-source-of-truth.cjs
```

Test file:

```txt
tests/config-status-source-of-truth.test.cjs
```

Guard checks:

- required config files exist;
- lead/case/client status labels and tones live in `src/lib/config`;
- funnel owner tile labels/risk labels live in `src/lib/config/funnel-stages.ts`;
- work item Done/calendar labels live in `src/lib/config/calendar-status.ts`;
- finance labels are exposed through `src/lib/config/finance.ts`;
- active pages do not declare local `STATUS_OPTIONS` arrays or local status label maps;
- `src/lib/cases.ts` and `src/lib/options.ts` reuse config bridges.

## Verification

Required:

```txt
npm run guard:config:status-source-of-truth
node --test tests/config-status-source-of-truth.test.cjs
git diff --check
```

Recommended after this stage:

```txt
npm run guard:routes:canonical
npm run guard:ui:patch-layers
```

## Manual test for Damian

Check:

- lead with multiple statuses in Leads and Lead Detail;
- case with multiple statuses in Cases and Case Detail;
- client active case status in Client Detail;
- Funnel risk badges and owner filters;
- Today/Done/work item labels in places touched by shared status helpers.

Expected:

- labels and tones stay consistent between list/detail/funnel;
- changing a status label in `src/lib/config/*` changes all touched screens;
- active page components no longer own local status maps.
