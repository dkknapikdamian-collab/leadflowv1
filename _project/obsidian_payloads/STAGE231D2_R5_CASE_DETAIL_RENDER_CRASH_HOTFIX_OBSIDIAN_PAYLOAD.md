# CloseFlow / LeadFlow — STAGE231D2-R5 CaseDetail render crash hotfix

- data i godzina: 2026-06-10 Europe/Warsaw
- typ wpisu: production crash hotfix
- status: przygotowane lokalnie do PASS/push
- problem: CaseDetail wysypywał render przez ReferenceError: caseCostsSummaryStage231D2 is not defined
- decyzja: nie sprawdzamy lokalnie UI; hotfix ma odblokować produkcyjną kartę sprawy
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- pliki: src/pages/CaseDetail.tsx, scripts/check-stage231d2r5-case-detail-render-crash.cjs, tests/stage231d2r5-case-detail-render-crash.test.cjs
- testy: R5 guard/test + D2/D2R3/D1/D0/D0A/Polish/build
- audyt ryzyk po etapie: jeśli po R5 zostanie /api/case-items 500, to osobny backend hotfix, nie render crash
- następny krok: deploy i produkcyjny test otwarcia /cases/[id]
