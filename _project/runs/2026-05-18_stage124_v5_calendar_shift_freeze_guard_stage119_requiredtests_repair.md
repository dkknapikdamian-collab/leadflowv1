# Stage124 V5 - Calendar shift freeze guard requiredTests repair

## FAKTY
- Damian confirmed Stage123 works: task +1D/+1H shift moves and persists.
- Stage124 V4 failed before freeze commit because local quiet gate had zero Stage98 entries in requiredTests.
- Correct freeze state requires Stage98, Stage119 and Stage124 each exactly once in requiredTests.

## ZMIANY
- Rewrites Stage119 guard to current V5 contract.
- Rewrites Stage124 freeze guard with valid regexes.
- Repairs quiet release gate structurally: removes old preflight blocks, rebuilds requiredTests with Stage98, Stage119 and Stage124 exactly once, and inserts one Stage119 preflight before production build.
- Does not change the working Calendar Stage123 product logic.

## TESTY
- Stage119 release gate trust guard
- Stage124 freeze guard
- Stage123 task shift payload guard
- Stage114 shift persistence guard
- npm run build
- npm run verify:closeflow:quiet

## POTWIERDZENIE DAMIANA
DZIAŁA. Stage124 is a freeze guard for the confirmed working task shift behavior.
