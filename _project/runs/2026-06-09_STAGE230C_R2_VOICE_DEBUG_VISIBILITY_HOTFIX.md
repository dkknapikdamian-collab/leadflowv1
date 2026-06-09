# STAGE230C-R2 - Voice debug visibility/readability hotfix

Date: 2026-06-09 Europe/Warsaw
Status: LOCAL_ONLY_PACKAGE_PREPARED / DO_TEST_AND_PUSH
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Scan-first evidence

Read/verified by package before patch:
- AGENTS.md
- _project/07_NEXT_STEPS.md
- _project/03_CURRENT_STAGE.md
- _project/06_GUARDS_AND_TESTS.md
- _project/08_CHANGELOG_AI.md
- _project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md
- _project/13_TEST_HISTORY.md
- src/pages/AiDrafts.tsx
- src/styles/visual-stage9-ai-drafts-vnext.css
- scripts/check-stage230b-quick-capture-inbox.cjs
- scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs
- tests/stage230b-quick-capture-inbox.test.cjs
- tests/stage230c-phone-dictation-duplicate-words-audit.test.cjs

## FAKTY

- Damian reported that copied trace is not visible/discoverable.
- Damian reported white text in the input / button area.
- Text duplication still happens, so this is not a dedupe stage.

## Implemented

- Trace box is visible with instructions even before debug is enabled.
- Kopiuj trace / Wyczyść trace buttons are visible, disabled only when no trace exists.
- Added trace limit label.
- Added scoped high-specificity CSS for textarea text, placeholder, caret, save button, trace buttons and trace rows.
- Added Stage230C-R2 guard/test.

## Not changed

- No automatic deduplication.
- No AI parser.
- No Supabase schema.
- No approval engine.
- No save flow mutation.

## Tests to run

- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- node scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs
- node --test tests/stage230c-phone-dictation-duplicate-words-audit.test.cjs
- node scripts/check-stage230c-r2-voice-debug-visibility-hotfix.cjs
- node --test tests/stage230c-r2-voice-debug-visibility-hotfix.test.cjs
- npm run build
- git diff --check

## Manual QA

1. Open /ai-drafts.
2. Confirm typed text in Szybki szkic is dark and visible.
3. Confirm save button disabled/enabled text is visible.
4. Confirm Debug dyktowania panel shows Kopiuj trace and Wyczyść trace.
5. Enable debug, dictate on phone and copy trace.
6. Paste trace into chat for Stage230C2 decision.
