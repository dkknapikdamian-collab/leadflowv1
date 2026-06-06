# STAGE228B R13 — Canonical LeadDetail imports repair

- Date: 2026-06-06 19:05 Europe/Warsaw
- Project: CloseFlow / LeadFlow
- Branch: dev-rollout-freeze
- Broken pushed commit: 14f00a3d
- Checkpoint before Stage228B: 21eab806298d329e43bbff7cc69866a668e44ba3

## Decision
Do not revert the entire Stage228B work action center unless this repair fails. The production error is caused by import-source corruption in `LeadDetail.tsx`, not by the concept of the action center.

## Fix
Rewrite the React, router, and lucide imports in `src/pages/LeadDetail.tsx` deterministically and add parser-based guards.

## Tests required
- Stage228B import source guard
- Stage228B AlertTriangle guard
- Stage98 mojibake hard gate
- Stage228B guard and test
- Stage228A regression guard
- Stage227B regression guard
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
