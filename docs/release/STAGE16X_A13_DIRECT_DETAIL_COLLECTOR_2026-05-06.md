# STAGE16X A13 DIRECT DETAIL COLLECTOR 2026-05-06

Cel: zebrać pełny, nieskrócony powód ostatniego czerwonego `test:critical`.

Zakres:
- uruchamia `scripts/check-a13-critical-regressions.cjs` bez compact runnera,
- uruchamia wrapper `tests/a13-critical-regressions.test.cjs`,
- uruchamia `scripts/run-tests-compact.cjs --critical`,
- zapisuje pełne stdout/stderr w `test-results/stage16x-a13-direct-details/`,
- zapisuje raport w `docs/release/STAGE16X_A13_DIRECT_DETAILS_2026-05-06.md`.

Nie naprawia kodu.
Nie commituję.
Nie pushuję.
