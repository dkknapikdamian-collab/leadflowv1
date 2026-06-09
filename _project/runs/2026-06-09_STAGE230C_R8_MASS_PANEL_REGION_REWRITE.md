# STAGE230C R8 - mass panel region rewrite

Date: 2026-06-09 Europe/Warsaw
Status: LOCAL_ONLY_PACKAGE_PREPARED / DO_TEST_AND_PUSH
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Scan-first evidence
Read/verified by package:
- AGENTS.md
- _project/07_NEXT_STEPS.md
- _project/03_CURRENT_STAGE.md
- _project/06_GUARDS_AND_TESTS.md
- _project/08_CHANGELOG_AI.md
- _project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md
- _project/13_TEST_HISTORY.md
- src/pages/AiDrafts.tsx
- src/styles/visual-stage9-ai-drafts-vnext.css
- Stage230B/Stage230C guards and tests

## FAKTY
- Previous local R2-R7 hotfix attempts left broken JSX/guard syntax in the local working tree.
- R8 rewrites the entire quick capture panel region and uses mass syntax/build preflight.

## DECYZJE
- No automatic deduplication in this stage.
- Fix visibility/readability and broken JSX only.

## Tests
- node --check Stage230B/Stage230C/R8 guards and tests
- Stage230B guard/test
- Stage230C guard/test
- Stage230C-R2/R8 guard/test
- npm run build
- git diff --check

## Manual QA
- /ai-drafts mobile
- Szybki szkic text visible
- Debug dyktowania visible
- Kopiuj trace / Wyczyść trace visible
- Copy trace works after dictation event
