# CloseFlow v105 - AI assistant encoding-safe test assertion

This hotfix finishes the v104 contract after the test file was saved with a mojibake assertion.

## What changed

- The test no longer stores the Polish letter in the regex as a raw character.
- The assertion now uses a Unicode escape:
  - `zrobi\u0107`
- This keeps the test stable on Windows PowerShell and prevents mojibake from coming back.
- The AI assistant remains single-source:
  - no local assistant copy in `Today.tsx`,
  - `Layout.tsx` renders `GlobalQuickActions`,
  - `GlobalQuickActions.tsx` renders `GlobalAiAssistant`,
  - `GlobalAiAssistant.tsx` renders `TodayAiAssistant` with application context.

## Run after patch

```powershell
node tests/ai-assistant-command-center.test.cjs
node scripts/check-polish-mojibake.cjs --repo . --check
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
```