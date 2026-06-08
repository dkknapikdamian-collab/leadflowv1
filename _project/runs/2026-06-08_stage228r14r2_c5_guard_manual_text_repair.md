# Stage228R14 R2 / C5 - Guard manual wording repair

- date: 2026-06-08 21:15 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- mode: LOCAL_ONLY_UNTIL_MANUAL_C5_PASS

## Problem

Stage228R14 runtime/documentation patch applied locally, but R14 guard failed:

```
STAGE228R14_C5_MISSING_ITEMS_NO_SQL_DECISION_FAIL: C5 manual test plan missing token: LeadDetail -> Brak -> Rozwiąż brak -> refresh
```

## Przyczyna

Guard oczekiwal skroconego tokena testu manualnego.
Rzeczywisty test w _project/05_MANUAL_TESTS.md jest bardziej szczegolowy:

```
LeadDetail -> Brak -> save -> refresh -> visible -> Rozwiąż brak -> refresh -> hidden
```

Czyli dokumentacja byla poprawna, a guard byl za sztywny.

## Naprawa

- Rewrite R14 guard.
- Guard akceptuje szczegolowe wording testu manualnego.
- Dalej wymaga:
  - decyzji no-SQL,
  - R11/R12/R13 kontraktow,
  - braku missing_items/blockers SQL,
  - next step: batch push dopiero po manual PASS.

## Testy

- node scripts/check-stage228r11-shared-missing-item-flow.cjs
- node scripts/check-stage228r12-context-action-blocker-host.cjs
- node scripts/check-stage228r13-missing-item-status-resolve.cjs
- node scripts/check-stage228r14-c5-missing-items-no-sql-decision.cjs
- npm run build
- git diff --check

## Audyt ryzyk

- Guard-only repair.
- No runtime/SQL/RLS/finance/layout change.
- Stage remains local-only until manual C5 PASS.
