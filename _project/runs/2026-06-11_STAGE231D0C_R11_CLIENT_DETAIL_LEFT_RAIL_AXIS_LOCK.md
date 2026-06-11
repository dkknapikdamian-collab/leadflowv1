# STAGE231D0C/R11 - ClientDetail left rail axis lock run report

## Status
LOCAL_APPLY_READY

## Goal
Lock the left rail vertical axis on ClientDetail because prior R7/R9 visual offset did not align the card with the right rail in production.

## Changed paths
- src/styles/visual-stage12-client-detail-vnext.css
- scripts/check-stage231d0c-r11-client-detail-left-rail-axis-lock.cjs
- tests/stage231d0c-r11-client-detail-left-rail-axis-lock.test.cjs
- _project/*.md central files
- _project/obsidian_updates/2026-06-11_STAGE231D0C_R11_CLIENT_DETAIL_LEFT_RAIL_AXIS_LOCK.md

## Guard plan
- R11 axis lock guard
- R11 node test
- R9/R7 regressions where present
- ClientDetail baseline regression
- ClientListCard regression
- git diff --check
- npm run build

## Risk audit
- Too much top whitespace on tablet/mobile is prevented with max-width 1180px reset.
- This is CSS-only. No runtime data or routing changed.
