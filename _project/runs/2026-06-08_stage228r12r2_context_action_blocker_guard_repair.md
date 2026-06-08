# Stage228R12 R2 - ContextActionDialogs blocker guard repair

- date: 2026-06-08 20:25 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- baseline:
  - Stage228R12 runtime patch was applied locally.
  - Apply failed on R11 guard before build.
- issue:
  - R11 guard had a generated argument order bug.
  - It called requireText(contextHost, 'ContextActionDialogs host') without a real token, so the error was: undefined missing token: ContextActionDialogs host.
- fix:
  - Rewrite R11 guard as R12-compatible.
  - Rewrite R12 guard with stable token checks.
  - Ensure package.json contains both R11 and R12 guard scripts in prebuild.
- tests:
  - node scripts/check-stage228r11-shared-missing-item-flow.cjs
  - node scripts/check-stage228r12-context-action-blocker-host.cjs
  - npm run build
  - git diff --check
- manual test:
  1. LeadDetail -> Brak -> save -> refresh -> visible in Braki i blokady.
  2. ClientDetail -> Brak -> save -> refresh -> visible in Braki i blokady.
  3. CaseDetail -> Szybkie akcje -> Brak -> save -> refresh -> visible as missing case item/action.
  4. Regression: Notatka/Zadanie/Wydarzenie still open.
- risk audit:
  - Guard-only repair over partially applied R12 runtime.
  - No SQL/RLS/finance changes.
  - Case still uses case_items; lead/client use task/activity by design.
