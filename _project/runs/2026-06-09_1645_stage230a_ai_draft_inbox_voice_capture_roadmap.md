# Stage230A - AI Draft Inbox / Voice Capture roadmap

- data i godzina: 2026-06-09 16:45 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: roadmap / product direction / AI architecture
- status: prepared by ZIP runner

## Scan

- AGENTS.md requires scan-first and project memory updates.
- _project/07_NEXT_STEPS.md is the requested target for stages.
- src/pages/AiDrafts.tsx already provides draft inbox foundations.
- src/lib/ai-drafts.ts uses Supabase as the production source of truth and local storage only as fallback/dev.
- src/lib/ai-draft-approval.ts is a rule parser fallback for lead/task/event/note and date hints.

## Decision direction

- Build Voice Capture / AI Draft Inbox as app-scoped AI, not a general chatbot.
- Raw draft must always be saved before AI parse.
- AI proposes actions; user approves before mutation.
- AI scope is limited to CloseFlow records: leads, clients, cases, tasks, events, notes, missing items, follow-ups and activity.
- Add phone dictation duplicate-words audit before relying on mobile voice input.

## Tests

- node scripts/check-stage230a-ai-draft-inbox-roadmap.cjs
- node --test tests/stage230a-ai-draft-inbox-roadmap.test.cjs
- git diff --check

## Risk audit

- Risk: AI as a general chatbot would dilute the product and create unsafe scope.
- Risk: direct AI mutations without approval could corrupt data.
- Risk: mobile dictation duplicate words may make capture unusable on some devices.
- Risk: provider keys must stay server-only.
