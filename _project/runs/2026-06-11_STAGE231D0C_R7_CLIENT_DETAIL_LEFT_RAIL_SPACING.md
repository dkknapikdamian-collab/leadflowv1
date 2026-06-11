# 2026-06-11 19:45 Europe/Warsaw - STAGE231D0C/R7 ClientDetail left rail spacing

Marker: STAGE231D0C_R7_CLIENT_DETAIL_LEFT_RAIL_SPACING

## Scan report

Repo files expected/read by operator before stage:
- AGENTS.md
- _project/03_CURRENT_STAGE.md
- _project/06_GUARDS_AND_TESTS.md
- _project/07_NEXT_STEPS.md
- _project/08_CHANGELOG_AI.md
- _project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md
- _project/13_TEST_HISTORY.md
- _project/UI_DICTIONARY_STAGE231D0A.md
- src/pages/ClientDetail.tsx
- src/styles/visual-stage12-client-detail-vnext.css
- scripts/check-stage231d0c-client-detail-workspace-baseline.cjs
- scripts/check-stage231d0b-client-list-card-freeze.cjs

## FAKTY Z KODU
- STAGE231D0C/R6 baseline exists and passes guards/build before R7.
- ClientDetail uses a three-column shell with left rail, center workspace and right rail.
- R7 changes spacing only in CSS under data-stage231d0c-client-detail-workspace-baseline scope.

## DECYZJE DAMIANA
- Accepted top overview tiles are visually good and must stay.
- Left rail must start lower, aligned with right rail card height/top rhythm.
- Card-to-card spacing must be consistent between left and right rail.

## TESTY
- node scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs
- node --test tests/stage231d0c-r7-client-detail-left-rail-spacing.test.cjs
- node scripts/check-stage231d0c-client-detail-workspace-baseline.cjs
- node --test tests/stage231d0c-client-detail-workspace-baseline.test.cjs
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- optional Stage231B0 R9 guard/test if present
- git diff --check
- npm run build

## Audyt ryzyk
- Zmiana dodaje padding-top tylko dla desktopowego lewego raila; mobile/tablet resetuje offset do 0.
- Ryzyko: jeśli później zmieni się wysokość headera, offset może wymagać korekty.
- Nie zmieniono top tiles, prawych kart, danych ani logiki.
