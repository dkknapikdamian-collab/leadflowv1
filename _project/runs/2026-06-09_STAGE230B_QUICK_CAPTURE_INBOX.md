# STAGE230B - Quick Capture Inbox bez AI

Date: 2026-06-09 19:20 Europe/Warsaw
Status: LOCAL_ONLY_APPLIED_BY_ZIP_R6 / DO_MANUAL_QA_AND_PUSH
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Scan-first evidence
Read/verified by package before patch:
- AGENTS.md
- _project/07_NEXT_STEPS.md
- _project/06_GUARDS_AND_TESTS.md
- _project/08_CHANGELOG_AI.md
- _project/13_TEST_HISTORY.md
- src/pages/AiDrafts.tsx
- src/lib/ai-drafts.ts
- src/lib/ai-draft-approval.ts
- src/lib/supabase-fallback.ts
- src/App.tsx
- src/styles/visual-stage9-ai-drafts-vnext.css

## Implemented
- Added Szybki szkic panel on /ai-drafts.
- Raw text is saved through saveAiLeadDraftAsync.
- Source: quick_capture.
- Type: note.
- parsedDraft.stage: STAGE230B_QUICK_CAPTURE_INBOX.
- parsedDraft.captureMode: quick_capture_raw.
- Textarea is cleared only after successful save.
- reloadDrafts runs after save.
- Added Szybki szkic label for raw quick capture drafts.
- Added Stage230B guard and node test.

## Not implemented by design
- No AI parser.
- No Gemini.
- No Cloudflare AI.
- No custom microphone JavaScript.
- No SQL.
- No dedupe for phone dictation; this belongs to Stage230C.

## Dirty-file boundary
Before R6, _project/07_NEXT_STEPS.md was already dirty in the local repo. R6 did not modify that file to avoid mixing Stage230B with unrelated Stage240/local changes. Update/commit _project/07 only after unrelated changes are resolved.

## Tests to run
- node scripts/check-stage230b-quick-capture-inbox.cjs
- node --test tests/stage230b-quick-capture-inbox.test.cjs
- node scripts/check-stage230a-ai-draft-inbox-roadmap.cjs
- node --test tests/stage230a-ai-draft-inbox-roadmap.test.cjs
- npm run build
- git diff --check

## Manual QA
1. Open /ai-drafts on desktop.
2. Save: Dzwonił Marek z Tarnowa, numer 500600700, chce ofertę na dom 120 metrów, oddzwonić jutro po 10.
3. Confirm text clears only after success.
4. Refresh F5 and confirm draft remains in Inbox.
5. Open the draft and confirm it can be approved later as lead/task/event/note.
6. Repeat on mobile using system keyboard dictation.
7. If duplicated words appear, record under Stage230C and do not fix in Stage230B.

## Risk audit
- If Supabase rejects parsedDraft/source/type/status, stop and prepare Stage230B-SQL separately.
- Existing note approval requires relation for final note conversion; this stage only captures raw draft and does not change that approval contract.
- Existing build warning about duplicate savedRecord in ContextActionDialogs.tsx is outside Stage230B.
- Existing local dirty files outside this stage must not be included in the Stage230B commit.
