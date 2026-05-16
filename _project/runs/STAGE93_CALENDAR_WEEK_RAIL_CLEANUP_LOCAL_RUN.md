# Stage93 calendar week rail cleanup V5 — local ZIP run

Date: 2026-05-16
Mode: local ZIP, no commit/push.

## FACTS FROM CODE / FILES
- Calendar week view had an active `calendar-week-visible-days-v3` rail and an obsolete hidden `calendar-week-filter-list hidden` render.
- Stage93 V5 replaces the whole week rail body between stable markers and removes the hidden legacy filter.
- The week rail count uses `calendar-week-day-count-text`, plain text, not a rounded badge/plaque.

## DECISIONS FROM DAMIAN
- Remove the obsolete week filter / hidden list entirely.
- Keep simple day selection only if it is visually clean.
- Count such as `1 rzecz` must be text, not a dark badge/plaque.

## AUTOMATED TESTS / GUARDS
- Added/updated `tests/stage93-calendar-week-rail-cleanup.test.cjs`.
- Wired the guard into `scripts/closeflow-release-check-quiet.cjs`.

## MANUAL TESTS
- TEST RECZNY DO WYKONANIA: open `/calendar` at desktop 2048x972 and normal zoom.
- Confirm `Dzisiaj`, full date label, and `1 rzecz` render as clean text.
- Confirm there is no black count badge/plaque and no old hidden week list.

## OBSIDIAN IMPACT
- Dashboard receives P1 note: old week filter / black badge removed.

## GIT / ZIP STATUS
- Local patch only. No commit/push.
