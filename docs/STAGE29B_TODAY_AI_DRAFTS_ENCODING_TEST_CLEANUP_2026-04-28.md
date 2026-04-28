# Stage29b - Today AI drafts encoding and test cleanup

Date: 2026-04-28

## Goal
Clean up Stage29a mojibake markers and make the Stage29 test resistant to Windows PowerShell encoding issues.

## Scope
- No SQL changes.
- No runtime logic changes.
- Rewrites Stage29a docs as ASCII-safe text.
- Replaces the fragile Polish-label assertion in tests/today-ai-drafts-tile-stage29.test.cjs with an ASCII-safe Szkice AI assertion.

## Check commands
```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/today-ai-drafts-tile-stage29.test.cjs
```
