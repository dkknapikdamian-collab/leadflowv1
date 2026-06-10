# STAGE231D3-R7 — Client finance costs rollup mass clean

- date: 2026-06-10 20:05 Europe/Warsaw
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- status: LOCAL_ONLY_PACKAGE_PREPARED

## Scope

Mass-clean failed D3 attempts and add client-level case cost rollup in `FinanceMiniSummary.tsx`.

## Guard plan

- check:stage231d3-client-finance-costs-rollup
- test:stage231d3-client-finance-costs-rollup
- D2-R5 render crash guard
- D2 case costs guard
- D2-R3 Vercel function budget guard
- D1 cost model guard
- D0/D0A visual regressions
- Polish encoding guard
- build
- git diff --check

## Risk audit

- Main risk: adding client-level cost fetch can make client finance depend on case_costs availability.
- Mitigation: catch errors and fall back to empty costs; keep existing finance rows usable.
- Vercel risk: no new api/*.ts file; still consolidated under `/api/cases?resource=costs`.
