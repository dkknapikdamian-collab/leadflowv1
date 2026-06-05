# 2026-06-05 - CloseFlow - Stage225R6 Guard Mojibake Self-Fix

## Status
Prepared as ZIP/local-only hotfix.

## Decision
Do not move to another stage while verify:closeflow:quiet fails.

## Facts
- R5 still failed Stage98 because the Stage225 guard script contained literal mojibake tokens as detector values.
- The detector must use ASCII-only code point checks, not literal mojibake characters.

## Files
- scripts/check-stage225-contact-cadence-grid.cjs
- _project/runs/STAGE225R6_GUARD_MOJIBAKE_SELF_FIX_2026_06_05.md
- _project/obsidian_updates/2026-06-05 - CloseFlow - Stage225R6 Guard Mojibake Self-Fix.md
- OBSIDIAN_UPDATE_MANIFEST_STAGE225R6_GUARD_MOJIBAKE_SELF_FIX.md

## Required tests
- node scripts/check-stage225-contact-cadence-grid.cjs
- node --test tests/stage225-contact-cadence-grid.test.cjs
- node --test tests/stage223r3-last-contact-intake.test.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check
- git status --short
