# STAGE231D0C/R12 - ClientDetail left rail measured axis fix

Marker: STAGE231D0C_R12_CLIENT_DETAIL_LEFT_RAIL_MEASURED_AXIS_FIX
Status: LOCAL_APPLY_PRE_PUSH
Date: 2026-06-11 HH:mm Europe/Warsaw

## Why
R7/R9 technical guards passed but visual screenshot still showed left rail too high. Manual desktop DOM audit after clearing debug inline styles produced reliable numbers:

- innerWidth: 1920
- leftFirstTop: 173
- rightFirstTop: 200
- leftMinusRight: -27
- computed margin-top before fix: -36px
- measured target margin-top: -9px

## Change
CSS-only override sets the ClientDetail left rail desktop axis to -9px margin-top and resets tablet/mobile to 0px.

## Tests
- node scripts/check-stage231d0c-r12-client-detail-left-rail-measured-axis-fix.cjs
- node --test tests/stage231d0c-r12-client-detail-left-rail-measured-axis-fix.test.cjs
- R9/R7 regressions if scripts exist
- ClientDetail baseline regression
- ClientListCard freeze regression
- git diff --check
- npm run build

## Manual QA
Open /clients/<id>, Ctrl+F5, compare left Data klienta card with right Najbliższe działania card.
