# STAGE93 guard fix + Stage94 Calendar UI sweep - local run

Generated: 2026-05-16T09:05:46.010Z

## FACTS FROM LOCAL PATCH

- This package overwrites only the Stage93 guard and adds a detection-only Calendar UI sweep script.
- It does not commit or push.
- It creates backups in `_project/backups/stage93-guard-fix-calendar-sweep-2026-05-16/`.

## WHY

Stage93 V5 wrote patch files but failed because the guard used a brittle end marker after `calendar-week-plan-list`.

## TESTS TO RUN

- `node --test tests/stage93-calendar-week-rail-cleanup.test.cjs`
- `node scripts/check-closeflow-calendar-ui-sweep-stage94.cjs`

## NEXT STEP

Use the sweep report to batch-fix remaining Calendar P1 issues.
