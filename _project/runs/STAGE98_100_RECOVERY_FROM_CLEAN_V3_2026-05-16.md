# STAGE98_100_RECOVERY_FROM_CLEAN_V3

FAKTY:
- Recovery from clean HEAD after Stage101 rollback.
- Scope: Stage98/99/100 only plus Stage32/96 compatibility marker.
- No commit. No push.

TESTY DO WYKONANIA:
- node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
- node --test tests/stage99-calendar-active-class-contract.test.cjs
- node --test tests/stage100-calendar-week-plan-entry-visible.test.cjs
- node --test tests/stage32-leads-value-right-rail.test.cjs
- node --test tests/stage96-leads-right-rail-width-position.test.cjs
- node scripts/closeflow-release-check-quiet.cjs
