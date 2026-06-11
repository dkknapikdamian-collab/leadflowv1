# 2026-06-11 STAGE231D0B-R9/R3 — Guard mojibake self-scan repair

Status: LOCAL_APPLY_READY

## FAKTY
- R9/R2 patch applied but D0B guard failed because the guard file contained literal encoding-drift probe characters and scanned itself.
- R3 rewrites the guard so encoding-drift probes are built from code points, not literal suspicious characters.
- R3 keeps the R9 product scope: ClientListCard CSS source truth cleanup, finance chips, file test and LeadListCard mapping only.

## TESTS TO RUN
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- npm run build
- git diff --check

## RISKS
- Manual visual QA on /clients is still required. Automated checks can confirm source truth and forbidden labels, but not whether the chips look good enough.

## NOT TOUCHED
- Layout.tsx
- trial banner
- top layout
- filters rail
- runtime lead list
- SQL / Supabase
