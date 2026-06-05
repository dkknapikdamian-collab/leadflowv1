# STAGE220A36-R6 — Deploy Unblock Mojibake Cleanup — REPORT

Data: 2026-06-05 22:35 Europe/Warsaw

## FAKTY
- The modal order was already present in source, but production could still show old UI when Vercel build failed.
- The last blocker was Stage98 mojibake gate catching literal marker characters in R4 script/test files.
- R6 removes those literals and keeps the case_items approved_at fix.

## TESTY
- node scripts/check-stage220a35-client-commission-finance.cjs
- node scripts/check-stage220a36-commission-input-model-split.cjs
- node scripts/check-stage220a36r2-commission-modal-field-order.cjs
- node scripts/check-stage220a36r4-build-guard-and-case-item-schema-fix.cjs
- node scripts/check-stage220a36r5-r4-guard-token-compat.cjs
- node scripts/check-stage220a36r6-deploy-unblock-mojibake-cleanup.cjs
- node --test tests/stage220a36r4-build-guard-and-case-item-schema-fix.test.cjs
- node --test tests/stage220a36r6-deploy-unblock-mojibake-cleanup.test.cjs
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## AUDYT RYZYK
- Do not proceed to Stage227 before a green Vercel build after R6.
- Manual UI must verify that the deployed modal shows mode, rate, commission amount, then percent basis.
- No Supabase schema or RLS changes were made.
