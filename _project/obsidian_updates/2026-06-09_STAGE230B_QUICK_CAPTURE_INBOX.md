# CloseFlow LeadFlow - STAGE230B Quick Capture Inbox bez AI

Date: 2026-06-09 19:20 Europe/Warsaw
Status: LOCAL_ONLY_APPLIED_BY_ZIP_R6 / DO_MANUAL_QA_AND_PUSH
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Decision
Add a low-friction raw draft capture panel before AI parsing. This protects user input first. AI parser comes later.

## Facts
- /ai-drafts already existed.
- saveAiLeadDraftAsync already existed and writes through Supabase required path.
- Stage230B adds Szybki szkic panel and saves raw text as source quick_capture, type note.
- No SQL, AI provider, Gemini, Cloudflare, custom microphone or dedupe was added.

## Tests
- Stage230B guard/test.
- Stage230A compatibility guard/test.
- build.
- git diff --check.

## Manual QA required
Desktop and mobile save/F5/dictation checks.

## Risks
- Supabase may reject the current payload shape in real runtime.
- Existing local dirty files from other stages must stay out of the Stage230B commit.
- Duplicate words in system dictation remain Stage230C.
