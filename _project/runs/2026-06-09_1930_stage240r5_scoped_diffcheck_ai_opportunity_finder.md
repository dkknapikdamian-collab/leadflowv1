# Stage240R5 - scoped diff-check for AI Opportunity Finder roadmap

- data i godzina: 2026-06-09 19:30 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: roadmap closure / scoped diff-check repair
- status: prepared by ZIP runner

## Powód

Stage240R4 przeszedł guardy Stage240R2 i Stage230A, ale zatrzymał się na globalnym `git diff --check`, bo w working tree istnieje równoległa lokalna praca Stage230B z trailing whitespace w `src/pages/AiDrafts.tsx`.

To nie jest błąd roadmapy Stage240. R5 używa scoped diff-check tylko dla plików roadmapy i guardów Stage240, żeby nie mieszać dokumentacyjnego commita z niezatwierdzonym runtime Stage230B.

## Zakres

- nie ruszać `src/pages/AiDrafts.tsx`,
- nie ruszać CSS Stage230B,
- nie ruszać `AGENTS.md`,
- nie ruszać SQL ani providerów AI,
- commitować tylko roadmapę AI Opportunity Finder, guardy i wpisy pamięci Stage240.

## Testy

- node scripts/check-stage240r2-ai-opportunity-finder-roadmap.cjs
- node --test tests/stage240r2-ai-opportunity-finder-roadmap.test.cjs
- node scripts/check-stage230a-ai-draft-inbox-roadmap.cjs
- node --test tests/stage230a-ai-draft-inbox-roadmap.test.cjs
- git diff --check -- scoped allowlist
- git diff --cached --check

## Audyt ryzyk

- Równoległy Stage230B nadal wymaga osobnego `git diff --check` i naprawy trailing whitespace przed swoim commitem.
- Ten etap nie może przypadkiem dodać runtime plików Stage230B.
- Po pushu status lokalny może nadal pokazywać zmiany Stage230B i `AGENTS.md`; to jest oczekiwane.
