# 2026-06-11 20:05 Europe/Warsaw - STAGE231D0C/R8 ClientDetail left rail spacing guard fix

Marker: STAGE231D0C_R8_CLIENT_DETAIL_LEFT_RAIL_SPACING_GUARD_FIX

## FAKTY Z KODU
- R7 spacing CSS marker exists: STAGE231D0C_R7_CLIENT_DETAIL_LEFT_RAIL_SPACING.
- R7 apply failed after patch because guard regex was malformed.
- R8 overwrites the guard with escaped regex syntax and keeps R7 runtime scope.

## DECYZJE DAMIANA
- Lewy rail ClientDetail ma mieć rytm i odstęp spójny z prawym railem.
- Górne kafelki zostają bez zmian.

## TESTY
- node --check scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs
- node scripts/check-stage231d0c-r7-client-detail-left-rail-spacing.cjs
- node --test tests/stage231d0c-r7-client-detail-left-rail-spacing.test.cjs
- node scripts/check-stage231d0c-client-detail-workspace-baseline.cjs
- node --test tests/stage231d0c-client-detail-workspace-baseline.test.cjs
- npm run check:stage231d0b-client-list-card-freeze
- node --test tests/stage231d0b-client-list-card-freeze.test.cjs
- optional Stage231B0 R9 guard/test
- git diff --check
- npm run build

## Audyt ryzyk
- R8 nie dotyka danych ani layoutu poza wcześniejszym R7 spacing CSS.
- Największe ryzyko: wizualny offset może wymagać korekty po deployu, ale mobile/tablet resetuje top offset.
