# Stage228R12 - ContextActionDialogs blocker host

- date: 2026-06-08 20:10 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- baseline: Stage228R11 locked the existing lightweight Brak flow.
- decision: Brak becomes a first-class ContextActionDialogs action kind: blocker.
- SQL: not required in this stage.

## Changes

- src/lib/context-action-contract.ts adds blocker to context action contract.
- src/components/ContextActionDialogs.tsx hosts MissingItemQuickActionModal and persists Brak for lead/client/case.
- LeadDetail Brak quick action routes to openLeadContextAction('blocker').
- ClientDetail Brak action routes to openClientContextAction('blocker').
- CaseQuickActions Brak routes to openSharedAction('blocker') and no longer owns a local AddCaseMissingItemDialog instance.
- R11 guard repaired to accept R12 architecture.
- R12 guard added and wired into prebuild.

## Tests

- node scripts/check-stage228r11-shared-missing-item-flow.cjs
- node scripts/check-stage228r12-context-action-blocker-host.cjs
- npm run build
- git diff --check

## Manual test

1. LeadDetail -> Brak -> save -> refresh -> visible in Braki i blokady.
2. ClientDetail -> Brak -> save -> refresh -> visible in Braki i blokady.
3. CaseDetail -> Szybkie akcje -> Brak -> save -> refresh -> visible as missing case item/action.
4. Confirm Notatka/Zadanie/Wydarzenie still open through shared host.

## Risk audit

- No SQL/RLS change.
- Case uses case_items while lead/client use task/activity by design.
- Existing local lead/client missing modal code may remain as compatibility/deprecated path, but active triggers route through ContextActionDialogs blocker.
- Future one-table missing_items model remains a separate migration stage.
