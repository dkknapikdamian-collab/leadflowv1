# STAGE225R6 - Guard mojibake self-fix

## Routing
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- stage: STAGE225R6_GUARD_MOJIBAKE_SELF_FIX
- mode: ZIP/local-only -> tests -> selective push after acceptance

## FACTS
- STAGE225 was pushed as 9da266e7 while verify:closeflow:quiet was failing.
- STAGE225R5 was pushed as 943a0154 while verify:closeflow:quiet was still failing.
- R5 removed mojibake from active TSX/helper code, but the Stage225 guard itself contained literal mojibake sentinel characters.
- Stage98 correctly failed on scripts/check-stage225-contact-cadence-grid.cjs.

## CHANGE
- Replaced literal mojibake tokens in scripts/check-stage225-contact-cadence-grid.cjs with ASCII-only code point checks.
- Fixed the broken SALES_SILENCE_THRESHOLDS_DAYS regex.
- Did not change the Contact Cadence UI or product behavior.

## TESTS TO RUN
```powershell
node scripts/check-stage225-contact-cadence-grid.cjs
node --test tests/stage225-contact-cadence-grid.test.cjs
node --test tests/stage223r3-last-contact-intake.test.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short
```

## RISK AUDIT
- Main risk: another push despite failing verify. Do not push unless verify:closeflow:quiet passes.
- Main technical risk: guard self-check must not include banned literal mojibake tokens.
- Scope intentionally small: one script plus project memory docs.
