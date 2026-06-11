# 2026-06-11 STAGE231D0B-R9/R4 — CSS guard token alignment

Status: LOCAL_APPLY_READY

## FAKTY
- R9/R2 applied product patch.
- R9/R3 repaired guard mojibake self-scan.
- Guard then failed because CSS did not contain two exact guard tokens expected by the strengthened R3 guard.
- R4 aligns CSS source-truth markers with the guard without changing runtime scope.

## ZMIANA
- Adds machine marker: STAGE231D0B-R9_CLIENT_LIST_CARD_POLISH_SOURCE_TRUTH.
- Ensures finance chip CSS contains max-width: max-content.
- Keeps compact chip behavior and max-inline-size cap.

## TESTS TO RUN
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- git diff --check
- npm run build

## RISKS
- This is a guard/source-token alignment repair, not a visual redesign.
- Manual /clients screenshot is still required before push acceptance.

## NOT TOUCHED
- Layout.tsx
- trial banner
- top layout
- right rail filters
- runtime lead list
- SQL / Supabase
