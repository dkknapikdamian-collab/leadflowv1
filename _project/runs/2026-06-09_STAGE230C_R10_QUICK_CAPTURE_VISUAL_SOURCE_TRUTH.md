# STAGE230C R10 - quick capture visual source truth

Date: 2026-06-09 Europe/Warsaw
Status: LOCAL_ONLY_PACKAGE_PREPARED / DO_TEST_AND_PUSH
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Scan-first evidence

Read/used:
- AGENTS.md
- src/pages/AiDrafts.tsx
- src/components/ClientCreateDialog.tsx
- src/styles/visual-stage20-lead-form-vnext.css
- src/styles/visual-stage9-ai-drafts-vnext.css
- _project current/guards/changelog/risk/test history files

## Facts

- ClientCreateDialog uses lead-form-vnext-content, lead-form-section, lead-form-field and lead-form-textarea.
- visual-stage20-lead-form-vnext.css defines the form source truth: white background, dark #111827 text, visible focus, readable disabled controls.
- Quick capture on /ai-drafts had its own styles and could render white text on white background on phone.

## Implemented

- AiDrafts imports visual-stage20-lead-form-vnext.css.
- Quick capture section declares source truth marker: data-stage230c-r10-form-visual-source-truth="lead-form-vnext".
- Quick capture section uses lead-form-section/lead-form-primary-section.
- Quick capture textarea uses lead-form-textarea.
- R10 scoped CSS forces readable text, placeholder, caret and button colors.
- R10 guard/test added.

## Not changed

- No dictation deduplication.
- No AI parsing.
- No Supabase schema.
- No save flow changes.

## Tests to run

- Stage230B guard/test
- Stage230C guard/test
- Stage230C-R2/R8 guard/test
- Stage230C-R10 guard/test
- npm run build
- git diff --check
