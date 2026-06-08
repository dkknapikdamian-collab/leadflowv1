# Stage228R9 R6 - finish rollback CaseDetail layout to R9R2

- date: 2026-06-08 17:45 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- rollback target: 473ae740
- reverted bad stage: 4a1343a4 / Stage228R9R3-R9R4
- repair reason:
  - R9R5 partially restored the files but failed while writing reports because WriteAllText resolved relative paths against C:\WINDOWS\System32.
  - R9R6 repeats the restore and uses absolute repo paths for report writes.
- reason for rollback:
  - R9R3/R9R4 moved the CaseDetail shell into a page-level grid and visually broke the screen.
  - Header/card area became huge/empty and tabs/rail alignment became unreadable.
- fix:
  - Restore package.json, src/pages/CaseDetail.tsx and src/styles/case-detail-stage228r9-shell-rail-lift.css from 473ae740.
  - Remove R9R3/R9R4 guard/report/manifest files from active state.
  - Keep R9R2 as last accepted layout baseline.
- tests:
  - node scripts/check-stage228r9-case-detail-shell-rail-lift.cjs
  - npm run build
- manual test:
  - Open CaseDetail.
  - Layout should return to the state before R9R3/R9R4.
  - Szybkie akcje and Finanse sprawy should remain visible and usable.
- risk audit:
  - No SQL/data/finance changes.
  - This is a rollback of visual layout only.
  - Next layout attempt must be split into smaller stages:
    1. only shrink header/card height/width,
    2. only move tabs,
    3. only lift right rail after visual confirmation.