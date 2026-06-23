# STAGE232G_R1A_WORK_ITEMS_TS_BUILD_HOTFIX_R2

Data: 2026-06-23 Europe/Warsaw
Status: LOCAL_APPLIED_PENDING_TEST

## Cel

Naprawić build/typecheck blocker w api/work-items.ts po R1A:

- blocksProgress/blocks_progress czytane przez helper kompatybilności,
- brak surowego existing.* poza zakresem,
- CF_RUNTIME_00 uzupełniony o pliki hotfixa,
- R1B pozostaje zablokowany do PASS/commit/push.

## Zakres

- api/work-items.ts
- scripts/check-stage232g-r1a-work-items-ts-build-hotfix.cjs
- scripts/check-cf-runtime-00-source-truth.cjs
- centralne _project/Obsidian docs

## Nie ruszano

- Calendar UI
- Today UI
- SQL
- finanse
- Owner Control
- Google OAuth/sync

## Testy

Do wykonania przez apply script:

- node scripts/check-stage232g-r1a-work-items-ts-build-hotfix.cjs
- node scripts/check-cf-runtime-00-source-truth.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
