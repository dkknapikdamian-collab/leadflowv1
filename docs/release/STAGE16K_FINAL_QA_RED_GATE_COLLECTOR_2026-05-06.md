# STAGE16K — Final QA Red Gate Collector

Cel: zebrać wszystkie czerwone gatey release candidate naraz, zamiast zatrzymywać się na pierwszym `assert`.

Zakres:
- dodaje `scripts/collect-stage16k-final-qa-red-gates.cjs`,
- dodaje skrypt `check:final-qa-red-gates:collect` do `package.json`,
- uruchamia główne checki release i testy z release gate pojedynczo,
- zapisuje raport do:
  - `docs/release/FINAL_QA_RED_GATES_2026-05-06.md`,
  - `docs/release/FINAL_QA_RED_GATES_2026-05-06.json`,
  - `test-results/stage16k-red-gates/`.

Nie robi commita.
Nie robi pusha.
Nie naprawia funkcji produktowych.
