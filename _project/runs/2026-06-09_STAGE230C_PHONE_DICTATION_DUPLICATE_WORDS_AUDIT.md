# STAGE230C - Phone dictation duplicate-words audit

Date: 2026-06-09 Europe/Warsaw
Status: LOCAL_ONLY_PACKAGE_PREPARED / DO_TEST_AND_PUSH
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Scan-first evidence

Read by package before patch:
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
- tests/stage230b-quick-capture-inbox.test.cjs

## FAKTY z repo

- Stage230B quick capture exists and saves via saveAiLeadDraftAsync.
- Stage230C is listed as Phone dictation duplicate-words audit in the roadmap.
- This stage adds a local diagnostic trace only.

## DECYZJE

- No automatic deduplication in Stage230C.
- No AI parser, no Supabase schema, no approval engine changes.
- Trace is local, optional and visible only after enabling Debug dyktowania.

## Implemented

- Debug dyktowania checkbox in Szybki szkic.
- Local voice_input_event_trace.
- beforeinput/input/change/compositionstart/compositionupdate/compositionend/paste tracing.
- duplicate signal diagnostics.
- Wyczyść trace and Kopiuj trace.
- Stage230C guard/test.
- Project memory and Obsidian update payload.

## Tests to run

- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- node scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs
- node --test tests/stage230c-phone-dictation-duplicate-words-audit.test.cjs
- npm run build
- git diff --check

## Manual QA

1. Open /ai-drafts.
2. Enable Debug dyktowania.
3. Type manually.
4. Use phone dictation.
5. Copy trace if duplicated words appear.
6. Save draft.
7. Refresh F5.
8. Confirm raw draft remains in Inbox.

## Risk audit

- Trace can contain customer text tail tokens; keep it local and optional.
- If issue is browser/keyboard side, app mitigation requires a separate Stage230C2.
- Do not interpret this stage as a fix; it is evidence collection.
