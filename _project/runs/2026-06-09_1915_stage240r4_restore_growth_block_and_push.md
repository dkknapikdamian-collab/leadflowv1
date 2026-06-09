# Stage240R4 - restore growth backlog and finish AI Opportunity Finder roadmap

- data i godzina: 2026-06-09 19:15 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: roadmap repair / guard compatibility / future high-value module
- status: prepared by ZIP runner

## Powód

Stage240R3 poprawił trailing whitespace, ale przy naprawie bloku zastąpił część starego growth backlogu. Przez to `check-stage230a-ai-draft-inbox-roadmap.cjs` przestał widzieć wymagany kontrakt Smart Prospecting jako modułu CloseFlow.

## Zakres

- odtworzyć pełny blok Stage230 między markerami,
- zachować nowy wpis `LeadFlow AI Opportunity Finder`,
- zachować stary growth backlog `STAGE240_LEADFLOW_SMART_PROSPECTING_OPPORTUNITY_FINDER`,
- uruchomić Stage240R2 guard/test i Stage230A guard/test.

## Testy

- node scripts/check-stage240r2-ai-opportunity-finder-roadmap.cjs
- node --test tests/stage240r2-ai-opportunity-finder-roadmap.test.cjs
- node scripts/check-stage230a-ai-draft-inbox-roadmap.cjs
- node --test tests/stage230a-ai-draft-inbox-roadmap.test.cjs
- git diff --check -- scoped allowlist
- git diff --cached --check

## Audyt ryzyk

- Runtime aplikacji nie jest dotykany.
- SQL, AI endpointy i providerzy nie są dotykane.
- Naprawa dotyczy wyłącznie roadmapy i guardów.
