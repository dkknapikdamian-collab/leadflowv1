# STAGE230C R15 - guard split + visual source truth

Date: 2026-06-09 Europe/Warsaw
Status: LOCAL_ONLY_PACKAGE_PREPARED / DO_TEST_AND_PUSH
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Scan-first evidence
- AGENTS.md
- _project/
- src/pages/AiDrafts.tsx
- src/styles/visual-stage9-ai-drafts-vnext.css
- src/styles/visual-stage20-lead-form-vnext.css
- Stage230B/230C/R2/R10 guards/tests

## FAKTY
- Dublowanie dyktowania jest zależne od jednego telefonu.
- Szybki szkic wymaga spójnego source truth wizualnego z formularzami lead/client.
- Poprzednie guardy R2 myliły odpowiedzialność widoczności diagnostyki z R10 visual source truth.

## Implemented
- R2 visibility guard/test stabilized.
- R10 visual source truth guard/test stabilized.
- Quick capture source truth markers repaired.
- Scoped CSS for readable textarea/button contrast reinforced.

## Tests to run
- Stage230B guard/test
- Stage230C guard/test
- Stage230C-R2 guard/test
- Stage230C-R10 guard/test
- npm run build
- git diff --check

## Risk audit
- Manual phone visual QA required before push.
- Do not add AGENTS.md, _LOCAL_CHECKS, GLOBAL_STAGE_PROBLEM_AUDIT_RULE or failed R6/R7 artifacts.
